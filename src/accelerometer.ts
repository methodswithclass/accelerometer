import Vector, { plainVector } from './vector';
import g from './utils/accelutility';

//public module, exposed to public api
class Accelerometer {
  private demo: boolean;
  private obj: any;
  private arena: any;
  private p: any;

  private filterBucket: Vector[] = [];

  private factor: number;
  private xDir: number = g.getAxis(g.const.x) || 1;
  private yDir: number = g.getAxis(g.const.y) || 1;
  private threshold: number;

  private mu: number;
  private damp: number;
  private interval: number;
  private filterSize: number;
  private gravity: number;
  private doesBounce: boolean;

  private $unfiltered: Vector = new Vector(0, 0, 0);
  private demoInput: Vector = new Vector(0, 0, 0);
  private accel1: Vector = new Vector(0, 0, 0);
  private accel0: Vector = new Vector(0, 0, 0);
  private vel0: Vector = new Vector(0, 0, 0);
  private vel1: Vector = new Vector(0, 0, 0);
  private pos0: Vector = new Vector(0, 0, 0);
  private pos1: Vector = new Vector(0, 0, 0);
  private $raw: plainVector = { x: 0, y: 0 };
  private startTime: number = 0;
  private currentTime: number = 0;

  private timer: any;
  private running: boolean = false;

  bounds: plainVector = { x: 100, y: 100 };
  name: string;

  constructor(input: any) {
    this.name = input.id || 'none';
    this.demo = input.demo || false;
    this.obj = input.object;
    this.arena = this.obj.el().parentElement;
    this.p = input.params || {};
    this.factor = g.getFactor() * this.p.factor || 1;
    this.threshold = this.factor * 0.5;

    this.mu = this.p.mu || 0.5;
    this.damp = this.p.damp || 0.5;
    this.interval = this.p.interval || 10;
    this.filterSize = this.p.filterSize || 3;
    this.gravity = this.p.gravity;
    this.doesBounce = this.p.bounce;
  }

  private startDemo = () => {
    window.addEventListener('touchmove', (e) => {
      let raw = {
        x: e.touches[0].clientX - this.arena?.offsetWidth / 2 || 0,
        y: e.touches[0].clientY - this.arena?.offsetHeight / 2 || 0,
      };
      this.demoInput.set(
        new Vector(
          this.xDir * this.factor * raw.x,
          this.yDir * this.factor * raw.y,
          this.currentTime
        )
      );
    });
  };

  private getBounds = () => {
    this.bounds = {
      x: this.arena?.offsetWidth / 2 - this.obj?.size.x / 2,
      y: this.arena?.offsetHeight / 2 - this.obj?.size.y / 2,
    };

    // console.log("get bounds", arena.offsetWidth, obj.size.x/2, this.bounds);
  };

  private bounce = () => {
    var sideX = this.pos1.x / Math.abs(this.pos1.x);

    var minVel = 12 * (Math.abs(this.accel1.y) + Math.abs(this.accel1.x));

    if (Math.abs(this.pos1.x) >= this.bounds.x) {
      this.pos1.x = sideX * this.bounds.x;
      this.vel1.x = -(1 - this.damp) * this.vel1.x;
      if (
        (Math.abs(this.vel1.x) < minVel && this.gravity) ||
        !this.doesBounce
      ) {
        this.vel1.x = 0;
      }
    }

    var sideY = this.pos1.y / Math.abs(this.pos1.y);

    if (Math.abs(this.pos1.y) >= this.bounds.y) {
      this.pos1.y = sideY * this.bounds.y;
      this.vel1.y = -(1 - this.damp) * this.vel1.y;
      if (
        (Math.abs(this.vel1.y) < minVel && this.gravity) ||
        !this.doesBounce
      ) {
        this.vel1.y = 0;
      }
    }
  };

  private friction = () => {
    if (this.accel1.len() == 0) {
      this.vel1 = this.vel1.multiply(1 - this.mu);
    }
  };

  private updateMotion = (_pos: Vector, vel: Vector, acc: Vector) => {
    //console.log("update", _pos, this.bounds);

    var pos = new Vector(
      this.bounds.x + _pos.x,
      this.bounds.y + _pos.y,
      this.$unfiltered.time
    );

    window.dispatchEvent(
      new CustomEvent('accel' + this.name, {
        detail: { pos: pos, vel: vel, acc: acc },
      })
    );
  };

  private integrate = (accelArray: Vector[]) => {
    this.accel1.set(g.average(accelArray));

    if (this.accel1.len() < this.threshold) {
      this.accel1.set(new Vector(0, 0, this.accel1.time));
    }

    var timeInterval = this.interval * this.filterSize;

    this.vel1.set(
      this.vel0
        .add(this.accel0.multiply(timeInterval))
        .add(this.accel1.subtract(this.accel0).multiply(0.5 * timeInterval))
    );
    this.pos1.set(
      this.pos0
        .add(this.vel0.multiply(timeInterval))
        .add(this.vel1.subtract(this.vel0).multiply(0.5 * timeInterval))
    );

    this.bounce();
    this.friction();

    this.updateMotion(this.pos1, this.vel1, this.accel1);

    this.pos0.set(this.pos1);
    this.vel0.set(this.vel1);
    this.accel0.set(this.accel1);
  };

  updateParams = (p: any) => {
    this.factor = g.getFactor() * p.factor || this.factor;
    this.xDir = g.getAxis(g.const.x) || this.xDir;
    this.yDir = g.getAxis(g.const.y) || this.yDir;
    this.threshold = this.factor * 0.5 || this.threshold;
    this.mu = p.mu || this.mu;
    this.damp = p.damp || this.damp;
    this.interval = p.interval || this.interval;
    this.filterSize = p.filterSize || this.filterSize;
    this.gravity = p.gravity || this.gravity;
  };

  motion = (e: any) => {
    const $raw = {
      gravity: {
        x: e.accelerationIncludingGravity.x,
        y: e.accelerationIncludingGravity.y,
      },
      abs: {
        x: e.acceleration.x,
        y: e.acceleration.y,
      },
    };

    if (this.running && !this.demo) {
      if (this.gravity) {
        this.$unfiltered.set(
          new Vector(
            this.xDir * this.factor * $raw.gravity.x,
            this.yDir * this.factor * $raw.gravity.y,
            (e.timeStamp - this.startTime) / 1000
          )
        );
      } else {
        this.$unfiltered.set(
          new Vector(
            this.xDir * this.factor * $raw.abs.x,
            this.yDir * this.factor * $raw.abs.y,
            (e.timeStamp - this.startTime) / 1000
          )
        );
      }

      //console.log("$raw", "x", $raw.gravity.x, "y", $raw.gravity.y);
    }
  };

  start = () => {
    console.log('start accel');

    this.updateParams(this.p);
    this.getBounds();

    if (this.demo) {
      this.startDemo();
    }

    this.running = true;
    this.startTime = new Date().getTime();
    this.currentTime = this.startTime;

    this.timer = setInterval(() => {
      this.currentTime = this.currentTime + this.interval;
      this.filterBucket[this.filterBucket.length] = this.demo
        ? this.demoInput
        : this.$unfiltered;

      if (this.filterBucket.length == this.filterSize) {
        this.integrate(this.filterBucket);

        this.filterBucket = [];
      }
    }, this.interval);
  };

  stop = () => {
    console.log('stop accel');

    this.running = false;

    if (this.timer) {
      clearInterval(this.timer);
      this.timer = {};
      this.timer = null;
    }
  };

  reset = () => {
    console.log('reset accel', this.name);

    this.getBounds();

    this.filterBucket = [];

    this.$unfiltered = new Vector(0, 0, 0);
    this.accel0 = new Vector(0, 0, 0);
    this.vel0 = new Vector(0, 0, 0);
    this.pos0 = new Vector(0, 0, 0);
    this.startTime = 0;

    this.updateMotion(this.pos0, this.vel0, this.accel0);
  };

  getMotion = (id: string, func: any) => {
    window.addEventListener(
      'accel' + id,
      (e: any) => {
        func(id, e.detail.pos, e.detail.vel, e.detail.acc);
      },
      false
    );
  };

  raw = () => {
    return this.$raw;
  };

  unfiltered = () => {
    return this.$unfiltered;
  };
}

export default Accelerometer;
