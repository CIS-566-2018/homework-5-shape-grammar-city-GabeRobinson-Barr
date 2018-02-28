
# Project 5: Shape Grammar

Gabriel Robinson-Barr
## Things to know about my city grammars.
Each building is created in Building.ts and the design is determined by the type of building. The actual building grammar is near impossible to read, and I'm sorry for that, but by the time I realized how unreadable and messy it was I was way too far in to go back and fix it. Ill list an abbreviated version of the rules here.

Houses -
Must have one door in the front on the ground floor.
Can have single or double windows in any of the other slots.
Can have flat or pointed roofs.

Big Houses (mansions) -
Can have 2-3 doors in the front.
Only have double windows.
Can have auxillary buildings to their left, right, or both.
Have pointed roofs.

Hotels -
Can be one rectangle building or have one to two building extentions.
Alternate doors and windows on the front, and possibly the back.
Have flat roofs.

Offices -
Have windows on every section above ground floor.
Can have parts that stick out one section further than the rest of the building on any wall.
Have flat roofs.

Skyscrapers -
3 types of sky scrapers, Flat roof, slanted roof, and round roof buildings.
Each of these has the same body of the building, except round roof buildings are round instead of square.
Have rows of windows separated by small floor dividers.
Flat and slanted roofs can stack roofs on top of each other to look cooler.


That is the basic layout for every unreadable rule in the building class. If you want to look at individual buildings and only generate random buildings, go into main.ts, set controls.SingleBuilding to true as the default value, and set the camera's initialized value to something like location - (0, 10, -20), and look - (0, 5, 0). As its set now it is super zoomed out to be able to see the entire city. Once you are in single building mode you can change the width/depth/height of buildings and hit reset scene to get a random building. Some of the buildings don't look good if they aren't square since I always make them roughly square in my city.


For the gui, hitting the 'Grow City' button will grow the city by one iteration. This is the only implemented way to get a city at higher iterations. The rules in City.ts are fairly easy to understand, and mostly consist of rules about what kind of building to create at certain distances from other buildings. All citys start with nothing but mansions, since only rich people can afford to settle land. Sometimes when iterating the growth it can take a few iterations to really get going, but once there are buildings other than just mansions the citys tend to grow quickly. Buildings can also get bigger as the city grows, but this is not particularly noticable. There is some collision and the building grammar isn't perfect.

For this assignment you'll be building directly off of the L-system code you
wrote last week.

**Goal:** to model an urban environment using a shape grammar.

**Note:** We’re well aware that a nice-looking procedural city is a lot of work for a single week. Focus on designing a nice building grammar. The city layout strategies outlined in class (the extended l-systems) are complex and not expected. We will be satisfied with something reasonably simple, just not a uniform grid!

## Symbol Node (5 points)
Modify your symbol node class to include attributes necessary for rendering, such as
- Associated geometry instance
- Position
- Scale
- Anything else you may need

## Grammar design (55 points)
- Design at least five shape grammar rules for producing procedural buildings. Your buildings should vary in geometry and decorative features (beyond just differently-scaled cubes!). At least some of your rules should create child geometry that is in some way dependent on its parent’s state. (20 points)
    - Eg. A building may be subdivided along the x, y, or z axis into two smaller buildings
    - Some of your rules must be designed to use some property about its location. (10 points)
    - Your grammar should have some element of variation so your buildings are non-deterministic.  Eg. your buildings sometimes subdivide along the x axis, and sometimes the y. (10 points)   
- Write a renderer that will interpret the results of your shape grammar parser and adds the appropriate geometry to your scene for each symbol in your set. (10 points)

## Create a city (30 points)
- Add a ground plane or some other base terrain to your scene (0 points, come on now)
- Using any strategy you’d like, procedurally generate features that demarcate your city into different areas in an interesting and plausible way (Just a uniform grid is neither interesting nor plausible). (20 points)
    - Suggestions: roads, rivers, lakes, parks, high-population density
    - Note, these features don’t have to be directly visible, like high-population density, but they should somehow be visible in the appearance or arrangement of your buildings. Eg. High population density is more likely to generate taller buildings
- Generate buildings throughout your city, using information about your city’s features. Color your buildings with a method that uses some aspect of its state. Eg. Color buildings by height, by population density, by number of rules used to generate it. (5 points)
- Document your grammar rules and general approach in the readme. (5 points)
- ???
- Profit.

## Make it interesting (10)
Experiment! Make your city a work of art.

## Warnings:
If you're not careful with how many draw calls you make in a single `tick()`,
you can very easily blow up your CPU with this assignment. As with the L-system,
try to group geometry into one VBO so the run-time of your program outside of
the time spent generating the city is fast.

## Suggestions for the overachievers:
Go for a very high level of decorative detail!
Place buildings with a strategy such that buildings have doors and windows that are always accessible.
Generate buildings with coherent interiors
If dividing your city into lots, generate odd-shaped lots and create building meshes that match their shape .i.e. rather than working with cubes, extrude upwards from the building footprints you find to generate a starting mesh to subdivide rather than starting with platonic geometry.
