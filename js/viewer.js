class FrameViewer {
	constructor() {
		this.camera = {};
		this.scene = {};
		this.renderer = {};

		this.targetRotation = 0;
		this.targetRotationOnMouseDown = 0;
		this.cameraAngle = 0.0;

		this.mouseX = 0;
		this.mouseXOnMouseDown = 0;

		this.windowHalfX = window.innerWidth / 2;

		this.matGray = {};
		this.matGreen = {};

		this.spheres = [];

		var that = this;
		document.addEventListener("DOMContentLoaded", function(e) {
			var container = document.getElementById("frame_viewer");

			that.camera = new THREE.PerspectiveCamera(70, 1.0, 1, 1000);
			that.scene = new THREE.Scene();

			that.matGray = new THREE.MeshBasicMaterial({"color": 0x888888, "wireframe": true});
			that.matGreen = new THREE.MeshBasicMaterial({"color": 0x00ff00, "wireframe": true});

			// Sphere
			for(var y=0; y < 4; ++y) {
				for(var z=0; z < 4; ++z) {
					for(var x=0; x < 4; ++x) {
						var sphere = new THREE.Mesh(new THREE.SphereGeometry(20,10,10), that.matGray);
						sphere.position.set(x * 100 - 150, (3 - y) * 100 - 150, z * 100 - 150);
						that.scene.add(sphere);
						that.spheres.push(sphere);
					}
				}
			}

			that.renderer = new THREE.CanvasRenderer();
			that.renderer.setClearColor(0xffffff);
			that.renderer.setPixelRatio(window.devicePixelRatio);
			that.renderer.setSize(400, 400);
			container.appendChild(that.renderer.domElement);

			that.update();
		}, false);
	}

	set(f) {
		for(var y=0; y < 4; ++y) {
			for(var z=0; z < 4; ++z) {
				for(var x=0; x < 4; ++x) {
					this.spheres[y * 16 + z * 4 + x].material = (f[y] & (0x0001 << (4 * z + x))) != 0 ? this.matGreen : this.matGray;
				}
			}
		}
	}

	update() {
		var that = this;
		requestAnimationFrame(function() {
			that.update();
		});

		this.targetRotation += 0.01;
		this.cameraAngle += (this.targetRotation - this.cameraAngle) * 0.05;
		this.camera.position.set(400 * -Math.sin(this.cameraAngle), 300, 400 * Math.cos(this.cameraAngle));
		this.camera.lookAt({x: 0, y: -60, z: 0});
		this.camera.updateMatrixWorld();

		this.renderer.render(this.scene, this.camera);
	}
};

var viewer = new FrameViewer();
