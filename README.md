mqtt-bridge
===========

This node.js server listens on MQTT messages for lights and translates it to the philips hue bridge

Example
=======

Clone the repository
```bash
$ git clone https://github.com/dennisdegreef/mqtt-hue-bridge.git
$ cd mqtt-hue-bridge
$ npm install
```

Start up the server by editing the config.js first to suit your needs
```bash
$ $EDITOR config.js
$ node
```

Or by using environment variables
```bash
$ MQTT_HOSTNAME="192.168.0.1" HUE_HOSTNAME="192.168.0.2" HUE_USERNAME=$(whoami) node server.js
```

Publish some MQTT messages to try it out (I use mosquitto server for this, but whatever MQTT server should work)
```bash
$ mosquitto_pub -m "on" -t "light/all/state"
$ mosquitto_pub -m "50" -t "light/2/brightness"
```


