import Vector from '../vector';

type utilType = { [k: string]: any | { [n: string]: string | number } };

const accelutility: utilType = {
  const: {
    factorG: 'global',
    factorS: 'session',
    x: 'i',
    y: 'j',
    dist: 30,
  },

  factor: {
    global: 1,
    session: 1.0,
  },

  axis: {
    i: 1,
    j: 1,
  },

  average: (array: Vector[]) => {
    var sumX = 0;
    var sumY = 0;

    for (let i in array) {
      sumX += array[i].x;
      sumY += array[i].y;
    }

    //console.log("average", sumX/array.length);

    return new Vector(
      sumX / array.length,
      sumY / array.length,
      array[array.length - 1].time
    );
  },

  setDist: (dist: number) => {
    accelutility.const.dist = dist;
  },

  setFactor: (type: string, factor: number) => {
    if (type === 'global') {
      accelutility.factor.global = Math.abs(factor);
    } else if (type === 'session') {
      accelutility.factor.session = Math.abs(factor);
    }
    console.log('utility set factor', type, accelutility.factor);
  },

  getFactor: (type?: string) => {
    let factor;
    if (type) {
      factor =
        type === 'session'
          ? Math.abs(accelutility.factor.session)
          : Math.abs(accelutility.factor.global);
    } else {
      factor = Math.abs(
        accelutility.factor.global * accelutility.factor.session
      );
    }
    return factor;
  },

  setAxis: (axis: string, value: number) => {
    if (axis === 'i') {
      accelutility.axis.i = value >= 0 ? 1 : -1;
    } else if (axis === 'j') {
      accelutility.axis.j = value >= 0 ? 1 : -1;
    }
    console.log('utility set axis', axis, value);
  },

  getAxis: (axis: string) => {
    let _axis;
    if (axis === 'i') {
      _axis = accelutility.axis.i >= 0 ? 1 : -1;
    } else if (axis === 'j') {
      _axis = accelutility.axis.j >= 0 ? 1 : -1;
    }
    return _axis;
  },
};

export default accelutility;
