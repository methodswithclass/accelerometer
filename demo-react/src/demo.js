import mcaccel from '@methodswithclass/accelerometer';

const load = (index) => {
  var id = `accel${index}`;
  var demo = false; // test the accelerometer engine with mouse data instead of device accelerometer data
  var demoType = 'mobile';
  //parameters for numerical integration process and general motion behavior
  var params = {
    interval: 2, //how often the accelerometer data is sampled in milliseconds
    filterSize: 3, //how many accelerometer data points are averaged during filtering process
    factor: demo ? 0.008 : 0.8, //sensitivity factor per accelerometer instance
    mu: 0.1, //friction coefficient
    damp: 0.4, //bounce dampening coeffiecient
    gravity: true, //does respond to tilting of device or only change in position of device (false)
    bounce: true, //does bounce off walls, or sticks when it hits a boundary (false)
  };

  //object parameters, unless otherwise defined with html
  var objParams = {
    shape: 'circle', //"square" and "cross" are other built in shapes, define your own shape with html (as children of DOM element) and exclude this value
    size: 200, //in px
    color: 'black', //color of object
  };

  var g = mcaccel.utility;

  /*
    these are global values above and beyond other set values
    they must be set per session on different devices through some calibration means 
    defaults are all positive one which may not give desired motion results
    */
  g.setFactor(g.const.factorG, 0.01);
  g.setAxis(g.const.x, 1);
  g.setAxis(g.const.y, 1);

  //this element is going to be attached to the accelerometer data coming from the device and respond to changes
  var object = document.getElementById('object');
  var arena = document.getElementById('arena');

  //this is the wrapper object around the DOM element called from accelerometer-1.js
  var obj = new mcaccel.object({
    id: `object${index}`, // name of wrapper object for DOM element, can be anything
    arena: arena, //this is a dom element, it needs a parent element that will define the boundaries of it's motion
    params: objParams, //inject object parameters
  });

  //this is the numerical intetgration module called from accelerometer-1.js
  var accel = new mcaccel.accelerometer({
    id, // name of accelerometer instance, can be anything
    demo,
    demoType,
    object: obj, //this is the mcaccel wrapper object above, not the DOM object itself
    params: params, //inject accelerometer parameters
  });

  accel.getMotion(
    id /*name of accelerometer instance, must be the same as instance above*/,
    (id, pos, vel, acc) => {
      //id in this scope is name of accelerometer instance
      //obj in this scope is the object wrapper instance of DOM element
      // console.log('debug accel', id, pos.x, pos.y, acc.x, acc.y);
      obj.setPosition(pos);
      obj.setVelocity(vel);
      obj.setAcceleration(acc);
    }
  );

  //attach accelerometer callback to device motion window function, this is where the rubber meets road
  window.ondevicemotion = accel.motion;

  //reset accel instance to zero position (center of parent element), velocity, and acceleration
  accel.reset();

  //start updating position of DOM element based on accelerometer data
  accel.start();

  const requestDeviceMotion = (callback) => {
    console.log('debug motion event', typeof DeviceMotionEvent);
    if (!DeviceMotionEvent) {
      callback(new Error('DeviceMotion is not supported.'));
    } else if (DeviceMotionEvent.requestPermission) {
      console.log('requested permission');
      DeviceMotionEvent.requestPermission().then(
        (state) => {
          if (state === 'granted') {
            callback(null);
          } else callback(new Error('Permission denied by user'));
        },
        (err) => {
          callback(err);
        }
      );
    } else {
      // no need for permission
      console.log('no need for permission');
      callback(null);
    }
  };

  const firstClick = () => {
    requestDeviceMotion((err) => {
      if (err === null) {
        window.removeEventListener('click', firstClick);
        window.removeEventListener('touchend', firstClick);
      } else {
        console.log('error', err?.message);
      }
    });
  };
  window.addEventListener('click', firstClick);
  window.addEventListener('touchend', firstClick);
  firstClick();
};

export default {
  load,
};
