/* ============================================
   Room Studio 3D — Interaction Manager
   Drag-to-place, selection, collision, camera
   ============================================ */
import * as THREE from 'three';
import { buildFurniture, getAvailableColors } from './furniture.js?v=3';

export class InteractionManager {
    constructor(scene, camera, renderer, roomScene, onSelect, onDeselect, requestRender, controls) {
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.roomScene = roomScene;
        this.onSelect = onSelect;
        this.onDeselect = onDeselect;
        this.requestRender = requestRender;
        this.controls = controls;

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

        this.placedItems = []; // { group, itemData, colorIndex, locked }
        this.selectedItem = null;
        this.ghostItem = null;
        this.isDraggingFromCatalog = false;
        this.isDraggingPlaced = false;
        this.dragStartMouse = new THREE.Vector2();
        this.dragOffset = new THREE.Vector3();
        this.dragLastValid = new THREE.Vector3(); // last valid position during drag
        this.placedGroup = new THREE.Group();
        this.placedGroup.name = 'placed-items';
        scene.add(this.placedGroup);

        this.canvas = renderer.domElement;
        this.bindEvents();
    }

    bindEvents() {
        this.canvas.addEventListener('pointerdown', (e) => this.onPointerDown(e));
        this.canvas.addEventListener('pointermove', (e) => this.onPointerMove(e));
        this.canvas.addEventListener('pointerup', (e) => this.onPointerUp(e));
    }

    updateMouse(e) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    }

    // ---- Catalog drag (start from HTML, project into 3D) ----

    startCatalogDrag(itemData, colorIndex = 0) {
        this.isDraggingFromCatalog = true;
        this.catalogDragItem = itemData;
        this.catalogDragColor = colorIndex;

        const ghost = buildFurniture(itemData, colorIndex);
        ghost.traverse(child => {
            if (child.isMesh) {
                child.material = child.material.clone();
                child.material.transparent = true;
                child.material.opacity = 0.5;
                child.userData._ghostOrigColor = child.material.color.getHex();
            }
        });
        this.ghostItem = ghost;
        this.scene.add(ghost);
        ghost.visible = false;
    }

    updateCatalogDrag(e) {
        if (!this.isDraggingFromCatalog || !this.ghostItem) return;
        this.updateMouse(e);
        const pos = this.raycastFloor();
        if (pos) {
            this.ghostItem.visible = true;
            const itemData = this.catalogDragItem;
            let x = pos.x, z = pos.z;

            const bounds = this.roomScene.getRoomBounds();
            if (bounds) {
                x = Math.max(bounds.minX + itemData.w / 2, Math.min(bounds.maxX - itemData.w / 2, x));
                z = Math.max(bounds.minZ + itemData.d / 2, Math.min(bounds.maxZ - itemData.d / 2, z));
            }

            if (itemData.placement === 'wall') {
                const wallPos = this.snapToWall(x, pos.y, z, itemData);
                this.ghostItem.position.copy(wallPos.position);
                this.ghostItem.rotation.y = wallPos.rotationY;
            } else if (itemData.placement === 'ceiling') {
                const h = bounds ? bounds.height : 2.7;
                this.ghostItem.position.set(x, h, z);
            } else {
                this.ghostItem.position.set(x, 0, z);
            }

            // Visual collision feedback
            const collides = this.checkCollision(this.ghostItem, itemData, null);
            this.ghostItem.traverse(child => {
                if (child.isMesh) {
                    child.material.color.setHex(collides ? 0xff4444 : (child.userData._ghostOrigColor || 0x888888));
                }
            });

            this.requestRender();
        } else {
            this.ghostItem.visible = false;
            this.requestRender();
        }
    }

    endCatalogDrag(e) {
        if (!this.isDraggingFromCatalog) return;
        this.isDraggingFromCatalog = false;

        if (this.ghostItem && this.ghostItem.visible) {
            this.updateMouse(e);
            const pos = this.raycastFloor();
            if (pos) {
                const itemData = this.catalogDragItem;
                const colorIndex = this.catalogDragColor;
                const bounds = this.roomScene.getRoomBounds();
                let x = pos.x, z = pos.z;
                if (bounds) {
                    x = Math.max(bounds.minX + itemData.w / 2, Math.min(bounds.maxX - itemData.w / 2, x));
                    z = Math.max(bounds.minZ + itemData.d / 2, Math.min(bounds.maxZ - itemData.d / 2, z));
                }

                if (!this.checkCollision(this.ghostItem, itemData, null)) {
                    this.placeItem(itemData, colorIndex, x, z);
                }
            }
        }

        if (this.ghostItem) {
            this.scene.remove(this.ghostItem);
            this.ghostItem = null;
        }
        this.requestRender();
    }

    cancelCatalogDrag() {
        this.isDraggingFromCatalog = false;
        if (this.ghostItem) {
            this.scene.remove(this.ghostItem);
            this.ghostItem = null;
        }
        this.requestRender();
    }

    // ---- Place item ----

    placeItem(itemData, colorIndex, x, z, options = {}) {
        const group = buildFurniture(itemData, colorIndex);
        const bounds = this.roomScene.getRoomBounds();
        const locked = options.locked || false;
        const rotation = options.rotation || 0;

        if (itemData.placement === 'wall') {
            const wallPos = this.snapToWall(x, 0, z, itemData);
            group.position.copy(wallPos.position);
            group.rotation.y = wallPos.rotationY;
        } else if (itemData.placement === 'ceiling') {
            const h = bounds ? bounds.height : 2.7;
            group.position.set(x, h, z);
        } else {
            group.position.set(x, 0, z);
        }

        if (rotation) {
            group.rotation.y = rotation;
        }

        const record = {
            group,
            itemData: { ...itemData },
            colorIndex,
            rotation: group.rotation.y,
            locked,
        };
        group.userData.record = record;

        // Locked items get a subtle visual indicator
        if (locked) {
            group.traverse(child => {
                if (child.isMesh) {
                    child.userData._isLocked = true;
                }
            });
        }

        this.placedGroup.add(group);
        this.placedItems.push(record);
        if (!locked) {
            this.selectItem(record);
        }
        this.requestRender();
        return record;
    }

    // ---- Place room fixtures ----

    placeFixtures(fixtures) {
        for (const fix of fixtures) {
            this.placeItem(fix.itemData, fix.colorIndex || 0, fix.x, fix.z, {
                locked: fix.locked !== false, // default locked
                rotation: fix.rotation || 0,
            });
        }
        this.deselectItem();
    }

    // ---- Selection ----

    selectItem(record) {
        if (record.locked) return; // Can't select locked fixtures
        this.deselectItem();
        this.selectedItem = record;

        record.group.traverse(child => {
            if (child.isMesh) {
                child.userData.origEmissive = child.material.emissive
                    ? child.material.emissive.getHex() : 0;
                child.userData.origEmissiveIntensity = child.material.emissiveIntensity || 0;
                if (child.material.emissive) {
                    child.material.emissive.set(0x332200);
                    child.material.emissiveIntensity = 0.15;
                }
            }
        });

        this.onSelect(record);
        this.requestRender();
    }

    deselectItem() {
        if (this.selectedItem) {
            this.selectedItem.group.traverse(child => {
                if (child.isMesh && child.material.emissive) {
                    child.material.emissive.setHex(child.userData.origEmissive || 0);
                    child.material.emissiveIntensity = child.userData.origEmissiveIntensity || 0;
                }
            });
            this.selectedItem = null;
            this.onDeselect();
        }
        this.requestRender();
    }

    // ---- Pointer events (select + drag placed items) ----

    onPointerDown(e) {
        if (this.isDraggingFromCatalog) return;
        this.dragStartMouse.set(e.clientX, e.clientY);
        this.updateMouse(e);

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const meshes = [];
        this.placedGroup.traverse(child => {
            if (child.isMesh) meshes.push(child);
        });
        const hits = this.raycaster.intersectObjects(meshes, false);

        if (hits.length > 0) {
            let obj = hits[0].object;
            while (obj && !obj.userData.record) {
                obj = obj.parent;
            }
            if (obj && obj.userData.record) {
                const record = obj.userData.record;
                if (record.locked) return; // Don't drag locked items

                this.selectItem(record);
                this.isDraggingPlaced = true;

                // Save position in case we need to revert
                this.dragLastValid.copy(obj.position);

                if (this.controls) this.controls.enabled = false;

                const pos = this.raycastFloor();
                if (pos) {
                    this.dragOffset.copy(obj.position).sub(pos);
                }
            }
        }
    }

    onPointerMove(e) {
        if (this.isDraggingFromCatalog) return;

        if (this.isDraggingPlaced && this.selectedItem) {
            const dx = e.clientX - this.dragStartMouse.x;
            const dy = e.clientY - this.dragStartMouse.y;
            if (Math.abs(dx) < 3 && Math.abs(dy) < 3) return;

            this.updateMouse(e);
            const pos = this.raycastFloor();
            if (pos) {
                const item = this.selectedItem;
                const bounds = this.roomScene.getRoomBounds();
                let x = pos.x + this.dragOffset.x;
                let z = pos.z + this.dragOffset.z;

                if (item.itemData.placement === 'wall') {
                    const wallPos = this.snapToWall(x, 0, z, item.itemData);
                    item.group.position.copy(wallPos.position);
                    item.group.rotation.y = wallPos.rotationY;
                } else if (item.itemData.placement !== 'ceiling') {
                    // Clamp to room bounds
                    if (bounds) {
                        x = Math.max(bounds.minX + item.itemData.w/2, Math.min(bounds.maxX - item.itemData.w/2, x));
                        z = Math.max(bounds.minZ + item.itemData.d/2, Math.min(bounds.maxZ - item.itemData.d/2, z));
                    }

                    // Test collision at proposed position
                    item.group.position.x = x;
                    item.group.position.z = z;

                    if (this.checkCollision(item.group, item.itemData, item)) {
                        // Revert to last valid position
                        item.group.position.copy(this.dragLastValid);
                    } else {
                        // Accept new position
                        this.dragLastValid.copy(item.group.position);
                    }
                }

                this.requestRender();
            }
        }
    }

    onPointerUp(e) {
        if (this.isDraggingFromCatalog) return;

        const dx = e.clientX - this.dragStartMouse.x;
        const dy = e.clientY - this.dragStartMouse.y;
        const wasDrag = Math.abs(dx) > 5 || Math.abs(dy) > 5;

        if (!wasDrag && !this.isDraggingPlaced) {
            this.updateMouse(e);
            this.raycaster.setFromCamera(this.mouse, this.camera);
            const meshes = [];
            this.placedGroup.traverse(child => {
                if (child.isMesh) meshes.push(child);
            });
            const hits = this.raycaster.intersectObjects(meshes, false);
            if (hits.length > 0) {
                let obj = hits[0].object;
                while (obj && !obj.userData.record) obj = obj.parent;
                if (obj && obj.userData.record) {
                    if (!obj.userData.record.locked) {
                        this.selectItem(obj.userData.record);
                    }
                }
            } else {
                this.deselectItem();
            }
        }

        this.isDraggingPlaced = false;
        if (this.controls) this.controls.enabled = true;
    }

    // ---- Edit actions ----

    rotateSelected() {
        if (!this.selectedItem || this.selectedItem.locked) return;
        const item = this.selectedItem;
        item.rotation = (item.rotation || 0) + Math.PI / 4; // 45-degree increments
        item.group.rotation.y = item.rotation;
        this.requestRender();
    }

    deleteSelected() {
        if (!this.selectedItem || this.selectedItem.locked) return;
        const idx = this.placedItems.indexOf(this.selectedItem);
        if (idx >= 0) this.placedItems.splice(idx, 1);
        this.placedGroup.remove(this.selectedItem.group);
        this.selectedItem = null;
        this.onDeselect();
        this.requestRender();
    }

    changeColorSelected(colorIndex) {
        if (!this.selectedItem || this.selectedItem.locked) return;
        const item = this.selectedItem;
        const pos = item.group.position.clone();
        const rot = item.group.rotation.y;

        this.placedGroup.remove(item.group);

        const newGroup = buildFurniture(item.itemData, colorIndex);
        newGroup.position.copy(pos);
        newGroup.rotation.y = rot;
        newGroup.userData.record = item;

        item.group = newGroup;
        item.colorIndex = colorIndex;
        this.placedGroup.add(newGroup);
        this.selectItem(item);
    }

    bringForward() {
        if (!this.selectedItem || this.selectedItem.locked) return;
        const item = this.selectedItem;
        const newZ = item.group.position.z + 0.05;
        const bounds = this.roomScene.getRoomBounds();

        item.group.position.z = newZ;
        if (bounds) {
            item.group.position.z = Math.min(bounds.maxZ - item.itemData.d/2, item.group.position.z);
        }
        if (this.checkCollision(item.group, item.itemData, item)) {
            item.group.position.z = newZ - 0.05; // revert
        }
        this.requestRender();
    }

    sendBackward() {
        if (!this.selectedItem || this.selectedItem.locked) return;
        const item = this.selectedItem;
        const newZ = item.group.position.z - 0.05;
        const bounds = this.roomScene.getRoomBounds();

        item.group.position.z = newZ;
        if (bounds) {
            item.group.position.z = Math.max(bounds.minZ + item.itemData.d/2, item.group.position.z);
        }
        if (this.checkCollision(item.group, item.itemData, item)) {
            item.group.position.z = newZ + 0.05; // revert
        }
        this.requestRender();
    }

    nudge(dx, dz) {
        if (!this.selectedItem || this.selectedItem.locked) return;
        const item = this.selectedItem;
        const oldX = item.group.position.x;
        const oldZ = item.group.position.z;

        item.group.position.x += dx;
        item.group.position.z += dz;

        const bounds = this.roomScene.getRoomBounds();
        if (bounds) {
            item.group.position.x = Math.max(bounds.minX + item.itemData.w/2,
                Math.min(bounds.maxX - item.itemData.w/2, item.group.position.x));
            item.group.position.z = Math.max(bounds.minZ + item.itemData.d/2,
                Math.min(bounds.maxZ - item.itemData.d/2, item.group.position.z));
        }

        if (this.checkCollision(item.group, item.itemData, item)) {
            item.group.position.x = oldX;
            item.group.position.z = oldZ;
        }
        this.requestRender();
    }

    clearAll() {
        this.placedItems.forEach(item => {
            this.placedGroup.remove(item.group);
        });
        this.placedItems = [];
        this.deselectItem();
        this.requestRender();
    }

    // ---- Helpers ----

    raycastFloor() {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const target = new THREE.Vector3();
        const hit = this.raycaster.ray.intersectPlane(this.floorPlane, target);
        return hit ? target : null;
    }

    snapToWall(x, y, z, itemData) {
        const bounds = this.roomScene.getRoomBounds();
        if (!bounds) return { position: new THREE.Vector3(x, y, z), rotationY: 0 };

        const wallY = (itemData.wallY || 1.5);
        const distBack = z;
        const distLeft = x;
        const distRight = bounds.maxX - x;

        if (distBack <= distLeft && distBack <= distRight) {
            return {
                position: new THREE.Vector3(
                    Math.max(itemData.w/2, Math.min(bounds.maxX - itemData.w/2, x)),
                    wallY,
                    itemData.d / 2 + 0.01
                ),
                rotationY: 0
            };
        } else if (distLeft <= distRight) {
            return {
                position: new THREE.Vector3(
                    itemData.d / 2 + 0.01,
                    wallY,
                    Math.max(itemData.w/2, Math.min(bounds.maxZ - itemData.w/2, z))
                ),
                rotationY: Math.PI / 2
            };
        } else {
            return {
                position: new THREE.Vector3(
                    bounds.maxX - itemData.d / 2 - 0.01,
                    wallY,
                    Math.max(itemData.w/2, Math.min(bounds.maxZ - itemData.w/2, z))
                ),
                rotationY: -Math.PI / 2
            };
        }
    }

    checkCollision(group, itemData, excludeRecord) {
        if (itemData.placement === 'wall' || itemData.placement === 'ceiling') return false;
        if (itemData.h <= 0.05) return false; // rugs don't collide

        const pos = group.position;
        const hw = itemData.w / 2;
        const hd = itemData.d / 2;

        // Check against room obstacles (columns, counters, fireplaces, door clearances)
        const obstacles = this.roomScene.getObstacles();
        for (const obs of obstacles) {
            if (obs.type === 'circle') {
                const dx = pos.x - obs.x;
                const dz = pos.z - obs.z;
                const dist = Math.sqrt(dx * dx + dz * dz);
                const minDist = obs.radius + Math.max(hw, hd);
                if (dist < minDist) return true;
            } else if (obs.type === 'rect') {
                if (this.aabbOverlap(
                    pos.x - hw, pos.z - hd, pos.x + hw, pos.z + hd,
                    obs.x, obs.z, obs.x + obs.w, obs.z + obs.d
                )) return true;
            }
        }

        // Check against other placed items (including locked fixtures)
        for (const other of this.placedItems) {
            if (other === excludeRecord) continue;
            if (other.itemData.placement === 'wall' || other.itemData.placement === 'ceiling') continue;
            if (other.itemData.h <= 0.05) continue; // skip rugs

            const oPos = other.group.position;
            const ohw = other.itemData.w / 2;
            const ohd = other.itemData.d / 2;

            if (this.aabbOverlap(
                pos.x - hw, pos.z - hd, pos.x + hw, pos.z + hd,
                oPos.x - ohw, oPos.z - ohd, oPos.x + ohw, oPos.z + ohd
            )) return true;
        }

        return false;
    }

    aabbOverlap(ax1, az1, ax2, az2, bx1, bz1, bx2, bz2) {
        return ax1 < bx2 && ax2 > bx1 && az1 < bz2 && az2 > bz1;
    }
}
