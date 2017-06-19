// var THREE = require('three');

console.log('it works!');

var scene, camera, renderer;
start();

var parentObject, line, ball, mouseMesh;
var bigLine;

function start() {
    initScene();
    initObjects();
    // addControls();
    // updateControls();
    addMouseMesh();
    animate();
}

function initScene() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    window.addEventListener('resize', onWindowResize, false);
}

function createBigGeometry() {
    let r = 250;
    var geometry = new THREE.Geometry();
    let j = 0;
    for (i = 0; i < 1500; i++) {
        var vertex1 = new THREE.Vector3();
        vertex1.x = Math.random() * 2 - 1;
        vertex1.y = Math.random() * 2 - 1;
        vertex1.z = Math.random() * 2 - 1;
        vertex1.normalize();
        vertex1.multiplyScalar(r);
        vertex2 = vertex1.clone();
        vertex2.multiplyScalar(Math.random() * 0.09 + 1);
        geometry.vertices.push(vertex1);
        geometry.vertices.push(vertex2);
    }

    for (let k = 0; k < geometry.vertices.length; k += 2) {
        geometry.colors[k] = new THREE.Color(Math.random(), Math.random(), Math.random());
        geometry.colors[k + 1] = geometry.colors[k];
    }
    geometry.colorsNeedUpdate = true;

    return geometry;
}

function morphBigGeometry() {
    let r = 150;
    // var geometry = new THREE.Geometry();
    for (i = 0; i < 1; i++) {
        var vertex1 = new THREE.Vector3();
        vertex1.x = Math.random() * 20 - 1;
        vertex1.y = Math.random() * 20 - 1;
        vertex1.z = Math.random() * 20 - 1;
        vertex1.normalize();
        vertex1.multiplyScalar(r);
        vertex2 = vertex1.clone();
        vertex2.multiplyScalar(Math.random() * 0.09 + 1);
        geometry.vertices.push(vertex1);
        geometry.vertices.push(vertex2);
    }
    return geometry;
    // bigLine.geometry.verticesNeedUpdate = true;
}

function changeGeometryValues(parameter) {
    let j = 0;
    for (let i = 0; i < bigLine.geometry.vertices.length; i++) {
        bigLine.geometry.vertices[i].x += Math.sin(Math.random() * 10 * 10 * parameter);
        bigLine.geometry.vertices[i].y += Math.cos(Math.random() * 10 * 10 * parameter);
        bigLine.geometry.vertices[i].z += Math.sin(Math.random() * 5 * 0.01 * parameter);

        bigLine.geometry.colors[j] = new THREE.Color(Math.random(), Math.random(), Math.random());
        bigLine.geometry.colors[j + 1] = bigLine.geometry.colors[j];
        j += 2;
    }

    // bigLine.updateMatrix();
    bigLine.geometry.verticesNeedUpdate = true;
    // bigLine.geometry.colorsNeedUpdate = true;
}

function initObjects() {
    var sphereGeometry = new THREE.SphereGeometry(30, 35, 35);
    var cubeGeometry = new THREE.BoxGeometry(1, 1, 1);

    var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

    var linesMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff,
        vertexColors: THREE.VertexColors
    });

    var linesGeometry = new THREE.Geometry();
    linesGeometry.vertices.push(
        new THREE.Vector3(10, 0, 0),
        new THREE.Vector3(0, 10, 0)
    );

    let bigGeometry = createBigGeometry();

    bigLine = new THREE.LineSegments(bigGeometry, linesMaterial);
    scene.add(bigLine);

    parentObject = new THREE.Object3D();

    let numRows = 10;
    let numCols = 10;
    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            console.log('lol');
            var childLine = new THREE.Line(linesGeometry, linesMaterial);
            childLine.position.x = j * 10;
            childLine.position.y = i * 10;
            parentObject.add(childLine);
        }
    }

    if (true) {
        console.log('setting bounding box..');
        bb = new THREE.Box3();
        bb.setFromObject(bigLine);

        var xCoord = (bb.max.x + bb.min.x) / 2;
        var yCoord = (bb.max.y + bb.min.y) / 2;
        var zCoord = (bb.max.z + bb.min.z) / 2;

        camera.position.x = xCoord;
        camera.position.y = yCoord;

        // camera.lookAt(xCoord, yCoord, 0);
    }

    console.log('x coordinate of the bounding box: ' + xCoord);
    console.log('y coordinate of the bounding box: ' + yCoord);

    // scene.add(parentObject);

    camera.position.z = 1200;
}

var controls;
function addControls() {
    // add controls to the screen
    let container = document.getElementById("container");

    controls = new THREE.OrbitControls(camera, container);
    controls.rotateSpeed = 5.0;
    controls.zoomSpeed = 1.2;

    controls.panSpeed = 0.8;
    controls.noZoom = false;
    controls.noPan = false;
    controls.staticMoving = false;

    controls.dynamicDampingFactor = 0.5;
    controls.keys = [65, 83, 68];
    controls.addEventListener('change', render);

    //controls.target = new THREE.Vector3(camera.position.x, camera.position.y, 0);
}

function updateControls() {
    console.log("first time: " + firstTime);
    if (firstTime) {
        controls.target = new THREE.Vector3(camera.position.x, camera.position.y, 0);
        firstTime = false;
    }
}

function addMouseMesh() {
    // Create a circle around the mouse and move it
    // The sphere has opacity 0
    var mouseGeometry = new THREE.SphereGeometry(10, 0, 0);
    var mouseMaterial = new THREE.MeshBasicMaterial({
        color: 0x0000ff
    });
    mouseMesh = new THREE.Mesh(mouseGeometry, mouseMaterial);
    mouseMesh.position.z = -5;
    scene.add(mouseMesh);
}

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
        mousePosition3d.z = 500;

        mouseMesh.position.copy(mousePosition3d);

        bigLine.lookAt(mousePosition3d);
        // for (var i = 0; i < num_points; i++) {
        //     parentEye.children[i].lookAt(mousePosition3d);
        // }
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    render();
    // stats.update();
    // controls.update();
}

function render() {
    bigLine.rotation.y += 0.001;
    let time = performance.now() * 0.0001;

    if (true) {
        changeGeometryValues(time);
    }
    renderer.render(scene, camera);
};