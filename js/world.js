/*jshint node:true, bitwise:false */
'use strict';

var jsgtb = require('jsgtb');
var Thing = require('./thing');
var Enemy = require('./enemy');
var Platform = require('./platform');
var ShortPlatform = function(game, x, y) {
    return new Platform(game, x, y, true);
};
var World = function(game, data) {
    var resources = new game.Resources();
    var things = [];
    var render = {};
    var map = [];
    var x, y;
    for(x = 0; x < 320; x++) {
        map[x] = [];
        for(y = 0; y < 32; y++) {
            map[x][y] = 0;
        }
    }
    render.lava = {
        image: resources.lava,
        size: {
            width: 8,
            height: 16
        },
        bbox: {
            X: 0,
            Y: 11,
            width: 8,
            height: 5
        },
        animations: {
            idle: {
                frames: [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8],
                fps: 10
            }
        }
    };
    render.enemy = {
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
    render.ground = {
        image: resources.ground,
        size: {
            width: 8,
            height: 8
        },
        bbox: {
            X: 0,
            Y: 0,
            width: 8,
            height: 8
        },
        animations: {
            idle: {
                frames: [0],
                fps: 0
            }
        }
    };
    render.wall = {
        image: resources.wall,
        size: {
            width: 8,
            height: 8
        },
        bbox: {
            X: 0,
            Y: 2,
            width: 8,
            height: 6
        },
        animations: {
            idle: {
                frames: [0],
                fps: 0
            }
        }
    };
    render.door = {
        image: resources.door,
        size: {
            width: 8,
            height: 8
        },
        bbox: {
            X: 0,
            Y: 2,
            width: 8,
            height: 6
        },
        animations: {
            idle: {
                frames: [0],
                fps: 0
            }
        }
    };
    render.coin = {
        image: resources.coin,
        size: {
            width: 2,
            height: 2
        },
        bbox: {
            X: 0,
            Y: 0,
            width: 2,
            height: 2
        },
        animations: {
            idle: {
                frames: [0, 1, 2, 3],
                fps: 5
            }
        }
    };
    render.platform = {
        size: {
            width: 16,
            height: 2
        },
        bbox: {
            X: 0,
            Y: 0,
            width: 16,
            height: 2
        }
    };
    render.shortplatform = {
        size: {
            width: 4,
            height: 2
        },
        bbox: {
            X: 0,
            Y: 0,
            width: 4,
            height: 2
        }
    };
    render.house = {
        image: resources.house,
        size: {
            width: 16,
            height: 16
        },
        bbox: {
            X: 0,
            Y: 7,
            width: 16,
            height: 1
        },
        animations: {
            idle: {
                frames: [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 7],
                fps: 10
            }
        }
    };
    render.block = {
        image: resources.block,
        size: {
            width: 2,
            height: 5
        },
        bbox: {
            X: 0,
            Y: 3,
            width: 2,
            height: 1
        },
        animations: {
            idle: {
                frames: [0],
                fps: 0
            },
            bump: {
                frames: [0, 1],
                fps: 5,
                noloop: true
            },
            vanish: {
                frames: [0, 2, 3],
                fps: 5,
                noloop: true
            }
        }
    };
    var world = new jsgtb.GameObject();
    world({
        update: function(actionTime) {
            for(var i = 0; i < things.length; i++) {
                if(things[i].update) {
                    things[i].update(world, actionTime);
                }
            }
        },
        draw: function(canvas) {
            for(var i = 0; i < things.length; i++) {
                //if(things[i].update) {
                    //things[i].update(world);
                //}
                things[i].draw(canvas);
            }
        },
        collides: function(x, y) {
            if(map[x] && map[x][y]) {
                return map[x][y].gone ? null : map[x][y];
            } else {
                return null;
            }
        },
        remove: function(thing) {
            console.log('trying to remove thing');
            for(var i = 0; i < things.length; i++) {
                if(things[i] === thing) {
                    thing.gone = true;
                    things.splice(i, 1);
                    break;
                }
            }
        },
        addBB: function(owner, X, Y, bbox) {
            for(x = bbox.X; x < bbox.X + bbox.width; x++) {
                for(y = bbox.Y; y < bbox.Y + bbox.height; y++) {
                    map [X + x]
                        [Y + y] = owner;
                }
            }
        },
        add: function(thing) {
            switch(thing.type) {
                case 'enemy':
                    things.push(
                            new Enemy(game,
                                thing.position.X,
                                thing.position.Y)
                    );
                    break;
                case 'platform':
                    things.push(
                            new Platform(game,
                                thing.position.X,
                                thing.position.Y)
                    );
                    break;
                case 'shortplatform':
                    things.push(
                            new ShortPlatform(game,
                                thing.position.X,
                                thing.position.Y)
                    );
                    break;
                default:
                    things.push(
                            new Thing(game,
                                thing.position.X,
                                thing.position.Y,
                                render[thing.type],
                                thing.type)
                    );

            }
            //if(thing.type === 'enemy') {
                //things.push(
                        //new Enemy(game,
                            //thing.position.X,
                            //thing.position.Y)
                //);

            //} else {
                //things.push(
                        //new Thing(game,
                            //thing.position.X,
                            //thing.position.Y,
                            //render[thing.type],
                            //thing.type)
                //);
            //}
            var bbox = render[thing.type].bbox || {
                X: 0,
                Y: 0,
                width: render[thing.type].size.width,
                height: render[thing.type].size.height
            };
            for(x = bbox.X; x < bbox.X + bbox.width; x++) {
                for(y = bbox.Y; y < bbox.Y + bbox.height; y++) {
                    map [thing.position.X + x]
                        [thing.position.Y + y] = things[things.length - 1];
                }
            }
        },
        getBB: function(thing) {
            return render[thing].bbox;
        },
        dump: function() {
            var data = { things: [] };
            for(var i = 0; i < things.length; i++) {
                data.things.push({
                    type: things[i].type,
                    position: things[i].position
                });
            }
            console.log(data);
            console.log(JSON.stringify(data));
        }
    });
    if(data && data.things) {
        for(var i = 0; i < data.things.length; i++) {
            world.add(data.things[i]);
            /*
            things.push(
                    new Thing(game,
                        data.things[i].position.X,
                        data.things[i].position.Y,
                        render[data.things[i].type],
                        data.things[i].type)
            );
            var bbox = render[data.things[i].type].bbox || {
                X: 0, //data.things[i].position.X,
                Y: 0, //.data.things[i].position.Y,
                width: render[data.things[i].type].size.width,
                height: render[data.things[i].type].size.height
            };
            for(x = bbox.X; x < bbox.X + bbox.width; x++) {
                for(y = bbox.Y; y < bbox.Y + bbox.height; y++) {
                    map [data.things[i].position.X + x]
                        [data.things[i].position.Y + y] = things[things.length - 1];
                }
            }*/
        }
    }
    return world;
};

module.exports = World;
