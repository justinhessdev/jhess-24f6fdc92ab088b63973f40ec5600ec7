"use strict";
/* globals _, engine */
window.initGame = function () {
  console.log("initgame");
  // you're really better off leaving this line alone, i promise.
  const command =
    "5 3 \n 1 1 s\n ffffff\n 2 1 w \n flfffffrrfffffff\n 0 3 w\n LLFFFLFLFL";

  let bounds = [];
  const outOfBoundsLocations = [];

  // task #1
  const parseInput = (input) => {
    // es6 way to destructure array with first item (bounds) and rest of items (robots)
    const [inputBounds, ...inputRobos] = input
      .split("\n")
      .map((item) => item.split(" ").filter(Boolean));

    bounds = inputBounds.map((val) => parseInt(val));
    const robos = createRobos(inputRobos); // take rest of our input to create robos array (createRobos declaration in helpers.js)
    const parsed = {
      bounds,
      robos,
    };

    return parsed;
  };

  // task #2
  const tickRobos = (robos) => {
    for (let i = 0; i < robos.length; i++) {
      let firstInstruction = "";
      if (robos[i].command) {
        firstInstruction = robos[i].command[0].toUpperCase();
        const orientation = robos[i].o.toUpperCase();
        if (firstInstruction === "F") {
          // do a quick test if robo is at edge. if so we don't move forward
          if (!isRoboAtEdge(robos[i], outOfBoundsLocations)) {
            const newCoordinates = cardinals[orientation]["forward"](
              robos[i].x,
              robos[i].y
            );
            robos[i] = {
              ...robos[i],
              ...newCoordinates,
            };
          }
        }

        if (firstInstruction === "L" || firstInstruction === "R") {
          robos[i].o = cardinals[orientation][firstInstruction];
        }

        robos[i].command = robos[i].command.substring(1);
      }

      // Checks if robot went out of bounds
      // If so add that location to our outOfBoundsLocation arr to leave the 'scent' for other robos
      // and remove that robot from our robos array
      const isRoboOutOfBounds = checkBounds(robos[i], bounds);
      if (isRoboOutOfBounds) {
        const roboLocation = robos.splice(i, 1)[0]; // splice returns an array so i add zero to get the item that was deleted
        addOutofBoundsLocation(roboLocation, bounds, outOfBoundsLocations);
      }
    }

    // return the mutated robos object from the input to match the new state
    return robos;
  };

  // task #3
  const missionSummary = (robos) => {
    const ulRobots = document.getElementById("robots");
    for (let i = 0; i < robos.length; i++) {
      const li = document.createElement("li");
      li.appendChild(
        document.createTextNode(
          `Position: ${robos[i].x}, ${robos[i].y} | Orientation: ${robos[i].o}`
        )
      );
      ulRobots.appendChild(li);
    }

    const ulLostRobots = document.getElementById("lostRobots");
    for (let i = 0; i < outOfBoundsLocations.length; i++) {
      const li = document.createElement("li");
      li.appendChild(
        document.createTextNode(
          `Lost contact going ${outOfBoundsLocations[i].o} from coordinates: ${outOfBoundsLocations[i].x}, ${outOfBoundsLocations[i].y}`
        )
      );
      ulLostRobots.appendChild(li);
    }
    return;
  };

  // leave this alone please
  return {
    parse: parseInput,
    tick: tickRobos,
    summary: missionSummary,
    command: command,
  };
};
