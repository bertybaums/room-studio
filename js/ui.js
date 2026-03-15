/* ============================================
   Room Studio 3D — UI Manager
   HTML overlay: catalog, toolbar, modals
   ============================================ */
import { ROOMS, ITEMS, SURFACES } from './data.js?v=3';
import { getAvailableColors } from './furniture.js?v=3';

// Helper: find an item definition by id across all categories
function findItemById(id) {
    for (const category of Object.keys(ITEMS)) {
        if (category === 'seasonal') {
            for (const season of Object.keys(ITEMS.seasonal)) {
                const found = ITEMS.seasonal[season].find(i => i.id === id);
                if (found) return found;
            }
        } else {
            const found = ITEMS[category].find(i => i.id === id);
            if (found) return found;
        }
    }
    return null;
}

export class UIManager {
    constructor(interaction, roomScene, requestRender) {
        this.interaction = interaction;
        this.roomScene = roomScene;
        this.requestRender = requestRender;

        this.currentCategory = 'seating';
        this.currentSeason = 'spring';
        this.currentRoom = ROOMS[0];

        // DOM refs
        this.catalogItems = document.getElementById('catalog-items');
        this.catalogTabs = document.getElementById('catalog-tabs');
        this.itemEdit = document.getElementById('item-edit');
        this.roomModal = document.getElementById('room-modal');
        this.roomGrid = document.getElementById('room-grid');
        this.dimensionLabel = document.getElementById('dimension-label');

        this.bindEvents();
    }

    init() {
        this.renderCatalog('seating');
        this.buildRoomModal();
        this.updateDimensionLabel();
        this.loadFixtures(this.currentRoom);
    }

    loadFixtures(room) {
        if (!room.fixtures || room.fixtures.length === 0) return;
        const resolved = [];
        for (const fix of room.fixtures) {
            const itemData = findItemById(fix.itemId);
            if (itemData) {
                resolved.push({
                    itemData,
                    colorIndex: fix.colorIndex || 0,
                    x: fix.x,
                    z: fix.z,
                    locked: fix.locked !== false,
                    rotation: fix.rotation || 0,
                });
            }
        }
        this.interaction.placeFixtures(resolved);
    }

    // ---- Catalog ----

    renderCatalog(category) {
        this.currentCategory = category;
        this.catalogItems.innerHTML = '';

        if (category === 'surfaces') {
            this.renderSurfaces();
            return;
        }

        let items;
        if (category === 'seasonal') {
            items = ITEMS.seasonal[this.currentSeason] || [];
        } else {
            items = ITEMS[category] || [];
        }

        items.forEach(item => {
            const el = document.createElement('div');
            el.className = 'catalog-item';
            el.dataset.itemId = item.id;

            // Preview icon based on category
            const icon = this.getItemIcon(item);

            el.innerHTML = `
                <div class="item-preview">${icon}</div>
                <div class="item-name">${item.name}</div>
                <div class="item-dims">${(item.w * 100).toFixed(0)}×${(item.d * 100).toFixed(0)}cm</div>
            `;

            this.bindCatalogDrag(el, item);
            this.catalogItems.appendChild(el);
        });
    }

    getItemIcon(item) {
        const icons = {
            'sofa-3': '🛋️', 'sofa-2': '🛋️', 'armchair': '💺', 'accent-chair': '💺',
            'dining-chair': '🪑', 'stool': '🪑', 'bench': '🪑', 'ottoman': '🟫',
            'coffee-table': '☕', 'side-table': '🟤', 'dining-table': '🍽️',
            'console-table': '▬', 'nightstand': '🟤', 'desk': '🖥️', 'kitchen-island': '🏝️',
            'bed-double': '🛏️', 'bed-queen': '🛏️', 'bed-single': '🛌',
            'dresser': '🗄️', 'wardrobe': '🚪', 'vanity': '💄',
            'bookshelf': '📚', 'bookshelf-wide': '📚', 'cabinet': '🗄️',
            'tv-stand': '📺', 'sideboard': '🗄️',
            'floor-lamp': '🪔', 'table-lamp': '💡', 'pendant': '✨',
            'painting-lg': '🖼️', 'painting-sm': '🖼️', 'mirror-rect': '🪞',
            'mirror-round': '🪞', 'clock': '🕰️', 'potted-plant': '🪴',
            'tall-plant': '🌿', 'vase': '🏺', 'rug-large': '🟫', 'rug-small': '🟫',
            'bathtub': '🛁', 'toilet': '🚽', 'bath-vanity': '🚿', 'shower': '🚿',
            'fridge': '🧊', 'oven': '🔥', 'dishwasher': '🧹', 'upper-cabinet': '🗄️',
            'sp-tulips': '🌷', 'sp-basket': '🧺', 'sp-wreath': '🌿', 'sp-birdhouse': '🐦',
            'sp-butterfly-art': '🦋', 'sp-planter': '🌸',
            'su-sunflowers': '🌻', 'su-fruit-bowl': '🍑', 'su-shells': '🐚',
            'su-beach-art': '🏖️', 'su-lantern': '🏮', 'su-wicker-basket': '🧺',
            'au-pumpkin': '🎃', 'au-pumpkin-sm': '🎃', 'au-garland': '🍂',
            'au-wreath': '🍂', 'au-candle-set': '🕯️', 'au-throw': '🧣', 'au-apple-basket': '🍎',
            'wi-xmas-tree': '🎄', 'wi-blanket': '🧶', 'wi-wreath': '❄️',
            'wi-stocking': '🧦', 'wi-candles': '🕯️', 'wi-snowglobe': '🔮',
            'wi-garland': '🌲', 'wi-gift': '🎁',
        };
        return icons[item.id] || '📦';
    }

    bindCatalogDrag(el, item) {
        let isDragging = false;
        let startX, startY;

        const onStart = (e) => {
            const pt = this.getPoint(e);
            startX = pt.x;
            startY = pt.y;
            isDragging = false;
            e.preventDefault();
        };

        const onMove = (e) => {
            const pt = this.getPoint(e);
            if (!isDragging && (Math.abs(pt.x - startX) > 8 || Math.abs(pt.y - startY) > 8)) {
                isDragging = true;
                this.interaction.startCatalogDrag(item, 0);
            }
            if (isDragging) {
                this.interaction.updateCatalogDrag(e);
                e.preventDefault();
            }
        };

        const onEnd = (e) => {
            if (isDragging) {
                this.interaction.endCatalogDrag(e);
            } else {
                // Tap to place at room center
                const bounds = this.roomScene.getRoomBounds();
                if (bounds) {
                    const x = (bounds.minX + bounds.maxX) / 2;
                    const z = (bounds.minZ + bounds.maxZ) / 2;
                    this.interaction.placeItem(item, 0, x, z);
                }
            }
            isDragging = false;
            document.removeEventListener('pointermove', onMove);
            document.removeEventListener('pointerup', onEnd);
        };

        el.addEventListener('pointerdown', (e) => {
            onStart(e);
            document.addEventListener('pointermove', onMove);
            document.addEventListener('pointerup', onEnd);
        });
    }

    // ---- Surfaces ----

    renderSurfaces() {
        // Wall surfaces
        const wallLabel = document.createElement('div');
        wallLabel.className = 'surface-group-label';
        wallLabel.textContent = 'Walls';
        this.catalogItems.appendChild(wallLabel);

        SURFACES.walls.forEach(s => {
            const el = document.createElement('div');
            el.className = 'surface-option' +
                (this.roomScene.currentWallSurface.id === s.id ? ' active' : '');
            el.innerHTML = `
                <div class="surface-swatch" style="background: ${s.color}"></div>
                <div class="surface-label">${s.name}</div>
            `;
            el.addEventListener('click', () => {
                this.roomScene.setWallSurface(s);
                this.renderCatalog('surfaces');
                this.requestRender();
            });
            this.catalogItems.appendChild(el);
        });

        // Floor surfaces
        const floorLabel = document.createElement('div');
        floorLabel.className = 'surface-group-label';
        floorLabel.textContent = 'Floors';
        this.catalogItems.appendChild(floorLabel);

        SURFACES.floors.forEach(s => {
            const el = document.createElement('div');
            el.className = 'surface-option' +
                (this.roomScene.currentFloorSurface.id === s.id ? ' active' : '');
            el.innerHTML = `
                <div class="surface-swatch" style="background: ${s.color}"></div>
                <div class="surface-label">${s.name}</div>
            `;
            el.addEventListener('click', () => {
                this.roomScene.setFloorSurface(s);
                this.renderCatalog('surfaces');
                this.requestRender();
            });
            this.catalogItems.appendChild(el);
        });
    }

    // ---- Item Edit Popover ----

    showEditPopover(record) {
        this.itemEdit.classList.remove('hidden');

        // Update color swatches
        const colorContainer = document.getElementById('edit-colors');
        colorContainer.innerHTML = '';
        const colors = getAvailableColors(record.itemData);
        colors.forEach((color, idx) => {
            const swatch = document.createElement('button');
            swatch.className = 'color-swatch' + (idx === record.colorIndex ? ' active' : '');
            swatch.style.background = color;
            swatch.addEventListener('click', () => {
                this.interaction.changeColorSelected(idx);
                this.showEditPopover(this.interaction.selectedItem); // refresh
            });
            colorContainer.appendChild(swatch);
        });

        // Update dimension display
        const dimInfo = document.getElementById('edit-dimensions');
        const d = record.itemData;
        dimInfo.textContent = `${(d.w * 100).toFixed(0)}×${(d.d * 100).toFixed(0)}×${(d.h * 100).toFixed(0)}cm`;
    }

    hideEditPopover() {
        this.itemEdit.classList.add('hidden');
    }

    // ---- Room Modal ----

    buildRoomModal() {
        this.roomGrid.innerHTML = '';
        ROOMS.forEach(room => {
            const el = document.createElement('div');
            el.className = 'room-option' + (room.id === this.currentRoom.id ? ' active' : '');
            el.innerHTML = `
                <div class="room-icon">${room.icon}</div>
                <div class="room-name">${room.name}</div>
                <div class="room-desc">${room.desc}</div>
                <div class="room-dims">${room.width}m × ${room.depth}m × ${room.height}m</div>
            `;
            el.addEventListener('click', () => {
                this.currentRoom = room;
                this.interaction.clearAll();
                this.roomScene.buildRoom(room);
                this.loadFixtures(room);
                this.buildRoomModal();
                this.roomModal.classList.add('hidden');
                this.updateDimensionLabel();
                if (this.onRoomChange) this.onRoomChange(room);
                this.requestRender();
            });
            this.roomGrid.appendChild(el);
        });
    }

    updateDimensionLabel() {
        const r = this.currentRoom;
        if (this.dimensionLabel) {
            this.dimensionLabel.textContent = `${r.name} — ${r.width}m × ${r.depth}m × ${r.height}m`;
        }
    }

    // ---- Event binding ----

    bindEvents() {
        // Tab switching
        this.catalogTabs.addEventListener('click', (e) => {
            const tab = e.target.closest('.cat-tab');
            if (!tab) return;
            this.catalogTabs.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            this.renderCatalog(tab.dataset.category);
        });

        // Season switching
        document.querySelectorAll('.season-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.season-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentSeason = btn.dataset.season;
                const activeTab = this.catalogTabs.querySelector('.cat-tab.active');
                if (activeTab && activeTab.dataset.category === 'seasonal') {
                    this.renderCatalog('seasonal');
                }
            });
        });

        // Room modal
        document.getElementById('room-select-btn').addEventListener('click', () => {
            this.roomModal.classList.remove('hidden');
        });
        document.getElementById('room-modal-close').addEventListener('click', () => {
            this.roomModal.classList.add('hidden');
        });
        this.roomModal.addEventListener('click', (e) => {
            if (e.target === this.roomModal) this.roomModal.classList.add('hidden');
        });

        // Clear room items
        document.getElementById('clear-room-btn').addEventListener('click', () => {
            this.interaction.clearAll();
        });

        // View buttons
        document.getElementById('view-front')?.addEventListener('click', () => {
            this.setView('front');
        });
        document.getElementById('view-corner')?.addEventListener('click', () => {
            this.setView('corner');
        });
        document.getElementById('view-top')?.addEventListener('click', () => {
            this.setView('top');
        });

        // Edit buttons
        document.getElementById('edit-rotate').addEventListener('click', () => {
            this.interaction.rotateSelected();
        });
        document.getElementById('edit-delete').addEventListener('click', () => {
            this.interaction.deleteSelected();
            this.hideEditPopover();
        });
        document.getElementById('edit-forward').addEventListener('click', () => {
            this.interaction.bringForward();
        });
        document.getElementById('edit-backward').addEventListener('click', () => {
            this.interaction.sendBackward();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (!this.interaction.selectedItem) return;
            const step = 0.05;
            switch (e.key) {
                case 'Delete': case 'Backspace':
                    this.interaction.deleteSelected();
                    this.hideEditPopover();
                    e.preventDefault();
                    break;
                case 'r':
                    this.interaction.rotateSelected();
                    break;
                case 'Escape':
                    this.interaction.deselectItem();
                    this.hideEditPopover();
                    break;
                case 'ArrowLeft':
                    this.interaction.nudge(-step, 0);
                    e.preventDefault();
                    break;
                case 'ArrowRight':
                    this.interaction.nudge(step, 0);
                    e.preventDefault();
                    break;
                case 'ArrowUp':
                    this.interaction.nudge(0, -step);
                    e.preventDefault();
                    break;
                case 'ArrowDown':
                    this.interaction.nudge(0, step);
                    e.preventDefault();
                    break;
            }
        });
    }

    setView(view) {
        // This will be called from main.js with camera animation
        if (this.onViewChange) this.onViewChange(view);
    }

    // ---- Helpers ----

    getPoint(e) {
        if (e.touches && e.touches.length > 0) {
            return { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
        return { x: e.clientX, y: e.clientY };
    }
}
