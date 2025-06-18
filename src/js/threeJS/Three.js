import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// import Stats from 'stats.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { HDRJPGLoader } from '@monogrid/gainmap-js'

function Electrosudno() {
    /**
     * Models
     */
    //* Обьект для хранения параметров мешей модели
    //* Update all materials
    const updateAllMaterials = () =>
    {
        scene.traverse((child) =>
        {
            if(child.isMesh && child.material.isMeshStandardMaterial)
            {
                // console.log(child);
                if (child.name === 'Boat') {
                    child.material.depthWrite = true;
                }
                
                child.castShadow = false;
                child.receiveShadow = false;
                child.matrixAutoUpdate = false;
                child.matrixWorldAutoUpdate = false;
                child.matrixWorldNeedsUpdate = false;
            }
        })
    }

    let dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('/draco/')
    let gltfLoader = new GLTFLoader()
    gltfLoader.setDRACOLoader(dracoLoader)

    // ./models/sinichka/scene/S2.gltf

    gltfLoader.load("./models/sinichka/scene/S2.gltf", (gltf) => {
        console.log(gltf);
        let current_object = gltf.scene;

        current_object.position.x = 0;
        current_object.position.y = -2.5;
        current_object.position.z = 0;
        current_object.scale.set(12, 12, 12);

        scene.add(current_object);

        updateAllMaterials()
        console.log(renderer.info)
    });

    // Canvas
    const canvas = document.querySelector('canvas#webgl')

    // Scene
    const scene = new THREE.Scene()

    /**
     * Sizes
     */
    const sizes = {
        width: window.innerWidth,
        height: window.innerHeight
    }

    window.addEventListener('resize', () =>
    {
        // Update sizes
        sizes.width = window.innerWidth
        sizes.height = window.innerHeight

        // Update camera
        camera.aspect = sizes.width / sizes.height
        camera.updateProjectionMatrix()

        // Update renderer
        renderer.setSize(sizes.width, sizes.height)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    })

    let cameraPosX;
    let cameraPosY = 1.5;
    let cameraPosZ = 0;
    let maxDistanceOrbit;
    let enableZoomOrbit;

    if (window.innerWidth <= 375) {
        cameraPosX = 10;
        maxDistanceOrbit = 11;
        enableZoomOrbit = true;
    } else if (window.innerWidth > 375 && window.innerWidth <= 480) {
        cameraPosX = 11;
        maxDistanceOrbit = 12;
        enableZoomOrbit = true;
    } else if (window.innerWidth > 480 && window.innerWidth <= 700) {
        cameraPosX = 10;
        maxDistanceOrbit = 11;
        enableZoomOrbit = true;
    } else if (window.innerWidth > 700 && window.innerWidth <= 960) {
        cameraPosX = 9;
        maxDistanceOrbit = 10;
        enableZoomOrbit = true;
    } else if (window.innerWidth > 960 && window.innerWidth <= 1200) {
        cameraPosX = 7;
        maxDistanceOrbit = 8;
        enableZoomOrbit = true;
    }  else {
        cameraPosX = 5.5;
        maxDistanceOrbit = 5.5;
        enableZoomOrbit = false;
    }

    /**
     * Camera
     */
    // Base camera
    const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
    camera.position.set(cameraPosX, cameraPosY, cameraPosZ)
    scene.add(camera)

    // Controls
    const controls = new OrbitControls(camera, canvas)
    controls.target.set(0, 0.75, 0)
    controls.maxPolarAngle = Math.PI * 0.5;
    controls.maxDistance = maxDistanceOrbit;
    controls.minDistance = 3.5;
    controls.enableDamping = true
    controls.enableZoom = enableZoomOrbit;
    //* Отключение перетаскивания
    controls.enablePan = false

    /**
     * Renderer
     */
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        // alpha: true,
        powerPreference: 'high-performance',
        precision: 'lowp'
    })
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor( 0x000000, 0 );
    renderer.shadowMap.autoUpdate = false;

    let hdrJpgEquirectangularMap
    let hdrJpg = new HDRJPGLoader(renderer).load( './images/environmentMaps/dok_kater.jpg', () => {

        hdrJpgEquirectangularMap = hdrJpg.renderTarget.texture;

        hdrJpgEquirectangularMap.mapping = THREE.EquirectangularReflectionMapping;
        hdrJpgEquirectangularMap.needsUpdate = true;

        scene.environment = hdrJpgEquirectangularMap;
    });

    //! Tone mapping
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;

    const tick = () =>
    {
        // stats.begin()

        // Update controls
        controls.update()

        // Render
        renderer.render(scene, camera)

        // Call tick again on the next frame
        window.requestAnimationFrame(tick)

        // stats.end()
    }

    tick()
    //! 1. Информация о рендере
    // console.log(renderer.info)
}

export default Electrosudno;