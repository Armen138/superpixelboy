/*jshint node:true */
'use strict';
var Thing = function(game, x, y, render, type) {
    var thing = new game.Object();
    var animation = 'idle';
    var callback = null;
    var now = Date.now();
    var i = 0;
    var position = {X: x, Y: y};
    if(!render.size) {
        render.size = {
            width: 4,
            height: 4
        };
    }
    var draw = function(canvas) {
        if (render.animations[animation].fps &&
            render.animations[animation].fps > 0 &&
            Date.now() - now > 1000 / render.animations[animation].fps) {
            now = Date.now();
            i++;
            if(i >= render.animations[animation].frames.length) {
                i = 0;
                if(render.animations[animation].noloop) {
                    if(callback) {
                        callback();
                    } else {
                        animation = 'idle';
                    }
                }
            }
        }
        canvas.context.drawImage(   render.image,
                                    render.animations[animation].frames[i] * render.size.width,
                                    0,
                                    render.size.width,
                                    render.size.height,
                                    position.X,
                                    position.Y,
                                    render.size.width,
                                    render.size.height);
    };
    thing({
        draw: draw,
        getAnimation: function() {
            return animation;
        },
        setAnimation: function(ani, aniCallback) {
            if(animation !== ani && animation !== 'death') { //death cannot be canceled
                i = 0;
                animation = ani;
                callback = aniCallback;
            }
        },
        position: position,
        type: type
    });
    return thing;
};

module.exports = Thing;
