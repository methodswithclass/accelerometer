class Vector {
  x: number;
  y: number;
  time: number;

  constructor(x: number, y: number, time: number) {
    this.x = x;
    this.y = y;
    this.time = time;
  }

  len = () => {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  };

  add = (v: Vector) => {
    return new Vector(this.x + v.x, this.y + v.y, this.time);
  };

  subtract = (v: Vector) => {
    return new Vector(this.x - v.x, this.y - v.y, this.time);
  };

  multiply = (scalar: number) => {
    return new Vector(this.x * scalar, this.y * scalar, this.time);
  };

  unit = () => {
    if (this.len() > 0) {
      return this.multiply(1 / this.len());
    } else {
      return new Vector(0, 0, 0);
    }
  };

  set = (v: Vector) => {
    this.x = v.x;
    this.y = v.y;
    this.time = v.time;
  };

  printValues = () => {
    return 'x: ' + this.x + ' y: ' + this.y + ' t: ' + this.time;
  };
}

export type plainVector = {
  x: number;
  y: number;
};

export default Vector;
