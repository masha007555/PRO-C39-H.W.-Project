var PLAY = 2;
var END = 1;
var WINNER = 0;
var gameState = PLAY;
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var score=0;
var jumpSound;
var gameOver, restart;
var dead;
var revive;
var start;
var startImage;
var laps = 0;
var win;
var winImage;
var trex_win;
var hitBox;
var victory;

function preload(){
  trex_running =   loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  trex_win = loadImage("trex1.png");

  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png"); 
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  startImage = loadImage("Start.png");
  winImage = loadImage("win.png");
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");

  jumpSound = loadSound("jumpSound.wav");
  dead = loadSound("Death.mp4");
  revive =loadSound("Revive.mp4");
  victory = loadSound("victory.mp4");
}
function setup() {
  createCanvas(windowWidth,windowHeight);

  hitBox = createSprite(width/2,height-100,windowWidth,windowHeight);
  hitBox.visible = false;

  start = createSprite(width/2,height/2+20);
  start.addImage(startImage);
  start.scale = 0.3;
  start.velocityX = -4.5;

  trex = createSprite(width/2,height-50,20,50);

  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.addAnimation("win", trex_win);
  trex.scale = 0.5;
  trex.debug = false;

  ground = createSprite(width/2,height-70,width,2);
  ground.addImage("ground",groundImage);
  ground.x = width /2;
  ground.velocityX = -(6 + 3*score/100);
  ground.debug = false;

  win = createSprite(width,height/2+50);
  win.addImage(winImage);
  win.scale = 0.5;

  gameOver = createSprite(width/2,height/2);
  gameOver.addImage(gameOverImg);

  restart = createSprite(width/2,height/2+50);
  restart.addImage(restartImg);

  gameOver.scale = 0.7;
  restart.scale = 0.7;

  gameOver.visible = false;
  restart.visible = false;

  invisibleGround = createSprite(width/2,height-4,width,125);  
  invisibleGround.visible = false;
  invisibleGround.debug = false;

  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}
function draw() {
  background(255);
  strokeWeight(2);
  stroke("black");
  fill("grey");
  textSize(30);
  text("Score: "+ score+"     Laps: "+laps+"/3", windowWidth/2-150,windowHeight/2-50);

  restart.depth = trex.depth;
  gameOver.depth = trex.depth;
  camera.position.x = trex.x;
  camera.position.y = trex.y;
  
  if (gameState===PLAY){
    win.visible = false;
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);

    if (score >= 1495){
      win.visible = true;
      win.velocityX = -50;
    }

    if (score >= 500){
      laps = 1;
    }
    if (score>=1000){
      laps = 2;
    }
    if (score >= 1500){
      laps = 3;
      victory.play();
      gameState = WINNER;
    }

    if(keyDown("space") && trex.y >=height-100 || mousePressedOver(hitBox) && trex.y >=height-100) {
      jumpSound.play();
      trex.velocityY = -12;
    }

    trex.velocityY = trex.velocityY + 0.8

    if (ground.x < width/3){
      ground.x = width/2;
    }

    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(trex)){
      gameState = END;
      dead.play();
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    win.visible = false;
    start.visible = false;
    start.velocityX= 0;

    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    trex.changeAnimation("collided",trex_collided);
    
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart) || keyDown("enter")) {
      revive.play();
      reset();
    }
  }
  else if (gameState===WINNER){
    trex.changeAnimation("win", trex_win);

    win.visible = true;
    restart.visible = true;
    restart.y = height/2+140;

    start.visible = false;
    start.velocityX= 0;

    win.velocityX=0;
    win.x = width/2;

    ground.velocityX = 0;
    trex.velocityY = 0;

    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    obstaclesGroup.setLifetimeEach(0);
    cloudsGroup.setLifetimeEach(0);

    obstaclesGroup.visible = false;

    if(mousePressedOver(restart) || keyDown("enter")) {
      revive.play();
      reset();
    }
  }

  drawSprites();
}
function spawnClouds() {
  if (frameCount % 60 === 0) {
    var cloud = createSprite(width+20,height-300,40,10);
    cloud.y = Math.round(random(height/3,height/1.5));
    cloud.addImage(cloudImage);

    cloud.scale = 0.5;
    cloud.velocityX = -3;
    cloud.lifetime = 600;
    
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    cloudsGroup.add(cloud);
  }
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(width,height-80,20,30);
    obstacle.debug = false;
    obstacle.velocityX = -(6 + 3*score/100);

    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  start.visible = true;
  laps=0;

  start.x=width/2;
  start.velocityX= -4.5;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();

  trex.changeAnimation("running",trex_running);
  score = 0;
}