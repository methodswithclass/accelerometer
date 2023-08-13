# Accelerometer

This package takes acceleromter data from your device, calculates position, and applies it to a DOM element.
Applications inlcude gaming, user interface controls, and more.

# Usage

It numerically integrates the velocity and position, in real time, from the accelerometer data from the device.

`npm install @methodswithclass/accelerometer`

`import Accelerometer, { ValidStatus } from @methodswithclass/accelerometer`

one of these values is returned in a promise from accel.validate()

```
ValidStatus = {
	valid: 'valid',
	invalid: 'invalid',
	unchecked: 'unchecked',
}
```

parameters for numerical integration process and general motion behavior, defaults are shown

```
const params = {
	interval: 2, //acceleromter interval in milliseconds
	filterSize: 3, //sampling/smoothing size
	mu: 0.1, //friction
	damp: 0.4, //bounce dampening
	gravity: true, //whether the object responds to tilting of device (true) or only change in position of device (false)
	bounce: true, //whether the object bounces off walls (true), or sticks to the wall (false)
	timout: 10, // motion timeout with no activity, in seconds
	xDir: 1, //horizonal flip
	yDir: 1, //vertical flip
	factor: 0.008, //sensitivity factor (speed of object)
}
```

Accelerometer manages several instances by id, subsequent calls return original

```
const accel = Accelerometer({
	id: "accel", // name of accelerometer instance
	arena: "arenaId", // element id to space to move within
	object: "objectId", //element id of object to be moved
	params, //inject accelerometer parameters
	overrideValidate: false // not all devices have accelerometers, this flag forces the validator to return 'valid', for local development
});

accel.calibrate({ xDir, yDir, factor}); // this is run by default

accel.validate(); // returns a promise with the device validation status, requests permission if necessary, this is run by default

accel.start(); //start updating position of DOM element based on accelerometer data

accel.stop(); // stop updating position, reset

accel.reset(); // returns object to initial position

```
