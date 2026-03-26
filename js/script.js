
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
  
  sprite.src = "assets/Boyidle.png";
  const FRAME_COUNT = 5;
  const FRAME_W = 250;
  const FRAME_H = 490;

  let frame = 0;
  let tick = 0;
  let jumping = false;
  let jumpOffset = 0;
  let jumpVelocity = 0;
  let bobOffset = 0;
  let bobTick = 0;

function drawFrame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const yOffset = jumping ? jumpOffset : bobOffset;
  ctx.drawImage(
    sprite,
    frame * FRAME_W, 0,
    FRAME_W, FRAME_H,
    0, 20 + yOffset,             // 20px padding so bob has room up and down
    canvas.width - 0, FRAME_H
  );
}
  function animate() {
    tick++;
    bobTick++;

    // cycle frames — adjust speed here, higher = slower
    if (tick % 14 === 0) {
      frame = (frame + 1) % FRAME_COUNT;
    }

    // idle bob
    if (!jumping) {
      bobOffset = Math.sin(bobTick * 0.05) * 3;
    } else {
      bobOffset = 0;
    }

    // jump physics
    if (jumping) {
      jumpOffset += jumpVelocity;
      jumpVelocity += 1.2;
      if (jumpOffset >= 0) {
        jumpOffset = 0;
        jumping = false;
        jumpVelocity = 0;
      }
    }

    drawFrame();
    requestAnimationFrame(animate);
  }

  sprite.onload = () => animate();

  canvas.addEventListener("click", () => {
    if (!jumping) {
      jumping = true;
      jumpVelocity = -12;
    }
  });
}
// // sprite
// const canvas = document.getElementById("character");

// if (!canvas) {
//   console.log("canvas not found");
// } else {
//   const ctx = canvas.getContext("2d");

//   const sprite = new Image();
//   sprite.src = "assets/Boyidle.png";

//   const FRAME_W = 66;
//   const FRAME_H = 65;

//   // rows on sprite sheet
//   const ROW = { front: 0, left: 1, right: 2, back: 3 };

//   let frame = 0;
//   let tick = 0;
//   let currentRow = ROW.front;

//   // jump
//   let jumping = false;
//   let jumpOffset = 0;
//   let jumpVelocity = 0;

//   // idle bob
//   let bobOffset = 0;
//   let bobTick = 0;

//   // walking
//   let walking = false;
//   const keys = {};

//   function drawFrame() {
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     const yOffset = jumping ? jumpOffset : bobOffset;
//     ctx.drawImage(
//       sprite,
//       frame * FRAME_W, currentRow * FRAME_H,
//       FRAME_W, FRAME_H,
//       0, yOffset,
//       FRAME_W, FRAME_H
//     );
//   }

//   function animate() {
//     tick++;
//     bobTick++;

//     // handle arrow key walking
//     walking = false;
//     if (keys["ArrowLeft"])  { currentRow = ROW.left;  walking = true; }
//     if (keys["ArrowRight"]) { currentRow = ROW.right; walking = true; }
//     if (keys["ArrowUp"])    { currentRow = ROW.back;  walking = true; }
//     if (keys["ArrowDown"])  { currentRow = ROW.front; walking = true; }

//     // animate frames — faster when walking, slower when idle
//     const frameSpeed = walking ? 8 : 18;
//     if (tick % frameSpeed === 0) {
//       frame = (frame + 1) % 4;
//     }

//     // idle breathing bob — gentle sine wave up/down
//     if (!jumping && !walking) {
//       bobOffset = Math.sin(bobTick * 0.05) * 2;
//     } else {
//       bobOffset = 0;
//     }

//     // jump physics
//     if (jumping) {
//       jumpOffset += jumpVelocity;
//       jumpVelocity += 1.2;
//       if (jumpOffset >= 0) {
//         jumpOffset = 0;
//         jumping = false;
//         jumpVelocity = 0;
//       }
//     }

//     drawFrame();
//     requestAnimationFrame(animate);
//   }

//   sprite.onload = () => animate();

//   // click to jump
//   canvas.addEventListener("click", () => {
//     if (!jumping) {
//       jumping = true;
//       jumpVelocity = -12;
//     }
//   });

//   // double click to reset to front
//   canvas.addEventListener("dblclick", () => {
//     currentRow = ROW.front;
//   });

//   // arrow keys to walk
//   window.addEventListener("keydown", (e) => {
//     keys[e.key] = true;
//   });
//   window.addEventListener("keyup", (e) => {
//     keys[e.key] = false;
//     // return to front when keys released
//     currentRow = ROW.front;
//   });
// }
