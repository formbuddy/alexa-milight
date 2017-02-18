/**
 * MiController
 *
 * @description :: Server-side logic for managing mis
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var Milight = require('node-milight-promise').MilightController;
var commands = require('node-milight-promise').commandsV6;

module.exports = {

	index: function(req, res) {

		var jsonResponse = {};
		
		var zone = req.param('zoneid');
		var cmd = req.param('command');
		var brightness;
		jsonResponse['zone'] = zone;
		jsonResponse['cmd'] = cmd;

		//valid commands are 'on', 'off' and 'brightness'
		if(cmd !== 'on' && cmd !== 'off' && cmd !== 'brightness'){
			jsonResponse['error'] = 'Invalid command';
			return res.json(jsonResponse);
		}

		//if command is brightness, then we need the brightness value
		if(cmd == 'brightness'){
			brightness = req.param('percent');
			if(brightness >= 0 && brightness <= 100){
				jsonResponse['brightnessPercent'] = brightness;
			} else {
				jsonResponse['error'] = 'Invalid brightness percent';
				return res.json(jsonResponse);
			}
		}

		var iBoxIP = sails.config.devices['iBox'];
		var light = new Milight({
        	ip: iBoxIP,
		    type: 'v6'
    	});
		jsonResponse['iBoxIP'] = iBoxIP;

		if(cmd == 'on'){
			light.sendCommands(commands.rgbw.on(zone));
		}
		if(cmd == 'off'){
			light.sendCommands(commands.rgbw.off(zone));
		}
		if(cmd == 'brightness'){
			light.sendCommands(commands.rgbw.on(zone), commands.rgbw.brightness(zone, brightness));
		}

		light.pause(1000);
		light.close().then(function() {
		});
		return res.json(jsonResponse);
	}
};

