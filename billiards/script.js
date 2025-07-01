const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth - 30;
canvas.height = window.innerHeight - 130;

//set up widths
const simMinWidth = 2.0;
const cScale = Math.min(canvas.width, canvas.height) / simMinWidth;
simWidth = canvas.width / cScale;
simHeight = canvas.height / cScale;

function cX(pos) {
  return pos.x * cScale;
}

function cY(pos) {
  return canvas.height - pos.y * cScale;
}

//define a vector class
class Vector2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add(v, s = 1.0) {
    this.x += v.x * s;
    this.y += v.y * s;
    return this;
  }
  addVectors(a, b) {
    this.x = a.x + b.x;
    this.y = a.y + b.y;
    return this;
  }

  subtract(v, s = 1.0) {
    this.x -= v.x * s;
    this.y -= v.y * s;
    return this;
  }
  subtractVectors(a, b) {
    this.x = a.x - b.x;
    this.y = a.y - b.y;
    return this;
  }
  clone() {
    return new Vector2(this.x, this.y);
  }
  scale(s) {
    this.x *= s;
    this.y *= s;
    return this;
  }
  dot(v) {
    return this.x * v.x + this.y * v.y;
  }
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  set(v) {
    this.x = v.x;
    this.y = v.y;
    return this;
  }
}

//ball class
class Ball {
  constructor(pos, vel, radius, mass) {
    this.pos = pos.clone();
    this.vel = vel.clone();
    this.radius = radius;
    this.mass = mass;
  }
  simulate(dt, gravity) {
    this.vel.add(gravity, dt);
    this.pos.add(this.vel, dt);
  }
}

const physicsScene = {
  gravity: new Vector2(0, 0),
  dt: 1 / 60.0,
  balls: [],
  paused: true,
  restitution: 1,
  worldSize: new Vector2(simWidth, simHeight),
};

function setUpScene() {
  physicsScene.balls = [];

  for (let i = 0; i < 30; i++) {
    const radius = 0.05 + Math.random() * 0.1;
    const mass = radius * radius * Math.PI;
    const pos = new Vector2(
      Math.random() * simWidth,
      Math.random() * simHeight
    );
    const vel = new Vector2(
      0.7 + 2.0 * Math.random(),
      0.7 + 2.0 * Math.random()
    );
    physicsScene.balls.push(new Ball(pos, vel, radius, mass));
  }
}
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "black";

  for (const ball of physicsScene.balls) {
    ctx.beginPath();
    ctx.arc(cX(ball.pos), cY(ball.pos), ball.radius * cScale, 0, Math.PI * 2);
    ctx.fill();
  }
}
function handleWallCollision(ball, worldSize) {
  if (ball.pos.x < ball.radius) {
    ball.pos.x = ball.radius;
    ball.vel.x = -ball.vel.x;
  }
  if (ball.pos.x > worldSize.x - ball.radius) {
    ball.pos.x = worldSize.x - ball.radius;
    ball.vel.x = -ball.vel.x;
  }
  if (ball.pos.y < ball.radius) {
    ball.pos.y = ball.radius;
    ball.vel.y = -ball.vel.y;
  }

  if (ball.pos.y > worldSize.y - ball.radius) {
    ball.pos.y = worldSize.y - ball.radius;
    ball.vel.y = -ball.vel.y;
  }
}

function handleBallCollision(ball1, ball2, restitution) {
  const dir = new Vector2();
  dir.subtractVectors(ball2.pos, ball1.pos);
  const dist = dir.length();
  if (dist == 0.0 || dist > ball1.radius + ball2.radius) {
    return;
  }
  dir.scale(1.0 / dist);

  const corr = (ball1.radius + ball2.radius - dist) / 2.0;
  ball1.pos.add(dir, -corr);
  ball2.pos.add(dir, corr);

  const v1 = ball1.vel.dot(dir);
  const v2 = ball2.vel.dot(dir);
  const m1 = ball1.mass;
  const m2 = ball2.mass;

  const newV1 = (m1 * v1 + m2 * v2 - m2 * (v1 - v2) * restitution) / (m1 + m2);
  const newV2 = (m1 * v1 + m2 * v2 - m1 * (v2 - v1) * restitution) / (m1 + m2);
  ball1.vel.add(dir, newV1 - v1);
  ball2.vel.add(dir, newV2 - v2);
}

function simulate() {
  for (let i = 0; i < physicsScene.balls.length; i++) {
    const ball = physicsScene.balls[i];
    ball.simulate(physicsScene.dt, physicsScene.gravity);
    for (let j = i + 1; j < physicsScene.balls.length; j++) {
      const otherBall = physicsScene.balls[j];
      handleBallCollision(ball, otherBall, physicsScene.restitution);
    }
    handleWallCollision(ball, physicsScene.worldSize);
  }
}

function update() {
  simulate();
  draw();
  requestAnimationFrame(update);
}

setUpScene();

update();

document.getElementById("restitutionSlider").oninput = function () {
  physicsScene.restitution = this.value / 10.0;
};
