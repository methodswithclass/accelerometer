<html>

<head>

	<!-- this module is not a dependency for accelerometer-1.js -->
	<link rel="stylesheet" href="http://code.methodswithclass.com/api/classes.css">

    <script src="https://code.jquery.com/jquery-3.2.1.min.js"></script>


	<script>

		(function () {

			setTimeout(function () {

				//parameters for numerical integration process and general motion behavior
				var params = {
					interval:2, //how often the accelerometer data is sampled in milliseconds
					filterSize:3, //how many accelerometer data points are averaged during filtering process
					factor:0.8, //sensitivity factor per accelerometer instance
					mu:0.1, //friction coefficient
					damp:0.4, //bounce dampening coeffiecient
					gravity:true, //does respond to tilting of device or only change in position of device (false)
					bounce:true //does bounce off walls, or sticks when it hits a boundary (false)
				}

				//object parameters, unless otherwise defined with html
				var objParams = {
					shape:"circle", //"square" and "cross" are other built in shapes, define your own shape with html (as children of DOM element) and exclude this value
					size:200, //in px
					color:"black" //color of object
				}

				var g = mcaccel.utility;

				/*
				these are global values above and beyond other set values
				they must be set per session on different devices through some calibration means 
				defaults are all positive one which may not give desired motion results
				*/
				g.setFactor(g.const.factorG, 0.01);
				g.setAxis(g.const.x, -1);
				g.setAxis(g.const.y, 1);


				//this element is going to be attached to the accelerometer data coming from the device and respond to changes
				var object = document.getElementById("object");
				var arena = document.getElementById("arena");


				//this is the wrapper object around the DOM element called from accelerometer-1.js
				var obj = new mcaccel.object({
					id:"object", // name of wrapper object for DOM element, can be anything
					arena:arena, //this is a dom element, it needs a parent element that will define the boundaries of it's motion
					params:objParams //inject object parameters
				});
					
				//this is the numerical intetgration module called from accelerometer-1.js
				var accel = new mcaccel.accelerometer({
					id:"accel", // name of accelerometer instance, can be anything
					object:obj, //this is the mcaccel wrapper object above, not the DOM object itself
					params:params //inject accelerometer parameters
				});

				accel.getMotion("accel" /*name of accelerometer instance, must be the same as instance above*/, function (id, pos, vel, acc) {

					//id in this scope is name of accelerometer instance
					//obj in this scope is the object wrapper instance of DOM element

					obj.setPosition(pos);
					obj.setVelocity(vel);
					obj.setAcceleration(acc);

				});

				//attach accelerometer callback to device motion window function, this is where the rubber meets road
				window.ondevicemotion = accel.motion;

				
				//reset accel instance to zero position (center of parent element), velocity, and acceleration 
				accel.reset();

				//start updating position of DOM element based on accelerometer data
				accel.start();


			}, 500);

		})();

	</script>

</head>

<body>

	<div class="absolute fill black-back">
		<div class="absolute width95 height95 center white-back lowered-dark" id="arena">
			<div id="object"></div>
		</div>
	</div>


	<script src="http://code.methodswithclass.com/api/accelerometer/1.2/accelerometer.js"></script>


</body>

</html>