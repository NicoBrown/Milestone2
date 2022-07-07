import * as THREE from 'three';
import { FontLoader } from 'https://unpkg.com/three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'https://unpkg.com/three/examples/jsm/geometries/TextGeometry.js';
import { SVGLoader } from 'https://unpkg.com/three/examples/jsm/loaders/SVGLoader.js';
import { FBXLoader } from 'https://unpkg.com/three/examples/jsm/loaders/FBXLoader.js';
import { RectAreaLightUniformsLib } from 'https://unpkg.com/three/examples/jsm/lights/RectAreaLightUniformsLib.js';
import { TransformControls, TransformControlsGizmo, TransformControlsPlane } from 'https://unpkg.com/three/examples/jsm/controls/TransformControls.js';
import { createCamera } from "./createCamera.js";
import { createRender } from "./createRender.js";
import { createLight } from './createLight.js';
import { createControls } from './createControls.js';
import { getContributions } from '../api.js';



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
            startingWidth: window.innerWidth,
            startingHeight: window.innerHeight,
            width: window.innerWidth,
            height: window.innerHeight
        };
        

        this.RectAreaLightUniformsLib = new RectAreaLightUniformsLib();
        this.scene = new THREE.Scene();

        //set Camera up
        this.camera = createCamera(sizes);
        var cameraGroup = new THREE.Group();
        cameraGroup.name = "cameraGroup";
        cameraGroup.add(this.camera);
        cameraGroup.position.set(0, 0, -7);
        //this.camera.position.set(0, 0, -7);
        this.camera.lookAt(0, 0, 0);

        // set controls

        this.orbitControls = createControls("orbit", this.camera, canvas);
        this.orbitControls.target.set(0, 0, 18);
        this.freeControls = createControls("free", this.camera, canvas);
        this.transformControls = createControls("transform", this.camera, canvas);
        

        this.renderer = createRender(sizes, canvas);
        this.sunLight = createLight(canvas);

        var objectGroup = new THREE.Group();
        objectGroup.name = "objectGroup";
        
        var contribGroup = new THREE.Group();
        objectGroup.name = "contribGroup";
        // this.postprocess = new Postprocess()
        // this.raycaster = new Raycaster()
        
        // Add elements to this.scene
        this.scene.add(cameraGroup);
        this.scene.add(this.sunLight);

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
        // const gridHelper = new THREE.GridHelper(10, 10, '#949494', '#949494');
        // gridHelper.material.transparent = false;
        // gridHelper.material.opacity = 1;
        // gridHelper.visible = true;
        // gridHelper.translateY(-18);
        // this.scene.add(gridHelper);

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
        let position = -8;
    
        for (let i = 0; i < imageUrls.length; i++) {

            textureLoader.load(imageUrls[i], function (texture) {
                
                let screenMaterial = new THREE.MeshBasicMaterial({
                    map: texture,
                });
                
                let screenGeometry = new THREE.BoxGeometry(3.2, 1.8, 0.1);
                // Create Screen object
                let screen = new THREE.Mesh(screenGeometry, screenMaterial);
                if (i % 2 == 0) {
                    screen.position.set(-2, position, 0);
                    screen.rotateY(-0.6);
                }
                else {
                    screen.position.set(2, position, 0);
                    screen.rotateY(0.6);
                }

                screen.name = "screen " + (i + 1).toString();
                screen.userData = {
                    URL: imageLinks[i]
                };

                //Add screens to this.scene
                objectGroup.add(screen);
                position += -4;
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
            textMesh.name = "textMesh";

            objectGroup.add(textMesh);
        });
        
        //create building model
        const fbxLoader = new FBXLoader();

        fbxLoader.load('./assets/objects/BuildingModel.fbx', function (object) {
            object.scale.set(0.05, 0.05, 0.05);
            object.rotateY(0.6);
            object.rotateX(-1.5708);
            object.position.set(5, -5.5, 4);
            object.name = "buildingModel";

            for (var i = 0; i < object.children.length; i++) {
                //console.log(object.children[i]);
                
                if (object.children[i].name.includes("Duct")) {
                    //console.log(object.children[i]);
                    object.children[i].material = new THREE.MeshPhongMaterial({ color: 0x00b3ff });
                }
                else if (object.children[i].name.includes("Diffuser")) {
                    //console.log(object.children[i]);
                    object.children[i].material = new THREE.MeshPhongMaterial({ color: 0x00b3ff });
                    object.children[i].translateZ(-0.1);
                }
                else if (object.children[i].name.includes("Fixture")) {
                    object.children[i].material = new THREE.MeshPhongMaterial({ color: 0xffffff });
                    object.children[i].translateZ(0.2);

                    //const bulbGeometry = new THREE.BoxGeometry(0.06, 0.01, 0.06);
                    // var bulbLight = new THREE.PointLight( 0xffee88, 1, 10, 20 );

                    var bulbMat = new THREE.MeshStandardMaterial({
                        emissive: 0xffee88,
                        emissiveIntensity: 100,
                        color: 0x000000
                    });
                    object.children[i].material = bulbMat;
                    object.children[i].material.emissiveIntensity = 10;
                    object.children[i].translateZ(0.2);
                    //bulbLight.add( new THREE.Mesh( bulbGeometry, bulbMat ) );
                    //bulbLight.position.set( 0,-2.8,0 );
                    //bulbLight.castShadow = true;
                    //objectGroup.add( bulbLight );

                    // var pointLightHelper = new THREE.PointLightHelper(bulbLight, 1);
                    //objectGroup.add(pointLightHelper);

                }
                else {
                    //console.log(object.children[i]);
                    object.children[i].material = new THREE.MeshStandardMaterial({ color: 0x999999 });
                    object.children[i].material.opacity = 0.5;
                }
            };
    
            objectGroup.add(object);
            
        });



        //add Github Contributions objects
        getContributions().then((data) => {
            //console.log(data)
            for (let i = 0; i < 52; i++) {
                //console.log(data.contributions[i])
                for (let j = 0; j < 7; j++) {
                    {
                        //console.log(data.contributions[i][j].contributionCount);
                        let colors = new THREE.Color( 0xffffff );
                        colors.setHex( Math.random() * 0xffffff );
                        let boxMaterial = new THREE.MeshLambertMaterial({ color: colors });
                        
                        let box = new THREE.BoxGeometry(1, data.contributions[i][j].contributionCount, 1);
                        box.translate(0,data.contributions[i][j].contributionCount/2,0)
                        // Create Screen object
                        let contribObject = new THREE.Mesh(box, boxMaterial);
        
                        contribObject.name = "box " + i.toString() + ", " + j.toString();
                        contribObject.position.set(i, -18, j);
        
                        //Add screens to this.scene
                        contribGroup.add(contribObject);
                        
                    }
                    
                }
                
            }
            contribGroup.translateY(-18);
            contribGroup.translateZ(3);
            contribGroup.translateX(4);
            contribGroup.scale.set(0.2, 0.2, 0.2);
            contribGroup.rotateY(Math.PI);
        })

        this.transformControls.attach(contribGroup)

        objectGroup.add(contribGroup);
        this.scene.add(objectGroup);
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
            raycaster.setFromCamera(cursor.position, this.camera);
            const intersects = raycaster.intersectObjects(this.scene.children, true);

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
        //var scrollY = window.scrollY;

        /**
         * -----------------------------------------------------
         * Events
         * -----------------------------------------------------
         */
        
        window.addEventListener('scroll', () => {
            scrollY = window.scrollY;
                        
            let scroll =(-18 * _get_scroll_percentage());
            //console.log(scroll);
            this.orbitControls.target.set(0, scroll, 10);
            this.orbitControls.update();
            this.camera.position.set(this.camera.position.x, scroll, this.camera.position.z);
            this.camera.lookAt(this.camera.position.x, scroll, this.camera.position.z);
            //cameraGroup.translateY(18); 
            // this.orbitControls.target.set(0, 18, 10);

        });
         

            /**
 * Get current browser viewpane heigtht
 */
            function _get_window_height() {
                return (
                    window.innerHeight ||
                    document.documentElement.clientHeight ||
                    document.body.clientHeight ||
                    0
                );
            }

            /**
             * Get current absolute window scroll position
             */
            function _get_window_Yscroll() {
                return (
                    window.pageYOffset ||
                    document.body.scrollTop ||
                    document.documentElement.scrollTop ||
                    0
                );
            }

            /**
             * Get current absolute document height
             */
            function _get_doc_height() {
                return Math.max(
                    document.body.scrollHeight || 0,
                    document.documentElement.scrollHeight || 0,
                    document.body.offsetHeight || 0,
                    document.documentElement.offsetHeight || 0,
                    document.body.clientHeight || 0,
                    document.documentElement.clientHeight || 0
                );
            }

            /**
             * Get current vertical scroll percentage
             */
            function _get_scroll_percentage() {
                return (
                    _get_window_Yscroll() / (_get_doc_height() - _get_window_height())
                );
            }
        
            window.addEventListener( 'keydown', function ( event ) {
                switch ( event.keyCode ) {

                    // case 16: // Shift
                    //     transformControl.setTranslationSnap( 100 );
                    //     transformControl.setRotationSnap( THREE.MathUtils.degToRad( 15 ) );
                    //     transformControl.setScaleSnap( 0.25 );
                    //     break;

                    case 32: // Spacebar
                        if (this.experience.freeControls.enabled) {
                            this.experience.freeControls.enabled = false;
                            this.experience.orbitControls.enabled = true;
                        }
                        else {
                            this.experience.freeControls.enabled = true;
                            this.experience.orbitControls.target.set(0, -9, 10);
                            this.experience.orbitControls.enabled = false;
                            // this.experience.orbitControls.target.set(0, scroll, 10);
                            // this.experience.orbitControls.update();
                            this.experience.camera.position.set(this.camera.position.x, scroll, this.camera.position.z);
                            this.experience.camera.lookAt(this.camera.position.x, scroll, this.camera.position.z);
                        }
                        break;

                    // case 27: // Esc
                    //     transformControl.reset();
                    //     break;
                }
            } );
        
            window.addEventListener('pointerdown', (e) => {

                const raycaster = new THREE.Raycaster();
                raycaster.setFromCamera(cursor.position, this.camera);
   
                const intersects = raycaster.intersectObjects(this.scene.children, true);
                //If found
                // if (intersects.length && intersects[0].object.userData.URL != undefined) {
                //     window.open(intersects[0].object.userData.URL);
                // }
            });

            window.addEventListener('onmouseover', () => {

                const raycaster = new THREE.Raycaster();
                raycaster.setFromCamera(cursor.position, this.camera);
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
    
                let textmesh = this.scene.getObjectByName('textMesh');
                
                textmesh.scale.set( scaleRatio, scaleRatio, scaleRatio);

                // Update this.camera
                this.camera.aspect = sizes.width / sizes.height;
                this.camera.updateProjectionMatrix();

                // Update renderer
                this.renderer.setSize(sizes.width, sizes.height);
                this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            });

            /**
             * -----------------------------------------------------
             * Animate
             * -----------------------------------------------------
             */



            //gsap.fromTo(groupMesh.getObjectByName('cube').position,{ duration: 1, delay: 1, x: 20}, { duration: 1, delay: 1, x: -20});

            const tick = () => {

                //Update this.camera and controls
                // Call tick again on the next frame
                window.requestAnimationFrame(tick);
                // if(this.camera.position.x > 24){
                //     this.camera.position.x = 24;
                // }

                // if(this.camera.position.x < -24){
                //     this.camera.position.x = -24;
                // }
                //console.log(this.scene);
                
                //this.camera.position.set(textMesh.position.x,textMesh.position.y, textMesh.position.z-10);
                // Animate this.camera
                // cameraGroup.position.set(0,18,-7);
                //this.camera.lookAt(new THREE.Vector3(0, 18, 10));
                // orbitControls.target.set(0, 18, 100);
                //this.orbitControls.update();

                //console.log(this.scene.children[5])//.getObjectByName('buildingModel').position);

                // Render
                this.renderer.render(this.scene, this.camera);


            };
            tick();
        }
}
