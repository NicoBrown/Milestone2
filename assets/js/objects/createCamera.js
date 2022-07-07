import * as THREE from "three";
import Experience from 'https://nicobrown.github.io/Milestone2/objects/experience.js'; 
       
export function createCamera(sizes) {

    // Base camera
    var camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 1000);
    //camera.position.set(0, 0, 0);
    //camera.lookAt(0, 0, 0);
    return camera;
    
}