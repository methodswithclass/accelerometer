export const average = (array: any[][], callback: any) => {
  var sum: number = 0;
  var sumArray: any[] = [];

  if (callback) {
    for (let i in array) {
      sum += callback(array[i], i, array);
    }

    return sum / array.length;
  } else {
    //console.log("average", array.length, array[0]);
    // for (let i in array) {
    //   for (let j in array[i]) {
    //     sumArray[sumArray.length] += array[i][j];
    //   }
    // }
    // //console.log("average", sumArray);
    // var result: { [k: string | number]: number } = {};
    // for (let k in sumArray) {
    //   result[] = sumArray[k] / array.length;
    // }
    // //console.log("average", result);
    // return result;
  }
};

export const average_callback_value = (
  value: any,
  index: any,
  array: any[]
) => {
  return value;
};

export const truncate = (number: number, decimal: number) => {
  var value =
    Math.floor(number * Math.pow(10, decimal)) / Math.pow(10, decimal);

  return value;
};

export const round = function (number: number, order: number) {
  var value = Math.round(number / order) * order;

  return value;
};

export const resolveDigit = (digit: number) => {
  return digit < 10 ? `0${digit}` : `${digit}`;
};

export const log = (x: number, num: number) => {
  return Math.log(x) / Math.log(num);
};

export const leadingzeros = (number: number, zeros: number) => {
  if (!zeros) zeros = 1;

  var digits = Math.floor(log(number * 10, 10));
  var total = Math.floor(log(zeros, 10)) - digits;
  var leading = '';
  var i = 0;
  for (var i = 0; i <= total; i++) {
    leading += '0';
  }

  // console.log(leading + digit);

  return leading + digits;
};

export const shuffle = (array: any[]) => {
  var currentIndex: number = array.length,
    temporaryValue: number,
    randomIndex: number;

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
export const linear = (params: any) => {
  var y1 = params.y1;
  var y2 = params.y2;
  var x1 = params.x1;
  var x2 = params.x2;
  var m;
  var b;

  if (x2 != x1) {
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
