/* ============================================
   Room Studio 3D — Procedural Furniture Factory
   All furniture built from Three.js primitives
   ============================================ */
import * as THREE from 'three';
import { WOOD_MAT, FABRIC_MAT, METAL_MAT, GLASS_MAT, CERAMIC_MAT, EMISSIVE_MAT } from './materials.js?v=3';

// Helper: create a box mesh positioned by its bottom-center
function box(w, h, d, mat) {
    const geo = new THREE.BoxGeometry(w, h, d);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
}

function cylinder(rTop, rBot, h, mat, segments = 16) {
    const geo = new THREE.CylinderGeometry(rTop, rBot, h, segments);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
}

function sphere(r, mat, wSeg = 16, hSeg = 12) {
    const geo = new THREE.SphereGeometry(r, wSeg, hSeg);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
}

function torus(r, tube, mat, radSeg = 16, tubeSeg = 12) {
    const geo = new THREE.TorusGeometry(r, tube, tubeSeg, radSeg);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
}

function cone(r, h, mat, segments = 16) {
    const geo = new THREE.ConeGeometry(r, h, segments);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
}

// Add 4 legs to a group
function addLegs(group, w, d, legH, legR, mat, inset = 0.05) {
    const positions = [
        [-w/2 + inset + legR, legH/2, -d/2 + inset + legR],
        [w/2 - inset - legR, legH/2, -d/2 + inset + legR],
        [-w/2 + inset + legR, legH/2, d/2 - inset - legR],
        [w/2 - inset - legR, legH/2, d/2 - inset - legR],
    ];
    positions.forEach(([x, y, z]) => {
        const leg = cylinder(legR, legR, legH, mat);
        leg.position.set(x, y, z);
        group.add(leg);
    });
}

// ---- BUILDERS ----
// Each returns a THREE.Group, sized to match item data dimensions
// Group origin is at bottom-center (y=0 at floor)

const builders = {};

// ---- SEATING ----

builders['sofa-3'] = (item, color) => {
    const g = new THREE.Group();
    const w = item.w, d = item.d, h = item.h;
    const wood = WOOD_MAT('#5C4033');
    const fabric = FABRIC_MAT(color);
    // Legs
    addLegs(g, w - 0.05, d - 0.05, 0.10, 0.025, wood);
    // Seat base
    const seat = box(w, 0.12, d, fabric);
    seat.position.set(0, 0.22, 0);
    g.add(seat);
    // Back cushion
    const back = box(w, h - 0.30, 0.12, fabric);
    back.position.set(0, 0.30 + (h - 0.30)/2, -d/2 + 0.06);
    g.add(back);
    // Arm rests
    [-1, 1].forEach(side => {
        const arm = box(0.10, h - 0.16, d * 0.85, fabric);
        arm.position.set(side * (w/2 - 0.05), 0.28 + (h - 0.16)/2 - 0.10, 0);
        g.add(arm);
    });
    // Seat cushions (3)
    const cw = (w - 0.24) / 3;
    for (let i = 0; i < 3; i++) {
        const cushion = box(cw - 0.02, 0.10, d - 0.20, FABRIC_MAT(shiftHex(color, 8)));
        cushion.position.set(-cw + i * cw, 0.33, 0.04);
        g.add(cushion);
    }
    return g;
};

builders['sofa-2'] = (item, color) => {
    const g = new THREE.Group();
    const w = item.w, d = item.d, h = item.h;
    const wood = WOOD_MAT('#5C4033');
    const fabric = FABRIC_MAT(color);
    addLegs(g, w - 0.05, d - 0.05, 0.10, 0.025, wood);
    const seat = box(w, 0.12, d, fabric);
    seat.position.set(0, 0.22, 0);
    g.add(seat);
    const back = box(w, h - 0.30, 0.12, fabric);
    back.position.set(0, 0.30 + (h - 0.30)/2, -d/2 + 0.06);
    g.add(back);
    [-1, 1].forEach(side => {
        const arm = box(0.10, h - 0.16, d * 0.85, fabric);
        arm.position.set(side * (w/2 - 0.05), 0.28 + (h - 0.16)/2 - 0.10, 0);
        g.add(arm);
    });
    const cw = (w - 0.24) / 2;
    for (let i = 0; i < 2; i++) {
        const cushion = box(cw - 0.02, 0.10, d - 0.20, FABRIC_MAT(shiftHex(color, 8)));
        cushion.position.set(-cw/2 + i * cw, 0.33, 0.04);
        g.add(cushion);
    }
    return g;
};

builders['armchair'] = (item, color) => {
    const g = new THREE.Group();
    const w = item.w, d = item.d, h = item.h;
    const fabric = FABRIC_MAT(color);
    addLegs(g, w - 0.05, d - 0.05, 0.10, 0.025, WOOD_MAT('#5C4033'));
    const seat = box(w, 0.12, d, fabric);
    seat.position.set(0, 0.22, 0);
    g.add(seat);
    const back = box(w - 0.10, h - 0.28, 0.12, fabric);
    back.position.set(0, 0.28 + (h - 0.28)/2, -d/2 + 0.06);
    g.add(back);
    [-1, 1].forEach(side => {
        const arm = box(0.10, 0.28, d * 0.8, fabric);
        arm.position.set(side * (w/2 - 0.05), 0.30 + 0.14, 0);
        g.add(arm);
    });
    const cushion = box(w - 0.24, 0.10, d - 0.18, FABRIC_MAT(shiftHex(color, 8)));
    cushion.position.set(0, 0.33, 0.04);
    g.add(cushion);
    return g;
};

builders['accent-chair'] = (item, color) => {
    const g = new THREE.Group();
    const w = item.w, d = item.d, h = item.h;
    const fabric = FABRIC_MAT(color);
    const metal = METAL_MAT('#888888');
    addLegs(g, w - 0.08, d - 0.08, 0.35, 0.015, metal);
    const seat = box(w, 0.08, d, fabric);
    seat.position.set(0, 0.39, 0);
    g.add(seat);
    const back = box(w - 0.06, h - 0.43, 0.06, fabric);
    back.position.set(0, 0.43 + (h - 0.43)/2, -d/2 + 0.03);
    g.add(back);
    return g;
};

builders['dining-chair'] = (item, color) => {
    const g = new THREE.Group();
    const w = item.w, d = item.d, h = item.h;
    const wood = WOOD_MAT(color);
    addLegs(g, w - 0.04, d - 0.04, 0.45, 0.018, wood);
    const seat = box(w, 0.03, d, wood);
    seat.position.set(0, 0.465, 0);
    g.add(seat);
    // Back
    const backH = h - 0.48;
    const backBoard = box(w - 0.06, backH, 0.02, wood);
    backBoard.position.set(0, 0.48 + backH / 2, -d/2 + 0.01);
    g.add(backBoard);
    // Back posts
    [-1, 1].forEach(side => {
        const post = box(0.025, backH + 0.05, 0.025, wood);
        post.position.set(side * (w/2 - 0.03), 0.48 + backH/2, -d/2 + 0.012);
        g.add(post);
    });
    return g;
};

builders['stool'] = (item, color) => {
    const g = new THREE.Group();
    const w = item.w, h = item.h;
    const metal = METAL_MAT(color);
    // 4 legs angled
    for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2;
        const leg = cylinder(0.012, 0.015, h - 0.04, metal, 8);
        leg.position.set(Math.cos(angle) * w * 0.35, (h - 0.04)/2, Math.sin(angle) * w * 0.35);
        g.add(leg);
    }
    // Seat
    const seat = cylinder(w/2, w/2, 0.04, FABRIC_MAT('#4A5568'));
    seat.position.set(0, h - 0.02, 0);
    g.add(seat);
    // Footrest ring
    const ring = torus(w * 0.32, 0.01, metal);
    ring.position.set(0, h * 0.3, 0);
    ring.rotation.x = Math.PI / 2;
    g.add(ring);
    return g;
};

builders['bench'] = (item, color) => {
    const g = new THREE.Group();
    const w = item.w, d = item.d, h = item.h;
    const wood = WOOD_MAT(color);
    addLegs(g, w - 0.06, d - 0.04, h - 0.04, 0.03, wood, 0.02);
    const seat = box(w, 0.04, d, wood);
    seat.position.set(0, h - 0.02, 0);
    g.add(seat);
    return g;
};

builders['ottoman'] = (item, color) => {
    const g = new THREE.Group();
    const w = item.w, d = item.d, h = item.h;
    const fabric = FABRIC_MAT(color);
    addLegs(g, w - 0.04, d - 0.04, 0.06, 0.015, WOOD_MAT('#5C4033'));
    const body = box(w, h - 0.06, d, fabric);
    body.position.set(0, 0.06 + (h - 0.06)/2, 0);
    g.add(body);
    // Tufted top
    const top = box(w - 0.02, 0.05, d - 0.02, FABRIC_MAT(shiftHex(color, 10)));
    top.position.set(0, h - 0.025, 0);
    g.add(top);
    return g;
};

// ---- TABLES ----

builders['coffee-table'] = (item, color) => {
    const g = new THREE.Group();
    const w = item.w, d = item.d, h = item.h;
    const wood = WOOD_MAT(color);
    addLegs(g, w - 0.06, d - 0.04, h - 0.03, 0.025, wood);
    const top = box(w, 0.03, d, wood);
    top.position.set(0, h - 0.015, 0);
    g.add(top);
    // Shelf
    const shelf = box(w - 0.10, 0.015, d - 0.06, wood);
    shelf.position.set(0, h * 0.3, 0);
    g.add(shelf);
    return g;
};

builders['side-table'] = (item, color) => {
    const g = new THREE.Group();
    const w = item.w, d = item.d, h = item.h;
    const wood = WOOD_MAT(color);
    addLegs(g, w - 0.04, d - 0.04, h - 0.025, 0.02, wood);
    const top = box(w, 0.025, d, wood);
    top.position.set(0, h - 0.0125, 0);
    g.add(top);
    return g;
};

builders['dining-table'] = (item, color) => {
    const g = new THREE.Group();
    const w = item.w, d = item.d, h = item.h;
    const wood = WOOD_MAT(color);
    addLegs(g, w - 0.12, d - 0.08, h - 0.04, 0.035, wood, 0.03);
    const top = box(w, 0.04, d, wood);
    top.position.set(0, h - 0.02, 0);
    g.add(top);
    // Apron
    const apronH = 0.08;
    const apron1 = box(w - 0.14, apronH, 0.02, wood);
    apron1.position.set(0, h - 0.04 - apronH/2, d/2 - 0.08);
    g.add(apron1);
    const apron2 = apron1.clone();
    apron2.position.z = -d/2 + 0.08;
    g.add(apron2);
    return g;
};

builders['console-table'] = (item, color) => {
    const g = new THREE.Group();
    const w = item.w, d = item.d, h = item.h;
    const wood = WOOD_MAT(color);
    addLegs(g, w - 0.06, d - 0.02, h - 0.025, 0.025, wood, 0.01);
    const top = box(w, 0.025, d, wood);
    top.position.set(0, h - 0.0125, 0);
    g.add(top);
    return g;
};

builders['nightstand'] = (item, color) => {
    const g = new THREE.Group();
    const w = item.w, d = item.d, h = item.h;
    const wood = WOOD_MAT(color);
    // Body
    const body = box(w, h - 0.06, d, wood);
    body.position.set(0, (h - 0.06)/2 + 0.06, 0);
    g.add(body);
    // Legs
    addLegs(g, w - 0.02, d - 0.02, 0.06, 0.015, wood, 0.0);
    // Top
    const top = box(w + 0.02, 0.02, d + 0.02, WOOD_MAT(shiftHex(color, -10)));
    top.position.set(0, h - 0.01, 0);
    g.add(top);
    // Drawer line
    const line = box(w - 0.06, 0.005, 0.005, METAL_MAT('#aaa'));
    line.position.set(0, h * 0.55, d/2 + 0.003);
    g.add(line);
    // Knob
    const knob = sphere(0.012, METAL_MAT('#bbb'));
    knob.position.set(0, h * 0.72, d/2 + 0.01);
    g.add(knob);
    return g;
};

builders['desk'] = (item, color) => {
    const g = new THREE.Group();
    const w = item.w, d = item.d, h = item.h;
    const wood = WOOD_MAT(color);
    addLegs(g, w - 0.06, d - 0.04, h - 0.03, 0.03, wood, 0.02);
    const top = box(w, 0.03, d, wood);
    top.position.set(0, h - 0.015, 0);
    g.add(top);
    // Drawer unit on right
    const dw = w * 0.35, dd = d - 0.08;
    const drawer = box(dw, h - 0.15, dd, WOOD_MAT(shiftHex(color, -8)));
    drawer.position.set(w/2 - dw/2 - 0.04, (h - 0.15)/2 + 0.06, 0);
    g.add(drawer);
    // Drawer handle
    const handle = box(dw * 0.4, 0.01, 0.02, METAL_MAT('#aaa'));
    handle.position.set(w/2 - dw/2 - 0.04, h * 0.5, dd/2 + 0.005);
    g.add(handle);
    return g;
};

builders['kitchen-island'] = (item, color) => {
    const g = new THREE.Group();
    const w = item.w, d = item.d, h = item.h;
    const wood = WOOD_MAT('#5C4033');
    const top_mat = CERAMIC_MAT(color);
    // Solid base
    const base = box(w, h - 0.04, d, wood);
    base.position.set(0, (h - 0.04)/2, 0);
    g.add(base);
    // Countertop
    const top = box(w + 0.04, 0.04, d + 0.04, top_mat);
    top.position.set(0, h - 0.02, 0);
    g.add(top);
    return g;
};

// ---- BEDROOM ----

builders['bed-double'] = (item, color) => buildBed(item, color);
builders['bed-queen'] = (item, color) => buildBed(item, color);
builders['bed-single'] = (item, color) => buildBed(item, color);

function buildBed(item, color) {
    const g = new THREE.Group();
    const w = item.w, d = item.d, h = item.h;
    const wood = WOOD_MAT('#5C4033');
    const fabric = FABRIC_MAT(color);
    // Frame
    const frame = box(w, 0.15, d, wood);
    frame.position.set(0, 0.175, 0);
    g.add(frame);
    // Legs
    addLegs(g, w - 0.02, d - 0.02, 0.10, 0.03, wood, 0.0);
    // Mattress
    const matt = box(w - 0.06, 0.18, d - 0.06, FABRIC_MAT('#f5f0eb'));
    matt.position.set(0, 0.34, 0);
    g.add(matt);
    // Bedding
    const bedding = box(w - 0.08, 0.05, d * 0.65, fabric);
    bedding.position.set(0, 0.455, d * 0.1);
    g.add(bedding);
    // Headboard
    const hb = box(w, h + 0.15, 0.05, wood);
    hb.position.set(0, (h + 0.15)/2, -d/2 + 0.025);
    g.add(hb);
    // Pillows
    const pw = w * 0.35, pillowY = 0.48;
    [-1, 1].forEach(side => {
        const pillow = box(pw, 0.08, 0.25, FABRIC_MAT('#f0ece6'));
        pillow.position.set(side * (w/2 - pw/2 - 0.08), pillowY, -d/2 + 0.25);
        g.add(pillow);
    });
    return g;
}

builders['dresser'] = (item, color) => {
    const g = new THREE.Group();
    const w = item.w, d = item.d, h = item.h;
    const wood = WOOD_MAT(color);
    const body = box(w, h - 0.06, d, wood);
    body.position.set(0, (h - 0.06)/2 + 0.06, 0);
    g.add(body);
    addLegs(g, w - 0.02, d - 0.02, 0.06, 0.02, wood, 0.0);
    const top = box(w + 0.02, 0.02, d + 0.02, WOOD_MAT(shiftHex(color, -10)));
    top.position.set(0, h - 0.01, 0);
    g.add(top);
    // Drawer lines + knobs (4 drawers)
    for (let i = 0; i < 4; i++) {
        const dy = 0.08 + i * ((h - 0.14) / 4) + (h - 0.14) / 8;
        const line = box(w - 0.06, 0.004, 0.004, METAL_MAT('#aaa'));
        line.position.set(0, dy, d/2 + 0.003);
        g.add(line);
        const knob = sphere(0.012, METAL_MAT('#bbb'));
        knob.position.set(0, dy + 0.03, d/2 + 0.01);
        g.add(knob);
    }
    return g;
};

builders['wardrobe'] = (item, color) => {
    const g = new THREE.Group();
    const w = item.w, d = item.d, h = item.h;
    const wood = WOOD_MAT(color);
    const body = box(w, h, d, wood);
    body.position.set(0, h/2, 0);
    g.add(body);
    // Door split
    const doorLine = box(0.005, h - 0.06, 0.005, WOOD_MAT(shiftHex(color, -15)));
    doorLine.position.set(0, h/2, d/2 + 0.003);
    g.add(doorLine);
    // Knobs
    [-1, 1].forEach(side => {
        const knob = sphere(0.015, METAL_MAT('#bbb'));
        knob.position.set(side * 0.04, h * 0.55, d/2 + 0.015);
        g.add(knob);
    });
    // Crown
    const crown = box(w + 0.03, 0.04, d + 0.02, WOOD_MAT(shiftHex(color, -10)));
    crown.position.set(0, h + 0.02, 0);
    g.add(crown);
    return g;
};

builders['vanity'] = (item, color) => {
    const g = new THREE.Group();
    const w = item.w, d = item.d, h = item.h;
    const wood = WOOD_MAT(color);
    addLegs(g, w - 0.04, d - 0.02, h - 0.025, 0.02, wood, 0.01);
    const top = box(w, 0.025, d, wood);
    top.position.set(0, h - 0.0125, 0);
    g.add(top);
    // Mirror on top
    const mirrorFrame = box(w * 0.6, 0.50, 0.03, wood);
    mirrorFrame.position.set(0, h + 0.27, -d/2 + 0.015);
    g.add(mirrorFrame);
    const mirror = box(w * 0.55, 0.44, 0.005, GLASS_MAT());
    mirror.position.set(0, h + 0.27, -d/2 + 0.03);
    g.add(mirror);
    return g;
};

// ---- STORAGE ----

builders['bookshelf'] = (item, color) => buildBookshelf(item, color, 5);
builders['bookshelf-wide'] = (item, color) => buildBookshelf(item, color, 5);

function buildBookshelf(item, color, numShelves) {
    const g = new THREE.Group();
    const w = item.w, d = item.d, h = item.h;
    const wood = WOOD_MAT(color);
    // Sides
    [-1, 1].forEach(side => {
        const panel = box(0.02, h, d, wood);
        panel.position.set(side * (w/2 - 0.01), h/2, 0);
        g.add(panel);
    });
    // Back
    const back = box(w, h, 0.01, WOOD_MAT(shiftHex(color, -15)));
    back.position.set(0, h/2, -d/2 + 0.005);
    g.add(back);
    // Top + bottom
    [0.01, h - 0.01].forEach(y => {
        const shelf = box(w - 0.04, 0.02, d, wood);
        shelf.position.set(0, y, 0);
        g.add(shelf);
    });
    // Interior shelves
    for (let i = 1; i < numShelves; i++) {
        const y = (i / numShelves) * (h - 0.04) + 0.02;
        const shelf = box(w - 0.04, 0.015, d - 0.01, wood);
        shelf.position.set(0, y, 0.005);
        g.add(shelf);
    }
    // Some books
    const bookColors = ['#8B0000', '#2E5090', '#228B22', '#DAA520', '#4A5568', '#9B2335'];
    for (let s = 0; s < numShelves; s++) {
        const shelfY = ((s + 0.5) / numShelves) * (h - 0.04) + 0.02;
        const shelfH = (h - 0.04) / numShelves - 0.02;
        let bx = -w/2 + 0.05;
        const numBooks = 3 + Math.floor(Math.random() * 4);
        for (let b = 0; b < numBooks && bx < w/2 - 0.05; b++) {
            const bw = 0.02 + Math.random() * 0.03;
            const bh = shelfH * (0.6 + Math.random() * 0.35);
            const bd = d - 0.06;
            const book = box(bw, bh, bd, FABRIC_MAT(bookColors[b % bookColors.length]));
            book.position.set(bx + bw/2, shelfY + bh/2, 0.01);
            g.add(book);
            bx += bw + 0.005;
        }
    }
    return g;
}

builders['cabinet'] = (item, color) => {
    const g = new THREE.Group();
    const w = item.w, d = item.d, h = item.h;
    const wood = WOOD_MAT(color);
    const body = box(w, h, d, wood);
    body.position.set(0, h/2, 0);
    g.add(body);
    // Doors
    const doorLine = box(0.004, h - 0.04, 0.004, WOOD_MAT(shiftHex(color, -15)));
    doorLine.position.set(0, h/2, d/2 + 0.003);
    g.add(doorLine);
    [-1, 1].forEach(side => {
        const knob = sphere(0.012, METAL_MAT('#bbb'));
        knob.position.set(side * 0.04, h * 0.55, d/2 + 0.012);
        g.add(knob);
    });
    return g;
};

builders['tv-stand'] = (item, color) => {
    const g = new THREE.Group();
    const w = item.w, d = item.d, h = item.h;
    const wood = WOOD_MAT(color);
    // Main body
    const body = box(w, h - 0.04, d, wood);
    body.position.set(0, (h - 0.04)/2 + 0.04, 0);
    g.add(body);
    // Legs
    addLegs(g, w - 0.04, d - 0.02, 0.04, 0.015, METAL_MAT('#888'), 0.02);
    // Top surface
    const top = box(w + 0.02, 0.02, d + 0.01, WOOD_MAT(shiftHex(color, 5)));
    top.position.set(0, h - 0.01, 0);
    g.add(top);
    // Open shelf in center
    const shelf = box(w * 0.5, 0.012, d - 0.04, wood);
    shelf.position.set(0, h * 0.4, 0);
    g.add(shelf);
    return g;
};

builders['sideboard'] = (item, color) => {
    const g = new THREE.Group();
    const w = item.w, d = item.d, h = item.h;
    const wood = WOOD_MAT(color);
    const body = box(w, h - 0.08, d, wood);
    body.position.set(0, (h - 0.08)/2 + 0.08, 0);
    g.add(body);
    addLegs(g, w - 0.04, d - 0.02, 0.08, 0.02, wood, 0.02);
    const top = box(w + 0.02, 0.02, d + 0.02, WOOD_MAT(shiftHex(color, -10)));
    top.position.set(0, h - 0.01, 0);
    g.add(top);
    // 3 door sections
    for (let i = 0; i < 2; i++) {
        const x = -w/3 + (i + 1) * (w/3);
        const line = box(0.004, h - 0.16, 0.004, WOOD_MAT(shiftHex(color, -15)));
        line.position.set(x - w/6, h/2, d/2 + 0.003);
        g.add(line);
    }
    return g;
};

// ---- LIGHTING ----

builders['floor-lamp'] = (item, color) => {
    const g = new THREE.Group();
    const h = item.h;
    const metal = METAL_MAT('#888888');
    // Base
    const base = cylinder(0.12, 0.14, 0.02, metal);
    base.position.set(0, 0.01, 0);
    g.add(base);
    // Pole
    const pole = cylinder(0.012, 0.015, h - 0.30, metal, 8);
    pole.position.set(0, (h - 0.30)/2 + 0.02, 0);
    g.add(pole);
    // Shade
    const shade = cylinder(0.04, 0.16, 0.25, FABRIC_MAT(color));
    shade.position.set(0, h - 0.125, 0);
    g.add(shade);
    // Glow
    const glow = cylinder(0.035, 0.15, 0.22, EMISSIVE_MAT('#FFF8DC'));
    glow.position.set(0, h - 0.125, 0);
    g.add(glow);
    return g;
};

builders['table-lamp'] = (item, color) => {
    const g = new THREE.Group();
    const h = item.h;
    const ceramic = CERAMIC_MAT(color);
    // Base body
    const base = cylinder(0.06, 0.08, h * 0.55, ceramic, 12);
    base.position.set(0, h * 0.275, 0);
    g.add(base);
    // Shade
    const shade = cylinder(0.04, 0.10, h * 0.35, FABRIC_MAT('#f5f0eb'));
    shade.position.set(0, h - h * 0.175, 0);
    g.add(shade);
    return g;
};

builders['pendant'] = (item, color) => {
    const g = new THREE.Group();
    const w = item.w, h = item.h;
    // Shade
    const shade = cylinder(0.05, w/2, h, FABRIC_MAT(color));
    shade.position.set(0, -h/2, 0);
    g.add(shade);
    // Wire
    const wire = cylinder(0.003, 0.003, 0.3, METAL_MAT('#555'));
    wire.position.set(0, 0.15, 0);
    g.add(wire);
    // Glow inside
    const glow = sphere(0.06, EMISSIVE_MAT('#FFF8DC'), 8, 6);
    glow.position.set(0, -h * 0.3, 0);
    g.add(glow);
    return g;
};

// ---- DECOR ----

builders['painting-lg'] = (item, color) => buildPainting(item, color);
builders['painting-sm'] = (item, color) => buildPainting(item, color);

function buildPainting(item, color) {
    const g = new THREE.Group();
    const w = item.w, h = item.h, d = item.d;
    // Frame
    const frame = box(w, h, d, WOOD_MAT('#5C4033'));
    frame.position.set(0, 0, 0);
    g.add(frame);
    // Canvas
    const canvas = box(w - 0.06, h - 0.06, 0.005, FABRIC_MAT(color));
    canvas.position.set(0, 0, d/2 - 0.005);
    g.add(canvas);
    // Simple abstract art: a few colored rectangles
    const artColors = [shiftHex(color, 30), shiftHex(color, -30), shiftHex(color, 50)];
    for (let i = 0; i < 3; i++) {
        const aw = (w - 0.08) * (0.2 + Math.random() * 0.3);
        const ah = (h - 0.08) * (0.2 + Math.random() * 0.3);
        const ax = (Math.random() - 0.5) * (w - 0.10 - aw);
        const ay = (Math.random() - 0.5) * (h - 0.10 - ah);
        const artBlock = box(aw, ah, 0.003, FABRIC_MAT(artColors[i % artColors.length]));
        artBlock.position.set(ax, ay, d/2);
        g.add(artBlock);
    }
    return g;
}

builders['mirror-rect'] = (item, color) => {
    const g = new THREE.Group();
    const w = item.w, h = item.h, d = item.d;
    const frame = box(w, h, d, WOOD_MAT(color));
    g.add(frame);
    const mirror = box(w - 0.04, h - 0.04, 0.003, new THREE.MeshStandardMaterial({
        color: '#c8d8e8', roughness: 0.05, metalness: 0.9
    }));
    mirror.position.set(0, 0, d/2);
    g.add(mirror);
    return g;
};

builders['mirror-round'] = (item, color) => {
    const g = new THREE.Group();
    const r = item.w / 2;
    // Frame ring
    const frameRing = torus(r - 0.02, 0.02, WOOD_MAT(color), 24, 8);
    g.add(frameRing);
    // Mirror disc
    const mirrorGeo = new THREE.CircleGeometry(r - 0.04, 24);
    const mirrorMesh = new THREE.Mesh(mirrorGeo, new THREE.MeshStandardMaterial({
        color: '#c8d8e8', roughness: 0.05, metalness: 0.9, side: THREE.DoubleSide
    }));
    mirrorMesh.position.z = 0.005;
    g.add(mirrorMesh);
    return g;
};

builders['clock'] = (item, color) => {
    const g = new THREE.Group();
    const r = item.w / 2;
    // Face
    const face = cylinder(r, r, 0.03, CERAMIC_MAT('#f5f0eb'), 24);
    face.rotation.x = Math.PI / 2;
    g.add(face);
    // Rim
    const rim = torus(r - 0.005, 0.012, WOOD_MAT(color), 24, 8);
    rim.position.z = 0.015;
    g.add(rim);
    // Hands
    const hourHand = box(0.008, r * 0.5, 0.005, METAL_MAT('#2c2c2c'));
    hourHand.position.set(0, r * 0.15, 0.02);
    hourHand.rotation.z = 0.8;
    g.add(hourHand);
    const minHand = box(0.005, r * 0.7, 0.005, METAL_MAT('#2c2c2c'));
    minHand.position.set(0, r * 0.2, 0.025);
    minHand.rotation.z = -0.4;
    g.add(minHand);
    return g;
};

builders['potted-plant'] = (item, color) => {
    const g = new THREE.Group();
    const w = item.w, h = item.h;
    // Pot
    const pot = cylinder(w/2 - 0.02, w/2 - 0.04, h * 0.35, CERAMIC_MAT('#C4916E'), 12);
    pot.position.set(0, h * 0.175, 0);
    g.add(pot);
    // Soil
    const soil = cylinder(w/2 - 0.03, w/2 - 0.03, 0.02, FABRIC_MAT('#3e2723'));
    soil.position.set(0, h * 0.36, 0);
    g.add(soil);
    // Foliage (cluster of spheres)
    const leafMat = FABRIC_MAT(color);
    for (let i = 0; i < 5; i++) {
        const leaf = sphere(h * 0.15 + Math.random() * 0.05, leafMat, 8, 6);
        leaf.position.set(
            (Math.random() - 0.5) * w * 0.4,
            h * 0.55 + Math.random() * h * 0.3,
            (Math.random() - 0.5) * w * 0.4
        );
        g.add(leaf);
    }
    return g;
};

builders['tall-plant'] = (item, color) => {
    const g = new THREE.Group();
    const w = item.w, h = item.h;
    // Pot
    const pot = cylinder(w * 0.35, w * 0.30, h * 0.2, CERAMIC_MAT('#8B7355'), 12);
    pot.position.set(0, h * 0.1, 0);
    g.add(pot);
    // Trunk
    const trunk = cylinder(0.025, 0.035, h * 0.5, WOOD_MAT('#6B4226'), 8);
    trunk.position.set(0, h * 0.2 + h * 0.25, 0);
    g.add(trunk);
    // Foliage
    const leafMat = FABRIC_MAT(color);
    for (let i = 0; i < 8; i++) {
        const leaf = sphere(h * 0.12 + Math.random() * 0.06, leafMat, 8, 6);
        leaf.position.set(
            (Math.random() - 0.5) * w * 0.6,
            h * 0.6 + Math.random() * h * 0.35,
            (Math.random() - 0.5) * w * 0.6
        );
        g.add(leaf);
    }
    return g;
};

builders['vase'] = (item, color) => {
    const g = new THREE.Group();
    const w = item.w, h = item.h;
    const ceramic = CERAMIC_MAT(color);
    // Vase body (lathe-like with stacked cylinders)
    const base = cylinder(w * 0.35, w * 0.4, h * 0.15, ceramic, 12);
    base.position.y = h * 0.075;
    g.add(base);
    const belly = cylinder(w * 0.45, w * 0.35, h * 0.45, ceramic, 12);
    belly.position.y = h * 0.375;
    g.add(belly);
    const neck = cylinder(w * 0.2, w * 0.45, h * 0.25, ceramic, 12);
    neck.position.y = h * 0.725;
    g.add(neck);
    const rim = cylinder(w * 0.25, w * 0.2, h * 0.15, ceramic, 12);
    rim.position.y = h * 0.925;
    g.add(rim);
    return g;
};

builders['rug-large'] = (item, color) => buildRug(item, color);
builders['rug-small'] = (item, color) => buildRug(item, color);

function buildRug(item, color) {
    const g = new THREE.Group();
    const w = item.w, d = item.d, h = item.h;
    const rug = box(w, h, d, FABRIC_MAT(color));
    rug.position.set(0, h/2, 0);
    rug.receiveShadow = true;
    g.add(rug);
    // Border
    const border = box(w - 0.10, h + 0.001, d - 0.10, FABRIC_MAT(shiftHex(color, -30)));
    border.position.set(0, h/2, 0);
    border.receiveShadow = true;
    g.add(border);
    // Inner rectangle
    const inner = box(w - 0.25, h + 0.002, d - 0.20, FABRIC_MAT(shiftHex(color, 15)));
    inner.position.set(0, h/2, 0);
    inner.receiveShadow = true;
    g.add(inner);
    return g;
}

// ---- BATHROOM ----

builders['bathtub'] = (item, color) => {
    const g = new THREE.Group();
    const w = item.w, d = item.d, h = item.h;
    const ceramic = CERAMIC_MAT(color);
    // Outer shell
    const outer = box(w, h, d, ceramic);
    outer.position.set(0, h/2, 0);
    g.add(outer);
    // Inner cavity (darker)
    const inner = box(w - 0.08, h - 0.05, d - 0.08, CERAMIC_MAT(shiftHex(color, -5)));
    inner.position.set(0, h/2 + 0.04, 0);
    g.add(inner);
    // Faucet
    const faucet = cylinder(0.015, 0.015, 0.15, METAL_MAT('#c0c0c0'), 8);
    faucet.position.set(0, h + 0.075, -d/2 + 0.06);
    g.add(faucet);
    const spout = box(0.02, 0.02, 0.08, METAL_MAT('#c0c0c0'));
    spout.position.set(0, h + 0.15, -d/2 + 0.10);
    g.add(spout);
    return g;
};

builders['toilet'] = (item, color) => {
    const g = new THREE.Group();
    const w = item.w, d = item.d, h = item.h;
    const ceramic = CERAMIC_MAT(color);
    // Base
    const base = cylinder(w/2 - 0.02, w/2, h * 0.6, ceramic, 12);
    base.position.set(0, h * 0.3, 0.05);
    g.add(base);
    // Seat
    const seat = cylinder(w/2, w/2 - 0.02, 0.04, ceramic, 12);
    seat.position.set(0, h * 0.62, 0.05);
    g.add(seat);
    // Tank
    const tank = box(w * 0.8, h * 0.7, d * 0.25, ceramic);
    tank.position.set(0, h * 0.35 + h * 0.15, -d/2 + d * 0.125);
    g.add(tank);
    // Lid
    const lid = box(w * 0.75, 0.02, d * 0.2, ceramic);
    lid.position.set(0, h * 0.7 + 0.01, -d/2 + d * 0.125);
    g.add(lid);
    return g;
};

builders['bath-vanity'] = (item, color) => {
    const g = new THREE.Group();
    const w = item.w, d = item.d, h = item.h;
    const wood = WOOD_MAT(color === '#f0ece6' ? '#f0ece6' : color);
    // Cabinet
    const cab = box(w, h - 0.04, d, wood);
    cab.position.set(0, (h - 0.04)/2, 0);
    g.add(cab);
    // Countertop
    const top = box(w + 0.02, 0.04, d + 0.02, CERAMIC_MAT('#f5f0eb'));
    top.position.set(0, h - 0.02, 0);
    g.add(top);
    // Sink bowl (indentation)
    const bowl = cylinder(w * 0.25, w * 0.20, 0.06, CERAMIC_MAT('#e8e4de'), 16);
    bowl.position.set(0, h + 0.01, 0.05);
    g.add(bowl);
    // Faucet
    const faucet = cylinder(0.01, 0.01, 0.12, METAL_MAT('#c0c0c0'), 8);
    faucet.position.set(0, h + 0.10, -d * 0.25);
    g.add(faucet);
    return g;
};

builders['shower'] = (item, color) => {
    const g = new THREE.Group();
    const w = item.w, d = item.d, h = item.h;
    const glass = GLASS_MAT();
    // Base tray
    const tray = box(w, 0.05, d, CERAMIC_MAT('#e0e0e0'));
    tray.position.set(0, 0.025, 0);
    g.add(tray);
    // Glass panels (two sides)
    const panel1 = box(w, h, 0.01, glass);
    panel1.position.set(0, h/2, d/2);
    g.add(panel1);
    const panel2 = box(0.01, h, d, glass);
    panel2.position.set(w/2, h/2, 0);
    g.add(panel2);
    // Shower head
    const pipe = cylinder(0.012, 0.012, h * 0.3, METAL_MAT('#c0c0c0'), 8);
    pipe.position.set(-w/2 + 0.08, h * 0.85, -d/2 + 0.08);
    g.add(pipe);
    const head = cylinder(0.06, 0.02, 0.03, METAL_MAT('#c0c0c0'), 12);
    head.position.set(-w/2 + 0.08, h * 0.95, -d/2 + 0.12);
    head.rotation.x = 0.3;
    g.add(head);
    return g;
};

// ---- KITCHEN ----

builders['fridge'] = (item, color) => {
    const g = new THREE.Group();
    const w = item.w, d = item.d, h = item.h;
    const metal = METAL_MAT(color);
    const body = box(w, h, d, metal);
    body.position.set(0, h/2, 0);
    g.add(body);
    // Door split (upper/lower)
    const split = box(w - 0.04, 0.004, 0.004, METAL_MAT(shiftHex(color, -20)));
    split.position.set(0, h * 0.6, d/2 + 0.003);
    g.add(split);
    // Handles
    [h * 0.75, h * 0.35].forEach(y => {
        const handle = box(0.02, 0.20, 0.02, METAL_MAT('#aaa'));
        handle.position.set(w/2 - 0.08, y, d/2 + 0.015);
        g.add(handle);
    });
    return g;
};

builders['oven'] = (item, color) => {
    const g = new THREE.Group();
    const w = item.w, d = item.d, h = item.h;
    const metal = METAL_MAT(color);
    const body = box(w, h, d, metal);
    body.position.set(0, h/2, 0);
    g.add(body);
    // Stovetop burners
    [[-0.12, -0.10], [0.12, -0.10], [-0.12, 0.10], [0.12, 0.10]].forEach(([x, z]) => {
        const burner = torus(0.06, 0.008, METAL_MAT('#333'), 16, 8);
        burner.position.set(x, h + 0.005, z);
        burner.rotation.x = Math.PI / 2;
        g.add(burner);
    });
    // Oven door
    const door = box(w - 0.06, h * 0.55, 0.01, METAL_MAT(shiftHex(color, -15)));
    door.position.set(0, h * 0.3, d/2 + 0.008);
    g.add(door);
    // Window on door
    const window = box(w - 0.14, h * 0.25, 0.005, new THREE.MeshStandardMaterial({
        color: '#1a1a1a', roughness: 0.1, metalness: 0.5, transparent: true, opacity: 0.7
    }));
    window.position.set(0, h * 0.35, d/2 + 0.015);
    g.add(window);
    // Handle
    const handle = box(w * 0.5, 0.015, 0.02, METAL_MAT('#aaa'));
    handle.position.set(0, h * 0.6, d/2 + 0.02);
    g.add(handle);
    return g;
};

builders['dishwasher'] = (item, color) => {
    const g = new THREE.Group();
    const w = item.w, d = item.d, h = item.h;
    const metal = METAL_MAT(color);
    const body = box(w, h, d, metal);
    body.position.set(0, h/2, 0);
    g.add(body);
    const handle = box(w * 0.6, 0.015, 0.02, METAL_MAT('#aaa'));
    handle.position.set(0, h * 0.93, d/2 + 0.015);
    g.add(handle);
    return g;
};

builders['upper-cabinet'] = (item, color) => {
    const g = new THREE.Group();
    const w = item.w, d = item.d, h = item.h;
    const wood = WOOD_MAT(color);
    const body = box(w, h, d, wood);
    g.add(body);
    // Door split
    const doorLine = box(0.004, h - 0.04, 0.004, WOOD_MAT(shiftHex(color, -15)));
    doorLine.position.set(0, 0, d/2 + 0.003);
    g.add(doorLine);
    [-1, 1].forEach(side => {
        const knob = sphere(0.01, METAL_MAT('#bbb'));
        knob.position.set(side * 0.04, -h * 0.1, d/2 + 0.01);
        g.add(knob);
    });
    return g;
};

// ---- SEASONAL ----

builders['sp-tulips'] = (item, color) => {
    const g = new THREE.Group();
    const w = item.w, h = item.h;
    // Vase
    const vase = cylinder(w * 0.3, w * 0.35, h * 0.4, GLASS_MAT(), 12);
    vase.position.y = h * 0.2;
    g.add(vase);
    // Flowers
    for (let i = 0; i < 5; i++) {
        const stem = cylinder(0.004, 0.004, h * 0.5, FABRIC_MAT('#228B22'), 4);
        const sx = (Math.random() - 0.5) * w * 0.3;
        const sz = (Math.random() - 0.5) * w * 0.3;
        stem.position.set(sx, h * 0.55, sz);
        g.add(stem);
        const bud = sphere(0.025, FABRIC_MAT(color), 6, 5);
        bud.position.set(sx, h * 0.82 + Math.random() * 0.05, sz);
        g.add(bud);
    }
    return g;
};

builders['sp-basket'] = (item, color) => {
    const g = new THREE.Group();
    const w = item.w, h = item.h;
    const basket = cylinder(w/2, w/2 - 0.03, h * 0.6, FABRIC_MAT(color), 12);
    basket.position.y = h * 0.3;
    g.add(basket);
    // Flowers poking out
    const flowerColors = ['#FF69B4', '#FFD700', '#FF6347'];
    for (let i = 0; i < 4; i++) {
        const flower = sphere(0.03, FABRIC_MAT(flowerColors[i % 3]), 6, 5);
        flower.position.set(
            (Math.random() - 0.5) * w * 0.4,
            h * 0.65 + Math.random() * h * 0.2,
            (Math.random() - 0.5) * w * 0.4
        );
        g.add(flower);
    }
    return g;
};

builders['sp-wreath'] = (item, color) => buildWreath(item, color);
builders['au-wreath'] = (item, color) => buildWreath(item, color);
builders['wi-wreath'] = (item, color) => buildWreath(item, color);

function buildWreath(item, color) {
    const g = new THREE.Group();
    const r = item.w / 2;
    const ring = torus(r - 0.04, 0.035, FABRIC_MAT(color), 20, 8);
    g.add(ring);
    // Berry-like dots
    for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const berry = sphere(0.015, FABRIC_MAT('#DC143C'), 6, 4);
        berry.position.set(Math.cos(angle) * (r - 0.04), Math.sin(angle) * (r - 0.04), 0.03);
        g.add(berry);
    }
    return g;
}

builders['sp-birdhouse'] = (item, color) => {
    const g = new THREE.Group();
    const w = item.w, h = item.h;
    const wood = WOOD_MAT(color);
    const body = box(w, h * 0.6, w, wood);
    body.position.y = h * 0.3;
    g.add(body);
    const roof = cone(w * 0.6, h * 0.3, WOOD_MAT(shiftHex(color, -20)), 4);
    roof.position.y = h * 0.75;
    roof.rotation.y = Math.PI / 4;
    g.add(roof);
    // Entry hole
    const hole = cylinder(w * 0.12, w * 0.12, 0.005, FABRIC_MAT('#2c2c2c'), 12);
    hole.rotation.x = Math.PI / 2;
    hole.position.set(0, h * 0.35, w/2 + 0.003);
    g.add(hole);
    return g;
};

builders['sp-butterfly-art'] = (item, color) => buildPainting(item, color);
builders['su-beach-art'] = (item, color) => buildPainting(item, color);

builders['sp-planter'] = (item, color) => {
    const g = new THREE.Group();
    const w = item.w, d = item.d, h = item.h;
    const pot = box(w, h * 0.7, d, CERAMIC_MAT(color));
    pot.position.y = h * 0.35;
    g.add(pot);
    for (let i = 0; i < 6; i++) {
        const flower = sphere(0.025, FABRIC_MAT(['#FF69B4', '#FFD700', '#FF6347', '#9370DB'][i % 4]), 6, 4);
        flower.position.set((Math.random() - 0.5) * w * 0.7, h * 0.8 + Math.random() * 0.05, (Math.random() - 0.5) * d * 0.5);
        g.add(flower);
    }
    return g;
};

builders['su-sunflowers'] = (item, color) => {
    const g = new THREE.Group();
    const w = item.w, h = item.h;
    const vase = cylinder(w * 0.3, w * 0.25, h * 0.35, CERAMIC_MAT('#8B7355'), 12);
    vase.position.y = h * 0.175;
    g.add(vase);
    for (let i = 0; i < 3; i++) {
        const stem = cylinder(0.005, 0.005, h * 0.5, FABRIC_MAT('#228B22'), 4);
        const sx = (Math.random() - 0.5) * w * 0.2;
        stem.position.set(sx, h * 0.6, (Math.random() - 0.5) * w * 0.2);
        g.add(stem);
        const flower = cylinder(0.04, 0.04, 0.015, FABRIC_MAT(color), 12);
        flower.position.set(sx, h * 0.85 + i * 0.03, (Math.random() - 0.5) * w * 0.2);
        g.add(flower);
        const center = cylinder(0.02, 0.02, 0.02, FABRIC_MAT('#5C4033'), 8);
        center.position.copy(flower.position);
        center.position.y += 0.015;
        g.add(center);
    }
    return g;
};

builders['su-fruit-bowl'] = (item, color) => {
    const g = new THREE.Group();
    const w = item.w, h = item.h;
    const bowl = cylinder(w/2, w * 0.3, h * 0.4, CERAMIC_MAT('#f5f0eb'), 16);
    bowl.position.y = h * 0.2;
    g.add(bowl);
    const fruits = [['#FF6347', 0.035], ['#FFD700', 0.03], ['#32CD32', 0.03], ['#FF8C00', 0.032]];
    fruits.forEach(([c, r], i) => {
        const fruit = sphere(r, FABRIC_MAT(c), 8, 6);
        fruit.position.set((Math.random() - 0.5) * w * 0.25, h * 0.35 + i * 0.02, (Math.random() - 0.5) * w * 0.25);
        g.add(fruit);
    });
    return g;
};

builders['su-shells'] = (item, color) => {
    const g = new THREE.Group();
    const w = item.w, d = item.d, h = item.h;
    const tray = box(w, h * 0.3, d, WOOD_MAT('#DEB887'));
    tray.position.y = h * 0.15;
    g.add(tray);
    for (let i = 0; i < 5; i++) {
        const shell = sphere(0.015 + Math.random() * 0.01, CERAMIC_MAT(shiftHex(color, (Math.random() - 0.5) * 20)), 6, 4);
        shell.scale.y = 0.5;
        shell.position.set((Math.random() - 0.5) * w * 0.6, h * 0.35, (Math.random() - 0.5) * d * 0.5);
        g.add(shell);
    }
    return g;
};

builders['su-lantern'] = (item, color) => {
    const g = new THREE.Group();
    const w = item.w, h = item.h;
    const metal = METAL_MAT(color);
    const frame = box(w, h, w, metal);
    frame.position.y = h/2;
    g.add(frame);
    const glass = box(w - 0.02, h - 0.06, w - 0.02, GLASS_MAT());
    glass.position.y = h/2;
    g.add(glass);
    const candle = cylinder(0.015, 0.015, h * 0.3, EMISSIVE_MAT('#FFF8DC'), 8);
    candle.position.y = h * 0.25;
    g.add(candle);
    return g;
};

builders['su-wicker-basket'] = (item, color) => {
    const g = new THREE.Group();
    const w = item.w, h = item.h;
    const basket = cylinder(w/2, w/2 - 0.02, h, FABRIC_MAT(color), 12);
    basket.position.y = h/2;
    g.add(basket);
    return g;
};

builders['au-pumpkin'] = (item, color) => buildPumpkin(item, color);
builders['au-pumpkin-sm'] = (item, color) => buildPumpkin(item, color);

function buildPumpkin(item, color) {
    const g = new THREE.Group();
    const r = item.w / 2;
    const body = sphere(r, FABRIC_MAT(color), 8, 8);
    body.scale.y = 0.8;
    body.position.y = r * 0.8;
    g.add(body);
    // Stem
    const stem = cylinder(r * 0.1, r * 0.08, r * 0.3, FABRIC_MAT('#228B22'), 6);
    stem.position.y = r * 1.5;
    g.add(stem);
    // Ridges
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const ridge = cylinder(0.005, 0.005, r * 1.5, FABRIC_MAT(shiftHex(color, -15)), 4);
        ridge.position.set(Math.cos(angle) * r * 0.85, r * 0.75, Math.sin(angle) * r * 0.85);
        g.add(ridge);
    }
    return g;
}

builders['au-garland'] = (item, color) => {
    const g = new THREE.Group();
    const w = item.w, h = item.h;
    // Simple draped garland as series of spheres
    const leafColors = ['#D2691E', '#DAA520', '#8B4513', '#DC143C'];
    for (let i = 0; i < 20; i++) {
        const t = i / 19;
        const x = (t - 0.5) * w;
        const y = Math.sin(t * Math.PI) * -h * 0.3;
        const leaf = sphere(0.02, FABRIC_MAT(leafColors[i % leafColors.length]), 5, 4);
        leaf.position.set(x, y, 0);
        g.add(leaf);
    }
    return g;
};

builders['au-candle-set'] = (item, color) => {
    const g = new THREE.Group();
    const w = item.w, h = item.h;
    const heights = [h, h * 0.75, h * 0.85];
    heights.forEach((ch, i) => {
        const x = (i - 1) * w * 0.35;
        const candle = cylinder(0.02, 0.02, ch, FABRIC_MAT(color), 8);
        candle.position.set(x, ch/2, 0);
        g.add(candle);
        const flame = sphere(0.01, EMISSIVE_MAT('#FF8C00'), 6, 4);
        flame.scale.y = 1.5;
        flame.position.set(x, ch + 0.01, 0);
        g.add(flame);
    });
    return g;
};

builders['au-throw'] = (item, color) => {
    const g = new THREE.Group();
    const w = item.w, d = item.d, h = item.h;
    const blanket = box(w, h, d, FABRIC_MAT(color));
    blanket.position.y = h/2;
    g.add(blanket);
    // Plaid-like stripes
    for (let i = 0; i < 3; i++) {
        const stripe = box(0.01, h + 0.002, d, FABRIC_MAT(shiftHex(color, 40)));
        stripe.position.set((i - 1) * w * 0.3, h/2, 0);
        g.add(stripe);
    }
    return g;
};

builders['au-apple-basket'] = (item, color) => {
    const g = new THREE.Group();
    const w = item.w, h = item.h;
    const basket = cylinder(w/2, w/2 - 0.02, h * 0.5, FABRIC_MAT('#DEB887'), 12);
    basket.position.y = h * 0.25;
    g.add(basket);
    for (let i = 0; i < 4; i++) {
        const apple = sphere(0.025, FABRIC_MAT(color), 6, 5);
        apple.position.set((Math.random() - 0.5) * w * 0.3, h * 0.55 + Math.random() * 0.03, (Math.random() - 0.5) * w * 0.3);
        g.add(apple);
    }
    return g;
};

builders['wi-xmas-tree'] = (item, color) => {
    const g = new THREE.Group();
    const w = item.w, h = item.h;
    // Trunk
    const trunk = cylinder(0.04, 0.05, h * 0.15, WOOD_MAT('#5C4033'), 8);
    trunk.position.y = h * 0.075;
    g.add(trunk);
    // Tiers
    const tiers = [
        { y: h * 0.25, r: w * 0.45, th: h * 0.3 },
        { y: h * 0.50, r: w * 0.35, th: h * 0.25 },
        { y: h * 0.70, r: w * 0.25, th: h * 0.2 },
        { y: h * 0.85, r: w * 0.15, th: h * 0.15 },
    ];
    tiers.forEach(t => {
        const tier = cone(t.r, t.th, FABRIC_MAT(color), 8);
        tier.position.y = t.y + t.th / 2;
        g.add(tier);
    });
    // Star
    const star = sphere(0.03, EMISSIVE_MAT('#FFD700'), 6, 4);
    star.position.y = h + 0.02;
    g.add(star);
    // Ornaments
    const ornColors = ['#DC143C', '#FFD700', '#4169E1', '#FF69B4'];
    for (let i = 0; i < 10; i++) {
        const tier = tiers[Math.floor(Math.random() * 3)];
        const angle = Math.random() * Math.PI * 2;
        const r = tier.r * (0.5 + Math.random() * 0.4);
        const ornament = sphere(0.02, FABRIC_MAT(ornColors[i % ornColors.length]), 6, 4);
        ornament.position.set(Math.cos(angle) * r, tier.y + Math.random() * tier.th * 0.5, Math.sin(angle) * r);
        g.add(ornament);
    }
    return g;
};

builders['wi-blanket'] = (item, color) => {
    const g = new THREE.Group();
    const blanket = box(item.w, item.h, item.d, FABRIC_MAT(color));
    blanket.position.y = item.h / 2;
    g.add(blanket);
    return g;
};

builders['wi-stocking'] = (item, color) => {
    const g = new THREE.Group();
    const w = item.w, h = item.h;
    // Stocking body (simplified as box + cylinder foot)
    const body = box(w, h * 0.7, 0.04, FABRIC_MAT(color));
    body.position.y = h * 0.15;
    g.add(body);
    // Cuff
    const cuff = box(w + 0.01, h * 0.15, 0.045, FABRIC_MAT('#f5f0eb'));
    cuff.position.y = h * 0.5 + h * 0.075;
    g.add(cuff);
    // Toe
    const toe = box(w * 0.7, h * 0.15, 0.04, FABRIC_MAT(color));
    toe.position.set(w * 0.2, -h * 0.15, 0);
    g.add(toe);
    return g;
};

builders['wi-candles'] = (item, color) => builders['au-candle-set'](item, color);

builders['wi-snowglobe'] = (item, color) => {
    const g = new THREE.Group();
    const r = item.w / 2;
    // Base
    const base = cylinder(r + 0.01, r + 0.015, r * 0.4, WOOD_MAT('#5C4033'), 16);
    base.position.y = r * 0.2;
    g.add(base);
    // Globe
    const globe = sphere(r, new THREE.MeshStandardMaterial({
        color: color, transparent: true, opacity: 0.25, roughness: 0.05, metalness: 0.1
    }), 16, 12);
    globe.position.y = r + r * 0.4;
    g.add(globe);
    // Little tree inside
    const miniTree = cone(r * 0.3, r * 0.8, FABRIC_MAT('#228B22'), 6);
    miniTree.position.y = r * 0.8;
    g.add(miniTree);
    return g;
};

builders['wi-garland'] = (item, color) => {
    const g = new THREE.Group();
    const w = item.w, h = item.h;
    for (let i = 0; i < 24; i++) {
        const t = i / 23;
        const x = (t - 0.5) * w;
        const y = Math.sin(t * Math.PI) * -h * 0.2;
        const leaf = sphere(0.015, FABRIC_MAT(color), 5, 4);
        leaf.position.set(x, y, 0);
        g.add(leaf);
    }
    // Red berries
    for (let i = 0; i < 6; i++) {
        const t = (i + 0.5) / 6;
        const x = (t - 0.5) * w;
        const y = Math.sin(t * Math.PI) * -h * 0.2;
        const berry = sphere(0.01, FABRIC_MAT('#DC143C'), 5, 4);
        berry.position.set(x, y + 0.015, 0.015);
        g.add(berry);
    }
    return g;
};

builders['wi-gift'] = (item, color) => {
    const g = new THREE.Group();
    const w = item.w, h = item.h;
    const gift = box(w, h, w, FABRIC_MAT(color));
    gift.position.y = h/2;
    g.add(gift);
    // Ribbon
    const ribbon1 = box(w + 0.005, 0.02, 0.005, FABRIC_MAT('#FFD700'));
    ribbon1.position.y = h/2;
    g.add(ribbon1);
    const ribbon2 = box(0.005, 0.02, w + 0.005, FABRIC_MAT('#FFD700'));
    ribbon2.position.y = h/2;
    g.add(ribbon2);
    // Bow
    const bow = sphere(0.025, FABRIC_MAT('#FFD700'), 6, 4);
    bow.position.y = h + 0.015;
    g.add(bow);
    return g;
};

// ---- Public API ----

export function buildFurniture(itemData, colorIndex = 0) {
    const id = itemData.id;
    const color = itemData.colors ? itemData.colors[colorIndex % itemData.colors.length] : '#8B7355';
    const builder = builders[id];
    if (!builder) {
        // Fallback: simple colored box
        const g = new THREE.Group();
        const b = box(itemData.w, itemData.h, itemData.d, FABRIC_MAT(color));
        b.position.y = itemData.h / 2;
        g.add(b);
        return g;
    }
    const group = builder(itemData, color);
    // Set userData for collision
    group.userData.itemData = itemData;
    group.userData.colorIndex = colorIndex;
    group.userData.footprint = { w: itemData.w, d: itemData.d };
    // Make all children part of the furniture for raycasting
    group.traverse(child => {
        if (child.isMesh) {
            child.userData.furnitureGroup = group;
        }
    });
    return group;
}

export function getAvailableColors(itemData) {
    return itemData.colors || ['#8B7355'];
}

// ---- Helpers ----

function shiftHex(hex, amount) {
    let c = parseInt(hex.replace('#', ''), 16);
    let r = Math.min(255, Math.max(0, ((c >> 16) & 0xFF) + amount));
    let g = Math.min(255, Math.max(0, ((c >> 8) & 0xFF) + amount));
    let b = Math.min(255, Math.max(0, (c & 0xFF) + amount));
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
