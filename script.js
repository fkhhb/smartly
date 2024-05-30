const container = document.getElementById("JS-Wrapper");
const thickness = 100;

// module aliases
const Engine = Matter.Engine,
  Render = Matter.Render,
  Runner = Matter.Runner,
  Bodies = Matter.Bodies,
  Composite = Matter.Composite,
  Mouse = Matter.Mouse,
  MouseConstraint = Matter.MouseConstraint;

// create an engine
const engine = Engine.create();
engine.world.gravity.y = 0.65;

// create a renderer
const render = Render.create({
  element: container, // set the element to the wrapper with the ID "JS-Wrapper"
  engine: engine,
  options: {
    background: "transparent",
    pixelRatio: 3,
    wireframes: false,
    width: container.clientWidth, // set the width to 100% of the wrapper
    height: container.clientHeight, // set the height to 100% of the wrapper
  },
});

const imageSrcs = [
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_(2019).png",
    shape: "rectangle",
    width: 72,
    height: 72,
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/en/a/ad/Snapchat_logo.svg",
    shape: "rectangle",
    width: 72,
    height: 72,
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/en/6/69/Tiktok_logo.svg",
    shape: "rectangle",
    width: 72,
    height: 72,
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/0/08/Pinterest-logo.png",
    shape: "rectangle",
    width: 72,
    height: 72,
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Google_Ads_logo.svg",
    shape: "rectangle",
    width: 72,
    height: 72,
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/0/0c/Google_Drive_icon_(2020).svg",
    shape: "rectangle",
    width: 72,
    height: 72,
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg",
    shape: "rectangle",
    width: 72,
    height: 72,
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/1/1b/Adobe_Premiere_Pro_CC_icon.svg",
    shape: "rectangle",
    width: 72,
    height: 72,
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/3/33/Adobe_After_Effects_CC_icon.svg",
    shape: "rectangle",
    width: 72,
    height: 72,
  },
];

const elements = imageSrcs.map((src, index) => {
  const position = 100 + Math.random() * 200;
  if (src.shape === "rectangle") {
    return Bodies.rectangle(position, 0, src.width, src.height, {
      friction: 0.3,
      restitution: 0.1,
      frictionAir: 0.00001,
      render: {
        sprite: {
          texture: src.src,
          xScale: 0.4,
          yScale: 0.4,
        },
      },
    });
  }
});

var wallOptions = {
  isStatic: true,
  restitution: 1,
  friction: 1,
  render: {
    visible: false, // Set visible to false to make the walls and roof invisible
  },
};

const wallWidth = thickness;
const wallHeight = container.clientHeight * 5;
const rightWall = Matter.Bodies.rectangle(
  container.clientWidth + wallWidth / 2,
  container.clientHeight / 2,
  wallWidth,
  wallHeight,
  wallOptions
);
const leftWall = Matter.Bodies.rectangle(
  0 - wallWidth / 2,
  container.clientHeight / 2,
  wallWidth,
  wallHeight,
  wallOptions
);
const floorWidth = 9000; // Adjust the width as needed
const floorHeight = thickness;
const ground = Matter.Bodies.rectangle(
  container.clientWidth / 2,
  container.clientHeight + floorHeight / 2,
  floorWidth,
  floorHeight,
  wallOptions
);

// add all of the bodies to the world
Composite.add(engine.world, [ground, leftWall, rightWall]);

function onObserved() {
  // run the renderer
  Render.run(render);

  let delay = 300; // half a second in milliseconds

  elements.forEach((element) => {
    setTimeout(() => {
      Composite.add(engine.world, [element]);
    }, delay);
    delay += 400;
  });

  // create runner
  const runner = Runner.create();

  // run the engine
  Runner.run(runner, engine);

  // Access the first child element (in this case, a canvas element)
  const canvas = container.children[0];

  // add event listener
  canvas.addEventListener("mouseleave", (event) => {
    // fire mouseup event to let go of the dragged item
    mouseConstraint.mouse.mouseup(event);
  });
}

const mouse = Mouse.create(render.canvas);
const mouseConstraint = MouseConstraint.create(engine, {
  mouse: mouse,
  constraint: {
    stiffness: 0.2,
    damppning: 0.2,
    render: {
      visible: false,
    },
  },
});

Composite.add(engine.world, mouseConstraint);

mouseConstraint.mouse.element.removeEventListener(
  "mousewheel",
  mouseConstraint.mouse.mousewheel
);
mouseConstraint.mouse.element.removeEventListener(
  "DOMMouseScroll",
  mouseConstraint.mouse.mousewheel
);

// container.addEventListener("mouseleave", () => {
//   // release all bodies in the Matter.js world
//   elements.forEach((body) => {
//     Matter.Body.setStatic(body, false);
//   });
// });

// For browser resize
function handleResize(matterContainer) {
  // Set canvas to new values
}

window.addEventListener("resize", () => {
  handleResize(container);
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      onObserved();
    }
  });
});

observer.observe(container);
