var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var cloud, cloudImg;
var cloudsGroup, obstacleGroup;

const PLAY = 1;
const END = 0;
var gameState = PLAY;

var score = 0;

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadImage("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  cloudImg = loadImage("cloud.png");
  gameOverImg = loadImage ("gameOver.png");
  restartImg = loadImage ("restart.png");

  
  
}

function setup() {
    
  createCanvas(600,200)
  
  //create a trex sprite
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  
  //create a ground sprite
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  //creating invisible ground
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;

  cloudsGroup = new Group();
  obstacleGroup = new Group();

  gameOver = createSprite(280,100);
  gameOver.addImage ("gameover", gameOverImg);
  gameOver.scale = 0.5;
  
  restart = createSprite (280, 140);
  restart.addImage ("restart", restartImg);
  
  restart.scale = 0.5;

}

function draw() {
  //set background color
  background(151);
  
  text ("Score: " + score, 500,50);
  

  if (gameState === PLAY) {
    gameOver.visible = false;
    restart.visible = false;
    score = score + Math.round (frameRate()/100);
    ground.velocityX = -(4 + score/100);
    // jump when the space key is pressed
    if(keyDown("space")&& trex.y >= 160) {
      trex.velocityY = -10;
    }
  
    // adding gravity
    trex.velocityY = trex.velocityY + 0.8;
  
    // infinite scrolling ground
    if (ground.x < 0){
      ground.x = ground.width/2;
    }

    spawnClouds();
    spawnObstacles();

    if (obstacleGroup.isTouching (trex)) {
      gameState = END;
    }

  } else {
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstacleGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    obstacleGroup.setLifetimeEach (-1);
    cloudsGroup.setLifetimeEach(-1);
    trex.changeAnimation ("collided");
    gameOver.visible = true;
    restart.visible = true;
    if (mousePressedOver (restart)) {
      reset();
    }
  }
  
  
  //stop trex from falling down
  trex.collide(invisibleGround);
  drawSprites();
  
}

function spawnClouds() {
    // make the clouds
    if (frameCount % 60 === 0) {
       
        cloud = createSprite (width, Math.round(random (25, height/2)), 40, 10);
        cloud.addImage("cloud", cloudImg);
        cloud.scale = 0.5;
        cloud.velocityX = -4;

        cloud.depth = trex.depth;
        trex.depth = trex.depth + 1;

        cloud.lifetime = 200;
        cloudsGroup.add(cloud);
    }
}

function spawnObstacles() {
  if (frameCount % 40 === 0) {
      obstacle = createSprite (width, height-25, 30, 30);
      var imgNum = "obstacle" + Math.round(random(1,6));
      
      obstacle. addImage ("obstacle",loadImage(imgNum + ".png"));
      obstacle.scale = 0.5;
      obstacle.velocityX = -(4 + score/100);

      obstacle.lifetime = 300;
      obstacleGroup.add(obstacle);

  }

}

function reset() {
  score = 0;
  gameState = PLAY;
  cloudsGroup.destroyEach();
  obstacleGroup.destroyEach();

}