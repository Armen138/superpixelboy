/*jshint node:true */
'use strict';
var Thing = require('./thing');

var Enemy = function(game, x, y) {
    var resources = new game.Resources();
    var render = {
        image: resources.enemy,
        bbox: {
            X: 1,
            Y: 0,
            width: 2,
            height: 4
        },
        size: {
            width: 4,
            height: 4
        },
        animations: {
            idle: {
                frames: [0, 1],
                fps: 5
            },
            walk: {
                frames: [0, 1],
                fps: 5
            },
            death: {
                frames: [0, 1, 2, 3, 4, 5],
                fps: 10,
                noloop: true
            }
        }
    };
    var enemy = new game.Object();
    var moving = 'right';
    var action = 0;
    var grounded = true;
    var dying = false;
    var die = function() {
        dying = true;
        enemy.setAnimation('death', function() {
            dying = false;
            enemy.fire('death');
        });
    };
    var reverse = function() {
        if(moving === 'right') {
            moving = 'left';
        } else {
            moving = 'right';
        }
    };
    enemy(new Thing(game, x, y, render));
    enemy({
        type: 'enemy',
        right: function() {
            moving = 'right';
        },
        left: function() {
            moving = 'left';
        },
        idle: function() {
            enemy.setAnimation('idle');
            moving = 'idle';
        },
        update: function(world, actionTime) {
            var now = Date.now();
            if(actionTime) {
                action = now;
                var leftFoot = world.collides(enemy.position.X + 1, enemy.position.Y + 4);
                var rightFoot = world.collides(enemy.position.X + 2, enemy.position.Y + 4);
                if(!leftFoot || !rightFoot) {
                    reverse();
                }
                if (!leftFoot && !rightFoot) {
                    grounded = false;
                } else {
                    grounded = true;
                    if ((leftFoot && leftFoot.type === 'lava') ||
                        (rightFoot && rightFoot.type === 'lava')) {
                        die();
                    }
                }
                for(var lf = 0; lf < 4; lf++) {
                    var box1 = world.collides(enemy.position.X, enemy.position.Y + lf);
                    var box2 = world.collides(enemy.position.X + 3, enemy.position.Y + lf);
                    if(box1 && box1 !== enemy && moving === 'left' ) {//|| box2) {
                        reverse();
                        break;
                    }
                    if(box2 && box2 !== enemy && moving === 'right' ) {//|| box2) {
                        reverse();
                        break;
                    }
                }
                //if(jumpTime < 8) {
                    //enemy.position.Y--;
                    //jumpTime++;
                    //var head1 = world.collides(enemy.position.X + 1, enemy.position.Y - 1);
                    //var head2 = world.collides(enemy.position.X + 2, enemy.position.Y - 1);
                    //var boopBlock = function(block) {
                        //if(!block.boop) {
                            //block.boop = 0;
                        //}
                        //jumpTime = 99;
                        //if(block.boop === 0) {
                            //block.setAnimation('bump');
                        //} else {
                            //vanishBlock(block);
                        //}
                        //block.boop++;
                    //};
                    //if((head1 && head1.type === 'block') || (head2 && head2.type === 'block')) {
                        //if(head1 === head2) {
                            //boopBlock(head1);
                        //} else {
                            //if(head1 && head1.type === 'block') {
                                //boopBlock(head1);
                            //}
                            //if(head2 && head2.type === 'block') {
                                //boopBlock(head2);
                            //}
                        //}
                    //}
                //} else {
                    //if(!grounded) {
                        //enemy.position.Y++;

                    //}
                //}
                if(!dying) {
                    switch(moving) {
                        case 'idle':
                            break;
                        case 'right':
                            world.addBB(0, enemy.position.X, enemy.position.Y, render.bbox);
                            enemy.setAnimation('walk');
                            enemy.position.X++;
                            world.addBB(enemy, enemy.position.X, enemy.position.Y, render.bbox);
                            break;
                        case 'left':
                            world.addBB(0, enemy.position.X, enemy.position.Y, render.bbox);
                            enemy.setAnimation('walk');
                            enemy.position.X--;
                            world.addBB(enemy, enemy.position.X, enemy.position.Y, render.bbox);
                            break;
                    }
                }
            }
        }
    });

    return enemy;
};

module.exports = Enemy;
