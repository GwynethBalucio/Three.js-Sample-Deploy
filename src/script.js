import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import typefacefont from 'three/examples/fonts/helvetiker_regular.typeface.json'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'


/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Environment Map
const rgbeLoader = new RGBELoader()
rgbeLoader.load('./textures/environmentMaps/HDR_multi_nebulae.hdr', (environmentMap) => {
    environmentMap.mapping = THREE.EquirectangularReflectionMapping

    scene.background = environmentMap
    scene.environment = environmentMap
})

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('/textures/matcaps/5.png')
matcapTexture.colorSpace = THREE.SRGBColorSpace
const material = new THREE.MeshMatcapMaterial({matcap: matcapTexture})
// const material = new THREE.MeshNormalMaterial()

// Fonts
const fontLoader = new FontLoader()

fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) => {
        const textGeometry = new TextGeometry(
            'Hello Three.js',
            {
                font: font,
                size: 0.5,
                depth: 0.2, 
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 5
            }
        )
        // // Manually centering textGeometry using boundings and frustum culling
        // textGeometry.computeBoundingBox()
        // textGeometry.translate(
        //     - (textGeometry.boundingBox.max.x - 0.02) * 0.5,
        //     - (textGeometry.boundingBox.max.y - 0.02) * 0.5,
        //     - (textGeometry.boundingBox.max.z - 0.03) * 0.5
        // )

        // center textGeometry with function
        textGeometry.center()
        
        const text = new THREE.Mesh(textGeometry, material)
        scene.add(text)
    }
)


/**
 * Objects
 */
// const cube = new THREE.Mesh(
//     new THREE.BoxGeometry(1, 1, 1),
//     new THREE.MeshBasicMaterial()
// )

// scene.add(cube)


// const donutMaterial = new THREE.MeshNormalMaterial({wireframe: true})
let donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)

for(let i=0; i<100; i++) {
    

    if (i%3==0) {
        donutGeometry = new THREE.BoxGeometry(1, 1)
    } else if (i%5==0) {
        donutGeometry = new THREE.SphereGeometry(0.5, 32, 32)
    } else if (i%7==0) {
        donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)
    }

    const donut = new THREE.Mesh(donutGeometry, material)

    // randomize position of donuts
    donut.position.x = (Math.random() - 0.55) * 25
    donut.position.y = (Math.random() - 0.55) * 25
    donut.position.z = (Math.random() - 0.55) * 25

    // randomize rotation of donuts
    donut.rotation.x = Math.random() * Math.PI
    donut.rotation.y = Math.random() * Math.PI

    // random scale for donut
    const scale = Math.random()
    donut.scale.set(scale,scale,scale)

    // add to scene
    scene.add(donut) 
}


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

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    for(let i=0; i<scene.children.length - 1; i++) {
        
        if (scene.children[i].type != 'TextGeometry' && scene.children[i].type != 'SphereGeometry') {
            scene.children[i].rotation.x = 0.15 * elapsedTime 
            scene.children[i].rotation.y = 0.1 * elapsedTime 
        }
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()