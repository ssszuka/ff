// Helper to get query param with default
function getParam(key, def) {
  const url = new URL(window.location.href);
  return url.searchParams.get(key) ?? def;
}

// Default values
const DEFAULTS = {
  name: "welcome",
  speed: 1,
  bg: "transparent",
  loop: true,
  autoplay: true,
  direction: 1,
  renderer: "svg",
  width: "100vw",
  height: "100vh"
};

// Read params and validate
let name = getParam("name", DEFAULTS.name);
let bg = getParam("bg", getParam("background", DEFAULTS.bg));
let speed = parseFloat(getParam("speed", DEFAULTS.speed));
speed = isNaN(speed) ? DEFAULTS.speed : speed;

let loopParam = getParam("loop", DEFAULTS.loop.toString());
let loop = true;
if (loopParam.toLowerCase() === "false") loop = false;
else if (!isNaN(loopParam)) loop = parseInt(loopParam);

const autoplay = getParam("autoplay", DEFAULTS.autoplay.toString()).toLowerCase() === "true";
const dirValue = parseInt(getParam("direction", DEFAULTS.direction));
const direction = [1, -1].includes(dirValue) ? dirValue : DEFAULTS.direction;

const renderer = getParam("renderer", DEFAULTS.renderer);
const width = getParam("width", DEFAULTS.width);
const height = getParam("height", DEFAULTS.height);

// Apply background and sizing
document.body.style.background = bg;
const container = document.getElementById("lottie");
container.style.width = width;
container.style.height = height;

// Function to load animation and handle errors
function loadLottieAnimation(animName, options) {
  const anim = lottie.loadAnimation({
    container,
    renderer: options.renderer,
    loop: options.loop,
    autoplay: options.autoplay,
    path: `animations/${animName}.json`
  });

  anim.addEventListener("DOMLoaded", () => {
    anim.setSpeed(options.speed);
    anim.setDirection(options.direction);
  });

  // On error, load error-404 animation with defaults
  anim.addEventListener("data_failed", () => {
    if (animName !== "error-404") {
      loadLottieAnimation("error-404", DEFAULTS);
    }
  });
}

// Initial load
loadLottieAnimation(name, {
  renderer,
  loop,
  autoplay,
  speed,
  direction
});