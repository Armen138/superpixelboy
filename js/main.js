/*jshint node:true, bitwise:false, browser:true */
'use strict';
var game = require('jsgtb/game');
var keys = require('jsgtb/keys');

var Character = require('./character');
var World = require('./world');
var Logo = require('./logo');
var data = require('./1-1.json');
var levels = [
    { name: '1-1', data: require('./1-1.json') },
    { name: '1-2', data: require('./1-2.json') }
];
var resources = new game.Resources();
//var Physics = require('./physics');
//console.log(Physics);

//var physics = new Physics();

//console.log(physics);

//this is the visible canvas
game.canvas.size(320, 320);
//wow. such smoothing.
game.canvas.context.imageSmoothingEnabled = false;
game.canvas.context.mozImageSmoothingEnabled = false;
var gameView = game.canvas.create();
//this where we render the game. Only 32x32 is visible, the rest we scroll around to.
gameView.size(320, 32);
var level = 0;
resources.on('load', function() {
    var editor = false;
    var editorMode = {
        current: 'block'
    };
    function selectTool(e) {
        editorMode.current = e.target.getAttribute('tile');
    }

    var editorButtons = document.querySelectorAll('#editormode>a');
    for(var i = 0; i < editorButtons.length; i++) {
        editorButtons[i].addEventListener('click', selectTool);
    }
    var play = new game.Object();
    var world = new World(game, data);
    var character = new Character(game, 16, 20);
    var scroll = 0;
    play.on('init', function() {
        scroll = 0;
        character = new Character(game, 16, 20);
        world = new World(game, levels[level].data);
        //character.position.X = 16;
        //character.position.Y = 20;
        //character.setAnimation('idle');
        resources.music.play(true);
        character.on('death', function() {
            console.log('back to title screen');
            level = 0;
            game.state = logo;
        });
        character.on('win', function() {
            level++;
            if(level > levels.length) {
                level = 0;
            }
            game.state = logo;
        });
    });
    play.on('clear', function() {
        resources.music.stop();
    });
    play.on('keydown', function(key) {
        if(key.code === keys.RIGHT) {
            character.right();
        }
        if(key.code === keys.LEFT) {
            character.left();
        }
        if(key.code === keys.UP) {
            character.jump();
        }
        if(editor) {
            if(key.code === keys.A) {
                scroll--;
            }
            if(key.code === keys.D) {
                scroll++;
            }
        }
    });
    play.on('keyup', function(key) {
        if (key.code === keys.RIGHT ||
            key.code === keys.LEFT) {
            character.idle();
        }
        if(key.code === keys.UP) {
        }
        if(key.code === keys.F2) {
            console.log('secret editor mode.');
            document.getElementById('editormode').style.display = 'block';
            editor = true;
        }
        if(key.code === keys.F4) {
            world.dump();
        }
    });
    var mouse = {X :0, Y: 0};
    play.on('mousemove', function(e) {
        mouse = e;
    });
    play.on('click', function(e) {
        if(!editor) {
            return;
        }
        var position = {
            X: (e.X / 10 | 0) + scroll,
            Y: (e.Y / 10 | 0)
        };
        console.log(e);
        if(e.button === 0) {
            world.add({
                type: editorMode.current,
                position: position
            });
        } else {
            var thing = world.collides(position.X, position.Y);
            if(thing) {
                world.remove(thing);
            }
        }
    });
    play.on('draw', function(e) {
        gameView.context.fillStyle = 'white';
        gameView.context.fillRect(0, 0, 320, 32);
        for(var i = 0; i < 16; i++) {
            gameView.context.drawImage(resources.sky, i * 32, 0);
        }
        world.draw(gameView);
        character.draw(gameView);
        if(character.position.X > 16) {
            scroll = character.position.X - 16;
        }
        gameView.context.fillText(levels[level].name, 0, 10);
        e.canvas.context.drawImage(gameView.element, scroll, 0, 32, 32, 0, 0, 320, 320);
        if(editor) {
            var bb = world.getBB(editorMode.current);
            e.canvas.context.strokeRect((mouse.X / 10 | 0) * 10 + bb.X * 10, (mouse.Y / 10 | 0) * 10 + bb.Y * 10, bb.width * 10, bb.height * 10);
        }
    });
    var action = 0;
    play.on('update', function() {
        var now = Date.now();
        var actionTime = false;
        if(now - action > 100) {
            actionTime = true;
            action = now;
        }
        //physics.step(now);
        character.update(world, actionTime);
        world.update(actionTime);
    });

    //game.state = play;
    var logo = new Logo(game);
    logo.on('dismiss', function() {
        game.state = play;
    });
    game.state = logo;
    game.run();
});

resources.load({
    'ground': 'images/ground.png',
    'sprites': 'images/sprites3.png',
    'coin': 'images/coin2.png',
    'crooked': 'images/32crooked.png',
    'lava': 'images/lava.png',
    'house': 'images/house.png',
    'block': 'images/block.png',
    'sky': 'images/sky.png',
    'enemy': 'images/enemy.png',
    'music': 'audio/music.mp3',
    'jump': 'audio/jump.mp3',
    'pickup': 'audio/pickup.mp3',
    'powerup': 'audio/powerup.mp3',
    'hurt': 'audio/hurt.mp3',
    'wall': 'images/wall.png',
    'door': 'images/door.png',
    'platform': 'images/platform.png',
    'shortplatform': 'images/shortplatform.png'
});
