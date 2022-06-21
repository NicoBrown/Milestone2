import * as THREE from 'three'
import Experience from "./experience.js"

// Gsap
//import gsap from 'gsap'


export default class screens{
    constructor () {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.canvas = this.experience.canvas;
        this.camera = this.experience.camera;
        console.log(this);
        this.setInstance();
    }

    setInstance () {
/**
 * -----------------------------------------------------
 * Loader Textures
 * -----------------------------------------------------
 */
const textureLoaderPF = new THREE.TextureLoader().load('./assets/textures/purefitness_screenshot.png');
const textureLoaderLR = new THREE.TextureLoader().load('./assets/textures/loverunning-screenshot.jpg');


/**
 * -----------------------------------------------------
 * Materials
 * -----------------------------------------------------
 */

// Screen Materials
const screenPFMaterial = new THREE.MeshBasicMaterial({
  map: textureLoaderPF,
});

const screenLRMaterial = new THREE.MeshBasicMaterial({
    map: textureLoaderLR,
  });

/**
 * -----------------------------------------------------
 * Object
 * -----------------------------------------------------
 */


// Group Mesh
const groupMesh = new THREE.Group();
groupMesh.name = "screen-objects";

// Define the screen rectangles
const screenGeometry = new THREE.BoxGeometry(16, 9, 0.1);

//PreFitness Screen
const screenPF = new THREE.Mesh(screenGeometry, screenPFMaterial);
screenPF.position.set(0, 5, -60);
screenPF.userData = {URL: 'https://nicobrown.github.io/MilestoneProject1/'};
screenPF.name = "screen-pf";
//end PF screen

//LoveRunning Screen
const screenLR = new THREE.Mesh(screenGeometry, screenLRMaterial);
screenLR.position.set(10, 5, 100);
screenLR.userData = {URL: 'https://nicobrown.github.io/LoveRunning/'};
screenLR.name = "screen-pf";
//end love running Screen

//Github Screen? or text location?

//end GH screen

groupMesh.add(screenPF);
this.experience.scene.add(groupMesh);
}
}