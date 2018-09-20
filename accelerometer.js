
/*

Accelerometer package

2017 Christopher Polito v1.2

*/


var obj = {};


(function (obj) {

	//private to this module, no public exposure, access with getters and setters
	var factor = {
		global:1,
		session:1.0
	};

	//private to this module, no public exposure, access with getters and setters
	var axis = {
		i:1,
		j:1
	}	

	//copy of utility object to reduce dependencies
	//private to this module, not exposed to public api
	var utility = {

		average:function (array, callback) {

			var sum = 0;
			var sumArray = [];

			if (callback) {

				for (i in array) {

					sum += callback(array[i], i, array);
				}

				return sum/array.length;

			}
			else {

				//console.log("average", array.length, array[0]);

				for (i in array) {
					for (j in array[i]) {
						sumArray[j] += array[i][j];
					}
				}

				//console.log("average", sumArray);

				var result = {};

				for (k in sumArray) {

					result[k] = sumArray[k]/array.length;
				}

				//console.log("average", result);

				return result;

			}

			
		},

		average_callback_value:function (value, index, array) {
			return value;
		},

		truncate:function (number, decimal) {

			var value = Math.floor(number*Math.pow(10, decimal))/Math.pow(10, decimal);
			
			return value;
		},

		round:function (number, order) {

			var value = Math.round(number/order)*order;

			return value;
		},

		resolveDigit:function (digit) {
			
			if (digit < 10) {
				return "0" + digit;	
			}
			else {
				return "" + digit;	
			}
		},

		log:function(x, num) {
 			return Math.log(x) / Math.log(num);
		},

		leadingzeros:function (number, zeros) {
			
			if (!zeros) zeros = 1;

			var digits = Math.floor(log(number*10, 10));
			var total = Math.floor(log(zeros, 10)) - digits;
			var leading = "";
			var i = 0;
			for (var i = 0; i <= total; i++) {
				leading += "0";
			}

			// console.log(leading + digit);

			return leading + digit;
		},

		shuffle:function (array) {
			var currentIndex = array.length, temporaryValue, randomIndex;

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
		},

		// generally solves a system of two linear equations of the form y = mx + b
		// inputs are two sets of y and x points, returns slope, m, and y = b when x = 0
		linear:function (params) {

			var y1 = params.y1;
			var y2 = params.y2;
			var x1 = params.x1;
			var x2 = params.x2;
			var m;
			var b;

			if (x2 != x1) {
				m = (y2-y1)/(x2-x1);
				b = x1*m + y1;
			}
			else {
				m = 0;
				b = 0;
			}

			return {
				m:m,
				b:b
			}

		}

	}

	//exposed to public api
	var vector = function (x,y,time) {

		var self = this;

		self.x = x;
		self.y = y;
		self.time = time;

		self.len = function () {
			return Math.sqrt(self.x*self.x + self.y*self.y);
		}
		
		self.add = function (v) {
			return new vector(self.x+v.x, self.y+v.y, self.time);
		}
		
		self.subtract = function(v) {
			return new vector(self.x-v.x, self.y-v.y, self.time);	
		}
		
		self.multiply = function (scalar) {
			return new vector(self.x*scalar, self.y*scalar, self.time);	
		}
		
		self.unit = function () {
			
			if (self.len() > 0) {
				return self.multiply(1/self.len());
			}
			else {
				return new vector(0,0,0);	
			}

		}

		self.set = function (v) {

			self.x = v.x;
			self.y = v.y;
			self.time = v.time;
		}
		
		self.printValues = function () {
			return "x: " + self.x + " y: " + self.y + " t: " + self.time;
		}

	}

	//public utility, exposed to public api
	var accelutility = {

		const:{
			factorG:"global",
			factorS:"session",
			x:"i",
			y:"j",
			dist:30
		},

		average:function (array) {

			var sumX = 0;
			var sumY = 0;

			for (i in array) {

				sumX += array[i].x;
				sumY += array[i].y;
			}

			//console.log("average", sumX/array.length);

			return new vector(sumX/array.length, sumY/array.length, array[array.length-1].time);

		},

		setDist:function (dist) {

			accelutility.const.dist = dist;
		},

		setFactor:function (type, _factor) {

			factor[type] = Math.abs(_factor);
			console.log("utility set factor", type, _factor);
		},

		getFactor:function (type) {

			if (type) return Math.abs(factor[type])
			else return Math.abs(factor.global*factor.session)
		},

		setAxis:function (_axis, value) {

			axis[_axis] = value >= 0 ? 1 : -1;
			console.log("utility set axis", _axis, value);
		},

		getAxis:function (_axis) {

			return axis[_axis] >= 0 ? 1 : -1;
		}

	}

	//public module, exposed to public api
	var object = function (input) {

		var self = this;

        var arena = input.arena;
        var container = document.createElement("div");
        container.style.position = "absolute";

        var createImage = function (arena, params) {

            // console.log("create image");

            var obj = document.createElement("img");
            obj.style.position = "absolute";
            obj.style.width = "100%";
            obj.style.height = "auto";
            obj.src = params.src;

            if (params.size) {
                container.style.width = params.size + "px";
                container.style.height = params.size + "px";
            }

            $(container).append(obj);
            $(arena).append(container);
        }

		var createCircle = function (arena, params) {

			// console.log("create circle");

			var obj = document.createElement("div");
			obj.style.position = "absolute";
			obj.style.width = "100%";
			obj.style.height = "100%";
			
			if (params.size) {
				container.style.width = params.size + "px";
				container.style.height = params.size + "px";
				// console.log("container size", params.size);
				obj.style.borderRadius = params.size/2 + "px";
			}

			if (params.color) obj.style.backgroundColor = params.color;

            $(container).append(obj);
            $(arena).append(container);
		}

		var createSquare = function (arena, params) {

			// console.log("create square");

            var obj = document.createElement("div");
			obj.style.position = "absolute";
			obj.style.width = "100%";
			obj.style.height = "100%";

			if (params.size) {
				container.style.width = params.size + "px";
				container.style.height = params.size + "px";
			}

			if (params.color) obj.style.backgroundColor = params.color;

            $(container).append(obj);
            $(arena).append(container);
		}

		var createCross = function (arena, params) {

			// console.log("create cross");

            var obj = document.createElement("div");
			obj.style.position = "absolute";
			obj.style.width = "100%";
			obj.style.height = "100%";
			
			if (params.size) {
				container.style.width = params.size + "px";
				container.style.height = params.size + "px";
			}

			obj.style.backgroundColor = "transparent";

			var vertical = document.createElement("div");
			var horizontal = document.createElement("div");

			vertical.style.position = "absolute";
			vertical.style.top = 0;
			vertical.style.left = "50%";
			vertical.style.width = "2px";
			vertical.style.height = "100%";
			if (params.color) vertical.style.backgroundColor = params.color;

			horizontal.style.position = "absolute";
			horizontal.style.top = "50%";
			horizontal.style.left = 0;
			horizontal.style.width = "100%";
			horizontal.style.height = "2px";
			if (params.color) horizontal.style.backgroundColor = params.color;

			$(obj).append(vertical);
			$(obj).append(horizontal);

            $(container).append(obj);
            $(arena).append(container);

		}

		var setShape = function (shape, params, arena) {

            // console.log("set object shape to", shape);

            container.innerHTML = "";
            container = null;
            container = document.createElement("div");
            container.style.position = "absolute";
            
			switch (shape) {

                case "image":
                    createImage(arena, params);
                    break;

				case "circle":
					createCircle(arena, params);
					break;

				case "square":
					createSquare(arena, params);
					break;

				case "cross":
					createCross(arena, params);
					break;
			}

		}

		self.name = input.id || "none";
		self.params = input.params || {};

		self.position = {x:0, y:0};
		self.velocity = {x:0, y:0};
        self.acceleration = { x: 0, y: 0 };


        if (input.params.shape) setShape(input.params.shape, input.params, arena);


        self.size = { x: 0, y: 0 };
        self.radius = 0;

        var getSize = function () {

            self.size = {
                x: container.offsetWidth,
                y: container.offsetHeight
            }

            self.radius = self.size.x / 2;

        }

        getSize();

        var util = utility;
        // var g = accelutility;


        var relPos = { x: 0, y: 0 };

        self.changeShape = function (shape, params) {

            setShape(shape, params, arena);

            getSize();
        }

        self.changeSize = function (size) {

            container.style.width = size + "px";
            container.style.height = size + "px";

            $(container).children(0).css({ borderRadius: size / 2 + "px" });

            getSize();
        }

		self.el = function () {

			return container;
		}

		self.setPosition = function (pos) {

			relPos = pos;
			
			self.position = new vector(relPos.x, relPos.y, relPos.time);
			
			container.style.left = util.truncate(self.position.x,0) + "px";
			container.style.top = util.truncate(self.position.y,0) + "px";
			
		}

		self.setVelocity = function (vel) {
			self.velocity = vel;
		}

		self.setAcceleration = function (acc) {
			self.acceleration = acc;
		}

		self.screenPos = function () {

			return {
				x:self.el().getBoundingClientRect().left,
				y:self.el().getBoundingClientRect().top
			}
		}

		self.relativePos = function () {
			return relPos;
		}

		self.absolutePos = function () {

			var screenPos = self.screenPos();

			return {
				x:screenPos.x,
				y:screenPos.y
			}
		}

		self.hide = function () {

			self.setPosition(relPos);

			self.el().style.visibility = "hidden";
		}

		self.show = function() {

			self.setPosition(relPos);

			self.el().style.visibility = "visible";
		}

	}


	//public module, exposed to public api
	var accelerometer = function (input) {

		var self = this;

		// var util = utility;
		var g = accelutility;

		self.name = input.id || "none";
		var obj = input.object;
		var arena = obj.el().parentElement;
		var p = input.params || {};

		var filterBucket = [];

		var factor = g.getFactor()*p.factor || 1;
		var xDir = g.getAxis(g.const.x) || 1;
		var yDir = g.getAxis(g.const.y) || 1;
		var threshold = factor*0.5;
		var mu = p.mu || 0.5;
		var damp = p.damp || 0.5;
		var interval = p.interval || 10;
		var filterSize = p.filterSize || 3;
		var gravity = p.gravity;
		var bounce = p.bounce;
		
		var unfiltered = new vector(0,0,0);
		var accel1 = new vector(0,0,0);
		var accel0 = new vector(0,0,0);
		var vel0 = new vector(0,0,0);
		var vel1 = new vector(0,0,0);
		var pos0 = new vector(0,0,0);
		var pos1 = new vector(0,0,0);
		var raw = {x:0, y:0};
		var startTime = 0;

		var timer;
		var running = false;

		self.bounds = {x:100, y:100};

		var getBounds = function () {

			self.bounds = {
				x:arena.offsetWidth/2 - obj.size.x/2,
				y:arena.offsetHeight/2 - obj.size.y/2
			}

			// console.log("get bounds", arena.offsetWidth, obj.size.x/2, self.bounds);
		}

		var bounce = function () {
			
			var sideX = pos1.x/Math.abs(pos1.x);
			
			var minVel = 12*(Math.abs(accel1.y)+Math.abs(accel1.x));
			
			if (Math.abs(pos1.x) >= self.bounds.x) {

				pos1.x	= sideX*self.bounds.x;
				vel1.x = -(1-damp)*vel1.x;
				if ((Math.abs(vel1.x) < minVel && gravity) || !bounce) {
					vel1.x = 0;	
				}
			}
			
			var sideY = pos1.y/Math.abs(pos1.y);

			if (Math.abs(pos1.y) >= self.bounds.y) {
				pos1.y	= sideY*self.bounds.y;
				vel1.y = -(1-damp)*vel1.y;
				if ((Math.abs(vel1.y) < minVel && gravity) || !bounce) {
					vel1.y = 0;
				}
			}
				
		}

		var friction = function () {
				
			if (accel1.len() == 0) {
				vel1 = vel1.multiply(1-mu);	
			}
		}

		var updateMotion = function (_pos, vel, acc) {

			//console.log("update", _pos, self.bounds);

			var pos = new vector(self.bounds.x + _pos.x, self.bounds.y + _pos.y, unfiltered.time);

			window.dispatchEvent((new CustomEvent('accel' + self.name, {'detail':{pos:pos, vel:vel, acc:acc}})));
		}

		var integrate = function (accelArray) {
				
			accel1.set(g.average(accelArray));
			
			if (accel1.len() < threshold) {
				accel1.set(new vector(0,0,accel1.time));
			}
			
			var timeInterval = interval*filterSize;

			vel1.set(vel0.add(accel0.multiply(timeInterval)).add(accel1.subtract(accel0).multiply(0.5*timeInterval)));
			pos1.set(pos0.add(vel0.multiply(timeInterval)).add(vel1.subtract(vel0).multiply(0.5*timeInterval)));

			bounce();
			friction();
			
			updateMotion(pos1, vel1, accel1);
			
			pos0.set(pos1);
			vel0.set(vel1);
			accel0.set(accel1);
		}

		self.updateParams = function (p) {

			factor = g.getFactor()*p.factor || factor;
			xDir = g.getAxis(g.const.x) || xDir;
			yDir = g.getAxis(g.const.y) || yDir;
			threshold = factor*0.5 || threshold;
			mu = p.mu || mu;
			damp = p.damp || damp;
			interval = p.interval || interval;
			filterSize = p.filterSize || filterSize;
			gravity = p.gravity || gravity;

		}

		self.motion = function (e) {
			
			raw = {
				gravity:{
					x:e.accelerationIncludingGravity.x,
					y:e.accelerationIncludingGravity.y
				},
				abs:{
					x:e.acceleration.x,
					y:e.acceleration.y
				}
			}

			if (running) {

				if (gravity) {
					unfiltered.set(new vector(xDir*factor*raw.gravity.x, yDir*factor*raw.gravity.y, (e.timeStamp - startTime)/1000));
				}
				else {
					unfiltered.set(new vector(xDir*factor*raw.abs.x, yDir*factor*raw.abs.y, (e.timeStamp - startTime)/1000));
				}

				//console.log("raw", "x", raw.gravity.x, "y", raw.gravity.y);
			}
		}

		self.start = function () {
				
			console.log("start accel");

			self.updateParams(p);
			
			getBounds();

			running = true;
			
			startTime = (new Date()).getTime();
			
			timer = setInterval(function () {
				
				filterBucket[filterBucket.length] = unfiltered;
					
				if (filterBucket.length == filterSize) {
					
					integrate(filterBucket);
					
					filterBucket = [];	
				}
				
			}, interval);
		}
		
		self.stop = function () {
			
			console.log("stop accel");
			
			running = false;
			
			if (timer) {
				clearInterval(timer);
				timer = {};
				timer = null;
			}

		}

		self.reset = function () {
			
			console.log("reset accel", self.name);

			getBounds();

			filterBucket = [];
			
			unfiltered = new vector(0,0,0);
			accel0 = new vector(0,0,0);
			vel0 = new vector(0,0,0);
			pos0 = new vector(0,0,0);
			startTime = 0;
			
			updateMotion(pos0, vel0, accel0);	
		}
		
		self.getMotion = function (id, func) {

			window.addEventListener("accel" + id, function (e) {
				func(id, e.detail.pos, e.detail.vel, e.detail.acc);
			}, false);
				
		}

		self.raw = function () {
			return raw;
		}

		self.unfiltered = function () {
			return unfiltered;
		}

	}

	obj.mcaccel = {
		utility:accelutility,
		vector:vector,
		object:object,
		accelerometer:accelerometer
	};


})(obj);




try {
	window.mcaccel = obj.mcaccel;
}
catch (e) {
	console.log(e.message);
}

try {
	module.exports = obj.mcaccel;
}
catch (e) {
	console.log(e.message);
}



