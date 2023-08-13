import Accelerometer, { ValidStatus } from '@methodswithclass/accelerometer';

// Accelerometer manages several instances by id, subsequent calls return original

const load = (input) => {
  const { id, arena, object } = input;

  //parameters for numerical integration process and general motion behavior, defaults shown
  const params = {
    interval: 2, //acceleromter interval in milliseconds
    filterSize: 3, //sampling/smoothing size
    mu: 0.1, //friction
    damp: 0.4, //bounce dampening
    gravity: true, //whether the object responds to tilting of device (true) or only change in position of device (false)
    bounce: true, //whether the object bounces off walls (true), or sticks to the wall (false)
    timeout: 10, // motion timeout with no activity, in approximate seconds
    xDir: 1, //horizonal flip
    yDir: 1, //vertical flip
    factor: 0.008, //sensitivity factor (speed of object)
  };

  const accel = Accelerometer({
    id,
    object,
    arena,
    params,
    overrideValidate: true, //optionally override device validation for local development
  });

  // accel.calibrate({ xDir: -1, yDir: 1, factor }); //optionally change the calibration after creation, this is run by default from params

  // const status = await accel.validate(); //optionally get the validation status, request permission for device motion, this is run by default

  const isValid = ValidStatus.valid; // status when device motion is allowed
  const isInValid = ValidStatus.invalid; // status when device motion is not allowed, or non-existent
  const isUnchecked = ValidStatus.unchecked; // status before validation is run

  console.log('validation statuses', isValid, isInValid, isUnchecked);

  accel.start(); //start updating position of DOM element based on accelerometer data

  // accel.stop(); //stop updating position, reset

  return accel;
};

export { load };
