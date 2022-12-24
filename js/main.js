const sectors = [
    {color:"#A005FF", label:"23", cashback:'', color_cashback:'',},
    {color:"#F80B7C", label:"66", cashback:'', color_cashback:'',},
    {color:"#05FF4B", label:"50", cashback:'', color_cashback:'',},
    {color:"#E3F515", label:"100", cashback:'', color_cashback:'',},
    {color:"#FF7D05", label:"5", cashback:'', color_cashback:'',},
    {color:"#EC0CD6", label:"500", cashback:'', color_cashback:'',},
    {color:"#48EAEA", label:"1000", cashback:'', color_cashback:'',},
    {color:"#0F18F2", label:"1000", cashback:'', color_cashback:'',},
];

const rand = (m, M) => Math.random() * (M - m) + m;

const tot = sectors.length;
const elSpin = document.querySelector("#spin");
const playAudio = document.querySelector("#playAudio");
const arrow = document.querySelector(".arrow");
const Mplay = document.querySelector("#play");
const ctx = document.querySelector("#wheel").getContext`2d`;
const dia = ctx.canvas.width;
const rad = dia / 2;
const PI = Math.PI;
const TAU = 2 * PI;
const arc = TAU / sectors.length;
const friction = 0.991;  // 0.995=soft, 0.99=mid, 0.98=hard
const angVelMin = 0.002; // Below that number will be treated as a stop
let angVelMax = 0; // Random ang.vel. to acceletare to
let angVel = 0;    // Current angular velocity
let ang = 0;       // Angle rotation in radians
let isSpinning = false;
let isAccelerating = false;

const getIndex = () => Math.floor(tot - ang / TAU * tot) % tot;

const drawSector = (sector, i) => {
    const ang = arc * i;
    ctx.save();
    // COLOR
    ctx.beginPath();
    ctx.fillStyle = sector.color;
    ctx.moveTo(rad, rad);
    ctx.arc(rad, rad, rad, ang, ang + arc);
    ctx.lineTo(rad, rad);
    ctx.fill();
    // TEXT
    ctx.translate(rad, rad);
    ctx.rotate(ang + arc / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#fff";
    ctx.font = "bold 30px sans-serif";
    ctx.fillText(sector.label, rad - 20, 10);
    //
    ctx.restore();
};

//* CSS rotate CANVAS Element */
const rotate = () => {
    const sector = sectors[getIndex()];
    ctx.canvas.style.transform = `rotate(${ang - PI / 2}rad)`;
    elSpin.textContent = !angVel ?  "SPIN": sector.label;
    elSpin.style.background = sector.color;
};

const frame = () => {

    if (!isSpinning) return;

    if (angVel >= angVelMax) isAccelerating = false;

    // Accelerate
    if (isAccelerating) {
        angVel ||= angVelMin; // Initial velocity kick
        angVel *= 1.06; // Accelerate
    }

    // Decelerate
    else {
        isAccelerating = false;
        angVel *= friction; // Decelerate by friction

        // SPIN END:
        if (angVel < angVelMin) {
            playAudio.pause();
            isSpinning = false;
            setTimeout(() => {
                elSpin.style.width = '740px';
                elSpin.style.height = '740px';
                elSpin.style.translate = '1s';
                elSpin.style.zIndex = '999';
                elSpin.style.fontSize = '100px';
                elSpin.style.border = '40px solid';
                arrow.style.display = 'none';
                setTimeout(() => {
                elSpin.style.color =  '#fff';
                    elSpin.style.width = '135px';
                    elSpin.style.height = '135px';
                    elSpin.style.translate = '1s';
                    elSpin.style.zIndex = '3';
                    arrow.style.display = 'block';
                    elSpin.style.fontSize = '24px';
                    elSpin.style.border = '20px solid';
                    elSpin.textContent = "SPIN";
                }, 2000)

            }, 2000)
        }
    }

    ang += angVel; // Update angle
    ang %= TAU;    // Normalize angle
    rotate();      // CSS rotate!
};

const engine = () => {
    frame();
    requestAnimationFrame(engine)
};

elSpin.addEventListener("click", () => {
    if (isSpinning) return;
    isSpinning = true;
    isAccelerating = true;
    angVelMax = rand(0.25, 0.40);
    playAudio.play();
});
Mplay.addEventListener('click', ()=>{
    playAudio.pause();
})
// INIT!
sectors.forEach(drawSector);
rotate(); // Initial rotation
engine(); // Start engine!