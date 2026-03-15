/* ============================================
   Room Studio 3D — Procedural Materials
   Canvas-based textures, no external assets
   ============================================ */
import * as THREE from 'three';

const textureCache = new Map();

function createCanvasTexture(key, width, height, drawFn) {
    if (textureCache.has(key)) return textureCache.get(key);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    drawFn(ctx, width, height);
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    textureCache.set(key, tex);
    return tex;
}

// ---- Floor textures ----

export function hardwoodTexture(baseColor = '#c49a6c') {
    return createCanvasTexture('hardwood-' + baseColor, 512, 512, (ctx, w, h) => {
        ctx.fillStyle = baseColor;
        ctx.fillRect(0, 0, w, h);
        const plankH = h / 6;
        for (let i = 0; i < 6; i++) {
            const y = i * plankH;
            // Slight color variation per plank
            const variation = (Math.random() - 0.5) * 20;
            const c = shiftColor(baseColor, variation);
            ctx.fillStyle = c;
            ctx.fillRect(0, y + 1, w, plankH - 2);
            // Grain lines
            ctx.strokeStyle = shiftColor(baseColor, -15);
            ctx.lineWidth = 0.5;
            ctx.globalAlpha = 0.3;
            for (let g = 0; g < 8; g++) {
                const gy = y + Math.random() * plankH;
                ctx.beginPath();
                ctx.moveTo(0, gy);
                ctx.bezierCurveTo(w * 0.3, gy + (Math.random() - 0.5) * 4,
                    w * 0.7, gy + (Math.random() - 0.5) * 4, w, gy);
                ctx.stroke();
            }
            ctx.globalAlpha = 1;
            // Plank gap
            ctx.fillStyle = shiftColor(baseColor, -30);
            ctx.fillRect(0, y, w, 1.5);
        }
    });
}

export function herringboneTexture(baseColor = '#c49a6c') {
    return createCanvasTexture('herringbone-' + baseColor, 256, 256, (ctx, w, h) => {
        ctx.fillStyle = shiftColor(baseColor, -10);
        ctx.fillRect(0, 0, w, h);
        const pw = 60, ph = 15;
        for (let row = -1; row < h / ph + 1; row++) {
            for (let col = -1; col < w / pw + 1; col++) {
                const x = col * pw;
                const y = row * ph * 2;
                const offset = (row % 2) * pw / 2;
                // Right-leaning plank
                ctx.fillStyle = shiftColor(baseColor, (col + row) % 2 ? 5 : -5);
                ctx.save();
                ctx.translate(x + offset, y);
                ctx.rotate(Math.PI / 6);
                ctx.fillRect(-pw / 2, -ph / 2, pw, ph - 1);
                ctx.restore();
                // Left-leaning plank
                ctx.fillStyle = shiftColor(baseColor, (col + row) % 2 ? -5 : 5);
                ctx.save();
                ctx.translate(x + offset, y + ph);
                ctx.rotate(-Math.PI / 6);
                ctx.fillRect(-pw / 2, -ph / 2, pw, ph - 1);
                ctx.restore();
            }
        }
    });
}

export function tileTexture(baseColor = '#f0ece6') {
    return createCanvasTexture('tile-' + baseColor, 256, 256, (ctx, w, h) => {
        ctx.fillStyle = baseColor;
        ctx.fillRect(0, 0, w, h);
        const size = w / 4;
        ctx.strokeStyle = shiftColor(baseColor, -20);
        ctx.lineWidth = 2;
        for (let r = 0; r <= 4; r++) {
            for (let c = 0; c <= 4; c++) {
                ctx.strokeRect(c * size, r * size, size, size);
                // Subtle variation
                ctx.fillStyle = shiftColor(baseColor, (Math.random() - 0.5) * 8);
                ctx.fillRect(c * size + 2, r * size + 2, size - 4, size - 4);
            }
        }
    });
}

export function marbleTexture(baseColor = '#e8e2d8') {
    return createCanvasTexture('marble-' + baseColor, 512, 512, (ctx, w, h) => {
        ctx.fillStyle = baseColor;
        ctx.fillRect(0, 0, w, h);
        // Veins
        ctx.globalAlpha = 0.15;
        for (let i = 0; i < 20; i++) {
            ctx.strokeStyle = shiftColor(baseColor, -30 + Math.random() * 10);
            ctx.lineWidth = 0.5 + Math.random() * 2;
            ctx.beginPath();
            let x = Math.random() * w, y = Math.random() * h;
            ctx.moveTo(x, y);
            for (let j = 0; j < 6; j++) {
                x += (Math.random() - 0.5) * 150;
                y += (Math.random() - 0.5) * 150;
                ctx.lineTo(x, y);
            }
            ctx.stroke();
        }
        ctx.globalAlpha = 1;
    });
}

export function checkerTexture() {
    return createCanvasTexture('checker', 256, 256, (ctx, w, h) => {
        const s = w / 4;
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                ctx.fillStyle = (r + c) % 2 === 0 ? '#f0ece6' : '#2c2c2c';
                ctx.fillRect(c * s, r * s, s, s);
            }
        }
    });
}

export function concreteTexture(baseColor = '#b0a898') {
    return createCanvasTexture('concrete-' + baseColor, 256, 256, (ctx, w, h) => {
        ctx.fillStyle = baseColor;
        ctx.fillRect(0, 0, w, h);
        // Noise-like speckles
        for (let i = 0; i < 3000; i++) {
            ctx.fillStyle = shiftColor(baseColor, (Math.random() - 0.5) * 20);
            ctx.globalAlpha = 0.3;
            ctx.fillRect(Math.random() * w, Math.random() * h, 2, 2);
        }
        ctx.globalAlpha = 1;
    });
}

export function stoneTexture(baseColor = '#9a9080') {
    return createCanvasTexture('stone-' + baseColor, 512, 512, (ctx, w, h) => {
        ctx.fillStyle = baseColor;
        ctx.fillRect(0, 0, w, h);
        // Random stone shapes
        for (let i = 0; i < 15; i++) {
            const x = Math.random() * w;
            const y = Math.random() * h;
            const sw = 40 + Math.random() * 80;
            const sh = 30 + Math.random() * 60;
            ctx.fillStyle = shiftColor(baseColor, (Math.random() - 0.5) * 25);
            ctx.beginPath();
            ctx.ellipse(x, y, sw / 2, sh / 2, Math.random() * Math.PI, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = shiftColor(baseColor, -20);
            ctx.lineWidth = 1.5;
            ctx.stroke();
        }
    });
}

// ---- Wall textures ----

export function brickTexture(baseColor = '#b5705a') {
    return createCanvasTexture('brick-' + baseColor, 512, 256, (ctx, w, h) => {
        ctx.fillStyle = shiftColor(baseColor, -10);
        ctx.fillRect(0, 0, w, h);
        const bw = w / 6, bh = h / 8;
        const mortarColor = shiftColor(baseColor, 30);
        for (let row = 0; row < 8; row++) {
            const offset = (row % 2) * bw / 2;
            for (let col = -1; col < 7; col++) {
                const x = col * bw + offset;
                const y = row * bh;
                ctx.fillStyle = shiftColor(baseColor, (Math.random() - 0.5) * 15);
                ctx.fillRect(x + 2, y + 2, bw - 4, bh - 4);
            }
            // Mortar lines
            ctx.fillStyle = mortarColor;
            ctx.fillRect(0, row * bh, w, 3);
        }
        // Vertical mortar
        for (let row = 0; row < 8; row++) {
            const offset = (row % 2) * bw / 2;
            ctx.fillStyle = mortarColor;
            for (let col = 0; col < 7; col++) {
                ctx.fillRect(col * bw + offset, row * bh, 3, bh);
            }
        }
    });
}

export function shiplapTexture(baseColor = '#f0ece6') {
    return createCanvasTexture('shiplap-' + baseColor, 256, 512, (ctx, w, h) => {
        ctx.fillStyle = baseColor;
        ctx.fillRect(0, 0, w, h);
        const plankH = h / 10;
        for (let i = 0; i < 10; i++) {
            const y = i * plankH;
            ctx.fillStyle = shiftColor(baseColor, (i % 2) * 3 - 1);
            ctx.fillRect(0, y + 2, w, plankH - 4);
            ctx.fillStyle = shiftColor(baseColor, -15);
            ctx.fillRect(0, y, w, 2);
            // Shadow line
            ctx.fillStyle = shiftColor(baseColor, -8);
            ctx.fillRect(0, y + 2, w, 1);
        }
    });
}

// ---- Material factory ----

export function getFloorMaterial(surface) {
    let map;
    switch (surface.pattern) {
        case 'hardwood': map = hardwoodTexture(surface.color); break;
        case 'herringbone': map = herringboneTexture(surface.color); break;
        case 'tile': map = tileTexture(surface.color); break;
        case 'marble': map = marbleTexture(surface.color); break;
        case 'checker': map = checkerTexture(); break;
        case 'stone': map = stoneTexture(surface.color); break;
        case 'concrete': map = concreteTexture(surface.color); break;
        default: map = hardwoodTexture(surface.color); break;
    }
    map.repeat.set(3, 3);
    return new THREE.MeshStandardMaterial({
        map,
        roughness: 0.7,
        metalness: 0.0,
        side: THREE.DoubleSide,
    });
}

export function getWallMaterial(surface) {
    if (surface.pattern) {
        let map;
        switch (surface.pattern) {
            case 'brick': map = brickTexture(surface.color); break;
            case 'shiplap': map = shiplapTexture(surface.color); break;
            case 'stone': map = stoneTexture(surface.color); break;
            default: map = null;
        }
        if (map) {
            map.repeat.set(2, 2);
            return new THREE.MeshStandardMaterial({
                map,
                roughness: 0.85,
                metalness: 0.0,
                side: THREE.DoubleSide,
            });
        }
    }
    return new THREE.MeshStandardMaterial({
        color: surface.color,
        roughness: 0.9,
        metalness: 0.0,
        side: THREE.DoubleSide,
    });
}

// Standard materials for furniture
export const WOOD_MAT = (color = '#8B7355') => new THREE.MeshStandardMaterial({ color, roughness: 0.6, metalness: 0.0 });
export const FABRIC_MAT = (color = '#C4916E') => new THREE.MeshStandardMaterial({ color, roughness: 0.95, metalness: 0.0 });
export const METAL_MAT = (color = '#888888') => new THREE.MeshStandardMaterial({ color, roughness: 0.3, metalness: 0.8 });
export const GLASS_MAT = () => new THREE.MeshStandardMaterial({ color: '#b4d4e8', roughness: 0.1, metalness: 0.1, transparent: true, opacity: 0.3 });
export const CERAMIC_MAT = (color = '#f0ece6') => new THREE.MeshStandardMaterial({ color, roughness: 0.4, metalness: 0.05 });
export const EMISSIVE_MAT = (color = '#FFE4B5') => new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.5, roughness: 0.9 });

// ---- Helpers ----

function shiftColor(hex, amount) {
    let c = parseInt(hex.replace('#', ''), 16);
    let r = Math.min(255, Math.max(0, ((c >> 16) & 0xFF) + amount));
    let g = Math.min(255, Math.max(0, ((c >> 8) & 0xFF) + amount));
    let b = Math.min(255, Math.max(0, (c & 0xFF) + amount));
    return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
