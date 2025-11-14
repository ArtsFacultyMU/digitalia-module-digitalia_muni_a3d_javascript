import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { PLYLoader } from 'three/addons/loaders/PLYLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

const WIDTH = 640;
const HEIGHT = 640;
const SUPPORTED_FORMATS = ["obj", "ply"]

const render_parents = document.querySelectorAll(".models .views-col");

let extension;
let ondemand_button;
for (let i = 0; i < render_parents.length; ++i) {
  extension = render_parents[i].querySelector("a.model-3d-link").getAttribute("href").split(".").pop();
  ondemand_button = render_parents[i].querySelector(".ondemand-render");

  if ( SUPPORTED_FORMATS.includes(extension) ) {
    ondemand_button.addEventListener("click", function() {
      ondemand_button.classList.remove("button");
      ondemand_button.classList.add("hidden");
      init(render_parents[i]);
    } ); 
    ondemand_button.classList.add("button");
  } else {
    ondemand_button.classList.remove("button");
    ondemand_button.classList.add("hidden");
  }

}

function init(element) {
	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera( 50, element.clientWidth / HEIGHT, 0.0001, 500 );
	const renderer = new THREE.WebGLRenderer();
	const download_element = element.querySelector("a.model-3d-link");
	const file_location = download_element.getAttribute("href");
  const extension = file_location.split(".").pop();

  let loader;

  switch(extension) {
    case "obj":
      loader = new OBJLoader();
      break;
    case "ply":
      loader = new PLYLoader();
      break;
    default:
      return;
  }


	const light = new THREE.AmbientLight( 0x404040, 10 );
	scene.add( light );
	scene.background = new THREE.Color( 0xfafafa );

	const controls = new OrbitControls( camera, renderer.domElement );

	loader.load( file_location, async function ( model ) {
		const material = new THREE.MeshMatcapMaterial( {color: 0xeeeeee });
    let mesh;
    console.log(model);

    if (extension == "ply") {
		  model.computeVertexNormals();
		  mesh = new THREE.Mesh( model, material );
    }

    if (extension == "obj") {
      mesh = model.getObjectByProperty("type", "Mesh");
      mesh.material = material;
    }

		// center camera on object
		mesh.geometry.computeBoundingBox();
		//console.log(mesh.geometry.boundingBox);
		mesh.geometry.boundingBox.getCenter(controls.target);
		controls.update();

		scene.add( mesh );
		render(renderer, scene, camera);
	} );
	
	controls.addEventListener( 'change', render.bind(this, renderer, scene, camera), false );
	controls.mouseButtons = {
		LEFT: THREE.MOUSE.ROTATE,
		MIDDLE: THREE.MOUSE.PAN,
		RIGHT: THREE.MOUSE.ROTATE,
	}

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
