# Masonry
A JS library built for quickly distributing 'tiles' of random sizes onto a given container in a Masonry layout

EXAMPLES:
http://meeksfigs.surge.sh

download and try the simple demo!


How To:
INITIALIZE
In order to create a new Masonry object, simply set a variable to 'new Masonry()'. The Masonry object takes 3 arguments, 1 of which is mandatory.
The first argument is an HTML element. This element will be the container for the actual Masonry display.
The second argument is a distribution. It has three possible values: "center" (default), "left", and "top". These control how the tiles will be stacked.
The third argument is the resolution (default 32). This controls the amount of rows the Masonry container will be divided into. Increase it to get smaller tiles.

OTHER FUNCTIONS
'app.placeTilesByClass("class")'
  This will grab all elements of the given class name and display them inside the Masonry as randomly-sized tiles.
  The size of these placed tiles can be controlled by the addition of a 'height' and/or 'width' attribute in the html element, which takes integers
 
'app.placeGeneratedTile(["classname", "classname],"style attribute","html content")'
  This will create a new Tile and place it on the Masonry. The first argument is an array of class names, the second is the content of the style attribute, while the third is the html content of the future tile itself
