import * as THREE from "three";
       
export function createCamera(sizes) {

    // Base camera
    var camera = new THREE.PerspectiveCamera(50, sizes.width / sizes.height, 0.1, 2000);
    camera.position.set(0, 18, -7);
    camera.lookAt(0, 18, -7);
    return camera;
    
}