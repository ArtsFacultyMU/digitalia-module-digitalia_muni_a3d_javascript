import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { PLYLoader } from 'three/addons/loaders/PLYLoader.js';

const WIDTH = 640;
const HEIGHT = 640;

const render_parents = document.querySelectorAll(".models .views-col");

for (let i = 0; i < render_parents.length; ++i) {
	init(render_parents[i]);
}

function init(element) {
	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera( 50, element.clientWidth / HEIGHT, 0.0001, 2 );
	const renderer = new THREE.WebGLRenderer();
	const download_element = element.querySelector("a.model-3d-link");
	const file_location = download_element.getAttribute("href");
	let bb = new THREE.Box3();

	scene.background = new THREE.Color( 0xfafafa );

	const light = new THREE.AmbientLight( 0x404040, 10 );
	scene.add( light );

	const controls = new OrbitControls( camera, renderer.domElement );

	//const loader = new GLTFLoader();
	const loader = new PLYLoader()
	loader.load( file_location, async function ( ply ) {
		ply.computeVertexNormals();
		//const material = new THREE.MeshStandardMaterial( { color: 0xeeeeee, flatShading: true } );
		const material = new THREE.MeshMatcapMaterial( {color: 0xeeeeee });
		//const material = new THREE.MeshPhysicalMaterial( {color: 0xEEEEEE });
		const mesh = new THREE.Mesh( ply, material );
		await renderer.compileAsync( mesh, camera, scene );

		// center camera on object
		mesh.geometry.computeBoundingBox();
		//console.log(mesh.geometry.boundingBox);
		mesh.geometry.boundingBox.getCenter(controls.target);
		controls.update();

		//model.traverse( ( mesh ) => {
		//	mesh.material = new THREE.MeshMatcapMaterial( {color: 0xEEEEEE });
		//} );

		scene.add( mesh );

		render(renderer, scene, camera);
	} );
	
	controls.addEventListener( 'change', render.bind(this, renderer, scene, camera), false );
	controls.mouseButtons = {
		LEFT: THREE.MOUSE.ROTATE,
		MIDDLE: THREE.MOUSE.PAN,
		RIGHT: THREE.MOUSE.ROTATE,
	}

	//camera.position.z = 0.125;

	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( element.clientWidth, HEIGHT );
	renderer.gammaOutput = true;
	download_element.parentNode.insertBefore( renderer.domElement, download_element );


	controls.update();

	window.addEventListener( 'resize', onWindowResize.bind(this, renderer, scene, camera), false );
}

function onWindowResize(renderer, scene, camera) {
	//camera.aspect = window.innerWidth / window.innerHeight;
	camera.aspect = renderer.domElement.parentNode.clientWidth / HEIGHT;
	camera.updateProjectionMatrix();

	//renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.setSize( renderer.domElement.parentNode.clientWidth, HEIGHT);

	render(renderer, scene, camera);
}

function render(renderer, scene, camera) {
	renderer.render( scene, camera );
}
