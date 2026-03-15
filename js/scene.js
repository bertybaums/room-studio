/* ============================================
   Room Studio 3D — Scene Builder
   Room geometry, lighting, architectural features
   ============================================ */
import * as THREE from 'three';
import { getFloorMaterial, getWallMaterial, WOOD_MAT, CERAMIC_MAT, METAL_MAT, GLASS_MAT, EMISSIVE_MAT } from './materials.js?v=3';
import { SURFACES } from './data.js?v=3';

export class RoomScene {
    constructor(scene) {
        this.scene = scene;
        this.roomGroup = new THREE.Group();
        this.roomGroup.name = 'room';
        scene.add(this.roomGroup);

        this.floorMesh = null;
        this.wallMeshes = [];
        this.featureMeshes = [];
        this.currentRoom = null;
        this.currentWallSurface = SURFACES.walls[0];
        this.currentFloorSurface = SURFACES.floors[0];
    }

    buildRoom(roomDef) {
        this.currentRoom = roomDef;
        this.clearRoom();

        const { width: W, depth: D, height: H } = roomDef;

        // Get surfaces
        const wallSurface = this.currentWallSurface;
        const floorSurface = this.currentFloorSurface;

        // ---- Floor ----
        const floorMat = getFloorMaterial(floorSurface);
        const floorGeo = new THREE.PlaneGeometry(W, D);
        this.floorMesh = new THREE.Mesh(floorGeo, floorMat);
        this.floorMesh.rotation.x = -Math.PI / 2;
        this.floorMesh.position.set(W / 2, 0, D / 2);
        this.floorMesh.receiveShadow = true;
        this.floorMesh.name = 'floor';
        this.roomGroup.add(this.floorMesh);

        // No ceiling — it blocks the view from above

        // ---- Walls ----
        const wallMat = getWallMaterial(wallSurface);

        // Collect features by wall
        const featuresByWall = { back: [], left: [], right: [] };
        (roomDef.features || []).forEach(f => {
            if (f.wall && featuresByWall[f.wall]) {
                featuresByWall[f.wall].push(f);
            }
        });

        // Back wall (at z=0, facing +z)
        this.buildWall('back', W, H, featuresByWall.back, wallMat, (mesh) => {
            mesh.position.set(W / 2, H / 2, 0);
        });

        // Left wall (at x=0, facing +x)
        this.buildWall('left', D, H, featuresByWall.left, wallMat, (mesh) => {
            mesh.rotation.y = Math.PI / 2;
            mesh.position.set(0, H / 2, D / 2);
        });

        // Right wall (at x=W, facing -x)
        this.buildWall('right', D, H, featuresByWall.right, wallMat, (mesh) => {
            mesh.rotation.y = -Math.PI / 2;
            mesh.position.set(W, H / 2, D / 2);
        });

        // ---- Baseboards ----
        const bbMat = WOOD_MAT('#ddd5c9');
        const bbH = 0.08, bbD = 0.015;
        // Back
        const bb1 = new THREE.Mesh(new THREE.BoxGeometry(W, bbH, bbD), bbMat);
        bb1.position.set(W/2, bbH/2, bbD/2);
        this.roomGroup.add(bb1);
        // Left
        const bb2 = new THREE.Mesh(new THREE.BoxGeometry(bbD, bbH, D), bbMat);
        bb2.position.set(bbD/2, bbH/2, D/2);
        this.roomGroup.add(bb2);
        // Right
        const bb3 = new THREE.Mesh(new THREE.BoxGeometry(bbD, bbH, D), bbMat);
        bb3.position.set(W - bbD/2, bbH/2, D/2);
        this.roomGroup.add(bb3);

        // ---- Architectural features ----
        (roomDef.features || []).forEach(f => {
            this.buildFeature(f, roomDef);
        });

        // ---- Lighting ----
        this.setupLighting(roomDef);
    }

    buildWall(wallName, wallW, wallH, features, material, positionFn) {
        // Determine if wall has openings (windows, doors)
        const openings = features.filter(f =>
            ['window', 'door', 'closet-door'].includes(f.type)
        );

        if (openings.length === 0) {
            // Simple flat wall
            const geo = new THREE.PlaneGeometry(wallW, wallH);
            const mesh = new THREE.Mesh(geo, material);
            mesh.name = `wall-${wallName}`;
            mesh.receiveShadow = true;
            positionFn(mesh);
            this.roomGroup.add(mesh);
            this.wallMeshes.push(mesh);
            return;
        }

        // Wall with holes using Shape
        const shape = new THREE.Shape();
        shape.moveTo(-wallW / 2, -wallH / 2);
        shape.lineTo(wallW / 2, -wallH / 2);
        shape.lineTo(wallW / 2, wallH / 2);
        shape.lineTo(-wallW / 2, wallH / 2);
        shape.lineTo(-wallW / 2, -wallH / 2);

        openings.forEach(f => {
            const hx = f.x - wallW / 2 + f.w / 2;  // center of hole relative to wall center
            const hy = f.y - wallH / 2 + f.h / 2;
            const hole = new THREE.Path();
            hole.moveTo(hx - f.w / 2, hy - f.h / 2);
            hole.lineTo(hx + f.w / 2, hy - f.h / 2);
            hole.lineTo(hx + f.w / 2, hy + f.h / 2);
            hole.lineTo(hx - f.w / 2, hy + f.h / 2);
            hole.lineTo(hx - f.w / 2, hy - f.h / 2);
            shape.holes.push(hole);
        });

        const geo = new THREE.ShapeGeometry(shape);
        const mesh = new THREE.Mesh(geo, material);
        mesh.name = `wall-${wallName}`;
        mesh.receiveShadow = true;
        positionFn(mesh);
        this.roomGroup.add(mesh);
        this.wallMeshes.push(mesh);
    }

    buildFeature(feature, room) {
        const { width: W, depth: D, height: H } = room;

        switch (feature.type) {
            case 'window': {
                this.buildWindowFeature(feature, room);
                break;
            }
            case 'door': {
                this.buildDoorFeature(feature, room);
                break;
            }
            case 'closet-door': {
                this.buildClosetDoorFeature(feature, room);
                break;
            }
            case 'fireplace': {
                this.buildFireplaceFeature(feature, room);
                break;
            }
            case 'column': {
                this.buildColumnFeature(feature, room);
                break;
            }
            case 'counter': {
                this.buildCounterFeature(feature, room);
                break;
            }
        }
    }

    buildWindowFeature(f, room) {
        const { width: W, depth: D, height: H } = room;
        let pos, rot;
        const frameDepth = 0.08;

        if (f.wall === 'back') {
            pos = new THREE.Vector3(f.x + f.w/2, f.y + f.h/2, frameDepth/2);
            rot = new THREE.Euler(0, 0, 0);
        } else if (f.wall === 'left') {
            pos = new THREE.Vector3(frameDepth/2, f.y + f.h/2, f.x + f.w/2);
            rot = new THREE.Euler(0, Math.PI/2, 0);
        } else {
            pos = new THREE.Vector3(W - frameDepth/2, f.y + f.h/2, f.x + f.w/2);
            rot = new THREE.Euler(0, -Math.PI/2, 0);
        }

        const group = new THREE.Group();
        group.position.copy(pos);
        group.rotation.copy(rot);

        // Window glass
        const glass = new THREE.Mesh(
            new THREE.PlaneGeometry(f.w - 0.06, f.h - 0.06),
            new THREE.MeshStandardMaterial({
                color: '#b4d4e8', transparent: true, opacity: 0.3,
                roughness: 0.05, metalness: 0.1, side: THREE.DoubleSide
            })
        );
        group.add(glass);

        // Frame pieces
        const frameMat = WOOD_MAT('#ddd5c9');
        const fw = 0.04;
        // Top
        const top = new THREE.Mesh(new THREE.BoxGeometry(f.w, fw, frameDepth), frameMat);
        top.position.y = f.h/2 - fw/2;
        group.add(top);
        // Bottom
        const bottom = top.clone();
        bottom.position.y = -f.h/2 + fw/2;
        group.add(bottom);
        // Left
        const left = new THREE.Mesh(new THREE.BoxGeometry(fw, f.h, frameDepth), frameMat);
        left.position.x = -f.w/2 + fw/2;
        group.add(left);
        // Right
        const right = left.clone();
        right.position.x = f.w/2 - fw/2;
        group.add(right);
        // Mullion (vertical center)
        const mullion = new THREE.Mesh(new THREE.BoxGeometry(0.025, f.h - fw*2, 0.03), frameMat);
        group.add(mullion);
        // Transom (horizontal center)
        const transom = new THREE.Mesh(new THREE.BoxGeometry(f.w - fw*2, 0.025, 0.03), frameMat);
        group.add(transom);

        // Sill
        const sill = new THREE.Mesh(
            new THREE.BoxGeometry(f.w + 0.06, 0.03, 0.12),
            WOOD_MAT('#c9bfb2')
        );
        sill.position.y = -f.h/2;
        sill.position.z = 0.04;
        group.add(sill);

        // Light from window
        const windowLight = new THREE.PointLight('#fff5e6', 0.5, 4);
        windowLight.position.set(0, 0, 0.5);
        group.add(windowLight);

        this.roomGroup.add(group);
        this.featureMeshes.push(group);
    }

    buildDoorFeature(f, room) {
        const { width: W } = room;
        let pos, rot;
        const frameDepth = 0.10;

        if (f.wall === 'left') {
            pos = new THREE.Vector3(frameDepth/2, f.y + f.h/2, f.x + f.w/2);
            rot = new THREE.Euler(0, Math.PI/2, 0);
        } else if (f.wall === 'right') {
            pos = new THREE.Vector3(W - frameDepth/2, f.y + f.h/2, f.x + f.w/2);
            rot = new THREE.Euler(0, -Math.PI/2, 0);
        } else {
            pos = new THREE.Vector3(f.x + f.w/2, f.y + f.h/2, frameDepth/2);
            rot = new THREE.Euler(0, 0, 0);
        }

        const group = new THREE.Group();
        group.position.copy(pos);
        group.rotation.copy(rot);

        // Door panel
        const door = new THREE.Mesh(
            new THREE.BoxGeometry(f.w - 0.06, f.h - 0.03, 0.04),
            WOOD_MAT('#b08d6e')
        );
        door.castShadow = true;
        group.add(door);

        // Frame
        const frameMat = WOOD_MAT('#ddd5c9');
        const fw = 0.05;
        const topFrame = new THREE.Mesh(new THREE.BoxGeometry(f.w + fw, fw, frameDepth), frameMat);
        topFrame.position.y = f.h/2;
        group.add(topFrame);
        const leftFrame = new THREE.Mesh(new THREE.BoxGeometry(fw, f.h + fw, frameDepth), frameMat);
        leftFrame.position.x = -f.w/2 - fw/2 + 0.025;
        group.add(leftFrame);
        const rightFrame = leftFrame.clone();
        rightFrame.position.x = f.w/2 + fw/2 - 0.025;
        group.add(rightFrame);

        // Door knob
        const knob = new THREE.Mesh(
            new THREE.SphereGeometry(0.025, 8, 6),
            METAL_MAT('#d4a44a')
        );
        knob.position.set(f.w/2 - 0.12, 0, 0.03);
        group.add(knob);

        // Door swing clearance zone (need space in front of door)
        group.userData.isDoor = true;
        if (f.wall === 'left') {
            group.userData.collision = {
                x: 0, z: f.x, w: f.w + 0.1, d: f.w + 0.1
            };
        } else if (f.wall === 'right') {
            group.userData.collision = {
                x: room.width - f.w - 0.1, z: f.x, w: f.w + 0.1, d: f.w + 0.1
            };
        } else {
            group.userData.collision = {
                x: f.x, z: 0, w: f.w + 0.1, d: f.w + 0.1
            };
        }

        this.roomGroup.add(group);
        this.featureMeshes.push(group);
    }

    buildClosetDoorFeature(f, room) {
        const { width: W } = room;
        let pos, rot;

        if (f.wall === 'right') {
            pos = new THREE.Vector3(W - 0.04, f.y + f.h/2, f.x + f.w/2);
            rot = new THREE.Euler(0, -Math.PI/2, 0);
        } else if (f.wall === 'left') {
            pos = new THREE.Vector3(0.04, f.y + f.h/2, f.x + f.w/2);
            rot = new THREE.Euler(0, Math.PI/2, 0);
        } else {
            pos = new THREE.Vector3(f.x + f.w/2, f.y + f.h/2, 0.04);
            rot = new THREE.Euler(0, 0, 0);
        }

        const group = new THREE.Group();
        group.position.copy(pos);
        group.rotation.copy(rot);

        // Sliding doors
        const doorMat = WOOD_MAT('#c9bfb2');
        const doorW = f.w / 2;
        [-1, 1].forEach(side => {
            const panel = new THREE.Mesh(
                new THREE.BoxGeometry(doorW - 0.02, f.h - 0.04, 0.03),
                doorMat
            );
            panel.position.x = side * doorW / 2;
            panel.castShadow = true;
            group.add(panel);

            // Handle groove
            const groove = new THREE.Mesh(
                new THREE.BoxGeometry(0.015, 0.10, 0.005),
                METAL_MAT('#aaa')
            );
            groove.position.set(side * (doorW - 0.08), 0, 0.02);
            group.add(groove);
        });

        // Frame
        const frameMat = WOOD_MAT('#ddd5c9');
        const topFrame = new THREE.Mesh(new THREE.BoxGeometry(f.w + 0.04, 0.04, 0.08), frameMat);
        topFrame.position.y = f.h/2;
        group.add(topFrame);

        this.roomGroup.add(group);
        this.featureMeshes.push(group);
    }

    buildFireplaceFeature(f, room) {
        const group = new THREE.Group();
        const x = f.x + f.w / 2;
        const fireDepth = 0.15;

        group.position.set(x, 0, fireDepth / 2);

        // Mantel / surround
        const surroundMat = new THREE.MeshStandardMaterial({
            color: '#c9bfb2', roughness: 0.5
        });

        // Main surround
        const surround = new THREE.Mesh(
            new THREE.BoxGeometry(f.w + 0.20, f.h + 0.15, fireDepth),
            surroundMat
        );
        surround.position.y = f.h / 2 + 0.05;
        surround.castShadow = true;
        group.add(surround);

        // Firebox (dark inset)
        const firebox = new THREE.Mesh(
            new THREE.BoxGeometry(f.w - 0.10, f.h - 0.15, 0.05),
            new THREE.MeshStandardMaterial({ color: '#1a1a1a', roughness: 0.95 })
        );
        firebox.position.set(0, f.h * 0.4, fireDepth / 2 - 0.02);
        group.add(firebox);

        // Mantel shelf
        const mantel = new THREE.Mesh(
            new THREE.BoxGeometry(f.w + 0.35, 0.06, 0.20),
            WOOD_MAT('#8B7355')
        );
        mantel.position.y = f.h + 0.13;
        mantel.position.z = 0.05;
        mantel.castShadow = true;
        group.add(mantel);

        // Fire glow
        const fireLight = new THREE.PointLight('#ff6b2b', 0.6, 3);
        fireLight.position.set(0, f.h * 0.3, fireDepth);
        group.add(fireLight);

        // Emissive fire
        const fire = new THREE.Mesh(
            new THREE.ConeGeometry(f.w * 0.2, f.h * 0.25, 6),
            new THREE.MeshStandardMaterial({
                color: '#ff4500', emissive: '#ff6b2b', emissiveIntensity: 0.8,
                transparent: true, opacity: 0.8
            })
        );
        fire.position.set(0, f.h * 0.25, fireDepth / 2);
        group.add(fire);

        // Collision zone: fireplace surround + clearance in front
        group.userData.isFireplace = true;
        group.userData.collision = {
            x: x - (f.w + 0.20) / 2,
            z: 0,
            w: f.w + 0.20,
            d: fireDepth + 0.6 // 60cm clearance in front of fireplace
        };

        this.roomGroup.add(group);
        this.featureMeshes.push(group);
    }

    buildColumnFeature(f, room) {
        const r = f.radius || 0.18;
        const h = f.h || room.height;
        const group = new THREE.Group();
        group.position.set(f.x, 0, f.z || 0);

        const colMat = new THREE.MeshStandardMaterial({
            color: '#f0ece6', roughness: 0.6
        });

        // Shaft
        const shaft = new THREE.Mesh(
            new THREE.CylinderGeometry(r, r, h - 0.10, 16),
            colMat
        );
        shaft.position.y = h / 2;
        shaft.castShadow = true;
        shaft.receiveShadow = true;
        group.add(shaft);

        // Capital (top)
        const cap = new THREE.Mesh(
            new THREE.CylinderGeometry(r + 0.06, r, 0.08, 16),
            colMat
        );
        cap.position.y = h - 0.04;
        group.add(cap);

        // Base
        const base = new THREE.Mesh(
            new THREE.CylinderGeometry(r, r + 0.06, 0.08, 16),
            colMat
        );
        base.position.y = 0.04;
        group.add(base);

        // Store collision data
        group.userData.isColumn = true;
        group.userData.collision = { x: f.x, z: f.z || 0, radius: r + 0.05 };

        this.roomGroup.add(group);
        this.featureMeshes.push(group);
    }

    buildCounterFeature(f, room) {
        const { width: W, depth: D } = room;
        const group = new THREE.Group();

        const cw = f.depth || 0.6;
        const ch = f.h;
        const cl = f.w;

        if (f.wall === 'right') {
            group.position.set(W - cw / 2, 0, cl / 2);
        } else if (f.wall === 'left') {
            group.position.set(cw / 2, 0, cl / 2);
        } else {
            group.position.set(f.x + cl / 2, 0, cw / 2);
        }

        // Cabinet base
        const cabinet = new THREE.Mesh(
            new THREE.BoxGeometry(cl, ch - 0.03, cw),
            WOOD_MAT('#f0ece6')
        );
        cabinet.position.y = (ch - 0.03) / 2;
        cabinet.castShadow = true;
        cabinet.receiveShadow = true;
        group.add(cabinet);

        // Countertop
        const ctop = new THREE.Mesh(
            new THREE.BoxGeometry(cl + 0.03, 0.03, cw + 0.03),
            CERAMIC_MAT('#e8e4de')
        );
        ctop.position.y = ch - 0.015;
        ctop.castShadow = true;
        group.add(ctop);

        // Drawer/cabinet lines
        const numDoors = Math.floor(cl / 0.5);
        for (let i = 1; i < numDoors; i++) {
            const line = new THREE.Mesh(
                new THREE.BoxGeometry(0.003, ch - 0.10, 0.003),
                WOOD_MAT('#d8d0c4')
            );
            line.position.set(-cl/2 + i * (cl / numDoors), ch / 2 - 0.02, cw / 2 + 0.002);
            group.add(line);
        }

        // Knobs
        for (let i = 0; i < numDoors; i++) {
            const knob = new THREE.Mesh(
                new THREE.SphereGeometry(0.012, 6, 4),
                METAL_MAT('#bbb')
            );
            knob.position.set(
                -cl/2 + (i + 0.5) * (cl / numDoors),
                ch * 0.55,
                cw / 2 + 0.015
            );
            group.add(knob);
        }

        // Store collision data
        group.userData.isCounter = true;
        group.userData.collision = {
            x: group.position.x - cl/2,
            z: group.position.z - cw/2,
            w: cl,
            d: cw
        };

        this.roomGroup.add(group);
        this.featureMeshes.push(group);
    }

    setupLighting(room) {
        // Remove old lights
        this.scene.children
            .filter(c => c.isLight)
            .forEach(l => this.scene.remove(l));

        const { width: W, depth: D, height: H } = room;

        // Ambient
        const ambient = new THREE.AmbientLight('#fff5ee', 0.45);
        this.scene.add(ambient);

        // Main directional (sun through window)
        const dir = new THREE.DirectionalLight('#fff5e6', 0.7);
        dir.position.set(W / 2, H + 2, -2);
        dir.target.position.set(W / 2, 0, D / 2);
        dir.castShadow = true;
        dir.shadow.mapSize.width = 1024;
        dir.shadow.mapSize.height = 1024;
        dir.shadow.camera.left = -W;
        dir.shadow.camera.right = W;
        dir.shadow.camera.top = H + 1;
        dir.shadow.camera.bottom = -1;
        dir.shadow.camera.near = 0.1;
        dir.shadow.camera.far = H + D + 5;
        dir.shadow.bias = -0.001;
        this.scene.add(dir);
        this.scene.add(dir.target);

        // Fill light from front
        const fill = new THREE.DirectionalLight('#e8e4ff', 0.25);
        fill.position.set(W / 2, H * 0.7, D + 3);
        this.scene.add(fill);

        // Hemisphere for natural feel
        const hemi = new THREE.HemisphereLight('#f5f0eb', '#8B7355', 0.3);
        this.scene.add(hemi);
    }

    setWallSurface(surface) {
        this.currentWallSurface = surface;
        if (this.currentRoom) this.buildRoom(this.currentRoom);
    }

    setFloorSurface(surface) {
        this.currentFloorSurface = surface;
        if (this.currentRoom) this.buildRoom(this.currentRoom);
    }

    clearRoom() {
        while (this.roomGroup.children.length) {
            const child = this.roomGroup.children[0];
            this.roomGroup.remove(child);
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
                if (Array.isArray(child.material)) {
                    child.material.forEach(m => m.dispose());
                } else {
                    child.material.dispose();
                }
            }
        }
        this.wallMeshes = [];
        this.featureMeshes = [];
    }

    getFloorPlane() {
        return new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    }

    getWallPlanes() {
        if (!this.currentRoom) return [];
        const { width: W, depth: D, height: H } = this.currentRoom;
        return [
            { name: 'back', plane: new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), normal: new THREE.Vector3(0, 0, 1) },
            { name: 'left', plane: new THREE.Plane(new THREE.Vector3(1, 0, 0), 0), normal: new THREE.Vector3(1, 0, 0) },
            { name: 'right', plane: new THREE.Plane(new THREE.Vector3(-1, 0, 0), -W), normal: new THREE.Vector3(-1, 0, 0) },
        ];
    }

    getRoomBounds() {
        if (!this.currentRoom) return null;
        return {
            minX: 0, maxX: this.currentRoom.width,
            minZ: 0, maxZ: this.currentRoom.depth,
            height: this.currentRoom.height
        };
    }

    getObstacles() {
        const obstacles = [];
        this.featureMeshes.forEach(group => {
            if (group.userData.isColumn) {
                obstacles.push({ type: 'circle', ...group.userData.collision });
            }
            if (group.userData.isCounter || group.userData.isFireplace || group.userData.isDoor) {
                obstacles.push({ type: 'rect', ...group.userData.collision });
            }
        });
        return obstacles;
    }
}
