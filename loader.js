const TILE_SIZE = 40;  // was this.setting_minblocksize = 40;

let config = {
    "assets": {
		"maps": {
			"goonies": {
				"path": "levels/gooniesv2.json",
				"tilesets": {
					"bgtiles": {
						"image": 'images/goonv2.png',
					},
					"objecttiles": {
						"image": 'images/objecttiles.png',
					},
					"bgimage": {
						"image": 'images/gooniesback.jpg'
					}
				}
			},

		},
        "images" : {
            "dogewarrior_body": {
                "name": "dogewarrior_body",
                "description": "Player sprites",
				"image": 'images/dogewarrior_body100.png',
				"width": 100,
				"height": 100,
			},
            "dogewarrior_head": {
                "name": "dogewarrior_head",
                "description": "Player head",
                "image": 'images/dogewarrior_head.png',
			},
            "water2": {
                "name": "water2",
                "description": "water effect2",
				"image": 'images/water2.png',
				"width": 40,
				"height": 40,
			},
		},
		"sounds": {
			"playerWalk": "sounds/sndPlayerWalk0.wav", 
			"jump": "sounds/jumping1.wav", 
		},

	}
};



function update_loading_screen(context, width, height, percentComplete) {
	var msg = "Loading Resources . " + percentComplete + "% loaded";
	context.clearRect( 0,0, width , height );
	context.fillStyle = "white";
	context.font = "14px Comic Sans MS";
	context.fillText( msg , width / 2 - msg.length * 6 / 2 , height /2 );
}


function checkLoadComplete() {
	assetsLoaded += 1;
	if (assetsLoaded == totalAssets) {
		console.log("Assets Loaded");
		startGame();
		window.requestAnimationFrame(update);
	} else {
		var pct = ( assetsLoaded * 100.0 / totalAssets).toFixed(2);
		update_loading_screen(context, canvas.width, canvas.height, pct);
	}
}

// totalAssets is 1 for the level plus the images and sounds needed 
let totalAssets = 1;
let assetsLoaded = 0;
/**
 * Load level and assets.
 * 
 * @param {string} levelName 
 */
function loadAssets(levelName) {
	totalAssets += Object.keys(config.assets.maps[levelName].tilesets).length;
	totalAssets += Object.keys(config.assets.images).length;
	totalAssets += Object.keys(config.assets.sounds).length;

	// load tilesets used in the level and add them to the global images array.
	for(let tileset in config.assets.maps[levelName].tilesets) {
		console.log(tileset);
		images[tileset] = new Image();
		images[tileset].src = config.assets.maps[levelName].tilesets[tileset].image;
		images[tileset].addEventListener('load', checkLoadComplete);
	}

	// load other images for the game like sprites, objects, bullets, particles.
    for (let image in config.assets.images) {
		images[image] = new Image();
		images[image].src = config.assets.images[image].image;
		images[image].addEventListener('load', checkLoadComplete);
	}

	// load sounds
	for (let sound in config.assets.sounds) {
		sounds[sound] = new Audio();
		sounds[sound].src = config.assets.sounds[sound];
		//sounds[sound].muted = true;
		//sounds[sound].setAttribute("allow", "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture");
		//sounds[sound].setAttribute("muted", "true");
		sounds[sound].addEventListener('canplaythrough', checkLoadComplete);
	}

	// load the level.
	loadJSON(config.assets.maps[levelName].path, function( map ) {
			level = new Level();
			level.map = map;
			checkLoadComplete();
	});
}