const sectors = [
    {color:"#A005FF", label:"Received"},
    {color:"#F80B7C", label:"Certificate for training"},
    {color:"#05FF4B", label:"Consultation with Seyit Usmanov"},
    {color:"#E3F515", label:"", cashback:'25%'},
    {color:"#FF7D05", label:"", cashback:'-20%'},
    {color:"#EC0CD6", label:"", cashback:'0%'},
    {color:"#48EAEA", label:"FREE 7-Day Salesforce Challenge"},
    {color:"#0F18F2", label:"", cashback:'-10%'},
];

const rand = (m, M) => Math.random() * (M - m) + m;
const tot = sectors.length;
const elSpin = document.querySelector("#spin");
const playAudio = document.querySelector("#playAudio");
const arrow = document.querySelector(".arrow");
const circle = document.querySelector(".circle");
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
    ctx.font = "bold 1.0980966325036603vw sans-serif";
    let tt = sector.label || sector.cashback;
    ctx.fillText(tt, rad - 20, 10);
    ctx.restore();
    if(sector.label.length > true){
        ctx.fillStyle = "#fff";
    }
};

//* CSS rotate CANVAS Element */
const rotate = () => {
    const sector = sectors[getIndex()];
    ctx.canvas.style.transform = `rotate(${ang - PI  / 2}rad)`;
    elSpin.textContent = !angVel ?  "SPIN": sector.label+sector.cashback;
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
                elSpin.style.width = '54.17276720351391vw';
                elSpin.style.height = '54.17276720351391vw';
                elSpin.style.translate = '1s';
                elSpin.style.zIndex = '999';
                elSpin.style.fontSize = '6.588579795021962vw';
                elSpin.style.border = '2.9282576866764276vw solid';
                elSpin.style.textAlign = 'center';
                arrow.style.display = 'none';
                circle.style.display = 'none';
                setTimeout(() => {
                elSpin.style.color =  '#fff';
                    elSpin.style.width = '9.882869692532942vw';
                    elSpin.style.height = '9.882869692532942vw';
                    elSpin.style.translate = '1s';
                    elSpin.style.zIndex = '3';
                    arrow.style.display = 'block';
                    circle.style.display = 'block';
                    elSpin.style.fontSize = '1.2445095168374818vw';
                    elSpin.style.border = '1.4641288433382138vw solid';
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
Mplay.addEventListener('click', (event)=>{
    playAudio.remove()
})
Mplay.addEventListener('click', (event)=>{
    playAudio.play()
})



// INIT!
sectors.forEach(drawSector);
rotate(); // Initial rotation
engine(); // Start engine!
