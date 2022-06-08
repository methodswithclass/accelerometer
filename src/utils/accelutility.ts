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
    accelutility.factor[typeof type] = Math.abs(factor);
    console.log('utility set factor', type, factor);
  },

  getFactor: (type?: string) => {
    if (type) return Math.abs(accelutility.factor[typeof type]);
    else
      return Math.abs(accelutility.factor.global * accelutility.factor.session);
  },

  setAxis: (axis: string, value: number) => {
    accelutility.axis[typeof axis] = value >= 0 ? 1 : -1;
    console.log('utility set axis', axis, value);
  },

  getAxis: (axis: string) => {
    return accelutility.axis[typeof axis] >= 0 ? 1 : -1;
  },
};

export default accelutility;
