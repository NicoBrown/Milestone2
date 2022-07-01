import * as THREE from 'three';
import { FontLoader } from 'https://unpkg.com/three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'https://unpkg.com/three/examples/jsm/geometries/TextGeometry.js';
import { SVGLoader } from 'https://unpkg.com/three/examples/jsm/loaders/SVGLoader.js';
import { FBXLoader } from 'https://unpkg.com/three/examples/jsm/loaders/FBXLoader.js';
import { TransformControls, TransformControlsGizmo, TransformControlsPlane } from 'https://unpkg.com/three/examples/jsm/controls/TransformControls.js';
import { createCamera } from "./createCamera.js";
import { createRender } from "./createRender.js";
import { createLight } from './createLight.js';
import { createControls } from './createControls.js';

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
        window.experience = this; // to get access to the class in the terminal 

        const sizes = {
            width: window.innerWidth,
            height: window.innerHeight
        };

        var scene = new THREE.Scene();
        const camera = createCamera(sizes);
        const orbitControls = createControls("orbit", camera, canvas);
        const renderer = createRender(sizes, canvas);
        const sunLight = createLight(canvas);
        // this.postprocess = new Postprocess()
        // this.raycaster = new Raycaster()
        
        // Add elements to scene
        scene.add(camera);
        scene.add(sunLight);

        const imageUrls = [
            "../assets/textures/purefitness-screenshot.png",
            "../assets/textures/loverunning-screenshot.jpg"
        ];
        const imageLinks = [
            "../assets/textures/purefitness-screenshot.png",
            "../assets/textures/loverunning-screenshot.jpg"
        ];
        /**
         * -----------------------------------------------------
         * Grid Helpers
         * -----------------------------------------------------
         */
        const gridHelper = new THREE.GridHelper(10, 10, '#949494', '#949494');
        gridHelper.material.transparent = false;
        gridHelper.material.opacity = 1;
        gridHelper.visible = true;
        gridHelper.position.x = 0;
        scene.add(gridHelper);

        /**
         * -----------------------------------------------------
         * Loader and Textures
         * -----------------------------------------------------
         */
        const textureLoader = new THREE.TextureLoader();
        const matcaptexture = textureLoader.load('./assets/textures/5.png');
        const backgroundtexture = textureLoader.load("./assets/textures/stars.png");

        /**
         * -----------------------------------------------------
         * Materials
         * -----------------------------------------------------
         */
        // base Material
        const normalMaterial = new THREE.MeshNormalMaterial();
        // matcap materials
        const matcapmaterial = new THREE.MeshMatcapMaterial({ matcap: matcaptexture });

        /**
         * -----------------------------------------------------
         * Object definition
         * -----------------------------------------------------
         */
        // Define the screen rectangles
        let position = 9;
    
        for (let i = 0; i < imageUrls.length; i++) {

            textureLoader.load(imageUrls[i], function (texture) {
                
                let screenMaterial = new THREE.MeshBasicMaterial({
                    map: texture,
                });
                
                let screenGeometry = new THREE.BoxGeometry(3.2, 1.8, 0.1);
                // Create Screen object
                let screen = new THREE.Mesh(screenGeometry, screenMaterial);
                screen.position.set(-1.5, position, 0);
                screen.name = "screen " + (i + 1).toString();
                // screen.userData = {
                //     URL: imageLinks[i]
                // };

                //Add screens to scene
                scene.add(screen);
                position -= 4.5;
            });
        }

        //create portfolio text
        const loader = new FontLoader();

        loader.load('./assets/fonts/helvetiker_regular.typeface.json', function (font) {
            const geometry = new TextGeometry('Nico\'s Portfolio',
                {
                    font: font,
                    size: 0.5,
                    height: 0.01,
                    curveSegments: 20,
                    bevelEnabled: true,
                    bevelThickness: 0.1,
                    bevelSize: 0.05,
                    bevelOffset: 0,
                    bevelSegments: 5
                });
            
            geometry.center();
            geometry.rotateY(Math.PI);
            var textMesh = new THREE.Mesh(geometry, matcapmaterial);
            textMesh.castShadow = true;
            textMesh.receiveShadow = true;
            textMesh.translateY(18);
            textMesh.name = "textMesh";

            scene.add(textMesh);
        });
        
        //create building model
        const fbxLoader = new FBXLoader();

        fbxLoader.load('./assets/objects/BuildingModel.fbx', function (object) {
            object.scale.set(0.05, 0.05, 0.05);
            object.rotateX(-1.5708);
            object.position.set(0, 13.5, 6);
            object.name = "buildingModel";
    
            scene.add(object);
        });
       
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
            const intersects = raycaster.intersectObjects(scene.children, true);

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
        var scrollY = window.scrollY;

        /**
         * -----------------------------------------------------
         * Events
         * -----------------------------------------------------
         */
         
        window.addEventListener('scroll', () => {
            scrollY = window.scrollY;
            camera.position.setZ(-7);
        });
         

//             /**
//  * Get current browser viewpane heigtht
//  */
//             function _get_window_height() {
//                 return (
//                     window.innerHeight ||
//                     document.documentElement.clientHeight ||
//                     document.body.clientHeight ||
//                     0
//                 );
//             }

//             /**
//              * Get current absolute window scroll position
//              */
//             function _get_window_Yscroll() {
//                 return (
//                     window.pageYOffset ||
//                     document.body.scrollTop ||
//                     document.documentElement.scrollTop ||
//                     0
//                 );
//             }

//             /**
//              * Get current absolute document height
//              */
//             function _get_doc_height() {
//                 return Math.max(
//                     document.body.scrollHeight || 0,
//                     document.documentElement.scrollHeight || 0,
//                     document.body.offsetHeight || 0,
//                     document.documentElement.offsetHeight || 0,
//                     document.body.clientHeight || 0,
//                     document.documentElement.clientHeight || 0
//                 );
//             }

//             /**
//              * Get current vertical scroll percentage
//              */
//             function _get_scroll_percentage() {
//                 return (
//                     _get_window_Yscroll() / (_get_doc_height() - _get_window_height())
//                 );
//             }
        


            // window.addEventListener( 'keydown', function ( event ) {

            //     switch ( event.keyCode ) {

            //         case 16: // Shift
            //             transformControl.setTranslationSnap( 100 );
            //             transformControl.setRotationSnap( THREE.MathUtils.degToRad( 15 ) );
            //             transformControl.setScaleSnap( 0.25 );
            //             break;

            //         case 87: // W
            //             transformControl.setMode( 'translate' );
            //             break;

            //         case 69: // E
            //             transformControl.setMode( 'rotate' );
            //             break;

            //         case 82: // R
            //             transformControl.setMode( 'scale' );
            //             break;

            //         case 32: // Spacebar
            //             transformControl.enabled = ! transformControl.enabled;
            //             break;

            //         case 27: // Esc
            //             transformControl.reset();
            //             break;
            //     }

            // } );
        
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
                const intersects = raycaster.intersectObjects(objectGroupMesh.children.children, true);
                // If found
                if (intersects.length) {
                    intersects[0].object.style = "border: 10px red";
                }
            });
    
            window.addEventListener('resize', () => {
                // Update global sizes
                sizes.width = window.innerWidth;
                sizes.height = window.innerHeight;

                // Compute resize ratio
                var scaleRatio = sizes.width / window.outerWidth;
                // console.log(scaleRatio);
    
                let textmesh = scene.getObjectByName('textMesh');
                textmesh.scale.set(scaleRatio, scaleRatio, scaleRatio);

                // Update camera
                camera.aspect = sizes.width / sizes.height;
                camera.updateProjectionMatrix();

                // Update renderer
                renderer.setSize(sizes.width, sizes.height);
                renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            });

            /**
             * -----------------------------------------------------
             * Animate
             * -----------------------------------------------------
             */

            function playScrollAnimations() {

            }

            //gsap.fromTo(groupMesh.getObjectByName('cube').position,{ duration: 1, delay: 1, x: 20}, { duration: 1, delay: 1, x: -20});

            const tick = () => {

                //Update camera and controls
                // Call tick again on the next frame
                window.requestAnimationFrame(tick);
                // if(camera.position.x > 24){
                //     camera.position.x = 24;
                // }

                // if(camera.position.x < -24){
                //     camera.position.x = -24;
                // }
                console.log(window.scrollY/ sizes.height / 3);
                
                //camera.position.set(textMesh.position.x,textMesh.position.y, textMesh.position.z-10);
                // Animate camera
                camera.translateY(18 - window.scrollY / sizes.height / 3);
                // camera.position.setZ(-7);
                // orbitControls.target.set(0, 18, 100);
                orbitControls.update();

                //console.log(scene.children[5])//.getObjectByName('buildingModel').position);

                // Render
                renderer.render(scene, camera);


            };
            tick();
        }
}
