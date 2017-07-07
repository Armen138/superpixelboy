/*jshint node:true */
'use strict';

var jsgtb = require('jsgtb');
var Logo = function(game) {
    var resources = new game.Resources();
    var logo = new jsgtb.GameObject();
    var close = false;
    var start, alpha;
    logo.on('init', function() {
        start = Date.now();
        alpha = 0.0;
        close = false;
    });
    logo.on('draw', function(e) {
        var now = Date.now();
        if(!close && alpha < 1.0 && now - start > 40) {
            alpha += 0.1;
            start = now;
        }
        if(close && alpha > 0.0 && now - start > 40) {
            alpha -= 0.1;
            start = now;
            if(alpha <= 0.0) {
                logo.fire('dismiss');
            }
        }
        e.canvas.clear('black');
        e.canvas.context.save();
        e.canvas.context.globalAlpha = alpha;
        e.canvas.context.drawImage(resources.crooked, 0, 0, 32, 32, 0, 0, 320, 320);
        e.canvas.context.restore();
    });
    var anykey = function() { close = true; };
    logo.on('click', anykey);
    logo.on('keyup', anykey);
    return logo;
};

module.exports = Logo;
