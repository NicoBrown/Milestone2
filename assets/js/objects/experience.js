import * as THREE from 'three';
import { OrbitControls } from 'https://unpkg.com/three/examples/jsm/controls/OrbitControls.js';
import { OBJLoader } from 'https://unpkg.com/three/examples/jsm/loaders/OBJLoader.js';
import { FontLoader } from 'https://unpkg.com/three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'https://unpkg.com/three/examples/jsm/geometries/TextGeometry.js';
import { SVGLoader } from 'https://unpkg.com/three/examples/jsm/loaders/SVGLoader.js';
import { TransformControls, TransformControlsGizmo, TransformControlsPlane } from 'https://unpkg.com/three/examples/jsm/controls/TransformControls.js';
import { Camera, Group, Scene } from 'three';


import world from "./world.js";
import screens from './screens.js';

// Gsap
//import gsap from 'gsap'

// Singleton
let instance = null;

export default class Experience {

    constructor(canvas) {

        if (instance) {
            return instance;
        }

        instance = this;

        window.experience = this; // to get acces to the class in the terminal 
        //Options
        //this.canvas = canvas;
            
        //Setup
        //var instance = this;
        var canvas = document.querySelector('canvas.webgl');
        var scene = new THREE.Scene();
        //var camera = new THREE.PerspectiveCamera();
        var worldobject = new world();
        var screenobject = new screens();
        // this.postprocess = new Postprocess()
        // this.raycaster = new Raycaster()

        //console.log(this)


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
 * Renderer
 * -----------------------------------------------------
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
});

document.body.appendChild( renderer.domElement );

renderer.setSize(sizes.width, sizes.height);
renderer.setClearColor( 0x000000, 0 );
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// renderer.setClearColor(0xeeeeee, 1);


/**
 * -----------------------------------------------------
 * Camera
 * -----------------------------------------------------
 */
// Base camera
var camera = new THREE.PerspectiveCamera(50, sizes.width / sizes.height, 0.1, 2000);
scene.add(camera);

scene.add(worldobject.setInstance());
scene.add(screenobject.setInstance());



// Controls
const orbitControls = new OrbitControls(camera, canvas);
orbitControls.enableDamping = true;
orbitControls.dampingFactor = 0.001;
orbitControls.minDistance = 0;
orbitControls.enablePan = true;
// controls.maxDistance = 300;
// controls.maxPolarAngle = 1.65;
// controls.minPolarAngle = 1.5;
// controls.minAzimuthAngle = -3.05;
// controls.maxAzimuthAngle = 3.05;
        
const transformControl = new TransformControls(camera, canvas);
transformControl.addEventListener('change', render);
transformControl.setTranslationSnap(1);
transformControl.size = 0.2;
transformControl.addEventListener( 'dragging-changed', function ( event ) {
orbitControls.enabled = ! event.value;
});
        


    
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
        const matcaptexture = textureLoader.load('./assets/textures/5.png');
        const backgroundtexture = textureLoader.load("./assets/textures/stars.png");
console.log(backgroundtexture);
/**
 * -----------------------------------------------------
 * Materials
 * -----------------------------------------------------
 */

// base Material
const normalMaterial = new THREE.MeshNormalMaterial();
//matcap materials
        const matcapmaterial = new THREE.MeshMatcapMaterial({ matcap: matcaptexture });

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
        const groupMesh = new THREE.Group();

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

	loader.load( './assets/fonts/helvetiker_regular.typeface.json', function ( font ) {


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
        groupMesh.add(textMesh);
        
        camera.position.set(textMesh.position.x,textMesh.position.y, textMesh.position.z-200);
        camera.lookAt(textMesh.position.x,textMesh.position.y,textMesh.position.z);
        orbitControls.target.set(0,200,200);
        orbitControls.update();

    } );

        //groupMesh.add(mesh);
        scene.add(groupMesh);

        // groupMesh.children) {
        //     transformControl.attach(child.children);
        // }
        
        scene.add(transformControl);
        transformControl.attach(groupMesh);
/**
 * -----------------------------------------------------
 * Raycasting
 * -----------------------------------------------------
 */
        const cursor = {
            position: new THREE.Vector2(),
            positionReal: new THREE.Vector2(),
        };
        window.addEventListener('mousemove', (event) => {
            cursor.position.x = (event.clientX / sizes.width) * 2 - 1;
            cursor.position.y = -(event.clientY / sizes.height) * 2 + 1;
            cursor.positionReal.x = event.clientX;
            cursor.positionReal.y = event.clientY;

            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(cursor.position, camera);
            const intersects = raycaster.intersectObjects(groupMesh.children, true);

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
        });


/**
 * -----------------------------------------------------
 * Events
 * -----------------------------------------------------
 */
 window.addEventListener( 'keydown', function ( event ) {

    switch ( event.keyCode ) {

        case 16: // Shift
            transformControl.setTranslationSnap( 100 );
            transformControl.setRotationSnap( THREE.MathUtils.degToRad( 15 ) );
            transformControl.setScaleSnap( 0.25 );
            break;

        case 87: // W
            transformControl.setMode( 'translate' );
            break;

        case 69: // E
            transformControl.setMode( 'rotate' );
            break;

        case 82: // R
            transformControl.setMode( 'scale' );
            break;

        case 32: // Spacebar
            transformControl.enabled = ! transformControl.enabled;
            break;

        case 27: // Esc
            transformControl.reset();
            break;
    }

} );
        
        window.addEventListener('pointerdown', (e) => {

            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(cursor.position, camera);
   
            const intersects = raycaster.intersectObjects(scene.children, true);
            //If found
            if (intersects.length && intersects[0].object.userData.URL != undefined) {
                window.open(intersects[0].object.userData.URL);
            }
        });

        window.addEventListener('onmouseover', () => {

            const raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(cursor.position, camera);
            const intersects = raycaster.intersectObjects(groupMesh.children.children, true);
            // If found
            if (intersects.length) {
                intersects[0].object.style = "border: 10px red";
            }
        });
    
        window.addEventListener('resize', () => {
            // Update sizes
            sizes.width = window.innerWidth;
            sizes.height = window.innerHeight;

            // Update camera
            camera.aspect = sizes.width / sizes.height;
            camera.updateProjectionMatrix();

            // Update renderer
            renderer.setSize(sizes.width, sizes.height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    
            if (sizes.width < 1000) {
                let textmesh = scene.getObjectByName('textMesh');
                textmesh.scale.set(0.5, 0.5, 0.5);
                // if(camera.position.x > 24){
                //     camera.position.x = 15;
                // }
    
                // if(camera.position.x < -15){
                //     camera.position.x = -15;
                // }
            }
            if (sizes.width > 1000) {
                let textmesh = scene.getObjectByName('textMesh');
                textmesh.scale.set(1, 1, 1);
        
                // if(camera.position.x > 24){
                //     camera.position.x = 24;
                // }
    
                // if(camera.position.x < -24){
                //     camera.position.x = -24;
                // }
            }
        });
        
    function render() {

        renderer.render( scene, camera );

    }

/**
 * -----------------------------------------------------
 * Animate
 * -----------------------------------------------------
 */

//gsap.fromTo(groupMesh.getObjectByName('cube').position,{ duration: 1, delay: 1, x: 20}, { duration: 1, delay: 1, x: -20});

        const tick = () => {

            // Update controls
            //controls.target.set(scene.getObjectByName("robotMesh").position);
            // if(camera.position.x > 24){
            //     camera.position.x = 24;
            // }

            // if(camera.position.x < -24){
            //     camera.position.x = -24;
            // }

            // if(camera.position.z > -200){
            //     camera.position.z = -200;
            // }

            // if(camera.position.z < -200){
            //     camera.position.z = -200;
            // }

            console.log(sizes.width);

            orbitControls.update();

            // Render
            renderer.render(scene, camera);

            // Call tick again on the next frame
            window.requestAnimationFrame(tick);
        };

        tick();
    }
 

}