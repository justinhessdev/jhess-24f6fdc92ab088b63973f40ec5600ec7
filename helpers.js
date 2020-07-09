const createRobos = (inputRobos) => {
  const robos = [];
  for (let i = 0; i < inputRobos.length; i = i + 2) {
    robos.push(createRobo(inputRobos[i], inputRobos[i + 1])); // 1st arg position, 2nd arg instruction
  }
  return robos;
};

const createRobo = (position, instruction) => {
  const robo = {
    x: parseInt(position[0]),
    y: parseInt(position[1]),
    o: position[2].toUpperCase(),
    command: instruction.toString(),
  };

  return robo;
};

const cardinals = {
  N: {
    L: "W",
    R: "E",
    forward: (x, y) => {
      return { x: x, y: y - 1 };
    },
  },
  E: {
    L: "N",
    R: "S",
    forward: (x, y) => {
      return { x: x + 1, y: y };
    },
  },
  S: {
    L: "E",
    R: "W",
    forward: (x, y) => {
      return { x: x, y: y + 1 };
    },
  },
  W: {
    L: "S",
    R: "N",
    forward: (x, y) => {
      return { x: x - 1, y: y };
    },
  },
};

const checkBounds = (movedRobo, bounds) => {
  if (
    movedRobo.x > bounds[0] ||
    movedRobo.x < 0 ||
    movedRobo.y > bounds[1] ||
    movedRobo.y < 0
  ) {
    return true;
  }
  return false;
};

function isRoboAtEdge(robo, locations) {
  if (!robo || !locations || !locations.length) {
    return false;
  }

  for (let location of locations) {
    if (
      robo.x === location.x &&
      robo.y === location.y &&
      robo.o === location.o
    ) {
      return true;
    }
  }

  return false;
}

function addOutofBoundsLocation(location, bounds, locations) {
  if (location.x > bounds[0]) {
    location.x = bounds[0];
  } else if (location.y > bounds[1]) {
    location.y = bounds[1];
  } else if (location.x < 0) {
    location.x = 0;
  } else if (location.y < 0) {
    location.y = 0;
  }

  locations.push(location);
}
