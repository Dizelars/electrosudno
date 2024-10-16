import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
// import Stats from 'stats.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { HDRJPGLoader } from '@monogrid/gainmap-js'
// import { GroundedSkybox } from 'three/addons/objects/GroundedSkybox.js'
// import {InteriorTransitionHelper} from "../helpers/interiorTransitionHelper.js";

function Electrosudno() {
    // Менеджер загрузки
    // Переключение между сценами
    // Логика типонов

    /**
     * Base
     */
    // Debug
    const gui = new GUI({
        title: 'Контроллер',
        width: 350,
        closeFolders: true
    })
    gui.close()
    gui.hide();

    window.addEventListener('keypress', (event) => {
        if(event.key === 'h') {
            gui.show(gui._hidden)
        }
    })

    // Создаем папки дебагера
    // const hdriFolder = gui.addFolder('Карта окружения');
    const toneMapping = gui.addFolder('Тоновое отображение')
    // const cameraSettings = gui.addFolder('Настройки камеры')
    // const PointFolder = gui.addFolder('Типоны');
    // const One = PointFolder.addFolder('Типон 1');
    // const Two = PointFolder.addFolder('Типон 2');
    // const Three = PointFolder.addFolder('Типон 3');
    // const ModelFolder = gui.addFolder('Модель');
    // const modelPosition = ModelFolder.addFolder('Позиция');
    // const positionFolder = modelPosition.addFolder('position');
    // const rotationFolder = modelPosition.addFolder('rotation');
    // const scaleFolder = modelPosition.addFolder('scale');

    //! Monitor FPS
    // const stats = new Stats()
    // stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
    // document.body.appendChild(stats.dom)

    // Обьект параметров
    // let constants = {
    //     colorFloor: '#a1a1a1',
    //     height: 1.8,
    //     radius: 7.5,
    //     resolution: 16
    // }

    /**
     * Loading Менеджер загрузки
     */
    // let sceneReady = false

    // const loadingManager = new THREE.LoadingManager();

    // const progressBar = document.getElementById('progress-bar');
    // const progressLabel = document.getElementById('progress-label');
    // loadingManager.onProgress = function(url, loaded, total) {
    //     const progressPercent = Math.round((loaded / total) * 100);
    //     progressBar.style.width = `${progressPercent}%`;
    //     progressLabel.textContent = `${progressPercent}%`;
    // }

    // // 3) onLoad - Запись по завершению загрузки.
    // const progressBarContainer = document.querySelector('.progress-bar');
    // loadingManager.onLoad = function() {
    //     progressBarContainer.style.display = 'none';
    //     sceneReady = true;
    //     raycasterTipons()
    //     positionTipons()
    // }


    /**
     * Models
     */
    //* Обьект для хранения параметров мешей модели
    // const global = {}
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

        // positionFolder.add(current_object.position, 'x', -9, 9, 0.01).name('position X')
        // positionFolder.add(current_object.position, 'y', -9, 9, 0.01).name('position Y')
        // positionFolder.add(current_object.position, 'z', -9, 9, 0.01).name('position Z')
        // rotationFolder.add(current_object.rotation, 'x', -9, 9, 0.01).name('rotation X')
        // rotationFolder.add(current_object.rotation, 'y', -9, 9, 0.01).name('rotation Y')
        // rotationFolder.add(current_object.rotation, 'z', -9, 9, 0.01).name('rotation Z')

        scene.add(current_object);

        updateAllMaterials()
        console.log(renderer.info)
    });


    /**
     * Pounts on model
     */
    // const points = [
    //     {
    //         position: new THREE.Vector3(0.96, 0.8, - 0.58),
    //         element: document.querySelector('.point-0')
    //     },
    //     {
    //         position: new THREE.Vector3(0.04, 0.76, 2.4),
    //         element: document.querySelector('.point-1')
    //     },
    //     {
    //         position: new THREE.Vector3(0, 0.86, - 2.26),
    //         element: document.querySelector('.point-2')
    //     }
    // ]

    // One.add(points[0].position,'x',-9,9,0.01)
    // One.add(points[0].position,'y',-9,9,0.01)
    // One.add(points[0].position,'z',-9,9,0.01)

    // Two.add(points[1].position,'x',-9,9,0.01)
    // Two.add(points[1].position,'y',-9,9,0.01)
    // Two.add(points[1].position,'z',-9,9,0.01)

    // Three.add(points[2].position,'x',-9,9,0.01)
    // Three.add(points[2].position,'y',-9,9,0.01)
    // Three.add(points[2].position,'z',-9,9,0.01)

    /**
     * Raycaster
     */
    // const raycaster = new THREE.Raycaster()

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

    // Логика типонов
    // controls.addEventListener('change', () => {
    //     positionTipons();
    // });

    // controls.addEventListener('end', () => {
    //     // raycasterTipons();
    //     console.log(camera.position);
    // });

    // function raycasterTipons() {
    //     if (sceneReady) {
    //         for(const point of points) {
    //             const screenPosition = point.position.clone()
    //             screenPosition.project(camera)

    //             raycaster.setFromCamera(screenPosition, camera)
    //             const intersects = raycaster.intersectObjects(scene.children, true)

    //             if (intersects.length === 0) {
    //                 point.element.classList.add('visible')
    //             }
    //             else {
    //                 const intersectionDistance = intersects[0].distance
    //                 const pointDistance = point.position.distanceTo(camera.position)
    //                 if (intersectionDistance < pointDistance) {
    //                     point.element.classList.remove('visible')
    //                 }
    //                 else {
    //                     point.element.classList.add('visible')
    //                 }
    //             }
    //         }
    //     }
    // }

    // function positionTipons() {
    //     if (sceneReady) {
    //         for(const point of points) {
    //             const screenPosition = point.position.clone()
    //             screenPosition.project(camera)

    //             const translateX = screenPosition.x * sizes.width * 0.5
    //             const translateY = - screenPosition.y * sizes.height * 0.5
    //             point.element.style.transform = `translate(${translateX}px, ${translateY}px)`
    //         }
    //     }
    // }

    // controls.update();

    /**
     * Point click
     */
    // const pointsOnModel = document.querySelectorAll('.point')

    // pointsOnModel.forEach((point) => {
    //     point.addEventListener('click', () => {
    //         point.classList.toggle('show')

    //         // Проверка наличия класса 'show' у остальных точек
    //         pointsOnModel.forEach((otherPoint) => {
    //             if (otherPoint !== point) {
    //                 if (otherPoint.classList.contains('show')) {
    //                     otherPoint.classList.remove('show')
    //                 }
    //             }
    //         })
    //     })
    // })


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

    // ./images/environmentMaps/skylit_garage_4k.jpg
    // ./images/environmentMaps/garage.jpg
    // ./images/environmentMaps/dok_kater.jpg

    let hdrJpgEquirectangularMap
    let hdrJpg = new HDRJPGLoader(renderer).load( './images/environmentMaps/dok_kater.jpg', () => {

        hdrJpgEquirectangularMap = hdrJpg.renderTarget.texture;

        hdrJpgEquirectangularMap.mapping = THREE.EquirectangularReflectionMapping;
        hdrJpgEquirectangularMap.needsUpdate = true;

        scene.environment = hdrJpgEquirectangularMap;
    });

    //! Tone mapping
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    toneMapping.add(renderer, 'toneMapping', {
        No: THREE.NoToneMapping,
        Linear: THREE.LinearToneMapping,
        Reinhard: THREE.ReinhardToneMapping,
        Cineon: THREE.CineonToneMapping,
        ACESFilmic: THREE.ACESFilmicToneMapping
    })

    renderer.toneMappingExposure = 1
    toneMapping.add(renderer, 'toneMappingExposure').min(0).max(10).step(0.001)


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