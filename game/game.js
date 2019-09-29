// Hello there. I'd just like to let you know that this code
// was written fast and dirty to get some MVP that worked. I
// am well aware that it is hideous.

var started = false;
var paused = true;
var oldTimeStamp;

var PUMPA_WEIRD_OFFSET = 5;
var PUMPA_Y = 357;
var PUMPA_LEFT_LIMIT = 60;
var PUMPA_RIGHT_LIMIT = 420;

var pumpaWidth = 148;
var pumpaHeight = 101;

var score = new Image(189, 50);
score.src = 'sprites/score.png';

var pumpa = new Image(pumpaWidth, pumpaHeight);
pumpa.src = 'sprites/3.png';

var ground = new Image(159, 308);
ground.src = 'sprites/ground.png';

var background = new Image(482, 232);
background.src = 'sprites/background.png';

var cloud = new Image(148, 97);
cloud.src = 'sprites/cloud.png';

var shark = new Image(44, 39);
shark.src = 'sprites/shark_right.png';

var water = new Image(641, 108);
water.src = 'sprites/water.png';

var x = null;
var y = null;

var canvas = null;
var ctx = null;

var timeslots = null;
var releaseTime = null;
var saveCount = 0;
var releasedCount = 0;
var nextLevelChange = 5;

initReleaseTimeTable(1);

function initReleaseTimeTable(numSlots, pause = 0) {
  timeslots = numSlots;
  releaseTime = [];

  var i = 0;
  while (i < timeslots) {
    releaseTime.push(
      (45 * i / timeslots + 45 * (i * 9973 % timeslots) + 45 * pause) + (pause === 0 ? 0 : 0) // I have no idea
    );

    i++;
  }

  nextLevelChange = 5 * timeslots * (1 + timeslots) / 2;

  console.log(pause, releaseTime, nextLevelChange);
}

function GetRandomDistance() {
  return 3 + Math.floor(Math.random() * 1.3333);
}

function SpawnControl() {
  var i = 0;
  while (i < timeslots) {
    releaseTime[i] -= 1;

    if (releaseTime[i] <= 0) {
      kycklings.push(new Kyckling());
      releaseTime[i] += + 45 * GetRandomDistance(); // ??
      releasedCount += 1;
      console.log('Spawning new now');
    }

    i++;
  }

  console.log(releaseTime);
}

function truncateInt(value) {
  return value | 0;
}

function pumpaXPosition() {
  if (tick === 0) {
    return PUMPA_LEFT_LIMIT;
  }
  var actual = (x - truncateInt(pumpaWidth / 2) - PUMPA_WEIRD_OFFSET);

  if (actual < PUMPA_LEFT_LIMIT) {
    return PUMPA_LEFT_LIMIT;
  }
  if (actual > PUMPA_RIGHT_LIMIT) {
    return PUMPA_RIGHT_LIMIT;
  }

  return actual;
}

var sharkStart = 100;
var sharkEnd = 520;
var sharkPosition = sharkStart;
var sharkDirection = 'right';

var relativeCounter = 0;
var cloudPosition = -148;

var kycklingPosStart = -65;

class Kyckling {

  constructor() {
    this.reset();
  }

  reset() {
    this.img = new Image(65, 72);
    this.img.src = 'sprites/kyckling/walk1.png';

    this.mode = 'walk';
    this.x = kycklingPosStart;
    this.y = 58;
    this.tickValue = 0;
    this.dy = -5;
    this.enabled = true;
    this.kill = false;
  }

  tick() {
    if (this.kill) {
      return;
    }
    //return;
    this.tickValue += 1;

    switch(this.mode) {
      case 'walk':
        this.x += 2;

        if (this.x >= 75) {
          this.mode = 'fall';
        }

        // This does not look too good
        if (this.tickValue % 2 === 0 || this.tickValue % 3 === 0) {
          this.img.src = 'sprites/kyckling/walk2.png';
        }
        else {
          this.img.src = 'sprites/kyckling/walk1.png';
        }

        if (this.x > 620) {
          saveCount++;
          this.kill = true;
        }

        break;
      case 'fall':
        this.img.src = 'sprites/kyckling/air.png';
        this.x += 3;
        this.y += this.dy;
        this.dy += 1;

        if (this.y >= 270 && this.dy >= 0) {
          this.y = 270;
          this.dy = -22;
        }
        else if (this.x > 520 && this.y >= 160 && this.dy > 0) {
          this.y = 160;
          this.mode = 'walk';
          this.img.src = 'sprites/kyckling/walk1.png';
        }

        break;
      default:
        break;
    }
  }
}

var kycklings = [];
var tick = 0;

function gameLoop() {
  if (!paused) {
    tick++;
  }

  if (tick % 2 === 0) {
    relativeCounter++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (relativeCounter >= 10 && !paused) {
      var spriteSplit = pumpa.src.split('/');
      var source = spriteSplit[spriteSplit.length - 1];

      if (source === '3.png') {
        pumpa.src = 'sprites/4.png';
      } else if (source === '4.png') {
        pumpa.src = 'sprites/7.png';
      } else {
        pumpa.src = 'sprites/3.png';
      }

      relativeCounter = 0;
    }

    ctx.drawImage(
      cloud,
      cloudPosition,
      0
    );

    cloudPosition += 2;

    if (cloudPosition >= 750) {
      cloudPosition = -148;
    }

    ctx.drawImage(
      score,
      447,
      -8
    );

    ctx.font = 'bold 26px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText('Poäng:', 486, 30);

    ctx.fillText(saveCount, 577, 30);

    ctx.drawImage(
      background,
      90,
      132
    );

    ctx.drawImage(
      shark,
      sharkPosition,
      285
    );

    if (sharkDirection === 'left') {
      sharkPosition -= 4;
    } else {
      sharkPosition += 4;
    }

    if (sharkDirection === 'right' && sharkPosition >= sharkEnd) {
      sharkDirection = 'left';
      sharkPosition = sharkEnd;
      shark.src = 'sprites/shark_left.png';
    } else if (sharkDirection === 'left' && sharkPosition <= sharkStart) {
      sharkDirection = 'right';
      sharkPosition = sharkStart;
      shark.src = 'sprites/shark_right.png';
    }

    ctx.drawImage(
      water,
      0,
      296
    );

    ctx.drawImage(
      ground,
      -40,
      125
    );

    ctx.drawImage(
      ground,
      549,
      226
    );

    ctx.drawImage(
      pumpa,
      pumpaXPosition(),
      (PUMPA_Y - (pumpaHeight / 2)) | 0, // stupid truncate hack
    );


    if (oldTimeStamp === null) {
      oldTimeStamp = new Date().getTime();
    }

    if (!paused) {
      if (releasedCount >= nextLevelChange) {
        console.log('releasedCount passed');
        initReleaseTimeTable(timeslots + 1, 4);
      }

      SpawnControl();
    }


    var timeStamp = new Date().getTime();

    //Calculate the number of seconds passed
    //since the last frame
    var secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;

    //Calculate fps
    var fps = Math.round(1 / secondsPassed);

    for (var i = 0; i < kycklings.length; i++) {
      var kyckling = kycklings[i];

      if (!paused) {
        kyckling.tick();
      }

      ctx.drawImage(
        kyckling.img,
        truncateInt(kyckling.x),
        truncateInt(kyckling.y)
      );
    }

    kycklings = kycklings.filter(kyckling => !kyckling.kill);

    if (!isNaN(fps)) {
      //Draw number to the screen
      ctx.font = '10px Arial';
      ctx.fillStyle = 'black';
      ctx.fillText(fps, 5, 10);
    }
  }

  // The loop function has reached it's end
  // Keep requesting new frames
  window.requestAnimationFrame(gameLoop);
}

function mouseTracking() {
  canvas.onmousemove = function(e) {
    if (paused) {
      paused = false;
    }
    else {
      var r = canvas.getBoundingClientRect();

      x = e.clientX - r.left;
      y = e.clientY - r.top;
    }
  };

  canvas.onmouseout  = function(e) {
    paused = true;
  };
}

function init() {
  console.log('init here');

  canvas = document.getElementById('game');
  canvas.width = 640;
  canvas.height = 400;

  ctx = canvas.getContext('2d');

  started = true;

  gameLoop();
  mouseTracking();
}


document.addEventListener("DOMContentLoaded", init);