
let lastScroll = window.scrollY;
const header = document.querySelector("header");

window.addEventListener("scroll", () => {
  const cur = window.scrollY;
  if (cur < 26)              header.classList.remove("nav-hidden");
  else if (cur > lastScroll) header.classList.add("nav-hidden");
  else                       header.classList.remove("nav-hidden");
  lastScroll = cur;
});


const homeContent = document.querySelector(".home-content");

window.addEventListener("scroll", () => {
  const heroHeight = window.innerHeight;

  const progress = Math.min(Math.max(window.scrollY / heroHeight, 0), 1);


    const scale   = 1 - progress * 0.08;
    const opacity = 1 - progress;    

  homeContent.style.transform = `scale(${scale})`;
  homeContent.style.opacity   = opacity;
});


document.querySelectorAll('a[href="#home"]').forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

document.querySelectorAll('a[href="#about"]').forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
  });
});

const canvas = document.getElementById("character");

if (!canvas) {
  console.log("canvas not found");
} else {
  const ctx = canvas.getContext("2d");

  const sprite = new Image();
  sprite.src = "assets/Boywave.png";

  // Sheet: 2000x230, 8 frames at 250x230 each
  const FRAME_W  = 250;
  const FRAME_H  = 490;
  const TOTAL_FRAMES = 17;

  // Tweak these once you see which frames look idle vs waving
  const IDLE_FRAMES = [0, 1, 3];       // frames to cycle during idle
  const WAVE_FRAMES = [4, 5,6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]; // frames for the wave

  // Draw at native 1:1 scale, feet pinned to canvas bottom
  // Character pixels end at row ~226 of the 230px frame
  // Canvas is 490px tall, so dy = 490 - 230 = 260 puts feet at y=486
 const DRAW_Y = 10; // small top padding, character is 230px in a 250px canvas
const DRAW_W = FRAME_W;
const DRAW_H = FRAME_H;

  // State
  let idleIndex  = 0;   // index into IDLE_FRAMES array
  let waveIndex  = 0;   // index into WAVE_FRAMES array
  let tick       = 0;
  let bobTick    = 0;
  let bobOffset  = 0;
  let waving     = false;

  // Jump
  let jumping      = false;
  let jumpOffset   = 0;
  let jumpVelocity = 0;

  function currentFrame() {
    return waving ? WAVE_FRAMES[waveIndex] : IDLE_FRAMES[idleIndex];
  }

  function drawFrame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const yOffset = jumping ? jumpOffset : bobOffset;
    const f = currentFrame();
    ctx.drawImage(
      sprite,
      f * FRAME_W, 0,        // source x, y
      FRAME_W, FRAME_H,      // source w, h
      0, DRAW_Y + yOffset,   // dest x, y
      DRAW_W, DRAW_H         // dest w, h — native size, no scaling
    );
  }

  function triggerWave() {
    if (waving) return;
    waving    = true;
    waveIndex = 0;
  }

  // Wave every 7 seconds
  setInterval(triggerWave, 7000);

  function animate() {
    tick++;
    bobTick++;

    if (waving) {
      // Advance wave — 10 ticks per frame
      if (tick % 10 === 0) {
        waveIndex++;
        if (waveIndex >= WAVE_FRAMES.length) {
          waving    = false;
          waveIndex = 0;
        }
      }
      bobOffset = 0; // no bob while waving
    } else {
      // Idle frame cycle — slower, 20 ticks per frame
      if (tick % 20 === 0) {
        idleIndex = (idleIndex + 1) % IDLE_FRAMES.length;
      }
      bobOffset = Math.sin(bobTick * 0.05) * 3;
    }

    // Jump physics
    if (jumping) {
      jumpOffset   += jumpVelocity;
      jumpVelocity += 1.2;
      if (jumpOffset >= 0) {
        jumpOffset   = 0;
        jumping      = false;
        jumpVelocity = 0;
      }
    }

    drawFrame();
    requestAnimationFrame(animate);
  }

  sprite.onload = () => animate();

  canvas.addEventListener("click", () => {
    if (!jumping) {
      jumping      = true;
      jumpVelocity = -12;
    }
  });
}