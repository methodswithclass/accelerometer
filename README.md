
# Accelerometer


TLDR 

This package translates the acceleromter data being output by your device into velocity and position data so that objects in the DOM can be manipulated accoringly for cool affects.
Applications inlcude gaming, user interface controls, and more.


#######

This package is an engine that calculates by numerical integration the velocity and susequently the position, in real time, from the raw accelerometer data being automatically output from your device which is available through your browser.

The raw data will need to be scale factored significantly for object motion of DOM objects to match the scale of the device size. To properly implement this package, calibration software must be written to determine appropriate scale factors and adjust for the coordinate system of the user's device. It is possible that this software I have written for this purpose may be open sourced and available in the future.

