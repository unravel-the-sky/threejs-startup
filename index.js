// var THREE = require('three');

console.log('it works!');

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
document.addEventListener('mousemove', onDocumentMouseMove, false);

var sphereGeometry = new THREE.SphereGeometry(30, 35, 35);
var cubeGeometry = new THREE.BoxGeometry(1, 1, 1);

var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

var linesMaterial = new THREE.LineBasicMaterial({
    color: 0x0000ff
});

var linesGeometry = new THREE.Geometry();
linesGeometry.vertices.push(
    new THREE.Vector3(-10, 0, 0),
    new THREE.Vector3(0, 10, 0),
    new THREE.Vector3(10, 0, 0)
);

var line = new THREE.Line(linesGeometry, linesMaterial);
scene.add(line);

var mousePosition3d;

function onDocumentMouseMove(event) {
    //NEW STUFF - getting mouse coordinates as threejs world coordinates
    var vector = new THREE.Vector3();
    vector.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1,
        0.5);

    vector.unproject(camera);

    if (true) {
        var dir = vector.sub(camera.position).normalize();
        var distance = -camera.position.z / dir.z;

        mousePosition3d = camera.position.clone().add(dir.multiplyScalar(distance));
        mousePosition3d.z = 50;

        // mouseMesh.position.copy(mousePosition3d)

        line.lookAt(mousePosition3d);
        // for (var i = 0; i < num_points; i++) {
        //     parentEye.children[i].lookAt(mousePosition3d);
        // }
    }
}

camera.position.z = 150;

var render = () => {
    requestAnimationFrame(render);

    // line.rotation.x += 0.01;

    renderer.render(scene, camera);
};

render();