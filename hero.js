import * as THREE from "three";

import { FontLoader }
from "https://unpkg.com/three@0.179.1/examples/jsm/loaders/FontLoader.js";

import { TextGeometry }
from "https://unpkg.com/three@0.179.1/examples/jsm/geometries/TextGeometry.js";

// ------------------------------------
// SCENE
// ------------------------------------

const container = document.getElementById("particle-container");

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    1,
    6000
);

camera.position.z = 900;

let scrollY = window.scrollY;

window.addEventListener("scroll",()=>{

    scrollY = window.scrollY;

});

// ------------------------------------
// RENDERER
// ------------------------------------

const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
});

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio,2)
);

container.appendChild(renderer.domElement);

// ------------------------------------
// STARS
// ------------------------------------

const STAR_COUNT = 5000;

const positions = [];
const colors = [];
const sizes = [];

// Recomputed after full load below too, but keep an initial value so the
// scene has *something* to render before the 'load' event fires.
let pageHeight = document.body.scrollHeight;

for(let i=0;i<STAR_COUNT;i++){

    positions.push(

        (Math.random()-0.5)*6000,

        Math.random()*pageHeight-pageHeight/2,

        (Math.random()-0.5)*2500

    );

    const brightness = 0.7 + Math.random()*0.15;

    colors.push(
        brightness,
        brightness,
        brightness
    );

    sizes.push(
        Math.random()
    );

}

// ------------------------------------
// GEOMETRY
// ------------------------------------

const geometry = new THREE.BufferGeometry();

geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(
        positions,
        3
    )
);

geometry.setAttribute(
    "color",
    new THREE.Float32BufferAttribute(
        colors,
        3
    )
);

// ------------------------------------
// TEXTURE
// ------------------------------------

const texture = new THREE.TextureLoader().load(
    "images/star.png"
);

// ------------------------------------
// MATERIAL
// ------------------------------------

const material = new THREE.PointsMaterial({

    map:texture,

    size:2.6,

    transparent:true,

    opacity:1,

    vertexColors:true,

    depthWrite:false,

    alphaTest:0.01,

    blending:THREE.AdditiveBlending

});

// ------------------------------------
// POINTS
// ------------------------------------

const stars = new THREE.Points(
    geometry,
    material
);

scene.add(stars);

// =============================
// TEXT VARIABLES
// =============================

// ------------------------------------
// MOUSE
// ------------------------------------

const mouse = {
    x: 9999,
    y: 9999
};

const raycasterVector = new THREE.Vector3();

window.addEventListener("mousemove",(e)=>{

    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;

    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

});

// ------------------------------------
// ANIMATION
// ------------------------------------

let time = 0;
const velocity = [];

const original = [];

const pos = geometry.attributes.position.array;

for(let i=0;i<pos.length;i+=3){

    original.push(
        pos[i],
        pos[i+1],
        pos[i+2]
    );

    velocity.push(
        0,
        0,
        0
    );

}
const target = [...original];

let morph = 0;

let textReady = false;



function animate(){

    requestAnimationFrame(animate);

    time += 0.01;

// ------------------------------------
// CAMERA FOLLOWS SCROLL
// ------------------------------------
// The star field and the "RAMSHA" text mesh are both placed using
// pageHeight as their coordinate space (see worldY below). The camera
// has to move through that same space as the user scrolls, or anything
// placed away from y=0 (like the text near the bottom of the page)
// will simply never enter view. This mirrors the same formula used
// for the text mesh's worldY so the two stay in sync.
camera.position.y =
    pageHeight / 2 - (scrollY + window.innerHeight / 2);

raycasterVector.set(
    mouse.x,
    mouse.y,
    0.5
);

raycasterVector.unproject(camera);

const dir = raycasterVector
.clone()
.sub(camera.position)
.normalize();

const distance =
-camera.position.z /
(dir.z || 0.0001);

const cursor = camera.position
.clone()
.add(
    dir.multiplyScalar(distance)
);

    material.opacity =
        0.85 +
        Math.sin(time)*0.12;

    stars.rotation.y += 0.00005;

    stars.rotation.x += 0.00002;
for(let i=0;i<pos.length;i+=3){

    let dx = pos[i] - cursor.x;

    let dy = pos[i+1] - cursor.y;

    const dist = Math.sqrt(
        dx*dx + dy*dy
    );

    if(dist < 220){

        const force =
        (220 - dist) / 220;

        const angle =
        Math.atan2(dy,dx);

        velocity[i] +=
        Math.cos(angle) *
        force *
        7;

        velocity[i+1] +=
        Math.sin(angle) *
        force *
        7;

    }
velocity[i] *= 0.90;
velocity[i+1] *= 0.90;

pos[i] += velocity[i];
pos[i+1] += velocity[i+1];

const tx = THREE.MathUtils.lerp(
    original[i],
    target[i],
    morph
);

const ty = THREE.MathUtils.lerp(
    original[i+1],
    target[i+1],
    morph
);

const tz = THREE.MathUtils.lerp(
    original[i+2],
    target[i+2],
    morph
);

pos[i] += (tx - pos[i]) * 0.08;
pos[i+1] += (ty - pos[i+1]) * 0.08;
pos[i+2] += (tz - pos[i+2]) * 0.08;

}
geometry.attributes.position.needsUpdate=true;



renderer.render(scene,camera);


}

animate();

// ------------------------------------
// RESIZE
// ------------------------------------

window.addEventListener("resize",()=>{

    camera.aspect =
        window.innerWidth /
        window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

});

// ------------------------------------
// SURFACE SAMPLING
// ------------------------------------
// Random *vertices* only exist along the edges/corners of the letter
// triangulation, so sampling those alone leaves visible gaps inside
// thicker strokes. Instead we pick a random triangle on the mesh and
// a random point inside that triangle (barycentric interpolation),
// weighted by each triangle's area — otherwise large flat interior
// triangles (the middle of a thick stroke) get picked just as rarely
// as tiny edge triangles, leaving those interiors looking patchy.
function sampleGeometrySurface(geometry, count){

    const posAttr = geometry.attributes.position;
    const index = geometry.index;
    const triCount = index ? index.count / 3 : posAttr.count / 3;

    function getTri(tri){
        let ia, ib, ic;
        if(index){
            ia = index.getX(tri*3);
            ib = index.getX(tri*3+1);
            ic = index.getX(tri*3+2);
        } else {
            ia = tri*3;
            ib = tri*3+1;
            ic = tri*3+2;
        }
        return {
            ax: posAttr.getX(ia), ay: posAttr.getY(ia), az: posAttr.getZ(ia),
            bx: posAttr.getX(ib), by: posAttr.getY(ib), bz: posAttr.getZ(ib),
            cx: posAttr.getX(ic), cy: posAttr.getY(ic), cz: posAttr.getZ(ic)
        };
    }

    // Build a cumulative-area table so triangles can be picked
    // proportionally to their surface area.
    const cumulative = new Float64Array(triCount);
    let totalArea = 0;

    for(let t=0;t<triCount;t++){
        const tr = getTri(t);
        const abx = tr.bx - tr.ax, aby = tr.by - tr.ay, abz = tr.bz - tr.az;
        const acx = tr.cx - tr.ax, acy = tr.cy - tr.ay, acz = tr.cz - tr.az;

        // area = 0.5 * |AB x AC|
        const cx = aby*acz - abz*acy;
        const cy = abz*acx - abx*acz;
        const cz = abx*acy - aby*acx;
        const area = 0.5 * Math.sqrt(cx*cx + cy*cy + cz*cz);

        totalArea += area;
        cumulative[t] = totalArea;
    }

    function pickTriangleIndex(){
        const r = Math.random() * totalArea;
        // binary search over the cumulative area table
        let lo = 0, hi = triCount - 1;
        while(lo < hi){
            const mid = (lo + hi) >> 1;
            if(cumulative[mid] < r){
                lo = mid + 1;
            } else {
                hi = mid;
            }
        }
        return lo;
    }

    const points = [];

    for(let i=0;i<count;i++){

        const tri = getTri(pickTriangleIndex());

        let r1 = Math.random();
        let r2 = Math.random();

        if(r1 + r2 > 1){
            r1 = 1 - r1;
            r2 = 1 - r2;
        }

        points.push(new THREE.Vector3(
            tri.ax + r1*(tri.bx-tri.ax) + r2*(tri.cx-tri.ax),
            tri.ay + r1*(tri.by-tri.ay) + r2*(tri.cy-tri.ay),
            tri.az + r1*(tri.bz-tri.az) + r2*(tri.cz-tri.az)
        ));

    }

    return points;

}

// =====================================
// LOAD FONT
// =====================================

const loader = new FontLoader();

loader.load(
    "https://threejs.org/examples/fonts/helvetiker_bold.typeface.json",

    (font)=>{

        // Recompute pageHeight now that everything (images, sections) has
        // settled, so the text lines up with the true scroll range.
        pageHeight = document.body.scrollHeight;

        const textGeometry = new TextGeometry("RAMSHA",{

            font:font,

            size:250,

            depth:10,

            curveSegments:12,

            bevelEnabled:false

        });

       textGeometry.center();

textGeometry.computeBoundingBox();

const textMaterial = new THREE.MeshBasicMaterial({
    color:0x00ff00
});

      const textMesh = new THREE.Mesh(
    textGeometry,
    textMaterial
);

const lastSection = document.querySelector(".three-section");

// Places the text's world Y at the same vertical position the last
// section occupies on the page, using the same pageHeight-based
// coordinate space the camera now tracks via scroll.
const worldY = pageHeight / 2 - lastSection.offsetTop - (lastSection.offsetHeight / 2);

textMesh.position.set(
    0,
    worldY,
    0
);

textMesh.updateMatrixWorld(true);

        scene.add(textMesh);
textMesh.visible = false;

const surfacePoints = sampleGeometrySurface(textGeometry, STAR_COUNT);

textGeometry.deleteAttribute("normal");
textGeometry.deleteAttribute("uv");

for(let i = 0; i < STAR_COUNT; i++){

const vertex = surfacePoints[i].clone();

vertex.applyMatrix4(textMesh.matrixWorld);

target[i * 3] = vertex.x;
target[i * 3 + 1] = vertex.y;
target[i * 3 + 2] = vertex.z;

}

textReady = true;

    }
);
// ------------------------------------
// SIMPLE SCROLL MORPH
// ------------------------------------

window.addEventListener("scroll", () => {

    const maxScroll =
        document.body.scrollHeight -
        window.innerHeight;

    morph = THREE.MathUtils.clamp(

        window.scrollY / maxScroll,

        0,

        1

    );

});

