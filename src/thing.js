import { Vector, truncate } from './utils/utils';

const Arena = function (props) {
  const self = this;

  const { arena } = props;
  const container = document.getElementById(arena) || {};
  self.width = container?.offsetWidth;
  self.height = container?.offsetHeight;
};

const Thing = function (props) {
  const self = this;

  const { arena, object } = props;

  self.position = new Vector();
  self.velocity = new Vector();
  self.acceleration = new Vector();
  self.arena = new Arena({ arena });
  self.radius = self.width / 2;
  self.bounds = {};

  const getObject = () => {
    const container = document.getElementById(object) || { style: {} };
    container.style.zIndex = 1000;
    self.width = container.offsetWidth || 10;
    self.height = container.offsetHeight || 10;
    return container;
  };

  const getBounds = () => {
    getObject();
    self.bounds = {
      width: self.arena.width / 2 - self.width / 2,
      height: self.arena.height / 2 - self.height / 2,
    };
  };

  self.setPosition = (pos) => {
    const container = getObject();
    getBounds();

    self.position.set(pos);

    container.style.left =
      truncate(self.bounds.width + self.position.x, 0) + 'px';
    container.style.top =
      truncate(self.bounds.height + self.position.y, 0) + 'px';
  };

  self.setVelocity = (vel) => {
    self.velocity.set(vel);
  };

  self.setAcceleration = (accel) => {
    self.acceleration.set(accel);
  };

  self.hasHitWall = (_pos) => {
    getBounds();

    const pos = {
      x: _pos.x,
      y: _pos.y,
    };
    const sideX = pos.x / Math.abs(pos.x);
    const sideY = pos.y / Math.abs(pos.y);

    let xResult = { x: false };
    let yResult = { y: false };

    // console.log('debug status', _pos.x, _pos.y, self.bounds);

    if (Math.abs(pos.x) >= self.bounds.width) {
      xResult = {
        x: true,
        xmax: sideX * self.bounds.width,
      };
    }

    if (Math.abs(pos.y) >= self.bounds.height) {
      yResult = {
        y: true,
        ymax: sideY * self.bounds.height,
      };
    }

    return { ...xResult, ...yResult };
  };
};

export default Thing;
