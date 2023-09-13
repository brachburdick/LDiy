# LDiy 0.4
An open source lighting desk and previz software.<br>
Designed to cut client task time by over 50% compared to other leading products like GrandMA, Chauvet, and ChamSys. <br>
Intuitive, accessible, and hardware agnostic.<br>
Inspired by EnviralDesign's GeoPix and OpenLightingFixtures.<br>
A 12South Entertainment product.<br>

# Current Status
Shifting away from Touchdesigner now that I've got the bones down. Trying for webapp, but currently the DMX library I'm using relies on Node core modules. If I have time I'm going to try to fork it and adapt it for browser use. If that doesn't work I'll just bundle with Electron. Currently the webapp demonstrates only the most barebones of functionality, but it does demonstrate the utility of taking a hw - agnostic approach.


# The Vision
Bringing scenes to life on a stage should be as simple as describing them. <br>
This software provides a unified, agnostic method of providing instructions to stage hardware on any scale/configuration. When implemented, most hardware takes advantage of only a fraction of the functionality provided by the manufacturer, and the functionality sought after by designers is shared across nearly all hardware. 
Additionally, almost all scenes can be described mathematically. Pixel mapping channel values is a lightweight allows the user to intuitively describe what they want to see. <br>
Translating macros into a unified format and instructing fixutures intuitively eliminates countless hours of development.<br>
"I want THIS pattern of colors and movement shown on THIS group of lights at THIS tempo." <br>
Describe it once, and you'll never have to program it again - for any fixture of lights, in any configuration, on any stage.<br>
In the future, beat & phrase detection means that the show will practically run itsself. <br>
<br>
A comprehensive tutorial will be added soon.<br>

# Stage:
The Stage's stage is a json object which holds information about all stage object instances: Fixtures, projectors, groups, geometries, macros, rendering tools, and metadata.<br>
Stage files will first be accessed from the db. Each object instance in the stage file will reference another document based on the class's library and the specific instance's subclass.<br>

# Libraries:
Each class of stage object has a library. The json documents in these libraries are designed to be lightweight and comprehensive to allow for ease of contribution. Functionality for rapid conversion from other formats (e.g.: OpenLightingProject) is in the works.<br>

# TouchDesigner:
Current version of the application runs on TouchDesigner v2021.16410.<br>


![image](https://github.com/brachburdick/LDiy/assets/107267496/a56dfd0d-c672-4591-9344-4e28410eb480)


# Related Links:
https://12southband.com/<br>
https://github.com/EnviralDesign/GeoPix<br>
https://github.com/OpenLightingProject<br>
https://derivative.ca/download/archive<br>





