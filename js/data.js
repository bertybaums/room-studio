/* ============================================
   Room Studio 3D — Data Definitions
   All rooms, items, materials, and seasonal data
   Dimensions in meters
   ============================================ */

// Room definitions with real-world dimensions
export const ROOMS = [
    {
        id: 'living-simple',
        name: 'Simple Living Room',
        icon: '🏠',
        desc: 'Open rectangular space',
        type: 'living',
        width: 5, depth: 4, height: 2.8,
        wallColor: '#f0ece6',
        floorType: 'hardwood',
        features: [
            { type: 'door', wall: 'left', x: 0.3, y: 0, w: 0.9, h: 2.1 }
        ]
    },
    {
        id: 'living-bay',
        name: 'Bay Window Living',
        icon: '🪟',
        desc: 'Large centered bay window',
        type: 'living',
        width: 5.5, depth: 4.5, height: 2.8,
        wallColor: '#f0ece6',
        floorType: 'hardwood',
        features: [
            { type: 'window', wall: 'back', x: 1.5, y: 0.9, w: 2.5, h: 1.5 },
            { type: 'door', wall: 'left', x: 0.3, y: 0, w: 0.9, h: 2.1 }
        ]
    },
    {
        id: 'living-fireplace',
        name: 'Fireplace Living',
        icon: '🔥',
        desc: 'Centered fireplace with mantel',
        type: 'living',
        width: 5.5, depth: 4, height: 2.8,
        wallColor: '#f0ece6',
        floorType: 'hardwood',
        features: [
            { type: 'fireplace', wall: 'back', x: 2.0, y: 0, w: 1.2, h: 1.3 },
            { type: 'window', wall: 'right', x: 0.8, y: 0.9, w: 1.2, h: 1.4 },
            { type: 'door', wall: 'left', x: 0.3, y: 0, w: 0.9, h: 2.1 }
        ]
    },
    {
        id: 'living-grand',
        name: 'Grand Living Room',
        icon: '🏛️',
        desc: 'Fireplace flanked by tall windows',
        type: 'living',
        width: 6.5, depth: 5, height: 3.2,
        wallColor: '#ede8e0',
        floorType: 'herringbone',
        features: [
            { type: 'window', wall: 'back', x: 0.5, y: 0.8, w: 1.4, h: 1.8 },
            { type: 'fireplace', wall: 'back', x: 2.8, y: 0, w: 1.3, h: 1.4 },
            { type: 'window', wall: 'back', x: 4.8, y: 0.8, w: 1.4, h: 1.8 },
            { type: 'door', wall: 'left', x: 0.3, y: 0, w: 0.9, h: 2.1 },
            { type: 'column', wall: 'none', x: 1.5, z: 1.5, radius: 0.18, h: 3.2 },
            { type: 'column', wall: 'none', x: 5.0, z: 1.5, radius: 0.18, h: 3.2 }
        ]
    },
    {
        id: 'bedroom-master',
        name: 'Master Bedroom',
        icon: '🛏️',
        desc: 'Spacious bedroom with closet',
        type: 'bedroom',
        width: 4.5, depth: 4, height: 2.7,
        wallColor: '#e8e4de',
        floorType: 'hardwood',
        features: [
            { type: 'window', wall: 'back', x: 1.25, y: 0.9, w: 2.0, h: 1.4 },
            { type: 'door', wall: 'left', x: 0.3, y: 0, w: 0.9, h: 2.1 },
            { type: 'closet-door', wall: 'right', x: 0.5, y: 0, w: 1.8, h: 2.3 }
        ]
    },
    {
        id: 'bedroom-small',
        name: 'Small Bedroom',
        icon: '🛌',
        desc: 'Tight space — a real challenge',
        type: 'bedroom',
        width: 3.2, depth: 3, height: 2.6,
        wallColor: '#f0ece6',
        floorType: 'hardwood',
        features: [
            { type: 'window', wall: 'back', x: 0.8, y: 0.9, w: 1.2, h: 1.2 },
            { type: 'door', wall: 'left', x: 0.2, y: 0, w: 0.8, h: 2.1 }
        ]
    },
    {
        id: 'kitchen',
        name: 'Galley Kitchen',
        icon: '🍳',
        desc: 'Appliances fixed — decorate around them',
        type: 'kitchen',
        width: 4.5, depth: 2.8, height: 2.6,
        wallColor: '#f5f0eb',
        floorType: 'tile-white',
        features: [
            { type: 'window', wall: 'back', x: 1.5, y: 1.0, w: 1.5, h: 1.2 },
            { type: 'counter', wall: 'right', x: 0, y: 0, w: 2.8, h: 0.9, depth: 0.6 },
            { type: 'door', wall: 'left', x: 0.3, y: 0, w: 0.9, h: 2.1 }
        ],
        fixtures: [
            { itemId: 'fridge', x: 4.1, z: 0.35, colorIndex: 0, locked: true },
            { itemId: 'oven', x: 3.9, z: 2.5, colorIndex: 0, locked: true, rotation: Math.PI },
            { itemId: 'upper-cabinet', x: 1.0, z: 0.18, colorIndex: 0, locked: true },
            { itemId: 'upper-cabinet', x: 2.0, z: 0.18, colorIndex: 0, locked: true },
        ]
    },
    {
        id: 'kitchen-open',
        name: 'Open Kitchen',
        icon: '🏠',
        desc: 'Appliances + island space to fill',
        type: 'kitchen',
        width: 5, depth: 4, height: 2.7,
        wallColor: '#f5f0eb',
        floorType: 'tile-white',
        features: [
            { type: 'window', wall: 'back', x: 1.5, y: 0.9, w: 2.0, h: 1.4 },
            { type: 'counter', wall: 'left', x: 0, y: 0, w: 4.0, h: 0.9, depth: 0.6 },
            { type: 'door', wall: 'right', x: 0.3, y: 0, w: 0.9, h: 2.1 }
        ],
        fixtures: [
            { itemId: 'fridge', x: 0.35, z: 3.65, colorIndex: 0, locked: true },
            { itemId: 'oven', x: 0.30, z: 2.2, colorIndex: 0, locked: true, rotation: Math.PI / 2 },
            { itemId: 'dishwasher', x: 0.30, z: 1.2, colorIndex: 0, locked: true, rotation: Math.PI / 2 },
            { itemId: 'upper-cabinet', x: 0.18, z: 0.8, colorIndex: 0, locked: true, rotation: Math.PI / 2 },
            { itemId: 'upper-cabinet', x: 0.18, z: 1.8, colorIndex: 0, locked: true, rotation: Math.PI / 2 },
        ]
    },
    {
        id: 'bathroom',
        name: 'Full Bathroom',
        icon: '🚿',
        desc: 'Fixtures installed — add towels, art, storage',
        type: 'bathroom',
        width: 2.8, depth: 2.4, height: 2.5,
        wallColor: '#e8e4de',
        floorType: 'tile-dark',
        features: [
            { type: 'window', wall: 'back', x: 0.8, y: 1.3, w: 1.0, h: 0.8 },
            { type: 'door', wall: 'left', x: 0.2, y: 0, w: 0.75, h: 2.1 }
        ],
        fixtures: [
            { itemId: 'bathtub', x: 1.85, z: 0.38, colorIndex: 0, locked: true },
            { itemId: 'toilet', x: 0.55, z: 0.35, colorIndex: 0, locked: true },
            { itemId: 'bath-vanity', x: 1.4, z: 2.15, colorIndex: 0, locked: true, rotation: Math.PI },
            { itemId: 'mirror-rect', x: 1.4, z: 2.15, colorIndex: 0, locked: true, rotation: Math.PI },
        ]
    },
    {
        id: 'bathroom-master',
        name: 'Master Bathroom',
        icon: '🛁',
        desc: 'Larger bath with shower — make it luxurious',
        type: 'bathroom',
        width: 3.5, depth: 3.0, height: 2.6,
        wallColor: '#e8e4de',
        floorType: 'marble',
        features: [
            { type: 'window', wall: 'back', x: 1.2, y: 1.2, w: 1.2, h: 1.0 },
            { type: 'door', wall: 'left', x: 0.2, y: 0, w: 0.8, h: 2.1 }
        ],
        fixtures: [
            { itemId: 'bathtub', x: 2.65, z: 0.38, colorIndex: 0, locked: true },
            { itemId: 'shower', x: 0.45, z: 0.45, colorIndex: 0, locked: true },
            { itemId: 'toilet', x: 0.55, z: 2.6, colorIndex: 0, locked: true, rotation: Math.PI },
            { itemId: 'bath-vanity', x: 1.8, z: 2.75, colorIndex: 0, locked: true, rotation: Math.PI },
            { itemId: 'bath-vanity', x: 2.7, z: 2.75, colorIndex: 1, locked: true, rotation: Math.PI },
        ]
    },
    {
        id: 'studio',
        name: 'Studio Apartment',
        icon: '📐',
        desc: 'Everything in one awkward space',
        type: 'studio',
        width: 7, depth: 4, height: 2.7,
        wallColor: '#f0ece6',
        floorType: 'hardwood',
        features: [
            { type: 'window', wall: 'back', x: 0.5, y: 0.9, w: 1.5, h: 1.4 },
            { type: 'window', wall: 'back', x: 5.0, y: 0.9, w: 1.5, h: 1.4 },
            { type: 'counter', wall: 'right', x: 0, y: 0, w: 2.5, h: 0.9, depth: 0.6 },
            { type: 'door', wall: 'left', x: 0.3, y: 0, w: 0.9, h: 2.1 },
            { type: 'column', wall: 'none', x: 3.5, z: 2.0, radius: 0.2, h: 2.7 }
        ],
        fixtures: [
            { itemId: 'fridge', x: 6.65, z: 0.35, colorIndex: 0, locked: true },
            { itemId: 'oven', x: 6.65, z: 1.35, colorIndex: 0, locked: true, rotation: -Math.PI / 2 },
        ]
    },
    {
        id: 'living-challenge',
        name: 'The Awkward Living Room',
        icon: '🧩',
        desc: 'Two columns, fireplace, and weird proportions',
        type: 'living',
        width: 5.5, depth: 5.5, height: 3.0,
        wallColor: '#ede8e0',
        floorType: 'herringbone',
        features: [
            { type: 'fireplace', wall: 'back', x: 2.0, y: 0, w: 1.2, h: 1.3 },
            { type: 'window', wall: 'right', x: 1.0, y: 0.8, w: 1.5, h: 1.6 },
            { type: 'window', wall: 'right', x: 3.2, y: 0.8, w: 1.5, h: 1.6 },
            { type: 'door', wall: 'left', x: 0.3, y: 0, w: 0.9, h: 2.1 },
            { type: 'column', wall: 'none', x: 1.8, z: 2.0, radius: 0.18, h: 3.0 },
            { type: 'column', wall: 'none', x: 3.7, z: 2.0, radius: 0.18, h: 3.0 }
        ]
    }
];

// Furniture catalog — dimensions in meters (width, depth, height)
// placement: 'floor' or 'wall'
export const ITEMS = {
    seating: [
        { id: 'sofa-3', name: '3-Seat Sofa', w: 2.1, d: 0.9, h: 0.80, placement: 'floor', colors: ['#8B7355', '#6B4226', '#C4916E', '#4A5568', '#9B2335', '#2E5090', '#f0ece6', '#2c2c2c', '#6B8E23', '#D2691E', '#8B4513', '#c5ceb5'] },
        { id: 'sofa-2', name: '2-Seat Sofa', w: 1.5, d: 0.85, h: 0.78, placement: 'floor', colors: ['#8B7355', '#6B4226', '#C4916E', '#4A5568', '#9B2335', '#2E5090', '#f0ece6', '#2c2c2c', '#6B8E23', '#D2691E', '#c5ceb5'] },
        { id: 'armchair', name: 'Armchair', w: 0.85, d: 0.85, h: 0.80, placement: 'floor', colors: ['#8B7355', '#C4916E', '#6B8E23', '#4A5568', '#9B2335', '#2E5090', '#DAA520', '#f0ece6', '#2c2c2c', '#D2691E', '#c5ceb5'] },
        { id: 'accent-chair', name: 'Accent Chair', w: 0.70, d: 0.70, h: 0.82, placement: 'floor', colors: ['#DAA520', '#9B2335', '#2E5090', '#6B8E23', '#FF69B4', '#FF8C00', '#4A5568', '#c4b8d4', '#87CEEB', '#c5ceb5'] },
        { id: 'dining-chair', name: 'Dining Chair', w: 0.45, d: 0.48, h: 0.88, placement: 'floor', colors: ['#8B7355', '#5C4033', '#2c2c2c', '#f0ece6', '#6B4226', '#DAA520', '#c9bfb2'] },
        { id: 'stool', name: 'Bar Stool', w: 0.38, d: 0.38, h: 0.75, placement: 'floor', colors: ['#2c2c2c', '#8B7355', '#f0ece6', '#DAA520', '#c0c0c0'] },
        { id: 'bench', name: 'Bench', w: 1.2, d: 0.40, h: 0.48, placement: 'floor', colors: ['#8B7355', '#5C4033', '#f0ece6', '#2c2c2c', '#6B4226', '#c9bfb2'] },
        { id: 'ottoman', name: 'Ottoman', w: 0.60, d: 0.60, h: 0.40, placement: 'floor', colors: ['#8B7355', '#C4916E', '#4A5568', '#9B2335', '#2E5090', '#6B8E23', '#DAA520', '#f0ece6', '#c5ceb5'] },
    ],
    tables: [
        { id: 'coffee-table', name: 'Coffee Table', w: 1.2, d: 0.60, h: 0.45, placement: 'floor', colors: ['#8B7355', '#5C4033', '#2c2c2c', '#f0ece6', '#6B4226', '#d4b088', '#c9bfb2'] },
        { id: 'side-table', name: 'Side Table', w: 0.50, d: 0.50, h: 0.55, placement: 'floor', colors: ['#8B7355', '#5C4033', '#DAA520', '#f0ece6', '#2c2c2c', '#c0c0c0', '#6B4226'] },
        { id: 'dining-table', name: 'Dining Table', w: 1.5, d: 0.90, h: 0.75, placement: 'floor', colors: ['#8B7355', '#5C4033', '#f0ece6', '#6B4226', '#d4b088', '#2c2c2c'] },
        { id: 'console-table', name: 'Console Table', w: 1.2, d: 0.35, h: 0.75, placement: 'floor', colors: ['#8B7355', '#5C4033', '#2c2c2c', '#f0ece6', '#DAA520', '#c0c0c0'] },
        { id: 'nightstand', name: 'Nightstand', w: 0.45, d: 0.40, h: 0.55, placement: 'floor', colors: ['#8B7355', '#5C4033', '#f0ece6', '#2c2c2c', '#6B4226', '#d4b088', '#c9bfb2'] },
        { id: 'desk', name: 'Writing Desk', w: 1.2, d: 0.60, h: 0.76, placement: 'floor', colors: ['#8B7355', '#5C4033', '#f0ece6', '#2c2c2c', '#6B4226', '#d4b088'] },
        { id: 'kitchen-island', name: 'Kitchen Island', w: 1.2, d: 0.70, h: 0.90, placement: 'floor', colors: ['#f0ece6', '#5C4033', '#8B7355', '#2c2c2c', '#e8e2d8'] },
    ],
    bedroom: [
        { id: 'bed-double', name: 'Double Bed', w: 1.6, d: 2.1, h: 0.55, placement: 'floor', colors: ['#f0ece6', '#d4c5b0', '#8B7355', '#c5ceb5', '#b0c4d8', '#e8cfc4', '#c4b8d4', '#2c3e5a', '#9B2335'] },
        { id: 'bed-queen', name: 'Queen Bed', w: 1.8, d: 2.1, h: 0.55, placement: 'floor', colors: ['#f0ece6', '#d4c5b0', '#8B7355', '#c5ceb5', '#b0c4d8', '#e8cfc4', '#c4b8d4', '#2c3e5a', '#9B2335'] },
        { id: 'bed-single', name: 'Single Bed', w: 1.0, d: 2.0, h: 0.50, placement: 'floor', colors: ['#f0ece6', '#d4c5b0', '#c5ceb5', '#b0c4d8', '#e8cfc4', '#c4b8d4', '#87CEEB'] },
        { id: 'dresser', name: 'Dresser', w: 1.2, d: 0.50, h: 0.80, placement: 'floor', colors: ['#8B7355', '#5C4033', '#f0ece6', '#2c2c2c', '#6B4226', '#d4b088', '#c9bfb2'] },
        { id: 'wardrobe', name: 'Wardrobe', w: 1.0, d: 0.60, h: 2.0, placement: 'floor', colors: ['#8B7355', '#5C4033', '#f0ece6', '#2c2c2c', '#6B4226', '#d4b088'] },
        { id: 'vanity', name: 'Vanity Table', w: 1.0, d: 0.45, h: 0.76, placement: 'floor', colors: ['#f0ece6', '#8B7355', '#5C4033', '#e8cfc4', '#c9bfb2', '#2c2c2c'] },
    ],
    storage: [
        { id: 'bookshelf', name: 'Bookshelf', w: 0.80, d: 0.30, h: 1.80, placement: 'floor', colors: ['#8B7355', '#5C4033', '#f0ece6', '#2c2c2c', '#6B4226', '#d4b088'] },
        { id: 'bookshelf-wide', name: 'Wide Bookshelf', w: 1.20, d: 0.35, h: 1.80, placement: 'floor', colors: ['#8B7355', '#5C4033', '#f0ece6', '#2c2c2c', '#6B4226', '#d4b088'] },
        { id: 'cabinet', name: 'Cabinet', w: 0.80, d: 0.40, h: 1.20, placement: 'floor', colors: ['#8B7355', '#5C4033', '#f0ece6', '#2c2c2c', '#6B4226', '#c9bfb2'] },
        { id: 'tv-stand', name: 'TV Stand', w: 1.5, d: 0.40, h: 0.50, placement: 'floor', colors: ['#2c2c2c', '#5C4033', '#8B7355', '#f0ece6', '#4A5568', '#d4b088'] },
        { id: 'sideboard', name: 'Sideboard', w: 1.6, d: 0.45, h: 0.85, placement: 'floor', colors: ['#8B7355', '#5C4033', '#f0ece6', '#2c2c2c', '#6B4226', '#c9bfb2', '#d4b088'] },
    ],
    lighting: [
        { id: 'floor-lamp', name: 'Floor Lamp', w: 0.35, d: 0.35, h: 1.60, placement: 'floor', colors: ['#f0ece6', '#DAA520', '#2c2c2c', '#C4916E', '#9B2335', '#b0c4d8', '#c5ceb5'] },
        { id: 'table-lamp', name: 'Table Lamp', w: 0.25, d: 0.25, h: 0.45, placement: 'floor', colors: ['#f0ece6', '#C4916E', '#2E5090', '#9B2335', '#DAA520', '#6B8E23', '#b0c4d8', '#c4b8d4'] },
        { id: 'pendant', name: 'Pendant Light', w: 0.40, d: 0.40, h: 0.35, placement: 'ceiling', colors: ['#f0ece6', '#2c2c2c', '#DAA520', '#C4916E', '#c0c0c0', '#9B2335'] },
    ],
    decor: [
        { id: 'painting-lg', name: 'Large Painting', w: 0.80, d: 0.04, h: 0.60, placement: 'wall', colors: ['#2E5090', '#9B2335', '#6B8E23', '#DAA520', '#FF8C00', '#4A5568', '#c27856', '#8B4513', '#FF69B4', '#87CEEB'] },
        { id: 'painting-sm', name: 'Small Painting', w: 0.50, d: 0.04, h: 0.40, placement: 'wall', colors: ['#2E5090', '#9B2335', '#6B8E23', '#DAA520', '#FF8C00', '#4A5568', '#c27856', '#FF69B4', '#87CEEB'] },
        { id: 'mirror-rect', name: 'Rectangle Mirror', w: 0.60, d: 0.03, h: 0.80, placement: 'wall', colors: ['#DAA520', '#8B7355', '#2c2c2c', '#c0c0c0', '#f0ece6'] },
        { id: 'mirror-round', name: 'Round Mirror', w: 0.60, d: 0.03, h: 0.60, placement: 'wall', colors: ['#DAA520', '#2c2c2c', '#c0c0c0', '#8B7355', '#f0ece6'] },
        { id: 'clock', name: 'Wall Clock', w: 0.35, d: 0.05, h: 0.35, placement: 'wall', colors: ['#2c2c2c', '#8B7355', '#f0ece6', '#DAA520', '#c0c0c0'] },
        { id: 'potted-plant', name: 'Potted Plant', w: 0.30, d: 0.30, h: 0.60, placement: 'floor', colors: ['#6B8E23', '#228B22', '#3CB371', '#556B2F'] },
        { id: 'tall-plant', name: 'Tall Plant', w: 0.45, d: 0.45, h: 1.20, placement: 'floor', colors: ['#6B8E23', '#228B22', '#3CB371', '#556B2F'] },
        { id: 'vase', name: 'Vase', w: 0.15, d: 0.15, h: 0.30, placement: 'floor', colors: ['#C4916E', '#2E5090', '#f0ece6', '#9B2335', '#DAA520', '#228B22', '#FF69B4', '#87CEEB', '#c4b8d4', '#FF8C00'] },
        { id: 'rug-large', name: 'Large Rug', w: 2.5, d: 1.8, h: 0.02, placement: 'floor', colors: ['#8B7355', '#9B2335', '#2E5090', '#C4916E', '#4A5568', '#6B8E23', '#D2691E', '#c5ceb5', '#c4b8d4', '#2c3e5a'] },
        { id: 'rug-small', name: 'Small Rug', w: 1.5, d: 1.0, h: 0.02, placement: 'floor', colors: ['#8B7355', '#C4916E', '#6B8E23', '#9B2335', '#2E5090', '#DAA520', '#4A5568', '#e8cfc4', '#c4b8d4'] },
    ],
    bathroom: [
        { id: 'bathtub', name: 'Bathtub', w: 1.7, d: 0.75, h: 0.60, placement: 'floor', colors: ['#f0ece6', '#e0e0e0', '#2c2c2c'] },
        { id: 'toilet', name: 'Toilet', w: 0.40, d: 0.65, h: 0.42, placement: 'floor', colors: ['#f0ece6', '#e0e0e0'] },
        { id: 'bath-vanity', name: 'Bath Vanity', w: 0.80, d: 0.50, h: 0.85, placement: 'floor', colors: ['#f0ece6', '#8B7355', '#5C4033', '#2c2c2c', '#c9bfb2', '#d4b088'] },
        { id: 'shower', name: 'Shower Enclosure', w: 0.90, d: 0.90, h: 2.10, placement: 'floor', colors: ['#e0e0e0', '#f0ece6'] },
    ],
    kitchen: [
        { id: 'fridge', name: 'Refrigerator', w: 0.70, d: 0.70, h: 1.80, placement: 'floor', colors: ['#e0e0e0', '#2c2c2c', '#c0c0c0'] },
        { id: 'oven', name: 'Oven/Range', w: 0.60, d: 0.60, h: 0.90, placement: 'floor', colors: ['#e0e0e0', '#2c2c2c', '#c0c0c0'] },
        { id: 'dishwasher', name: 'Dishwasher', w: 0.60, d: 0.60, h: 0.85, placement: 'floor', colors: ['#e0e0e0', '#2c2c2c', '#c0c0c0'] },
        { id: 'upper-cabinet', name: 'Upper Cabinet', w: 0.80, d: 0.35, h: 0.70, placement: 'wall', wallY: 1.5, colors: ['#f0ece6', '#8B7355', '#5C4033', '#2c2c2c', '#c5ceb5', '#c9bfb2'] },
    ],
    seasonal: {
        spring: [
            { id: 'sp-tulips', name: 'Tulip Vase', w: 0.18, d: 0.18, h: 0.40, placement: 'floor', colors: ['#FF69B4', '#FF1493', '#FFD700'] },
            { id: 'sp-basket', name: 'Flower Basket', w: 0.30, d: 0.30, h: 0.25, placement: 'floor', colors: ['#DEB887'] },
            { id: 'sp-wreath', name: 'Spring Wreath', w: 0.45, d: 0.08, h: 0.45, placement: 'wall', colors: ['#6B8E23'] },
            { id: 'sp-birdhouse', name: 'Birdhouse', w: 0.15, d: 0.15, h: 0.25, placement: 'floor', colors: ['#DAA520'] },
            { id: 'sp-butterfly-art', name: 'Butterfly Art', w: 0.40, d: 0.04, h: 0.30, placement: 'wall', colors: ['#FF69B4', '#87CEEB'] },
            { id: 'sp-planter', name: 'Window Planter', w: 0.50, d: 0.18, h: 0.20, placement: 'floor', colors: ['#C4916E'] },
        ],
        summer: [
            { id: 'su-sunflowers', name: 'Sunflowers', w: 0.20, d: 0.20, h: 0.50, placement: 'floor', colors: ['#FFD700'] },
            { id: 'su-fruit-bowl', name: 'Fruit Bowl', w: 0.30, d: 0.30, h: 0.15, placement: 'floor', colors: ['#FF6347', '#FFD700', '#32CD32'] },
            { id: 'su-shells', name: 'Shell Collection', w: 0.25, d: 0.20, h: 0.08, placement: 'floor', colors: ['#F5DEB3'] },
            { id: 'su-beach-art', name: 'Beach Painting', w: 0.60, d: 0.04, h: 0.45, placement: 'wall', colors: ['#87CEEB'] },
            { id: 'su-lantern', name: 'Garden Lantern', w: 0.20, d: 0.20, h: 0.35, placement: 'floor', colors: ['#2c2c2c'] },
            { id: 'su-wicker-basket', name: 'Wicker Basket', w: 0.35, d: 0.35, h: 0.30, placement: 'floor', colors: ['#DEB887'] },
        ],
        autumn: [
            { id: 'au-pumpkin', name: 'Pumpkin', w: 0.25, d: 0.25, h: 0.22, placement: 'floor', colors: ['#FF8C00'] },
            { id: 'au-pumpkin-sm', name: 'Small Pumpkin', w: 0.15, d: 0.15, h: 0.13, placement: 'floor', colors: ['#FFD700', '#F5F5DC'] },
            { id: 'au-garland', name: 'Leaf Garland', w: 1.0, d: 0.05, h: 0.15, placement: 'wall', colors: ['#D2691E'] },
            { id: 'au-wreath', name: 'Fall Wreath', w: 0.45, d: 0.08, h: 0.45, placement: 'wall', colors: ['#D2691E'] },
            { id: 'au-candle-set', name: 'Candle Set', w: 0.25, d: 0.15, h: 0.20, placement: 'floor', colors: ['#DAA520'] },
            { id: 'au-throw', name: 'Plaid Throw', w: 0.50, d: 0.40, h: 0.08, placement: 'floor', colors: ['#8B0000'] },
            { id: 'au-apple-basket', name: 'Apple Basket', w: 0.25, d: 0.25, h: 0.20, placement: 'floor', colors: ['#DC143C'] },
        ],
        winter: [
            { id: 'wi-xmas-tree', name: 'Christmas Tree', w: 0.70, d: 0.70, h: 1.60, placement: 'floor', colors: ['#228B22'] },
            { id: 'wi-blanket', name: 'Cozy Blanket', w: 0.60, d: 0.50, h: 0.10, placement: 'floor', colors: ['#8B0000', '#F5F5DC'] },
            { id: 'wi-wreath', name: 'Holiday Wreath', w: 0.50, d: 0.10, h: 0.50, placement: 'wall', colors: ['#228B22'] },
            { id: 'wi-stocking', name: 'Stocking', w: 0.20, d: 0.05, h: 0.40, placement: 'wall', colors: ['#DC143C'] },
            { id: 'wi-candles', name: 'Candle Cluster', w: 0.20, d: 0.20, h: 0.25, placement: 'floor', colors: ['#F5F5DC'] },
            { id: 'wi-snowglobe', name: 'Snow Globe', w: 0.12, d: 0.12, h: 0.15, placement: 'floor', colors: ['#87CEEB'] },
            { id: 'wi-garland', name: 'Pine Garland', w: 1.2, d: 0.08, h: 0.12, placement: 'wall', colors: ['#228B22'] },
            { id: 'wi-gift', name: 'Gift Box', w: 0.20, d: 0.20, h: 0.20, placement: 'floor', colors: ['#DC143C', '#228B22', '#DAA520'] },
        ]
    }
};

// Material definitions for walls and floors
export const SURFACES = {
    walls: [
        { id: 'wall-warm-white', name: 'Warm White', color: '#f0ece6' },
        { id: 'wall-cream', name: 'Cream', color: '#f5edd6' },
        { id: 'wall-blush', name: 'Blush', color: '#e8cfc4' },
        { id: 'wall-sage', name: 'Sage', color: '#c5ceb5' },
        { id: 'wall-navy', name: 'Navy', color: '#2c3e5a' },
        { id: 'wall-charcoal', name: 'Charcoal', color: '#3a3632' },
        { id: 'wall-terracotta', name: 'Terracotta', color: '#c27856' },
        { id: 'wall-sky', name: 'Sky Blue', color: '#b0c4d8' },
        { id: 'wall-lavender', name: 'Lavender', color: '#c4b8d4' },
        { id: 'wall-olive', name: 'Olive', color: '#8a8a5c' },
        { id: 'wall-brick', name: 'Brick', color: '#b5705a', pattern: 'brick' },
        { id: 'wall-shiplap', name: 'Shiplap', color: '#f0ece6', pattern: 'shiplap' },
        { id: 'wall-stone', name: 'Stone', color: '#9a9080', pattern: 'stone' },
    ],
    floors: [
        { id: 'floor-hardwood', name: 'Hardwood', color: '#c49a6c', pattern: 'hardwood' },
        { id: 'floor-oak', name: 'Light Oak', color: '#d4b088', pattern: 'hardwood' },
        { id: 'floor-walnut', name: 'Dark Walnut', color: '#6b4226', pattern: 'hardwood' },
        { id: 'floor-herringbone', name: 'Herringbone', color: '#c49a6c', pattern: 'herringbone' },
        { id: 'floor-tile-white', name: 'White Tile', color: '#f0ece6', pattern: 'tile' },
        { id: 'floor-tile-dark', name: 'Dark Tile', color: '#5a5a5a', pattern: 'tile' },
        { id: 'floor-marble', name: 'Marble', color: '#e8e2d8', pattern: 'marble' },
        { id: 'floor-checker', name: 'Checkerboard', color: '#2c2c2c', pattern: 'checker' },
        { id: 'floor-stone', name: 'Stone', color: '#a09888', pattern: 'stone' },
        { id: 'floor-concrete', name: 'Concrete', color: '#b0a898', pattern: 'concrete' },
    ]
};
