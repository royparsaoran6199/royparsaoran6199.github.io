var pacman = null;
var UP = new THREE.Vector3(0, 0, 1);
var LEFT = new THREE.Vector3(-1, 0, 0);
var TOP = new THREE.Vector3(0, 1, 0);
var RIGHT = new THREE.Vector3(1, 0, 0);
var BOTTOM = new THREE.Vector3(0, -1, 0);
var camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.5, 1000);
var textureSun = new THREE.TextureLoader().load('textures/matahari.jpg');
var textureMerku = new THREE.TextureLoader().load('textures/merkurius.jpg');
var textureVenus = new THREE.TextureLoader().load('textures/venus.jpg');
var textureBumi = new THREE.TextureLoader().load('textures/bumi.jpg');
var textureMars = new THREE.TextureLoader().load('textures/mars.jpg');
var textureJupiter = new THREE.TextureLoader().load('textures/jupiter.jpg');
var textureSatur = new THREE.TextureLoader().load('textures/saturnus.jpg');
var textureCincin = new THREE.TextureLoader().load('textures/cincin.jpg');
var sun = null;
var merku = null;
var venus = null;
var mars = null;
var jupiter = null;
var saturnus = null;
var earth = null;
var FpivotBumi = null;
var FpivotJupiter = null;
var FpivotMars = null;
var FpivotMerku = null;
var FpivotSaturnus = null;
var FpivotVenus = null;
var listener = new THREE.AudioListener();
camera.add(listener);
var sound = new THREE.Audio(listener);
var lives = 3;

var audioLoader = new THREE.AudioLoader();
audioLoader.load('sounds/pacman_beginning.mp3', function(buffer) {
    sound.setBuffer(buffer);
    sound.setLoop(false);
    sound.setVolume(0.5);
    sound.play();
});
var ghost;
var remove = [];
var numGhosts = 0;
var renderer = new THREE.WebGLRenderer();
var MAP_LEVEL1 = [
    '# # # # # # # # # # # # # # # # # # # # # # # # # # # #',
    '# o . . . . . . . . . . . # # . . . . . . . . . . . o #',
    '# . # # # # . # # # # # . # # . # # # # # . # # # # . #',
    '# . #     # . #       # . # # . #       # . #     # . #',
    '# . # # # # . # # # # # . # # . # # # # # . # # # # . #',
    '# . . . . . . . . . . . . . . . . . . . . . . . . . . #',
    '# . # # # # . # # . # # # # # # # # . # # . # # # # . #',
    '# . # # # # . # # . # # # # # # # # . # # . # # # # . #',
    '# . . . . . . # # . . . . # # . . . . # # . . . . . . #',
    '# . # # # # . # # # # #   # #   # # # # # . # # # # . #',
    '# . #     # . # # # # #   # #   # # # # # . #     # . #',
    '# . #     # . # #         G           # # . #     # . #',
    '# . #     # . # #   # # # # # # # #   # # . #     # . #',
    '# . # # # # . # #   #             #   # # . # # # # . #',
    '# . . . . . .       #             #       . . . . . . #',
    '# . # # # # . # #   #             #   # # . # # # # . #',
    '# . #     # . # #   # # # # # # # #   # # . #     # . #',
    '# . #     # . # #           C         # # . #     # . #',
    '# . #     # . # #   # # # # # # # #   # # . #     # . #',
    '# . # # # # . # #   # # # # # # # #   # # . # # # # . #',
    '# . . . . . . . . . . . . # # . . . . . . . . . . . . #',
    '# . # # # # . # # # # # . # # . # # # # # . # # # # . #',
    '# . # # # # . # # # # # . # # . # # # # # . # # # # . #',
    '# . . . # # . . . . . . . P T . . . . . . . # # . . . #',
    '# # # . # # . # # . # # # # # # # # . # # . # # . # # #',
    '# # # . # # . # # . # # # # # # # # . # # . # # . # # #',
    '# . . . . . . # # . . . . # # . . . . # # . . . . . . #',
    '# . # # # # # # # # # # . # # . # # # # # # # # # # . #',
    '# . # # # # # # # # # # . # # . # # # # # # # # # # . #',
    '# o . . . . . . . . . . . . . . . . . . . . . . . . o #',
    '# # # # # # # # # # # # # # # # # # # # # # # # # # # #'
];


var createMap = function(scene, levelMap) {
    var map = {};
    map.bottom = -(levelMap.length - 1);
    map.top = 0;
    map.left = 0;
    map.right = 0;
    map.numDots = 0;
    map.ghostSpawn = null;

    var x, y;
    for (var row = 0; row < levelMap.length; row++) {
        y = -row;
        map[y] = {};
        var length = Math.floor(levelMap[row].length / 2);
        map.right = Math.max(map.right, length);

        for (var column = 0; column < levelMap[row].length; column += 2) {
            x = Math.floor(column / 2);

            var cell = levelMap[row][column];
            var object = null;
            var objectT = null;
            var objectC = null;

            if (cell === '#') {
                object = createWall();
            } else if (cell === '.') {
                object = createDots();
                map.numDots += 1;
            } else if (cell === 'o') {
                object = createCherry();
            } else if (cell === 'P') {
                object = createPacman();
                pacman = object;
            } else if (cell === 'G') {
                map.ghostSpawn = new THREE.Vector3(x, y, 0);
            } else if (cell === 'T') {
                objectT = createTerrain();
            } else if (cell === 'C') {
                objectC = createSun();
                objectC.position.set(x, y, 10);
                map[y][x] = objectC;
                scene.add(objectC);
                sun = objectC;
                objectC = createMerku();
                objectC.position.set(x, y - 3, 10);
                map[y][x] = objectC;
                scene.add(objectC);
                merku = objectC;

                objectC = createVenus();
                objectC.position.set(x, y - 4, 10);
                map[y][x] = objectC;
                scene.add(objectC);
                venus = objectC;

                objectC = createEarth();
                objectC.position.set(x, y - 5, 10);
                map[y][x] = objectC;
                scene.add(objectC);
                earth = objectC;

                objectC = createMars();
                objectC.position.set(x, y - 6, 10);
                map[y][x] = objectC;
                scene.add(objectC);
                mars = objectC;

                objectC = createJupiter();
                objectC.position.set(x, y - 7, 10);
                map[y][x] = objectC;
                scene.add(objectC);
                jupiter = objectC;

                objectC = createSaturnus();
                objectC.position.set(x, y - 9, 10);
                map[y][x] = objectC;
                scene.add(objectC);
                saturnus = objectC;

                var pivotMerku = new THREE.Group();
                var pivotVenus = new THREE.Group();
                var pivotBumi = new THREE.Group();
                var pivotMars = new THREE.Group();
                var pivotJupiter = new THREE.Group();
                var pivotSaturnus = new THREE.Group();
                pivotMerku.position.z = 10
                pivotVenus.position.z = 10
                pivotBumi.position.z = 10
                pivotMars.position.z = 10
                pivotJupiter.position.z = 10
                pivotSaturnus.position.z = 10
                scene.add(pivotMerku);
                scene.add(pivotVenus);
                scene.add(pivotBumi);
                scene.add(pivotMars);
                scene.add(pivotJupiter);
                scene.add(pivotSaturnus);
                pivotMerku.add(merku);
                pivotVenus.add(venus);
                pivotBumi.add(earth);
                pivotMars.add(mars);
                pivotJupiter.add(jupiter);
                pivotSaturnus.add(saturnus);
                FpivotBumi = pivotBumi;
                FpivotJupiter = pivotJupiter;
                FpivotMars = pivotMars;
                FpivotMerku = pivotMerku;
                FpivotSaturnus = pivotSaturnus;
                FpivotVenus = pivotVenus;
            }
            if (object !== null) {
                object.position.set(x, y, 0);
                map[y][x] = object;
                scene.add(object);
            } else if (objectT !== null) {
                objectT.position.set(x, y, -1);
                map[y][x] = objectT;
                scene.add(objectT);

            }
        }
    }

    map.centerX = (map.left + map.right) / 2;
    map.centerY = (map.bottom + map.top) / 2;

    return map;
};
var createWall = function() {
    var geometryWall = new THREE.BoxGeometry(1, 1, 1);
    var materialWall = new THREE.MeshLambertMaterial({
        map: new THREE.TextureLoader().load('textures/wall.png')

    });
    return function() {
        var wall = new THREE.Mesh(geometryWall, materialWall);
        wall.isWall = true;

        return wall;
    };
}();

var createPacman = function() {
    var geometryPacman = new THREE.SphereGeometry(0.5, 32, 32);
    var materialPacman = new THREE.MeshBasicMaterial({
        color: 0xffff00
    });
    return function() {
        var pacman = new THREE.Mesh(geometryPacman, materialPacman);
        pacman.isInvicible = false;
        return pacman;
    };
}();
var createDots = function() {
    var geometryDots = new THREE.SphereGeometry(0.1, 32, 32);
    var materialDots = new THREE.MeshBasicMaterial({
        color: 0xffc78f
    });

    return function() {
        var dots = new THREE.Mesh(geometryDots, materialDots);
        dots.isDot = true;

        return dots;
    };
}();

var GHOST_SPEED = 0.7,
    GHOST_RADIUS = 0.6;
var createGhost = function() {
    var ghostGeometry = new THREE.SphereGeometry(GHOST_RADIUS, 16, 16);
    return function(scene, position) {
        // Give each ghost it's own material so we can change the colors of individual ghosts.
        var ghostMaterial = new THREE.MeshPhongMaterial({ color: 'red' });
        var ghost = new THREE.Mesh(ghostGeometry, ghostMaterial);
        ghost.isGhost = true;
        ghost.isWrapper = true;

        // Ghosts start moving left.
        ghost.position.copy(position);
        ghost.direction = new THREE.Vector3(-1, 0, 0);

        scene.add(ghost);
    };
}();
var createCherry = function() {
    var geometryCherry = new THREE.SphereGeometry(0.3, 32, 32);
    var materialCherry = new THREE.MeshBasicMaterial({
        color: 0xff0000
    });

    return function() {
        var cherry = new THREE.Mesh(geometryCherry, materialCherry);
        cherry.isCherry = true;
        return cherry;
    };
}();
var createTerrain = function() {
        var geometry = new THREE.PlaneGeometry(100, 50, 50);
        var material = new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load('textures/lantai.jpg'),
            side: THREE.DoubleSide
        });
        var plane = new THREE.Mesh(geometry, material);
        return plane;
    }
    // var renderer = createRenderer();
var createScene = function() {
    var scene = new THREE.Scene();

    // Add lighting
    scene.add(new THREE.AmbientLight(0x888888));
    var light = new THREE.SpotLight('white', 0.5);
    light.position.set(0, 0, 50);
    scene.add(light);

    return scene;
};
var createSun = function() {
    var sunGeo = new THREE.SphereGeometry(2, 20, 20);
    var sunMat = new THREE.MeshPhongMaterial({
        map: textureSun
    });
    var sun = new THREE.Mesh(sunGeo, sunMat);
    return sun;
}

var createMerku = function() {
    var merkuGeo = new THREE.SphereGeometry(0.1, 20, 20);
    var merkuMat = new THREE.MeshPhongMaterial({
        map: textureMerku
    });
    var merku = new THREE.Mesh(merkuGeo, merkuMat);
    return merku;
}
var createVenus = function() {
    var venusGeo = new THREE.SphereGeometry(0.2, 20, 20);
    var venusMat = new THREE.MeshPhongMaterial({
        map: textureVenus
    });
    var venus = new THREE.Mesh(venusGeo, venusMat);
    return venus;
}
var createEarth = function() {
    var bumiGeo = new THREE.SphereGeometry(0.4, 20, 20);
    var bumiMat = new THREE.MeshPhongMaterial
    var bumi = new THREE.Mesh(bumiGeo, bumiMat);
    return bumi;
}

var createMars = function() {
    var marsGeo = new THREE.SphereGeometry(0.1, 20, 20);
    var marsMat = new THREE.MeshPhongMaterial({
        map: textureMars
    });
    var mars = new THREE.Mesh(marsGeo, marsMat);
    return mars;
}
var createJupiter = function() {
    var jupiterGeo = new THREE.SphereGeometry(0.8, 50, 50);
    var jupiterMat = new THREE.MeshPhongMaterial({
        map: textureJupiter
    });
    var jupiter = new THREE.Mesh(jupiterGeo, jupiterMat);
    return jupiter;
}
var createSaturnus = function() {
    var saturGeo = new THREE.SphereGeometry(0.8, 50, 50);
    var saturMat = new THREE.MeshPhongMaterial({
        map: textureSatur
    });
    var satur = new THREE.Mesh(saturGeo, saturMat);
    var cincinGeo = new THREE.CircleGeometry(1.2, 32);
    var cincinMat = new THREE.MeshPhongMaterial({
        map: textureCincin
    });
    var cincin = new THREE.Mesh(cincinGeo, cincinMat);
    var saturnus = new THREE.Group();
    saturnus.add(satur);
    saturnus.add(cincin);
    return saturnus;
}
var getAt = function(map, position) {
    var x = Math.round(position.x),
        y = Math.round(position.y);
    return map[y] && map[y][x];
}
var isWall = function(map, position) {
    var cell = getAt(map, position);
    return cell && cell.isWall === true;
};
var isDot = function(map, position) {
    var cell = getAt(map, position);
    return cell && cell.isDot === true;
};
var isCherry = function(map, position) {
    var cell = getAt(map, position);
    return cell && cell.isCherry === true;
};

var removeAt = function(map, position) {
    var x = Math.round(position.x),
        y = Math.round(position.y);
    if (map[y] && map[y][x]) {
        map[y][x].visible = false;
    }
}
document.body.onkeydown = function(evt) {

    let speed = 0.1;
    var exPosition = new THREE.Vector3(camera.position.x, camera.position.y, camera.position.z);
    if ((evt.key == 'w' || evt.keyCode == '38')) {
        camera.position.addScaledVector(direction, speed);
        if (isWall(map, camera.position) == true) {
            camera.position.set(exPosition.x, exPosition.y, exPosition.z);
        }
        audioLoader.load('sounds/pacman_chomp.mp3', function(buffer) {
            sound.setBuffer(buffer);
            sound.setLoop(false);
            sound.setVolume(0.5);
            sound.play();
        });
    } else if ((evt.key == 's' || evt.keyCode == 40)) {
        camera.position.addScaledVector(direction, -speed);
        if (isWall(map, camera.position) == true) {
            camera.position.set(exPosition.x, exPosition.y, exPosition.z);
        }
        audioLoader.load('sounds/pacman_chomp.mp3', function(buffer) {
            sound.setBuffer(buffer);
            sound.setLoop(false);
            sound.setVolume(0.5);
            sound.play();
        });
    } else if (evt.key == 'd') {
        camera.rotation.y -= 0.1;
        if (isWall(map, pacman.position) == true) {
            pacman.position.x -= 0.1;
        }
        audioLoader.load('sounds/pacman_chomp.mp3', function(buffer) {
            sound.setBuffer(buffer);
            sound.setLoop(false);
            sound.setVolume(0.5);
            sound.play();
        });
    } else if (evt.key == 'a') {
        camera.rotation.y += 0.1;
        if (isWall(map, pacman.position) == true) {
            pacman.position.x += 0.1;
        }
        audioLoader.load('sounds/pacman_chomp.mp3', function(buffer) {
            sound.setBuffer(buffer);
            sound.setLoop(false);
            sound.setVolume(0.5);
            sound.play();
        });
    }
    if (isDot(map, pacman.position) == true && map[Math.round(pacman.position.y)][Math.round(pacman.position.x)].visible == true) {
        removeAt(map, pacman.position);
        map.numDots -= 1;
    }
    if (isCherry(map, pacman.position) == true && map[Math.round(pacman.position.y)][Math.round(pacman.position.x)].visible == true) {
        pacman.isInvicible = true;
        console.log(pacman.isInvicible);
        setTimeout(function() {
            pacman.isInvicible = false;
        }, 10000);
        console.log(pacman.isInvicible);
        removeAt(map, pacman.position);
    }

}


var update = function(delta, now) {
    scene.children.forEach(function(object) {
        if (object.isGhost === true)
            updateGhost(object, delta, now);
        if (object.isWrapper === true)
            wrapObject(object, map);
        if (object.isTemporary === true && now > object.removeAfter)
            remove.push(object);
    });
    remove.forEach(scene.remove, scene);
    for (item in remove) {
        if (remove.hasOwnProperty(item)) {
            scene.remove(remove[item]);
            delete remove[item];
        }
    }
    if (numGhosts < 4) {
        createGhost(scene, map.ghostSpawn);
        numGhosts += 1;
    }
};

renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

var updateGhost = function(ghost, delta, now) {
    moveGhost(ghost, delta)
}
var scene = createScene();
scene.background = new THREE.TextureLoader().load('textures/bg.jpg');
var map = createMap(scene, MAP_LEVEL1);

camera.position.set(pacman.position.x, pacman.position.y, pacman.position.z + 0.7);
var firstPosition = new THREE.Vector3();
firstPosition.copy(camera.position);

camera.rotation.set(90 * Math.PI / 180, 0, 0);
const direction = new THREE.Vector3;

pacman.rotation.x = -90 * Math.PI / 180, 0, 0;

var moveGhost = function() {
    var previousPosition = new THREE.Vector3();
    var currentPosition = new THREE.Vector3();
    var leftTurn = new THREE.Vector3();
    var rightTurn = new THREE.Vector3();

    return function(ghost, delta) {
        previousPosition.copy(ghost.position).addScaledVector(ghost.direction, 0.5).round();
        ghost.translateOnAxis(ghost.direction, delta * GHOST_SPEED);
        currentPosition.copy(ghost.position).addScaledVector(ghost.direction, 0.5).round();

        if (!currentPosition.equals(previousPosition)) {
            leftTurn.copy(ghost.direction).applyAxisAngle(UP, Math.PI / 2);
            rightTurn.copy(ghost.direction).applyAxisAngle(UP, -Math.PI / 2);

            var forwardWall = isWall(map, currentPosition);
            var leftWall = isWall(map, currentPosition.copy(ghost.position).add(leftTurn));
            var rightWall = isWall(map, currentPosition.copy(ghost.position).add(rightTurn));

            if (!leftWall || !rightWall) {
                var possibleTurns = [];
                if (!forwardWall) possibleTurns.push(ghost.direction);
                if (!leftWall) possibleTurns.push(leftTurn);
                if (!rightWall) possibleTurns.push(rightTurn);

                if (possibleTurns.length === 0)
                    throw new Error('A ghost got stuck!');

                var newDirection = possibleTurns[Math.floor(Math.random() * possibleTurns.length)];
                ghost.direction.copy(newDirection);
                ghost.position.round().addScaledVector(ghost.direction, delta);
            }
        }
        if (currentPosition.x === Math.round(camera.position.x) && currentPosition.y === Math.round(camera.position.y) && pacman.isInvicible == false && ghost.visible == true) {
            camera.position.set(firstPosition.x, firstPosition.y, firstPosition.z);
            lives -= 1;
        } else if (currentPosition.x === Math.round(camera.position.x) && currentPosition.y === Math.round(camera.position.y) && pacman.isInvicible == true && ghost.visible == true) {
            ghost.visible = false;
        }
    }
}();
var wrapObject = function(object, map) {
    if (object.position.x < map.left)
        object.position.x = map.right;
    else if (object.position.x > map.right)
        object.position.x = map.left;

    if (object.position.y > map.top)
        object.position.y = map.bottom;
    else if (object.position.y < map.bottom)
        object.position.y = map.top;
};

var animationLoop = function(callback, requestFrameFunction) {
    requestFrameFunction = requestFrameFunction || requestAnimationFrame;

    var previousFrameTime = window.performance.now();
    var animationSeconds = 0;

    var render = function() {
        var now = window.performance.now();
        var animationDelta = (now - previousFrameTime) / 1000;
        previousFrameTime = now;
        animationDelta = Math.min(animationDelta, 1 / 30);
        animationSeconds += animationDelta;
        callback(animationDelta, animationSeconds);
        requestFrameFunction(render);
    };

    requestFrameFunction(render);
};
animationLoop(function(delta, now) {
    update(delta, now);
});

function main() {
    sun.rotation.x += Math.PI / 500;
    sun.rotation.y += Math.PI / 500;
    earth.rotation.x += Math.PI / 300;
    earth.rotation.y += Math.PI / 300;
    venus.rotation.x += Math.PI / 300;
    venus.rotation.y += Math.PI / 300;
    merku.rotation.x += Math.PI / 300;
    merku.rotation.y += Math.PI / 300;
    mars.rotation.x += Math.PI / 300;
    mars.rotation.y += Math.PI / 300;
    jupiter.rotation.x += Math.PI / 300;
    jupiter.rotation.y += Math.PI / 300;
    saturnus.rotation.x += Math.PI / 300;
    // pivot rotation
    FpivotBumi.rotation.z += Math.PI / 190;
    FpivotMerku.rotation.z += Math.PI / 290;
    FpivotVenus.rotation.z += Math.PI / 400;
    FpivotMars.rotation.z += Math.PI / 250;
    FpivotJupiter.rotation.z += Math.PI / 350;
    FpivotSaturnus.rotation.z += Math.PI / 210;
    camera.getWorldDirection(direction);
    document.getElementById('dots').innerHTML = map.numDots;
    if (map.numDots === 0) {
        alert("YOU WIN!!!");
    } else if (lives === 0) {
        alert("YOU LOSE!!!");
    }
    document.getElementById('lives').innerHTML = lives;
    pacman.position.set(camera.position.x, camera.position.y, camera.position.z - 0.3);

    renderer.render(scene, camera);

    requestAnimationFrame(main);
};


main();