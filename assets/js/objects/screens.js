import * as THREE from "three";
import Experience from "./experience.js";
import { SVGLoader } from "https://unpkg.com/three/examples/jsm/loaders/SVGLoader.js";
import { Scene, ShapeUtils } from "three";

// Gsap
//import gsap from 'gsap'

export default class screens {
  constructor() {
    this.experience = new Experience();
    //this.scene = this.experience.scene;
    //this.canvas = this.experience.canvas;
    this.setInstance();
  } 

  setInstance() {
    /**
     * -----------------------------------------------------
     * Set up Group
     * -----------------------------------------------------
     */
    const groupMesh = new THREE.Group();
    groupMesh.name = "screen-objects";

    /**
     * -----------------------------------------------------
     * SVG and Texture Loaders
     * -----------------------------------------------------
     */
    const textureLoader = new THREE.TextureLoader();
    const svgloader = new SVGLoader();

    const texturePF = textureLoader.load(
      "../assets/textures/purefitness-screenshot.png"
    );
    const textureLR = textureLoader.load(
      "../assets/textures/loverunning-screenshot.jpg"
    );

    /**
     * -----------------------------------------------------
     * Materials
     * -----------------------------------------------------
     */

    // Screen Materials
    const screenPFMaterial = new THREE.MeshBasicMaterial({
      map: texturePF,
    });

    const screenLRMaterial = new THREE.MeshBasicMaterial({
      map: textureLR,
    });


    /**
     * -----------------------------------------------------
     * SVG Objects
     * -----------------------------------------------------
     */
     const SVGGroup = new THREE.Group();
     SVGGroup.name = "SVG-objects";
    // SVG Loader is not a part of the main three.js bundle
    // We need to load it separately, it is included in this pen's Settings > JavaScript
    // https://threejs.org/docs/#examples/en/loaders/SVGLoader

    const SVGurls = 
      ["../assets/images/azure-1-logo-svgrepo-com.svg",
        "../assets/images/css-3-logo-svgrepo-com.svg",
        "../assets/images/js-svgrepo-com.svg",
        "../assets/images/typescript-svgrepo-com.svg",
        "../assets/images/github-svgrepo-com.svg",
        "../assets/images/html-5-logo-svgrepo-com.svg"
      ]

    for (let i = 0; i < SVGurls.length; i++)
    {
      (svgloader.load(SVGurls[i],
        function (data) {

          // When importing SVGs paths are inverted on Y axis
          // it happens in the process of mapping from 2d to 3d coordinate system
          SVGGroup.scale.y *= -1;
          SVGGroup.scale.x *= -1;

          //var title = data.find('title').text();

          //console.log(title)

          const material = new THREE.MeshNormalMaterial();

          // Loop through all of the parsed paths
          data.paths.forEach((path, i) => {
            const shapes = path.toShapes(true);

            // Each path has array of shapes
            shapes.forEach((shape, j) => {
              // Finally we can take each shape and extrude it
              const geometry = new THREE.ExtrudeGeometry(shape, {
                depth: 10,
                bevelEnabled: false,
              });


                            
              geometry.scale(0.1, 0.1, 0.1);

              geometry.translate(0, 0, Math.random());

              // Create a mesh and add it to the group
              const mesh = new THREE.Mesh(geometry, material);

              SVGGroup.add(mesh);
            });
          });
        }
      ))
    }


    /**
     * -----------------------------------------------------
     * Screen Objects
     * -----------------------------------------------------
     */
    // Define the screen rectangles
    const screenGeometry = new THREE.BoxGeometry(16, 9, 0.1);

    //PreFitness Screen
    const screenPF = new THREE.Mesh(screenGeometry, screenPFMaterial);
    screenPF.position.set(0, 5, -60);
    screenPF.userData = {
      URL: "https://nicobrown.github.io/MilestoneProject1/",
    };
    screenPF.name = "screen-pf";
    //end

    //LoveRunning Screen
    const screenLR = new THREE.Mesh(screenGeometry, screenLRMaterial);
    screenLR.position.set(120, 5, 100);
    screenLR.rotateOnAxis(new THREE.Vector3(0, 1, 0), 2);
    screenLR.userData = { URL: "https://nicobrown.github.io/LoveRunning/" };
    screenLR.name = "screen-lr";
    //end

    //Github Screen? or text location?
    //end


    //Add screens to groupmesh 
    groupMesh.add(SVGGroup);
    groupMesh.add(screenPF);
    groupMesh.add(screenLR);
    //groupMesh.visible = false;

    return groupMesh;
  }
}
