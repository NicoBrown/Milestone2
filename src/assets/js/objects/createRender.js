import * as THREE from 'three';
import Experience from './experience.js';

export function createRender(sizes, canvas) {

    //this.experience = new Experience();
    //this.canvas = this.experience.canvas;
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true,
    });

    document.body.appendChild(renderer.domElement);

    renderer.setSize(sizes.width, sizes.height);
    renderer.setClearColor(0x000000, 0);
    renderer.setClearAlpha(0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    // renderer.setClearColor(0xeeeeee, 1);

    return renderer;

};