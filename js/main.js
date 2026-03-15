/* ============================================
   Room Studio 3D — Main Entry Point
   Scene setup, render loop, camera management
   ============================================ */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomScene } from './scene.js?v=3';
import { InteractionManager } from './interaction.js?v=3';
import { UIManager } from './ui.js?v=3';
import { ROOMS } from './data.js?v=3';

// ---- Renderer ----
const canvas = document.getElementById('three-canvas');
const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;
renderer.outputColorSpace = THREE.SRGBColorSpace;

// ---- Scene ----
const scene = new THREE.Scene();
scene.background = new THREE.Color('#e8e4de');

// ---- Camera ----
const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
const initialRoom = ROOMS[0];

// Set initial camera position directly (before controls exist)
camera.position.set(
    initialRoom.width + 1.5,
    initialRoom.height * 0.8 + 1,
    initialRoom.depth + 2
);

// ---- Controls ----
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.minDistance = 1.5;
controls.maxDistance = 15;
controls.maxPolarAngle = Math.PI / 2 - 0.05;
controls.minPolarAngle = 0.1;
controls.target.set(
    initialRoom.width / 2,
    initialRoom.height * 0.35,
    initialRoom.depth / 2
);
controls.update();
controls.addEventListener('change', requestRender);

// ---- Room Scene ----
const roomScene = new RoomScene(scene);

// ---- Render-on-demand ----
let renderRequested = false;
function requestRender() {
    if (!renderRequested) {
        renderRequested = true;
        requestAnimationFrame(render);
    }
}

function render() {
    renderRequested = false;
    controls.update();
    resizeIfNeeded();
    renderer.render(scene, camera);
}

function resizeIfNeeded() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const pr = renderer.getPixelRatio();
    if (canvas.width !== Math.floor(w * pr) || canvas.height !== Math.floor(h * pr)) {
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    }
}

// ---- Interaction Manager ----
const interaction = new InteractionManager(
    scene, camera, renderer, roomScene,
    (record) => { ui.showEditPopover(record); },
    () => { ui.hideEditPopover(); },
    requestRender,
    controls
);

// ---- UI Manager ----
const ui = new UIManager(interaction, roomScene, requestRender);

// Camera view changes
ui.onViewChange = (view) => {
    const room = ui.currentRoom;
    animateCameraTo(room, view);
};

// ---- Camera positioning ----

function setCameraForRoom(room, view) {
    const cx = room.width / 2;
    const cz = room.depth / 2;
    const ch = room.height * 0.35;

    switch (view) {
        case 'front':
            camera.position.set(cx, ch + 0.5, room.depth + 2.5);
            controls.target.set(cx, ch, cz);
            break;
        case 'top':
            camera.position.set(cx, room.height + 4, cz + 0.1);
            controls.target.set(cx, 0, cz);
            break;
        case 'corner':
        default:
            camera.position.set(
                room.width + 1.5,
                room.height * 0.8 + 1,
                room.depth + 2
            );
            controls.target.set(cx, ch, cz);
            break;
    }
    controls.update();
    requestRender();
}

function animateCameraTo(room, view) {
    const cx = room.width / 2;
    const cz = room.depth / 2;
    const ch = room.height * 0.35;

    let targetPos, targetLook;

    switch (view) {
        case 'front':
            targetPos = new THREE.Vector3(cx, ch + 0.5, room.depth + 2.5);
            targetLook = new THREE.Vector3(cx, ch, cz);
            break;
        case 'top':
            targetPos = new THREE.Vector3(cx, room.height + 4, cz + 0.1);
            targetLook = new THREE.Vector3(cx, 0, cz);
            break;
        case 'corner':
        default:
            targetPos = new THREE.Vector3(room.width + 1.5, room.height * 0.8 + 1, room.depth + 2);
            targetLook = new THREE.Vector3(cx, ch, cz);
            break;
    }

    const startPos = camera.position.clone();
    const startTarget = controls.target.clone();
    const duration = 600;
    const startTime = performance.now();

    function animStep(now) {
        const t = Math.min(1, (now - startTime) / duration);
        const ease = 1 - Math.pow(1 - t, 3);

        camera.position.lerpVectors(startPos, targetPos, ease);
        controls.target.lerpVectors(startTarget, targetLook, ease);
        controls.update();
        renderer.render(scene, camera);

        if (t < 1) {
            requestAnimationFrame(animStep);
        }
    }
    requestAnimationFrame(animStep);
}

// Make setCameraForRoom available to UI for room switching
ui.onRoomChange = (room) => {
    setCameraForRoom(room, 'corner');
};

// ---- Build initial room ----
roomScene.buildRoom(initialRoom);
ui.init();

// ---- Window resize ----
window.addEventListener('resize', requestRender);

// ---- Initial render ----
resizeIfNeeded();
render();

// Damping animation loop
function dampingLoop() {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(dampingLoop);
}
dampingLoop();
