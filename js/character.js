/*jshint node:true */
'use strict';
var Thing = require('./thing');

var Character = function(game, x, y) {
    var resources = new game.Resources();
    var render = {
        image: resources.sprites,
        size: {
            width: 4,
            height: 4
        },
        animations: {
            walk: {
                frames: [1, 2, 3, 4],
                fps: 10
            },
            jump: {
                frames: [0, 5, 6],
                fps: 10,
                noloop: true
            },
            idle: {
                frames: [0, 0, 0, 5],
                fps: 2
            },
            wall: {
                frames: [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 15, 15, 15, 15, 15],
                fps: 10,
                noloop: true
            }
        }
    };
    var character = new game.Object();
    var moving = 'idle';
    var action = 0;
    var jumpTime = 99;
    var grounded = true;
    var dying = false;
    var die = function() {
        dying = true;
        character.setAnimation('death', function() {
            dying = false;
            character.fire('death');
        });
    };
    character(new Thing(game, x, y, render));
    character({
        right: function() {
            moving = 'right';
        },
        left: function() {
            moving = 'left';
        },
        idle: function() {
            character.setAnimation('idle');
            moving = 'idle';
        },
        jump: function() {
            if(grounded) {
                jumpTime = 0; //Date.now();
                character.setAnimation('jump');
                resources.jump.play();
            }
        },
        update: function(world) {
            var killEnemy = function(enemy) {
                character.jump();
                enemy.setAnimation('death', function() {
                    world.remove(enemy);
                });
            };
            var vanishBlock = function(block) {
                block.setAnimation('vanish', function() {
                    world.remove(block);
                });
            };
            var now = Date.now();
            if(now - action > 100) {
                action = now;
                var leftFoot = world.collides(character.position.X + 1, character.position.Y + 4);
                var rightFoot = world.collides(character.position.X + 2, character.position.Y + 4);
                if (!leftFoot && !rightFoot) {
                    grounded = false;
                } else {
                    grounded = true;
                    if ((leftFoot && leftFoot.type === 'lava') ||
                        (rightFoot && rightFoot.type === 'lava')) {
                        die();
                    }
                    if((leftFoot && leftFoot.type === 'enemy') ||
                        (rightFoot && rightFoot.type === 'enemy')) {
                        if(leftFoot === rightFoot) {
                            killEnemy(leftFoot); //.setAnimation('death');
                        } else {
                            if(leftFoot && leftFoot.type === 'enemy') {
                                killEnemy(leftFoot); //.setAnimation('death');
                            } else if(rightFoot){
                                killEnemy(rightFoot); //.setAnimation('death');
                            }
                        }
                    }
                }
                for(var lf = 0; lf < 4; lf++) {
                    var box = world.collides(character.position.X, character.position.Y + lf);
                    if(box && box.type === 'enemy') { die(); }
                    if(box && moving === 'left') {
                        moving = 'idle';
                    }
                    box = world.collides(character.position.X + 3, character.position.Y + lf);
                    if(box && box.type === 'enemy') { die(); }
                    if(box && moving === 'right') {
                        moving = 'idle';
                    }
                }
                if(jumpTime < 8) {
                    character.position.Y--;
                    jumpTime++;
                    var head1 = world.collides(character.position.X + 1, character.position.Y - 1);
                    var head2 = world.collides(character.position.X + 2, character.position.Y - 1);
                    var boopBlock = function(block) {
                        if(!block.boop) {
                            block.boop = 0;
                        }
                        jumpTime = 99;
                        if(block.boop === 0) {
                            block.setAnimation('bump');
                        } else {
                            vanishBlock(block);
                        }
                        block.boop++;
                    };
                    if((head1 && head1.type === 'block') || (head2 && head2.type === 'block')) {
                        if(head1 === head2) {
                            boopBlock(head1);
                        } else {
                            if(head1 && head1.type === 'block') {
                                boopBlock(head1);
                            }
                            if(head2 && head2.type === 'block') {
                                boopBlock(head2);
                            }
                        }
                    }
                } else {
                    if(!grounded) {
                        character.position.Y++;

                    }
                }
                if(!dying) {
                    switch(moving) {
                        case 'idle':
                            break;
                        case 'right':
                            character.setAnimation('walk');
                            character.position.X++;
                            break;
                        case 'left':
                            character.setAnimation('walk');
                            character.position.X--;
                            break;
                    }
                }
            }
        }
    });

    return character;
};

module.exports = Character;
