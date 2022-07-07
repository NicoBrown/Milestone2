import * as THREE from 'three';
import { OrbitControls } from 'https://unpkg.com/three/examples/jsm/controls/OrbitControls.js';
import { TransformControls, TransformControlsGizmo, TransformControlsPlane } from 'https://unpkg.com/three/examples/jsm/controls/TransformControls.js';
import Experience from './experience.js';

export function createControls(type, camera, canvas) {

    //this.experience = new Experience();
    var controls = null; //this.experience.controls;

    if (type === "orbit")
    {
        // standard orbit controls for page navigation
        controls = new OrbitControls(camera, canvas);
        controls.enableDamping = true;
        controls.dampingFactor = 0.001;
        controls.minDistance = 0;
        controls.enablePan = true;
        controls.maxDistance = 100;
        controls.maxPolarAngle = 1.63;
        controls.minPolarAngle = 1.53;
        controls.minAzimuthAngle = 3.07;
        controls.maxAzimuthAngle = -3.07;
        controls.enableZoom = false;
    }

    else if (type === "free")
    {
        // free controls to view scene
        controls = new OrbitControls(camera, canvas);
        controls.enableDamping = false;
        controls.minDistance = 0;
        controls.enablePan = true;

        controls.enabled = false;
    }

    else if (type == "transform")
    {
        // transform controls for debugging
        controls = new TransformControls(camera, canvas);
        //controls.addEventListener('change', render);
        controls.setTranslationSnap(1);
        controls.size = 0.2;
        controls.addEventListener( 'dragging-changed', function ( event ) {
        controls.enabled = !event.value;
        });

    }
            
    return controls;

}