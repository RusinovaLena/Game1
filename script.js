var i = 0;
var w = 1400;
var h = 600;
var isStart = false;
var firstJump = false;
let currentI = 849302;

function random( min, max ) {
  return Math.round( min + ( Math.random() * ( max - min ) ) );
}

function randomChoice(array){
  return array[ Math.round( random( 0, array.length - 1 ) ) ];
}

var InfiniteRunner = Sketch.create({
  fullscreen: false,
  width: this.w,
  height: this.h,
  container: document.getElementById('container')
});

function Vector2(x, y, width, height){
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.previousX = 0;
  this.previousY = 0;
};

Vector2.prototype.setPosition = function(x, y) {
  this.previousX = this.x;
  this.previousY = this.y;
  this.x = x;
  this.y = y;
};

Vector2.prototype.setX = function(x) {
  this.previousX = this.x;
  this.x = x;
};

Vector2.prototype.setY = function(y) { 
  this.previousY = this.y;  
  this.y = y;
};

Vector2.prototype.insercects = function(obj){
  if(obj.x < this.x + this.width && obj.y < this.y + this.height &&
     obj.x + obj.width > this.x && obj.y + obj.height > this.y ){
    return true;
  }
  return false;
};

Vector2.prototype.topElement = function(obj){
  if( this.y <= 90 ){
    return true;
  }
  return false;
};

Vector2.prototype.runUp = function(){
  if( this.y <= 90 ){
    return true;
  }
  return false;
};

Vector2.prototype.insercectsLeft = function(obj){
  if(obj.x < this.x + this.width && obj.y < this.y + this.height ){
    return true;
  }
  return false;
};

function Player(options){
  this.setPosition(options.x, options.y);
  this.width = options.width;
  this.height = options.height;
  this.velocityX = 0;
  this.velocityY = 0;
  this.jumpSize = -13;
  this.color = '#ff9b4a';
}

Player.prototype = new Vector2;

Player.prototype.update = function() {
  this.velocityY += 1;
  if ( this.y <= 92 ) {
    if( InfiniteRunner.keys.SPACE || InfiniteRunner.dragging ){
      this.setPosition( this.x + this.velocityX, this.y + this.velocityY );
    } else {
      this.setPosition( this.x + this.velocityX, 90 );
    }
  } else {
    this.setPosition( this.x + this.velocityX, this.y + this.velocityY );
  }

  if( this.y > InfiniteRunner.height || this.x + this.width < 0 ){
    this.x = 150;
    this.y = 368;
    this.velocityX = 0;
    this.velocityY = 0;
    InfiniteRunner.currentCount = 0;
    InfiniteRunner.aceleration = 0;
    InfiniteRunner.acelerationTweening = 0;
    InfiniteRunner.scoreColor = '#181818';
    InfiniteRunner.platformManager.maxDistanceBetween = 350;
    InfiniteRunner.platformManager.updateWhenLose();
  }

  if((InfiniteRunner.keys.SPACE || InfiniteRunner.dragging) && this.velocityY < -8){
    this.velocityY += -0.9;  
  }
};

Player.prototype.draw = function() {
  InfiniteRunner.fillStyle = this.color;
  InfiniteRunner.arc(this.x, this.y, this.width, Math.PI/7, -Math.PI/7, false);
  InfiniteRunner.lineTo(this.x, this.y);
  InfiniteRunner.fill();
};

function Platform(options){
  this.x = options.x;
  this.y = options.y;
  this.width = options.width;
  this.height = options.height;
  this.previousX = 0;
  this.previousY = 0;
  this.color = options.color;
}

Platform.prototype = new Vector2;

Platform.prototype.draw = function() {
  InfiniteRunner.fillStyle = this.color;
  InfiniteRunner.fillRect(this.x, this.y, this.width, this.height);
};

function PlatformManager(){
  this.maxDistanceBetween = 300;
  this.colors = ['#addfad', '#94baa2', '#badbad', '#abd1b9'];
  this.first = new Platform({x: 100, y: 400, width: 700, height: 70})
  this.second = new Platform({x: (this.first.x + this.first.width) + random(this.maxDistanceBetween - 150, this.maxDistanceBetween),
      y: random(this.first.y - 128, InfiniteRunner.height - 80), width: 800, height: 70})
  this.third = new Platform({x: (this.second.x + this.second.width) + random(this.maxDistanceBetween - 150, this.maxDistanceBetween),
      y: random(this.second.y - 128, InfiniteRunner.height - 80), width: 1400, height: 70})    
  this.topObstacle = new Platform({x: (this.third.x + this.third.width / 2),
  y: this.third.y - random(40, 70), width: 100, height: 50})
  this.roof = new Platform({x: 0, y: 0, width: InfiniteRunner.width, height: 70})
  this.roofObstacle = new Platform({x: (this.second.x + this.second.width / 2), y: 70, width: 80, height: 50})

  this.first.height = this.first.y + InfiniteRunner.height;
  this.second.height = this.second.y + InfiniteRunner.height;
  this.third.height = this.third.y + InfiniteRunner.height;
  this.topObstacle.height = this.topObstacle.y + InfiniteRunner.height;

  this.first.color = randomChoice(this.colors);
  this.second.color = randomChoice(this.colors);
  this.third.color = randomChoice(this.colors);
  this.topObstacle.color = randomChoice(this.third.color);
  this.roof.color = '#005b96';
  this.roofObstacle.color = this.roof.color;

  this.colliding = false;
  this.platforms = [ this.first, this.second, this.third, this.topObstacle, this.roofObstacle, this.roof ];    
}

PlatformManager.prototype.update = function() {
  this.first.x -= 2 + InfiniteRunner.aceleration;
  if(this.first.x + this.first.width < 0 ){
      this.first.width = random(450, InfiniteRunner.width + 1200);
      this.first.x = (this.third.x + this.third.width) + random(this.maxDistanceBetween - 150, this.maxDistanceBetween);
      this.first.y = random(this.third.y - 32, InfiniteRunner.height - 50);
      this.first.height = this.first.y + InfiniteRunner.height;
      this.first.color = randomChoice(this.colors);
  }
  
  this.second.x -= 2 + InfiniteRunner.aceleration;
  if(this.second.x + this.second.width < 0 ){
      this.second.width = random(450, InfiniteRunner.width + 1200);
      this.second.x = (this.first.x + this.first.width) + random(this.maxDistanceBetween - 150, this.maxDistanceBetween);
      this.second.y = random(this.first.y - 32, InfiniteRunner.height - 50);
      this.second.height = this.second.y + InfiniteRunner.height;
      this.second.color = randomChoice(this.colors);
  }

  this.third.x -= 2 + InfiniteRunner.aceleration;
  if(this.third.x + this.third.width < 0 ){
      this.third.width = random(450, InfiniteRunner.width + 1200);
      this.third.x = (this.second.x + this.second.width) + random(this.maxDistanceBetween - 150, this.maxDistanceBetween);
      this.third.y = random(this.second.y - 32, InfiniteRunner.height - 50);
      this.third.height = this.third.y + InfiniteRunner.height;
      this.third.color = randomChoice(this.colors);
  }

  this.topObstacle.x -= 2 + InfiniteRunner.aceleration;
  if(this.topObstacle.x + this.topObstacle.width < 0 ){
      this.topObstacle.width = random(50, 100);
      this.topObstacle.x = this.third.x + this.third.width / 2;
      this.topObstacle.y = this.third.y - random(40, 70);
      this.topObstacle.height = this.topObstacle.y + random(10, 30);
      this.topObstacle.color = randomChoice(this.third.color);
  }  

  this.roofObstacle.x -= 2 + InfiniteRunner.aceleration;
      this.roofObstacle.width = 80;
      this.roofObstacle.x = this.second.x + this.second.width / 2;
      this.roofObstacle.y = 70;
      this.roofObstacle.height = 50;
      this.roofObstacle.color = this.roof.color;

  this.roof.x -= 2 + InfiniteRunner.aceleration;
  this.roof.width = InfiniteRunner.width;
  this.roof.x = 0;
  this.roof.y = 0;
  this.roof.height = 70;
  this.roof.color = this.roof.color;
};

PlatformManager.prototype.updateWhenLose = function() {
  isStart = false;
  this.first.x = 100;
  this.first.color = randomChoice(this.colors);
  this.first.y = 400;
  this.second.x = (this.first.x + this.first.width) + random(this.maxDistanceBetween - 150, this.maxDistanceBetween);
  this.third.x = (this.second.x + this.second.width) + random(this.maxDistanceBetween - 150, this.maxDistanceBetween);
  this.topObstacle.x = this.third.x + this.third.width / 2;
  this.roof.x = 0;
};

function Particle(options){
  this.x = options.x - 10;
  this.y = options.y + 5;
  this.size = 10;
  this.velocityX = random(-(InfiniteRunner.aceleration * 3) -8,-(InfiniteRunner.aceleration * 3));
  this.velocityY = random(-(InfiniteRunner.aceleration * 3) -8,-(InfiniteRunner.aceleration * 3));
  this.color = options.color;
}

Particle.prototype.update = function() {
  this.x += this.velocityX ;
  this.y += this.velocityY;
  this.size *= 0.89;
};

Particle.prototype.draw = function() {
  InfiniteRunner.fillStyle = this.color;
  InfiniteRunner.fillRect(this.x, this.y, this.size, this.size);
};

function Particle2(options){
  this.x = options.x - 5;
  this.y = options.y - 45;
  this.size = 10;
  this.velocityX = random(-(InfiniteRunner.aceleration * 3) -8,-(InfiniteRunner.aceleration * 3));
  this.velocityY = random(-(InfiniteRunner.aceleration * 3) -8,-(InfiniteRunner.aceleration * 3));
  this.color = options.color;
}

Particle2.prototype.update = function() {
  this.x += this.velocityX;
  this.y -= this.velocityY;
  this.size *= 0.89;
};

Particle2.prototype.draw = function() {
  InfiniteRunner.fillStyle = this.color;
  InfiniteRunner.fillRect(this.x, this.y , this.size, this.size);
};

InfiniteRunner.setup = function () {
    this.currentCount = 0;
    this.aceleration = 0;
    this.acelerationTweening = 0;
    this.player = new Player({x: 150, y: 368, width: 20, height: 20});
    this.platformManager = new PlatformManager();
    this.particles = [];
    this.particlesIndex = 0;
    this.particlesMax = 20;
    this.collidedPlatform = null;
    this.jumpCountRecord = 0;
};

InfiniteRunner.update = function() {

  this.player.update();

  switch(this.currentCount){
    case 10:
      this.acelerationTweening = 1;
      this.platformManager.maxDistanceBetween = 430;
      this.scoreColor = '#076C00';
      break;
    case 25:
      this.acelerationTweening = 2;
      this.platformManager.maxDistanceBetween = 530;
      this.scoreColor = '#0300A9';
      break;
    case 40:
      this.acelerationTweening = 3;
      this.platformManager.maxDistanceBetween = 580;
      this.scoreColor = '#9F8F00';
      break;
  }

  this.aceleration += (this.acelerationTweening - this.aceleration) * 0.0000001;

  for (i = 0; i < this.platformManager.platforms.length - 1; i++) {

    if ( this.player.y <= 90 ) {
      this.player.x = this.player.previousX;
      this.player.y = this.player.previousY;
      this.particles[(this.particlesIndex++) % this.particlesMax] = new Particle2({
        x: 150,
        y: 90,
        color: '#005b96'
      });

    }

    if(this.player.runUp()){
      this.player.y = 90
    } else {

      if ( this.player.insercects(this.platformManager.platforms[i]) ){
        this.collidedPlatform = this.platformManager.platforms[i];
        if (this.player.y < this.platformManager.platforms[i].y) {
          this.player.y = this.platformManager.platforms[i].y;
          this.player.velocityY = 0;
        }     

        this.player.x = this.player.previousX;
        this.player.y = this.player.previousY;
    
        this.particles[(this.particlesIndex++) % this.particlesMax] = new Particle({
          x: this.player.x,
          y: this.player.y + this.player.height,
          color: this.collidedPlatform.color
        });

        if(this.player.insercectsLeft(this.platformManager.platforms[i])){
          this.player.x = this.collidedPlatform.x - 64;

          for (i = 0; i < 10; i++) {
            this.particles[(this.particlesIndex++)%this.particlesMax] = new Particle({
              x: this.player.x + this.player.width,
              y: random(this.player.y, this.player.y + this.player.height),
              velocityY: random(-30,30),
              color: randomChoice(['#181818','#181818', this.collidedPlatform.color])
            });
          };

          this.player.velocityY = -10 + -(this.aceleration * 4);
          this.player.velocityX = -20 + -(this.aceleration * 4);

        } else {      
          if(this.dragging || this.keys.SPACE){           
            if (firstJump == false) {
              this.player.velocityY = 0;
              firstJump = true;
            } else {
              this.player.velocityY = this.player.jumpSize;
            }                     
          }           
        }
      }
    }
  };

  if( this.dragging || this.keys.SPACE ) {
    isStart = true;     
  }

  if( isStart == true ){
    for (i = 0; i < this.platformManager.platforms.length; i++) {
      if (this.platformManager.platforms[i].width + this.platformManager.platforms[i].x < 150 
        && currentI !== i && i !== 3 && i !== 4 ) {
        this.currentCount++;

        if(this.currentCount > this.jumpCountRecord){
          this.jumpCountRecord = this.currentCount;
        }
        currentI = i;        
      }
      this.platformManager.update();
    };
  }

  for (i = 0; i < this.particles.length; i++) {
    this.particles[i].update();
  };
};

InfiniteRunner.draw = function(){
  this.player.draw();

  for (i = 0; i < this.platformManager.platforms.length; i++) {
    this.platformManager.platforms[i].draw();
  };

  for (i = 0; i < this.particles.length; i++) {
    this.particles[i].draw();
  };
  
  this.font = "bold 20px serif";
  this.fillStyle = '#ff9b4a';
  this.fillText('РЕКОРД: '+this.jumpCountRecord, this.width - (150 + (this.aceleration * 4)), 33 - (this.aceleration * 4));
  this.fillText('СЧЁТ: ' + this.currentCount, this.width - (150 + (this.aceleration * 4)), 50);
  
  if( isStart == false ) {
    this.fillStyle = '#ffffff';
    this.textAlign = "center";
    this.fillText('ИСПОЛЬЗУЙТЕ ДЛЯ ПРЫЖКА ПРОБЕЛ ИЛИ КНОПКУ МЫШИ',
    this.width/2, this.height/2);
    this.fillText('(УДЕРЖИВАЙТЕ, ЧТОБЫ ПРЫГНУТЬ ВЫШЕ)',
    this.width/2, this.height/2 + 20);
  } 
};
