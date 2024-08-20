/* global Phaser */

const config = {
  type: Phaser.AUTO,
  width: 256,
  height: 244,
  backgroundColor: '#fff',
  parent: 'game',
  scene: {
    preload, // se ejecuta para cargar recursos
    create, // se ejecuta cuando el juego comienza
    update // se ejecuta en cada frame
  }
}

new Phaser.Game(config)

function preload() {
  console.log('preload')
}

function create() {
  console.log('create')
}

function update() {

}