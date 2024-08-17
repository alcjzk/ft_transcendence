import * as THREE from 'three';

const TEMPLATE = document.createElement('template');
TEMPLATE.innerHTML = `
    <canvas class="confetti"><canvas>
`;

class Confetti extends HTMLElement {
    constructor() {
        super();
        this.appendChild(TEMPLATE.content.cloneNode(true));
        this.canvas = this.querySelector('canvas');
    }

    connectedCallback() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ alpha: true, canvas: this.canvas });

        this.renderer.setSize(window.innerWidth, window.innerHeight);

        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        const colors = [];

        for (let i = 0; i < 1000; i++) {
            const x = THREE.MathUtils.randFloatSpread(window.innerWidth);
            const y = THREE.MathUtils.randFloatSpread(window.innerHeight);
            const z = THREE.MathUtils.randFloatSpread(200);

            vertices.push(x, y, z);

            const color = new THREE.Color();
            color.setHSL(Math.random(), 1.0, 0.5);
            colors.push(color.r, color.g, color.b);
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({ size: 5, vertexColors: true });

        this.points = new THREE.Points(geometry, material);
        this.scene.add(this.points);
        this.camera.position.z = 500;

        this.animate = () => {
            requestAnimationFrame(this.animate);
            this.points.rotation.x += 0.005;
            this.points.rotation.y += 0.005;
            this.renderer.render(this.scene, this.camera);
        };

        this.animate();
    }

    disconnectedCallback() {
        this.renderer.dispose();
    }
}

window.customElements.define('ft-confetti', Confetti);

export default Confetti;
