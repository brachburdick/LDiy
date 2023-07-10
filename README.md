# LDiy 0.3
An open source lighting desk and previz software. Powered by Touchdesigner.
Designed to cut client task time by over 50% compared to other leading products like GrandMA, Chauvet, and ChamSys. 
Intuitive, accessible, and hardware agnostic.
Inspired by EnviralDesign's GeoPix and OpenLightingFixtures.
A 12South Entertainment product.


# The Vision
Bringing scenes to life on a stage should be as simple as describing them. 
This software provides a unified, agnostic method of providing instructions to stage hardware on any scale/configuration. When implemented, most hardware takes advantage of only a fraction of the functionality provided by the manufacturer, and the functionality sought after by designers is shared across nearly all hardware. 
Additionally, almost all scenes can be described mathematically. Pixel mapping channel values is a lightweight allows the user to intuitively describe what they want to see. 
Translating macros into a unified format and instructing fixutures intuitively eliminates countless hours of development.
"I want THIS pattern of colors and movement shown on THIS group of lights at THIS tempo." 
Describe it once, and you'll never have to program it again - for any fixture of lights, in any configuration, on any stage.
In the future, beat & phrase detection means that the show will practically run itsself. 

A comprehensive tutorial will be added soon.

# Stage:
The Stage's stage is a json object which holds information about all stage object instances: Fixtures, projectors, groups, geometries, macros, rendering tools, and metadata.
Stage files will first be accessed from the db. Each object instance in the stage file will reference another document based on the class's library and the specific instance's subclass.

# Libraries:
Each class of stage object has a library. The json documents in these libraries are designed to be lightweight and comprehensive to allow for ease of contribution. Functionality for rapid conversion from other formats (e.g.: OpenLightingProject) is in the works.

# TouchDesigner:
Current version of the application runs on TouchDesigner v2021.16410.

# Related Links:
https://12southband.com/
https://github.com/EnviralDesign/GeoPix
https://github.com/OpenLightingProject
https://derivative.ca/download/archive





