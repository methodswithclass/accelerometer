import Thing from './thing';
import { Vector, averageVector, delay } from './utils/utils';

export const ValidStatus = {
  valid: 'valid',
  invalid: 'invalid',
  unchecked: 'unchecked',
};

const valid = {};

const testAccel = (id) => (e) => {
  valid[id] = !Number.isNaN(e.acceleration.x);
};

const requestDeviceMotion = async (id) => {
  await delay(1000);
  if (!valid[id]) {
    throw new Error('DeviceMotion is not supported.');
  } else if (typeof DeviceMotionEvent.requestPermission === 'function') {
    console.log('request permission');
    const result = await DeviceMotionEvent.requestPermission();
    if (!result || result !== 'granted') {
      throw new Error('Permission denied by user');
    }
  } else {
    // no need for permission
    console.log('no need for permission');
  }
};

const check = async ({ id, overrideValidate }) => {
  window.ondevicemotion = testAccel(id);

  try {
    await requestDeviceMotion(id);
    return ValidStatus.valid;
  } catch (error) {
    console.log('error getting device motion', id, error.message);
    return overrideValidate ? ValidStatus.valid : ValidStatus.invalid;
  }
};

const Accelerometer = function (props = {}) {
  const self = this;

  const {
    id = 'global',
    arena,
    object: objectId,
    overrideValidate,
    params,
  } = props;

  const {
    mu = 0.1,
    bounce: doesBounce = true,
    damp = 0.6,
    filterSize = 3,
    gravity = true,
    interval = 2,
    timeout = 10,
    factor: globalFactor = 0.008,
    xDir: xAxis = 1,
    yDir: yAxis = 1,
  } = params || {};

  let timer;
  let filterBucket = [];
  let timeoutBucket = [];
  let timeoutCheck = {};
  let prevTimeoutKey = null;
  const unfiltered = new Vector();
  const averagedAccel = new Vector();
  const pos0 = new Vector();
  const vel0 = new Vector();
  const accel0 = new Vector();
  const pos1 = new Vector();
  const vel1 = new Vector();
  const accel1 = new Vector();
  const minVel = Math.pow(10, -3);
  let startTime = 0;
  let currentTime = 0;
  let previousTime = 0;
  let running = false;
  let xDir = xAxis;
  let yDir = yAxis;
  let factor = globalFactor;
  let threshold = factor * factor;
  let isValid = ValidStatus.unchecked;
  const object = new Thing({ id: `object-${id}`, arena, object: objectId });

  const init = (_self) => {
    _self.reset();
  };

  const motion = (e) => {
    if (!running) {
      return;
    }

    const raw = {
      gravity: {
        x: e.accelerationIncludingGravity.x,
        y: e.accelerationIncludingGravity.y,
      },
      abs: {
        x: e.acceleration.x,
        y: e.acceleration.y,
      },
    };

    if (gravity) {
      unfiltered.set({
        x: xDir && factor ? xDir * factor * raw.gravity.x : raw.gravity.x,
        y: yDir && factor ? yDir * factor * raw.gravity.y : raw.gravity.y,
      });
    } else {
      unfiltered.set({
        x: xDir && factor ? xDir * factor * raw.abs.x : raw.abs.x,
        y: yDir && factor ? yDir * factor * raw.abs.y : raw.abs.y,
      });
    }
  };

  const handleEvent = (e) => {
    object?.setPosition(e.detail.pos);
    object?.setVelocity(e.detail.vel);
    object?.setAcceleration(e.detail.accel);
  };

  const attach = () => {
    window.ondevicemotion = motion;

    window.addEventListener(`accel${id}`, handleEvent);
  };

  const unattach = () => {
    window.ondevicemotion = null;
    window.removeEventListener(`accel${id}`, handleEvent);
  };

  const updateMotion = (pos, vel, accel) => {
    window.dispatchEvent(
      new CustomEvent(`accel${id}`, {
        detail: { pos, vel, accel },
      })
    );
  };

  const hasTimedOut = (current) => {
    timeoutBucket.push(unfiltered.new());
    if (timeoutBucket.length < filterSize) {
      return false;
    }

    averagedAccel.set(averageVector(timeoutBucket));
    timeoutBucket = [];
    const key = averagedAccel.print({ decimal: 4 });
    if (!timeoutCheck[key]) {
      timeoutCheck[key] = [];
    }
    timeoutCheck[key].push(current);

    if (prevTimeoutKey && key !== prevTimeoutKey) {
      delete timeoutCheck[prevTimeoutKey];
    }

    prevTimeoutKey = key;

    const result = Object.values(timeoutCheck).some((items) => {
      return items?.[items?.length - 1] - items?.[0] > 1000 * timeout;
    });

    if (!running || result) {
      timeoutCheck = {};
      averagedAccel.set({ x: 0, y: 0 });
      return true;
    }

    return false;
  };

  const bounce = () => {
    const wallStatus = object?.hasHitWall(pos1);

    if (wallStatus?.x) {
      pos1.set({ x: wallStatus.xmax });
      vel1.set({ x: -damp * vel1.x });
      if (
        (Math.abs(vel1.x) < minVel / Math.sqrt(2) && gravity) ||
        !doesBounce
      ) {
        vel1.set({ x: 0 });
      }
    }

    if (wallStatus?.y) {
      pos1.set({ y: wallStatus.ymax });
      vel1.set({ y: -damp * vel1.y });
      if (
        (Math.abs(vel1.y) < minVel / Math.sqrt(2) && gravity) ||
        !doesBounce
      ) {
        vel1.set({ y: 0 });
      }
    }
  };

  const friction = () => {
    if (accel1.len() < threshold) {
      vel1.set(vel1.multiply(1 - mu));
    }
  };

  const integrate = (accelArray, current) => {
    if (!running) {
      return;
    }

    accel1.set(averageVector(accelArray));

    if (accel1.len() < threshold) {
      accel1.set(new Vector());
    }

    const timeInterval = current - previousTime;

    vel1.set(
      vel0
        .add(accel0.multiply(timeInterval))
        .add(accel1.subtract(accel0).multiply(0.5 * timeInterval))
    );
    pos1.set(
      pos0
        .add(vel0.multiply(timeInterval))
        .add(vel1.subtract(vel0).multiply(0.5 * timeInterval))
    );

    bounce();
    friction();

    updateMotion(pos1, vel1, accel1);

    pos0.set(pos1);
    vel0.set(vel1);
    accel0.set(accel1);
    previousTime = currentTime;
  };

  const update = () => {
    currentTime = new Date().getTime();

    if (hasTimedOut(currentTime)) {
      self.stop();
      return;
    }

    filterBucket.push(unfiltered.new());

    if (filterBucket.length === filterSize) {
      integrate(filterBucket, currentTime);

      filterBucket = [];
    }
  };

  self.validate = async () => {
    if (isValid === ValidStatus.valid) {
      return isValid;
    }
    isValid = await check({ id, overrideValidate });
    return isValid;
  };

  self.getObject = () => {
    return object;
  };

  self.calibrate = (params) => {
    const { xDir: _xDir, yDir: _yDir, factor: _factor } = params;

    xDir = _xDir ? _xDir : xDir;
    yDir = _yDir ? _yDir : yDir;
    factor = _factor > 0 ? _factor : factor;
    threshold = factor * factor;
  };

  self.start = () => {
    console.log('start accel', id);

    attach();
    this.reset();

    startTime = new Date().getTime();
    previousTime = startTime;

    running = true;

    timer = setInterval(update, interval);
  };

  self.stop = () => {
    console.log('stop accel', id);

    running = false;

    self.reset();

    unattach();

    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  };

  self.reset = () => {
    console.log('reset accel', id);

    filterBucket = [];
    timeoutBucket = [];
    timeoutCheck = {};

    unfiltered.set({ x: 0, y: 0 });
    accel0.set({ x: 0, y: 0 });
    vel0.set({ x: 0, y: 0 });
    pos0.set({ x: 0, y: 0 });
    startTime = 0;

    handleEvent({ detail: { pos: pos0, vel: vel0, accel: accel0 } });
  };

  self.unfiltered = () => {
    return unfiltered;
  };

  self.isRunning = () => {
    return running;
  };

  init(self);
  self.validate();
};

const accelMap = {};

export const init = (input) => {
  const { id, params } = input;

  const existingAccel = accelMap[id];
  if (existingAccel) {
    existingAccel.calibrate(params);
    return existingAccel;
  }

  const accel = new Accelerometer(input);

  accel.reset();

  accelMap[id] = accel;

  return accel;
};
