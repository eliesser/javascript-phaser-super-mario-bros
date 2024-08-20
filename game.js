/* global Phaser */

import { createAnimations } from './animations.js'

const config = {
  type: Phaser.AUTO,
  width: 256,
  height: 244,
  backgroundColor: '#049cd8',
  parent: 'game',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
  scene: {
    preload, // se ejecuta para cargar recursos
    create, // se ejecuta cuando el juego comienza
    update // se ejecuta en cada frame
  }
}

new Phaser.Game(config)

function preload() {
  // this --> game --> el juego que estamos construyendo
  this.load.image(
    'cloud1',
    'assets/scenery/overworld/cloud1.png'
  )

  this.load.image(
    'floorbricks',
    'assets/scenery/overworld/floorbricks.png'
  )

  this.load.spritesheet(
    'mario',
    'assets/entities/mario.png',
    {
      frameWidth: 18,
      frameHeight: 16
    }
  )

  this.load.audio(
    'game-over', 'assets/sound/music/gameover.mp3'
  )
}

function create() {
  // image(x, y, id-del-assets)
  this.add.image(0, 0, 'cloud1').setOrigin(0, 0).setScale(0.15);

  // agrega los sprites del suelo y los podemos repetir
  // this.add.tileSprite(0, config.height - 32, config.width, 32, 'floorbricks').setOrigin(0, 0);

  this.floor = this.physics.add.staticGroup();

  this.floor.create(0, config.height - 16, 'floorbricks').setOrigin(0, 0.5).refreshBody();

  this.floor.create(150, config.height - 16, 'floorbricks').setOrigin(0, 0.5).refreshBody();

  // crea el sprite de mario
  // this.mario = this.add.sprite(50, 210, 'mario').setOrigin(0, 1);
  this.mario = this.physics.add.sprite(50, 100, 'mario').setOrigin(0, 1).setCollideWorldBounds(true).setGravityY(300);

  this.physics.world.setBounds(0, 0, 2000, config.height)
  this.physics.add.collider(this.mario, this.floor)

  this.cameras.main.setBounds(0, 0, 2000, config.height)
  this.cameras.main.startFollow(this.mario)

  createAnimations(this)

  // asigna teclas del teclado
  this.keys = this.input.keyboard.createCursorKeys();
}

function update() {
  if (this.mario.isDead) return;

  if (this.keys.left.isDown) {
    this.mario.anims.play('mario-walk', true);
    this.mario.x -= 1;
    this.mario.flipX = true;
  } else if (this.keys.right.isDown) {
    this.mario.anims.play('mario-walk', true);
    this.mario.x += 1;
    this.mario.flipX = false;
  } else {
    this.mario.anims.play('mario-idle');
  }

  if (this.keys.up.isDown && this.mario.body.touching.down) {
    this.mario.setVelocityY(-300);
    this.mario.anims.play('mario-jump');
  }

  if (this.mario.y >= config.height) {
    this.mario.isDead = true;
    this.mario.anims.play('mario-dead');
    this.mario.setCollideWorldBounds(false)
    this.sound.play('game-over')

    setTimeout(() => {
      this.mario.setVelocityY(-350);
    }, 100);

    setTimeout(() => {
      this.scene.restart();
    }, 8000);
  }
}