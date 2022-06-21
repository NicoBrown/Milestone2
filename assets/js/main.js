import * as THREE from 'three'
import { OrbitControls } from 'https://unpkg.com/three/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from 'https://unpkg.com/three/examples/jsm/loaders/OBJLoader.js';
import { FontLoader } from 'https://unpkg.com/three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'https://unpkg.com/three/examples/jsm/geometries/TextGeometry.js';
import { Camera } from 'three'


import * as world from "./objects/world.js"

// Gsap
//import gsap from 'gsap'

/**
 * -----------------------------------------------------
 * Base
 * -----------------------------------------------------
 */
// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();


/**
 * -----------------------------------------------------
 * DEBUGGER TWEAKPANE
 * -----------------------------------------------------
 */
// Debugger
// const tweakpane = new Pane({ title: '☠ Parameters' });
// tweakpane.containerElem_.style.width = '280px';
// tweakpane.containerElem_.style.height = '280px';
// tweakpane.registerPlugin(EssentialsPlugin);


/**
 * -----------------------------------------------------
 * Sizes
 * -----------------------------------------------------
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};


/**
 * -----------------------------------------------------
 * Camera
 * -----------------------------------------------------
 */
// Base camera
const camera = new THREE.PerspectiveCamera(50, sizes.width / sizes.height, 0.1, 200);
scene.add(camera);


// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.001;
controls.minDistance = 0;
controls.maxDistance = 300;
controls.maxPolarAngle = 1.65;
controls.minPolarAngle = 1.5;
// controls.minAzimuthAngle = -3.05;
// controls.maxAzimuthAngle = 3.05;

/**
 * -----------------------------------------------------
//  * Light
//  * -----------------------------------------------------
//  */
const sunLight = new THREE.DirectionalLight(0xffffff, 1);
sunLight.castShadow = true;
sunLight.shadow.camera.far = 50;
sunLight.shadow.mapSize.set(1024, 1024);
sunLight.shadow.normalBias = 0.05;
sunLight.position.set(5, 250, 0);
sunLight.rotation.set(0, 10, 10);
scene.add(sunLight);
// const sunLightHelper = new THREE.DirectionalLightHelper(sunLight, 3);
// scene.add(sunLightHelper);

/**
 * -----------------------------------------------------
 * Grid Helpers
 * -----------------------------------------------------
 */
const gridHelper = new THREE.GridHelper(3, 3, '#949494', '#949494');
gridHelper.material.transparent = true;
gridHelper.material.opacity = 0;
gridHelper.visible = false;
gridHelper.position.x = 0;
//scene.add(gridHelper);

/**
 * -----------------------------------------------------
 * Loader Textures
 * -----------------------------------------------------
 */
const textureLoader = new THREE.TextureLoader();
const purefitTexture = textureLoader.load('./textures/purefitness_screenshot.png');
const matcaptexture =  textureLoader.load('./textures/5.png')
// const backgroundtexture = textureLoader.load( "textures/stars.png" )
// console.log(backgroundtexture);
/**
 * -----------------------------------------------------
 * Materials
 * -----------------------------------------------------
 */

// base Material
const normalMaterial = new THREE.MeshNormalMaterial();
//board materials
const pureFitMaterial = new THREE.MeshBasicMaterial({ map: purefitTexture });
const matcapmaterial = new THREE.MeshMatcapMaterial({ matcap: matcaptexture})

// // Simple Shaders Material
// const shaderMaterial = new THREE.ShaderMaterial({
//     vertexShader: SimpleVertexShader,
//     fragmentShader: SimpleFragmentShader,
// });

// scene background material
// scene.background = new THREE.MeshBasicMaterial({map: backgroundtexture});


/**
 * -----------------------------------------------------
 * Object
 * -----------------------------------------------------
 */


// Group Mesh
const groupMesh = new THREE.Group()

// Define the rectangles
const cubeGeometry = new THREE.BoxGeometry(16, 9, 0.1);
const cube = new THREE.Mesh(cubeGeometry, pureFitMaterial);
cube.position.set(0, 5, -60);
cube.userData = {URL: 'https://nicobrown.github.io/MilestoneProject1/'};
cube.name = "cube";

// Define the curve
var closedSpline = new THREE.CatmullRomCurve3( [
    new THREE.Vector3(289.76843686945404, 0, 56.10018915737797),
        new THREE.Vector3(-53.56300074753207, 0, -248.12233847921289),
        new THREE.Vector3(-211.3956202065645, 0, -268.3388617817887),
        new THREE.Vector3(-383.785318791128, 0, 47.869296953772746),
        new THREE.Vector3(-155.19539306638188, 0, 760.056126706788),
        new THREE.Vector3(319.93363195682286, 0, 544.2194726126658),
        new THREE.Vector3(289.87938185137807, 0, 326.31394394520044),
        new THREE.Vector3(289.97667752298884, 0, 52.87991840985492)
] );

closedSpline.type = 'catmullrom';
closedSpline.closed = true;

// Set up settings for later extrusion
var extrudeSettings = {
    steps           : 200,
    bevelEnabled: true,
	bevelThickness: 1,
	bevelSize: 1,
	bevelOffset: 1,
	bevelSegments: 1,
    extrudeMaterial: 1,
    extrudePath     : closedSpline,
    depth           : 1
};

// Define a line
var pts = [1,20,], count = 2;
for ( var i = 0; i < count; i ++ ) {
    pts.push( new THREE.Vector2 ( i, i * 20 ));
}
var shape = new THREE.Shape( pts );

// Extrude the triangle along the CatmullRom curve
var geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
var material2 = new THREE.MeshLambertMaterial( { color: 0xAEAEAE, wireframe: false } );

// Create mesh with the resulting geometry
var mesh = new THREE.Mesh( geometry, material2 );
mesh.scale.set(0.5,0.5,0.5);


// //create robot
// const OBJloader = new OBJLoader();

// OBJloader.load( '/Assets/subdivided.obj', function ( robotMesh ) {

//     robotMesh.castShadow = true;
//     robotMesh.receiveShadow = true;
//     robotMesh.position.set( 55, 0 , -55);
//     var robotx = robotMesh.position.x;
//     robotMesh.name = "robotMesh";
//     scene.add(robotMesh);
//     tweakpane.addBlade();
//     tweakpane.addInput(PARAMS, "x"  );

//     camera.position.set(robotMesh.position.x + 3, robotMesh.position.y + 3, robotMesh.position.z - 10);
//     camera.lookAt(robotMesh.position);
// } );


//create portfolio text
 const loader = new FontLoader();

	loader.load( './Assets/fonts/helvetiker_regular.typeface.json', function ( font ) {


        const geometry = new TextGeometry( 'NICO\'S \nPORTFOLIO', {
            font: font,
            size: 10,
            height: 1,
            curveSegments: 20,
            bevelEnabled: true,
            bevelThickness: 0.5,
            bevelSize: 0.5,
            bevelOffset: 0,
            bevelSegments: 5
        } );

        var textMesh = new THREE.Mesh(geometry, matcapmaterial);

        textMesh.castShadow = true;
        textMesh.receiveShadow = true;
        textMesh.translateY(200);
        textMesh.name = "textMesh";
        geometry.center();
        geometry.rotateY(Math.PI);
        scene.add(textMesh);
        
        camera.position.set(textMesh.position.x,textMesh.position.y, textMesh.position.z-200);
        camera.lookAt(textMesh.position.x,textMesh.position.y,textMesh.position.z);
        controls.target.set(0,200,200);
        controls.update();
    } );

groupMesh.add(cube);
groupMesh.add(mesh);
scene.add(groupMesh);


/**
 * -----------------------------------------------------
 * Renderer
 * -----------------------------------------------------
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
});


renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// renderer.setClearColor(0xeeeeee, 1);


/**
 * -----------------------------------------------------
 * Raycasting
 * -----------------------------------------------------
 */
const cursor = {
    position: new THREE.Vector2(),
    positionReal: new THREE.Vector2(),
}
window.addEventListener('mousemove', (event) => {
    cursor.position.x = (event.clientX / sizes.width) * 2 - 1
    cursor.position.y = -(event.clientY / sizes.height) * 2 + 1
    cursor.positionReal.x = event.clientX
    cursor.positionReal.y = event.clientY

    const raycaster = new THREE.Raycaster()
    raycaster.setFromCamera(cursor.position, camera)
    const intersects = raycaster.intersectObjects(groupMesh.children, true)

    // // collect array of uuids of currently hovered objects
		// var hoveredObjectUuids = intersects.map(el => el.object.uuid);

    // // If found
    //     for (let i = 0; i < intersects.length; i++) {
    //   var hoveredObj = intersects[i].object;
    //   if (hoveredObjects[hoveredObj.uuid]) {
    //     continue; // this object was hovered and still hovered
    //   }
    //     intersects[0].object.scale, 1, {
    //         x: 2,
    //         ease: gsap.Expo.easeOut,
    //         y: 2,
    //         ease: gsap.Expo.easeOut,
    //         z: 2,
    //         ease: gsap.Expo.easeOut
    //       };

    //       hoveredObjects[hoveredObj.uuid] = hoveredObj;

    //       for (let uuid of Object.keys(hoveredObjects)) {
    //         let idx = hoveredObjectUuids.indexOf(uuid);
    //       if (idx === -1) {
    //           // object with given uuid was unhovered
    //         let unhoveredObj = hoveredObjects[uuid];
    //         delete hoveredObjects[uuid];


    //         this.to(unhoveredObj.scale, 2, {
    //           x: 1,
    //           ease: gsap.Expo.easeOut,
    //           y: 1,
    //           ease: gsap.Expo.easeOut,
    //           z: 1,
    //           ease: gsap.Expo.easeOut
    //         });

    //       }
    //     }
    //}
})

/**
 * -----------------------------------------------------
 * Events
 * -----------------------------------------------------
 */
window.addEventListener('pointerdown', () => {

    const raycaster = new THREE.Raycaster()
    raycaster.setFromCamera(cursor.position, camera)
    const intersects = raycaster.intersectObjects(groupMesh.children, true)
    // If found
    if (intersects.length && intersects[0].object.userData.URL != undefined) {
        window.open(intersects[0].object.userData.URL);
    }
})

window.addEventListener('onmouseover', () => {

    const raycaster = new THREE.Raycaster()
    raycaster.setFromCamera(cursor.position, camera)
    const intersects = raycaster.intersectObjects(groupMesh.children, true)
    // If found
    if (intersects.length) {
        intersects[0].object.style;
    }
})

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    
    if(sizes.width < 1000)
    {
        let textmesh = scene.getObjectByName('textMesh');
        textmesh.scale.set(0.5,0.5,0.5);
        // if(camera.position.x > 24){
        //     camera.position.x = 15;
        // }
    
        // if(camera.position.x < -15){
        //     camera.position.x = -15;
        // }
    }
    if(sizes.width > 1000)
    {
        
        // if(camera.position.x > 24){
        //     camera.position.x = 24;
        // }
    
        // if(camera.position.x < -24){
        //     camera.position.x = -24;
        // }
    }
});

/**
 * -----------------------------------------------------
 * Animate
 * -----------------------------------------------------
 */

//gsap.fromTo(groupMesh.getObjectByName('cube').position,{ duration: 1, delay: 1, x: 20}, { duration: 1, delay: 1, x: -20});

const tick = () =>
{

    // Update controls
    //controls.target.set(scene.getObjectByName("robotMesh").position);
    // if(camera.position.x > 24){
    //     camera.position.x = 24;
    // }

    // if(camera.position.x < -24){
    //     camera.position.x = -24;
    // }

    if(camera.position.z > -200){
        camera.position.z = -200;
    }

    if(camera.position.z < -200){
        camera.position.z = -200;
    }

    console.log(sizes.width);

    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
