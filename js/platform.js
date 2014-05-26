/*jshint node:true */
'use strict';
var Thing = require('./thing');

var Platform = function(game, x, y, short) {
    var resources = new game.Resources();
    var render = {
        image: resources.platform,
        bbox: {
            X: 0,
            Y: 0,
            width: 16,
            height: 2
        },
        size: {
            width: 16,
            height: 2
        },
        animations: {
            idle: {
                frames: [0],
                fps: 0
            },
            walk: {
                frames: [0],
                fps: 0
            }
        }
    };
    if(short) {
        render.bbox.width = 4;
        render.size.width = 4;
        render.image = resources.shortplatform;
    }
    var platform = new game.Object();
    var moving = 'right';
    platform.direction = moving;
    var action = 0;
    //var grounded = true;
    var dying = false;
    //var die = function() {
        //dying = true;
        //platform.setAnimation('death', function() {
            //dying = false;
            //platform.fire('death');
        //});
    //};
    var reverse = function() {
        if(moving === 'right') {
            moving = 'left';
        } else {
            moving = 'right';
        }
        platform.direction = moving;
    };
    platform(new Thing(game, x, y, render));
    platform({
        type: 'platform',
        right: function() {
            moving = 'right';
        },
        left: function() {
            moving = 'left';
        },
        idle: function() {
            platform.setAnimation('idle');
            moving = 'idle';
        },
        update: function(world, actionTime) {
            var now = Date.now();
            if(actionTime) {
                action = now;
                var leftFoot = world.collides(platform.position.X - 1, platform.position.Y + 1);
                var rightFoot = world.collides(platform.position.X + 16, platform.position.Y + 1);
                //if(!leftFoot || !rightFoot) {
                    //reverse();
                //}
                //if (!leftFoot && !rightFoot) {
                    //grounded = false;
                //} else {
                    //grounded = true;
                    //if ((leftFoot && leftFoot.type === 'lava') ||
                        //(rightFoot && rightFoot.type === 'lava')) {
                        //die();
                    //}
                //}
                //for(var lf = 0; lf < 4; lf++) {
                    //var box1 = world.collides(platform.position.X, platform.position.Y + lf);
                    //var box2 = world.collides(platform.position.X + 3, platform.position.Y + lf);

                if(leftFoot && moving === 'left' ) {//|| box2) {
                    reverse();
                    //break;
                }
                if(rightFoot && moving === 'right' ) {//|| box2) {
                    reverse();
                    //break;
                }
                for(var i = 0; i < 16; i++) {
                    var player = world.collides(platform.position.X + i, platform.position.Y - 1);
                    if(player) {
                        player.position.X += (moving === 'right' ? 1 : -1);
                        break;
                    }
                }
                //}
                //if(jumpTime < 8) {
                    //platform.position.Y--;
                    //jumpTime++;
                    //var head1 = world.collides(platform.position.X + 1, platform.position.Y - 1);
                    //var head2 = world.collides(platform.position.X + 2, platform.position.Y - 1);
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
                        //platform.position.Y++;

                    //}
                //}
                if(!dying) {
                    switch(moving) {
                        case 'idle':
                            break;
                        case 'right':
                            world.addBB(0, platform.position.X, platform.position.Y, render.bbox);
                            platform.setAnimation('walk');
                            platform.position.X++;
                            world.addBB(platform, platform.position.X, platform.position.Y, render.bbox);
                            break;
                        case 'left':
                            world.addBB(0, platform.position.X, platform.position.Y, render.bbox);
                            platform.setAnimation('walk');
                            platform.position.X--;
                            world.addBB(platform, platform.position.X, platform.position.Y, render.bbox);
                            break;
                    }
                }
            }
        }
    });

    return platform;
};

module.exports = Platform;
