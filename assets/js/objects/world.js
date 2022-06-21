import * as THREE from 'three'
import * as screens from "./screens.js"
import Experience from "./experience.js"



export default class world{
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.setSceneModel();
        console.log(this);

        // this.on("ready", () => {
        //     this.setSceneModel();
            
        // })
    }

    setSceneModel(){
/**
 * -----------------------------------------------------
 * Loader Textures
 * -----------------------------------------------------
 */

/**
 * -----------------------------------------------------
 * Materials
 * -----------------------------------------------------
 */
// Simple Shaders Material
// const shaderMaterial = new THREE.ShaderMaterial({
//     vertexShader: SimpleVertexShader,
//     fragmentShader: SimpleFragmentShader,
// });

//Road Materials
var roadMaterial = new THREE.MeshLambertMaterial( { color: 0xAEAEAE, wireframe: false } );

/**
 * -----------------------------------------------------
 * Object
 * -----------------------------------------------------
 */


    // Group Mesh
    const groupMesh = new THREE.Group();
    groupMesh.name = "world-object";

    // Define the curve for the road
    var closedSpline = new THREE.CatmullRomCurve3( [
        new THREE.Vector3(289.76843686945404, 0, 56.10018915737797),
            new THREE.Vector3(-53.56300074753207, 0, -248.12233847921289),
            new THREE.Vector3(-211.3956202065645, 0, -268.3388617817887),
            new THREE.Vector3(-383.785318791128, 0, 47.869296953772746),
            new THREE.Vector3(-155.19539306638188, 0, 760.056126706788),
            new THREE.Vector3(319.93363195682286, 0, 544.2194726126658),
            new THREE.Vector3(289.87938185137807, 0, 326.31394394520044),
            new THREE.Vector3(289.97667752298884, 0, 52.87991840985492)
    ] );

    closedSpline.type = 'catmullrom';
    closedSpline.closed = true;

    // Set up settings for later extrusion
    var extrudeSettings = {
        steps           : 200,
        bevelEnabled: true,
        bevelThickness: 1,
        bevelSize: 1,
        bevelOffset: 1,
        bevelSegments: 1,
        extrudeMaterial: 1,
        extrudePath     : closedSpline,
        depth           : 100
    };

    // Define a line
    var pts = [1,20,], count = 2;
    for ( var i = 0; i < count; i ++ ) {
        pts.push( new THREE.Vector2 ( i, i * 20 ));
    }
    var shape = new THREE.Shape( pts );

    // Extrude the triangle along the CatmullRom curve
    var roadGeoExtruded = new THREE.ExtrudeGeometry( shape, extrudeSettings );

    // Create mesh with the resulting geometry
    var roadMesh = new THREE.Mesh( roadGeoExtruded, roadMaterial );
    roadMesh.scale.set(0.5,0.5,0.5);

    groupMesh.add(roadMesh);
    this.experience.scene.add(groupMesh);


    }
}
