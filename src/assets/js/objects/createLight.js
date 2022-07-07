import * as THREE from 'three';

export function createLight() {
    
    const sunLight = new THREE.DirectionalLight(0xffffff, 1);
    sunLight.castShadow = true;
    sunLight.shadow.camera.far = 50;
    sunLight.shadow.mapSize.set(1024, 1024);
    sunLight.shadow.normalBias = 0.05;
    sunLight.position.set(5, 250, 0);
    sunLight.rotation.set(0, 10, 10);

    return sunLight;
    
    //-------------HELPER-------------//

    // const sunLightHelper = new THREE.DirectionalLightHelper(sunLight, 3);
    // scene.add(sunLightHelper);
    
}