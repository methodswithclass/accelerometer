export const Vector = function (props = {}) {
  const self = this;

  self.x = props?.x || 0;
  self.y = props?.y || 0;
  self.time = props?.time || 0;

  self.len = () => {
    return Math.sqrt(self.x * self.x + self.y * self.y);
  };

  self.add = (vector) => {
    return new Vector({
      x: self.x + vector.x,
      y: self.y + vector.y,
      time: self.time,
    });
  };

  self.subtract = (vector) => {
    return new Vector({
      x: self.x - vector.x,
      y: self.y - vector.y,
      time: self.time,
    });
  };

  self.multiply = (scalar) => {
    return new Vector({
      x: self.x * scalar,
      y: self.y * scalar,
      time: self.time,
    });
  };

  self.unit = () => {
    if (self.len() > 0) {
      return self.multiply(1 / self.len());
    } else {
      return new Vector(0, 0, 0);
    }
  };

  self.set = (vector) => {
    self.x = !Number.isNaN(vector?.x) ? vector.x : self.x;
    self.y = !Number.isNaN(vector?.y) ? vector.y : self.y;
    self.time = !Number.isNaN(vector?.time) ? vector.time : self.time;
  };

  self.print = (prefix) => {
    return `${prefix ? `${prefix}: ` : ''}x:${self.x} y:${self.y} t:${
      self.time
    }`;
  };
};

export const delay = (interval) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, interval);
  });
};

export const averageVector = (array, callback) => {
  if (!array || array.length === 0) {
    return new Vector({ x: 0, y: 0, time: 0 });
  }

  const sum = array.reduce(
    (accum, item, index) => {
      const { x, y } = accum;
      return typeof callback === 'function'
        ? callback(accum, item, index, array)
        : { x: x + item?.x, y: y + item?.y };
    },
    { x: 0, y: 0 }
  );

  return new Vector({
    x: sum?.x / array.length,
    y: sum?.y / array.length,
    time: array[array.length - 1]?.time,
  });
};

const averageDefault = (array) => {
  if (!array || array.length === 0) {
    return null;
  }

  const sum = array.reduce((accum, item) => {
    return accum + item;
  }, 0);

  return sum / array.length;
};

export const average = (array, callback) => {
  if (
    !array ||
    array.length === 0 ||
    !callback ||
    typeof callback !== 'function'
  ) {
    return averageDefault(array);
  }

  const sum = array.reduce((accum, item, index) => {
    return (accum += callback(item, index, array));
  }, 0);

  return sum / array.length;
};

export const truncate = (number, decimal) => {
  const value =
    Math.floor(number * Math.pow(10, decimal)) / Math.pow(10, decimal);

  return value;
};

export const round = function (number, order) {
  const value = Math.round(number / order) * order;

  return value;
};

export const resolveDigit = (digit) => {
  return digit < 10 ? `0${digit}` : `${digit}`;
};

export const log = (x, num) => {
  return Math.log(x) / Math.log(num);
};

export const leadingzeros = (number, zeros) => {
  if (!zeros) zeros = 1;

  const digits = Math.floor(log(number * 10, 10));
  const total = Math.floor(log(zeros, 10)) - digits;
  let leading = '';
  for (let i = 0; i <= total; i++) {
    leading += '0';
  }

  // console.log(leading + digit);

  return leading + digits;
};

export const shuffle = (array) => {
  let currentIndex = array.length;
  let temporaryValue;
  let randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

// generally solves a system of two linear equations of the form y = mx + b
// inputs are two sets of y and x points, returns slope, m, and y = b when x = 0
export const linear = (first, second) => {
  const y1 = first.y;
  const y2 = second.y;
  const x1 = first.x;
  const x2 = second.x;
  let m;
  let b;

  if (x2 !== x1) {
    m = (y2 - y1) / (x2 - x1);
    b = x1 * m + y1;
  } else {
    m = 0;
    b = 0;
  }

  return {
    m: m,
    b: b,
  };
};
