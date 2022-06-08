import Vector, { plainVector } from './vector';
import * as util from './utils/utils';

class MovableThing {
  private arena: any;
  private container: any;
  private relPos: any = { x: 0, y: 0 };

  name: string;
  params: any;
  position: plainVector;
  velocity: plainVector;
  acceleration: plainVector;

  size: any;
  radius: number;

  constructor(input: any) {
    this.arena = input.arena;

    this.name = input.id || 'none';
    this.params = input.params || {};

    this.position = { x: 0, y: 0 };
    this.velocity = { x: 0, y: 0 };
    this.acceleration = { x: 0, y: 0 };

    this.container = document.createElement('div');
    this.container.style.position = 'absolute';

    if (input.params.shape)
      this.setShape(input.params.shape, input.params, this.arena);

    this.size = { x: 0, y: 0 };
    this.radius = 0;

    this.getSize();
  }

  private noChildren = (obj: any) => {
    return typeof obj?.children === 'undefined' || obj?.children?.length === 0;
  };

  private createImage = (arena: any, params: any) => {
    console.log('create image');
    var obj = document.createElement('img');
    obj.style.position = 'absolute';
    obj.style.width = '100%';
    obj.style.height = 'auto';
    obj.src = params.src;
    if (params.size) {
      this.container.style.width = params.size + 'px';
      this.container.style.height = params.size + 'px';
    }
    this.container.appendChild(obj);
    if (this.noChildren(this.arena)) {
      this.arena.appendChild(this.container);
    }
  };

  private createCircle = (arena: any, params: any) => {
    console.log('create circle');
    var obj = document.createElement('div');
    obj.style.position = 'absolute';
    obj.style.width = '100%';
    obj.style.height = '100%';
    if (params.size) {
      this.container.style.width = params.size + 'px';
      this.container.style.height = params.size + 'px';
      // console.log("container size", params.size);
      obj.style.borderRadius = params.size / 2 + 'px';
    }
    if (params.color) obj.style.backgroundColor = params.color;
    this.container.appendChild(obj);
    if (this.noChildren(this.arena)) {
      this.arena.appendChild(this.container);
    }
  };

  private createSquare = (arena: any, params: any) => {
    console.log('create square');
    var obj = document.createElement('div');
    obj.style.position = 'absolute';
    obj.style.width = '100%';
    obj.style.height = '100%';
    if (params.size) {
      this.container.style.width = params.size + 'px';
      this.container.style.height = params.size + 'px';
    }
    if (params.color) obj.style.backgroundColor = params.color;
    this.container.appendChild(obj);
    if (this.noChildren(this.arena)) {
      this.arena.appendChild(this.container);
    }
  };

  private createCross = (arena: any, params: any) => {
    console.log('create cross');
    var obj = document.createElement('div');
    obj.style.position = 'absolute';
    obj.style.width = '100%';
    obj.style.height = '100%';
    if (params.size) {
      this.container.style.width = params.size + 'px';
      this.container.style.height = params.size + 'px';
    }
    obj.style.backgroundColor = 'transparent';
    var vertical = document.createElement('div');
    var horizontal = document.createElement('div');
    vertical.style.position = 'absolute';
    vertical.style.top = '0';
    vertical.style.left = '50%';
    vertical.style.width = '2px';
    vertical.style.height = '100%';
    if (params.color) vertical.style.backgroundColor = params.color;
    horizontal.style.position = 'absolute';
    horizontal.style.top = '50%';
    horizontal.style.left = '0';
    horizontal.style.width = '100%';
    horizontal.style.height = '2px';
    if (params.color) horizontal.style.backgroundColor = params.color;
    obj.appendChild(vertical);
    obj.appendChild(horizontal);
    this.container.appendChild(obj);
    if (this.noChildren(this.arena)) {
      this.arena.appendChild(this.container);
    }
  };

  private setShape = (shape: string, params: any, arena: any) => {
    // console.log("set object shape to", shape);

    // container.innerHTML = "";
    // container = null;
    // container = document.createElement("div");
    // container.style.position = "absolute";

    switch (shape) {
      case 'image':
        this.createImage(arena, params);
        break;

      case 'circle':
        this.createCircle(arena, params);
        break;

      case 'square':
        this.createSquare(arena, params);
        break;

      case 'cross':
        this.createCross(arena, params);
        break;
    }
  };

  private getSize = () => {
    this.size = {
      x: this.container.offsetWidth,
      y: this.container.offsetHeight,
    };

    this.radius = this.size.x / 2;
  };

  changeShape = (shape: any, params: any) => {
    this.setShape(shape, params, this.arena);

    this.getSize();
  };

  changeSize = (size: number | string) => {
    this.container.style.width = size + 'px';
    this.container.style.height = size + 'px';

    // $(container).children(0).css({ borderRadius: size / 2 + "px" });

    this.getSize();
  };

  el = () => {
    return this.container;
  };

  setPosition = (pos: Vector) => {
    this.relPos = pos;

    this.position = new Vector(this.relPos.x, this.relPos.y, this.relPos.time);

    this.container.style.left = util.truncate(this.position.x, 0) + 'px';
    this.container.style.top = util.truncate(this.position.y, 0) + 'px';
  };

  setVelocity = (vel: Vector) => {
    this.velocity = vel;
  };

  setAcceleration = (acc: Vector) => {
    this.acceleration = acc;
  };

  screenPos = () => {
    return {
      x: this.el().getBoundingClientRect().left,
      y: this.el().getBoundingClientRect().top,
    };
  };

  relativePos = () => {
    return this.relPos;
  };

  absolutePos = () => {
    var screenPos = this.screenPos();

    return {
      x: screenPos.x,
      y: screenPos.y,
    };
  };

  hide = () => {
    this.setPosition(this.relPos);

    this.el().style.visibility = 'hidden';
  };

  show = () => {
    this.setPosition(this.relPos);

    this.el().style.visibility = 'visible';
  };
}

export default MovableThing;
