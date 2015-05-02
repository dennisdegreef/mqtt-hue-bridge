/**
 *
 * This application transforms MQTT messages to Philips Hue API calls
 *
 * @author  Dennis de Greef <github@link0.net>
 * @license MIT
 *
 * Examples:
 *   /light/all/state        on
 *   /light/1/state          off
 *   /light/3/brightness     100
 *   /light/all/brightness   50
 *
 */
var mqtt     = require('mqtt');
var hue      = require('node-hue-api');
var config   = require('./config');

var mqttUri  = 'mqtt://' + config.mqtt.hostname + ':' + config.mqtt.port;
var client   = mqtt.connect(mqttUri);
var api      = new hue.HueApi(config.hue.hostname, config.hue.username);
var state    = hue.lightState.create();

// topic is /light/<id>/<property>
var topicRegex = config.mqtt.namespace + "/(.*)/(.*)";

var lights = [];
api.lights().then(function(result) {
    lights = result.lights;

    client.on('message', function (topic, message) {
        var topicParts = topic.match(topicRegex);
        if(topicParts == null) {
            // These are not the topics you are looking for
            return;
        }
        var identifier = topicParts[1];
        var property   = topicParts[2];
        var value      = message.toString();

        // Determine state change from MQTT topic
        var newState = state;
        if(property == 'state') {
            if(value == 'on' || value == '1') {
                newState = state.on();
            }
            if(value == 'off' || value == '0') {
                newState = state.off();
            }
        } else if(property == 'brightness') {
            newState = state.brightness(value);
        }

        var regexInteger = new RegExp('^\\d+$');
        if(identifier == "all") {
            // Group 0 is always all lights
            api.setGroupLightState(0, newState).done();
        } else if(regexInteger.test(identifier)) {
            api.setLightState(identifier, newState).done();
        }
    });
}).done();

client.on('connect', function () {
    // Subscribe on everything in the MQTT namespace
    client.subscribe(config.mqtt.namespace + '/#');
});
