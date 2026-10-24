# Earthquake drill game

This folder contains the Phaser game loaded by the Earthquake module at
`/earthquake_drill/index.html`. The page is only a canvas host; the game starts
automatically and renders its countdown, health, and round result inside the
game scene.

## Controls

- Arrow keys: move around the classroom
- Shift: duck
- Space: hold on while under a desk

The game uses Phaser 3 from jsDelivr and local files in `assets/`. Missing art
assets fall back to graphics generated in `game.js`.
