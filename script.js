// Variables
let move_speed = 3;
let bird_dy = 0;
let gravity = 0.5;
let game_state = 'Start';
let hiscore = [];

// DOM
const bird = document.querySelector('.bird');
const button = document.querySelector('.button');
const backgroundImage = document.querySelector('.background');
const computedStyle = window.getComputedStyle(backgroundImage);
const backgroundImagePos = computedStyle.getPropertyValue("background-position");
const score_val = document.querySelector('.score_val');
const message = document.querySelector('.message');
const high_score_val = document.querySelector('.high_score_val');

// SFX
const hitSound = new Audio("assets/bgm/hit.wav");

// Object
let bird_props = bird.getBoundingClientRect();
let background = document.querySelector('.background').getBoundingClientRect();

// Functions
function handleKeyPress(e) {
  if (e.key == 'Enter' && game_state != 'Play') {
    startGame();
  }
}

function handleButtonClick() {
  if (game_state != 'Play') {
    startGame();
  }
}

function handleTouchStart() {
  if (game_state === 'Play') {
    bird_dy = -9.5;
  }
}

function handleKeyUp(e) {
  if (game_state === 'Play') {
    if (e.key == 'ArrowUp' || e.key == ' ') {
      playJumpAudio();
    }
  }
}

function handleMouseClick() {
  if (game_state === 'Play') {
    playJumpAudio();
  }
}

// Event Listeners
document.addEventListener('keydown', handleKeyPress);
button.addEventListener('click', handleButtonClick);
document.addEventListener('touchstart', handleTouchStart);
document.addEventListener('keyup', handleKeyUp);
document.addEventListener('click', handleMouseClick);

function startGame() {
  clearPipes();
  bird.style.top = '40vh';
  game_state = 'Play';
  button.innerHTML = '';
  message.innerHTML = '';
  score_val.innerHTML = '0';
  high_score_val.innerHTML = '';
  backgroundImage.style.animation = "none";
  backgroundImage.style.animation = "backgroundMove 40s linear infinite";
  play();
}

function clearPipes() {
  document.querySelectorAll('.pipe_sprite').forEach((e) => {
    e.remove();
  });
}

function playJumpAudio() {
  const jumpSound = new Audio("assets/bgm/jump.mp3");
  jumpSound.play();
}

function play() {
  function move() {

    // Detect if game has ended
    if (game_state != 'Play') return;

    // Getting reference to all the pipe elements
    let pipe_sprite = document.querySelectorAll('.pipe_sprite');
    pipe_sprite.forEach((element) => {

      let pipe_sprite_props = element.getBoundingClientRect();
      bird_props = bird.getBoundingClientRect();

      // Delete the pipes if they have moved out
      // of the screen hence saving memory
      if (pipe_sprite_props.right <= 0) {
        element.remove();
      } else {
        // Collision detection with bird and pipes
        if (
          bird_props.left < pipe_sprite_props.left +
          pipe_sprite_props.width &&
          bird_props.left +
          bird_props.width > pipe_sprite_props.left &&
          bird_props.top < pipe_sprite_props.top +
          pipe_sprite_props.height &&
          bird_props.top +
          bird_props.height > pipe_sprite_props.top
        ) {

          // Change game state and end the game
          // if collision occurs
          game_state = 'End';
          message.innerHTML = 'Press Enter To Restart';
          hiscore.push(parseInt(score_val.innerHTML));
          high_score_val.innerHTML = `Hi-Score  ${Math.max.apply(Math, hiscore)}` 
          button.innerHTML = 'Restart';
          message.style.left = '50%';
          backgroundImage.style.animationPlayState = "paused";
          hitSound.play();
          return;
        }
        else {
          // Increase the score if player
          // has the successfully dodged the pipe
          if (
            pipe_sprite_props.right < bird_props.left &&
            pipe_sprite_props.right +
            move_speed >= bird_props.left &&
            element.increase_score == '1'
          ) {
            score_val.innerHTML = +score_val.innerHTML + 1;
          }
          element.style.left =
            pipe_sprite_props.left - move_speed + 'px';
        }
      }
    });
    requestAnimationFrame(move);
  }
  requestAnimationFrame(move);


  function apply_gravity() {
    if (game_state != 'Play') return;
    bird_dy = bird_dy + gravity;
    document.addEventListener('keydown', (e) => {
      if (e.key == 'ArrowUp' || e.key == ' ') {
        bird_dy = -10.5;
        /* console.log(game_state)
        console.log(bird_props.bottom)
          console.log(background.bottom) */
      }
    });
    //mobile
    document.addEventListener('touchstart', () => {
      if (game_state === 'Play') {
        bird_dy = -10.5;
      }
    });

    // Collision detection with bird and
    // window bottom

    if (bird_props.bottom >= background.bottom){
      game_state = 'End';
      message.innerHTML = 'Please Restart the Page (Bug)';
      high_score_val.innerHTML = 'High Score : '
      message.style.left = '50%';
      backgroundImage.style.animationPlayState = "paused"
      hitSound.play();
      return;
    }
    bird.style.top = bird_props.top + bird_dy + 'px';
    bird_props = bird.getBoundingClientRect();
    requestAnimationFrame(apply_gravity);
  }
  requestAnimationFrame(apply_gravity);

  let pipe_seperation = -20;

  // Constant value for the gap between two pipes
  let pipe_gap = 30;

  function create_pipe() {
    if (game_state != 'Play') return;

    // Create another set of pipes
    // if distance between two pipe has exceeded
    // a predefined value
    if (pipe_seperation > 115) {
      pipe_seperation = -20

      // Calculate random position of pipes on y axis
      let pipe_posi = Math.floor(Math.random() * 25) + 8;
      let pipe_sprite_inv = document.createElement('div');
      pipe_sprite_inv.className = 'pipe_sprite';
      pipe_sprite_inv.style.top = pipe_posi - 70 + 'vh';
      pipe_sprite_inv.style.left = '100vw';
      pipe_sprite_inv.style.transform = 'scaleY(-1)';

      // Append the created pipe element in DOM
      document.body.appendChild(pipe_sprite_inv);
      let pipe_sprite = document.createElement('div');
      pipe_sprite.className = 'pipe_sprite';
      pipe_sprite.style.top = pipe_posi + pipe_gap + 'vh';
      pipe_sprite.style.left = '100vw';
      pipe_sprite.increase_score = '1';

      // Append the created pipe element in DOM
      document.body.appendChild(pipe_sprite);
    }
    pipe_seperation++;
    requestAnimationFrame(create_pipe);
  }
  requestAnimationFrame(create_pipe);
}

setInterval(() => {
  toggleVisibility(button);
}, 1000);

function toggleVisibility(element) {
  element.style.visibility = (element.style.visibility === "hidden") ? "visible" : "hidden";
}

