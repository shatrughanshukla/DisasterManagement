// Phaser 3 — Duck, Cover & Hold
// Full working version with middle-door placement, colliders, complete gameplay, and HEALTH SYSTEM.

const CONFIG = {
  type: Phaser.AUTO,
  width: 900,
  height: 600,
  parent: "game-container",
  backgroundColor: "#87ceeb",
  physics: { default: "arcade", arcade: { gravity: { y: 400 }, debug: false } },
  scene: [PreloadScene, MenuScene, PlayScene, ResultScene],
};

// Make sure the game variable is accessible globally
window.game = new Phaser.Game(CONFIG);

/* ------------------ PreloadScene ------------------ */
function PreloadScene() {
  Phaser.Scene.call(this, { key: "PreloadScene" });
}
PreloadScene.prototype = Object.create(Phaser.Scene.prototype);
PreloadScene.prototype.constructor = PreloadScene;

PreloadScene.prototype.preload = function () {
  // Try to load real assets if you put them in assets/, otherwise placeholders will be generated
  this.load.image("classroom_bg", "assets/classroom_bg.png");
  this.load.image("desk", "assets/desk.png");
  this.load.spritesheet("student", "assets/student_spritesheet.png", {
    frameWidth: 32,
    frameHeight: 48,
  });
  this.load.image("book", "assets/book.png");
  this.load.audio("quake", "assets/quake.mp3");

  // Debug callbacks (optional)
  this.load.on("filecomplete", (key) => {
    /*console.log('Loaded:', key);*/
  });
  this.load.on("loaderror", (file) => {
    /*console.log('Missing asset:', file.key);*/
  });
};

PreloadScene.prototype.create = function () {
  // If real textures weren't loaded, generate placeholder textures (background, desk, student, book)
  this.createPlaceholderAssets();
  this.scene.start("MenuScene");
};

PreloadScene.prototype.createPlaceholderAssets = function () {
  // Create classroom background with middle door (only if classroom_bg not found)
  if (!this.textures.exists("classroom_bg")) {
    const g = this.add.graphics();
    // Base: ceiling, walls, floor
    g.fillStyle(0xf0f8ff).fillRect(0, 0, 900, 200); // ceiling
    g.fillStyle(0xffffff).fillRect(0, 200, 900, 300); // walls
    g.fillStyle(0x8b4513).fillRect(0, 500, 900, 100); // floor

    // Blackboard
    g.fillStyle(0x000000).fillRect(50, 50, 300, 150);
    g.fillStyle(0xffffff);
    g.fillRect(60, 60, 280, 3).fillRect(60, 70, 200, 3);
    g.fillRect(60, 80, 250, 3).fillRect(60, 90, 180, 3);
    g.fillRect(60, 100, 220, 3).fillRect(60, 110, 160, 3);
    g.fillRect(60, 120, 240, 3).fillRect(60, 130, 190, 3);

    // Left & Right windows (middle replaced by door)
    g.fillStyle(0x87ceeb).fillRect(400, 50, 120, 100); // left window
    g.fillRect(700, 50, 120, 100); // right window

    // Frames left
    g.fillStyle(0x000000);
    g.fillRect(400, 50, 120, 4).fillRect(400, 50, 4, 100);
    g.fillRect(516, 50, 4, 100).fillRect(400, 146, 120, 4);
    g.fillRect(460, 50, 4, 100).fillRect(400, 100, 120, 4);

    // Frames right
    g.fillRect(700, 50, 120, 4).fillRect(700, 50, 4, 100);
    g.fillRect(816, 50, 4, 100).fillRect(700, 146, 120, 4);
    g.fillRect(760, 50, 4, 100).fillRect(700, 100, 120, 4);

    // Middle door (replaces window) -- positioned so center = (600,150)
    g.fillStyle(0x654321).fillRect(550, 50, 100, 150); // outer frame-ish
    g.fillStyle(0x8b4513).fillRect(555, 55, 90, 140); // door inner
    g.fillStyle(0xffd700).fillRect(630, 140, 8, 8); // handle
    g.fillStyle(0x87ceeb).fillRect(570, 70, 40, 50); // glass panel
    g.fillStyle(0x000000);
    g.fillRect(570, 70, 40, 2)
      .fillRect(570, 70, 2, 50)
      .fillRect(608, 70, 2, 50)
      .fillRect(570, 118, 40, 2);

    g.generateTexture("classroom_bg", 900, 600);
    g.destroy();
  }

  // Desk placeholder
  if (!this.textures.exists("desk")) {
    const g2 = this.add.graphics();
    g2.fillStyle(0x8b4513).fillRect(0, 0, 60, 6);
    g2.fillStyle(0x654321).fillRect(2, 2, 56, 2);
    g2.fillStyle(0x8b4513).fillRect(4, 6, 6, 20).fillRect(50, 6, 6, 20);
    g2.generateTexture("desk", 60, 26);
    g2.destroy();
  }

  // Student standing placeholder
  if (!this.textures.exists("student")) {
    const g3 = this.add.graphics();
    g3.fillStyle(0xffdbac).fillRect(8, 4, 16, 12);
    g3.fillStyle(0xff0000).fillRect(6, 2, 20, 8);
    g3.fillStyle(0x0066cc).fillRect(4, 16, 24, 16);
    g3.fillStyle(0xffdbac).fillRect(2, 18, 6, 8).fillRect(24, 18, 6, 8);
    g3.fillStyle(0x000000).fillRect(10, 6, 2, 2).fillRect(20, 6, 2, 2);
    g3.fillStyle(0xff0000).fillRect(14, 10, 4, 2);
    g3.fillStyle(0x000000).fillRect(8, 32, 4, 8).fillRect(20, 32, 4, 8);
    g3.generateTexture("student", 32, 40);
    g3.destroy();
  }

  // Student duck placeholder
  if (!this.textures.exists("student_duck")) {
    const g4 = this.add.graphics();
    g4.fillStyle(0xffdbac).fillRect(8, 8, 16, 8);
    g4.fillStyle(0xff0000).fillRect(6, 6, 20, 6);
    g4.fillStyle(0x0066cc).fillRect(4, 14, 24, 12);
    g4.fillStyle(0xffdbac).fillRect(2, 12, 8, 6).fillRect(22, 12, 8, 6);
    g4.fillStyle(0x000000).fillRect(10, 10, 2, 2).fillRect(20, 10, 2, 2);
    g4.fillStyle(0xff0000).fillRect(14, 12, 4, 2);
    g4.fillStyle(0x000000).fillRect(8, 26, 4, 6).fillRect(20, 26, 4, 6);
    g4.generateTexture("student_duck", 32, 32);
    g4.destroy();
  }

  // Brick placeholder
  if (!this.textures.exists("book")) {
    const g5 = this.add.graphics();
    g5.fillStyle(0x8b0000).fillRect(0, 0, 20, 10); // brick red
    g5.lineStyle(2, 0x000000, 1); // brick lines
    g5.strokeRect(0, 0, 20, 10); // outline
    g5.strokeLineShape(new Phaser.Geom.Line(0, 5, 20, 5)); // middle line to separate brick halves
    g5.generateTexture("book", 20, 10);
    g5.destroy();
  }
};

/* ------------------ MenuScene ------------------ */
function MenuScene() {
  Phaser.Scene.call(this, { key: "MenuScene" });
}
MenuScene.prototype = Object.create(Phaser.Scene.prototype);
MenuScene.prototype.constructor = MenuScene;
MenuScene.prototype.create = function () {
  const startBtn = document.getElementById("start-btn");
  const resultDiv = document.getElementById("result");
  resultDiv.innerText = "";
  startBtn.disabled = false;
  // We don't set onclick here anymore as it's handled in the HTML file
};

/* ------------------ PlayScene ------------------ */
function PlayScene() {
  Phaser.Scene.call(this, { key: "PlayScene" });
}
PlayScene.prototype = Object.create(Phaser.Scene.prototype);
PlayScene.prototype.constructor = PlayScene;

PlayScene.prototype.create = function () {
  // DOM hooks
  this.timerEl = document.getElementById("time-val");
  this.resultEl = document.getElementById("result");
  this.resultEl.innerText = "";

  // Background image (placeholder or real)
  this.add.image(450, 300, "classroom_bg").setDisplaySize(900, 600);

  // --- HEALTH SYSTEM ---
  this.maxHealth = 100;
  this.currentHealth = this.maxHealth;
  this.gameEnded = false;
  this.invulnerabilityTime = 500; // ms of invulnerability after being hit
  this.lastHitTime = 0;

  // Create rounded health bar using graphics
  this.createHealthBar();

  // --- Desks (3 rows) ---
  this.desks = this.physics.add.staticGroup();
  const deskY = [450, 350, 250];
  // door center (matches background door we drew) -> center at x=600
  this.doorCenterX = 600;
  const doorHalfWidth = 50; // background door width = 100
  for (let r = 0; r < deskY.length; r++) {
    for (let c = 0; c < 4; c++) {
      const x = 150 + c * 180;
      const y = deskY[r];
      // skip desks that would intersect the door center area (give small margin)
      if (Math.abs(x - this.doorCenterX) < doorHalfWidth + 30) continue;
      const desk = this.desks.create(x, y, "desk").setScale(1.2).refreshBody();
      desk.safeZone = true;
    }
  }

  // Player
  this.player = this.physics.add.sprite(120, 500, "student");
  this.player.setCollideWorldBounds(true);
  this.player.body.setSize(20, 40).setOffset(6, 8);

  // Animations (placeholders: single-frame idle/walk)
  this.anims.create({
    key: "walk",
    frames: [{ key: "student", frame: 0 }],
    frameRate: 10,
    repeat: -1,
  });
  this.anims.create({
    key: "idle",
    frames: [{ key: "student", frame: 0 }],
    frameRate: 10,
  });
  this.anims.create({
    key: "duck",
    frames: [{ key: "student_duck", frame: 0 }],
    frameRate: 10,
  });

  // Controls
  this.cursors = this.input.keyboard.createCursorKeys();
  this.holdKey = this.input.keyboard.addKey(
    Phaser.Input.Keyboard.KeyCodes.SPACE
  );
  this.duckKey = this.input.keyboard.addKey(
    Phaser.Input.Keyboard.KeyCodes.SHIFT
  );

  // Colliders
  this.physics.add.collider(this.player, this.desks);

  // Top wall (invisible collider under blackboard/windows)
  const topRect = this.add
    .rectangle(450, 120, 900, 160, 0x000000, 0)
    .setOrigin(0.5, 0.5);
  this.physics.add.existing(topRect, true);
  this.topWall = topRect;
  this.topWall.body.setSize(900, 160);
  this.topWall.setVisible(false);
  this.physics.add.collider(this.player, this.topWall);

  // Door collider in the middle (centered at x = this.doorCenterX, y = 150)
  // Match the placeholder door size: width 100, height 200
  const doorRect = this.add
    .rectangle(this.doorCenterX, 125, 100, 150, 0x000000, 0) // height reduced to 150
    .setOrigin(0.5, 0.5);
  this.physics.add.existing(doorRect, true);
  this.doorWall = doorRect;
  this.doorWall.body.setSize(100, 150); // match new height
  this.doorWall.setVisible(false);

  // Desk vs door collisions (so desks don't overlap door) - we already skipped placing desks near door
  // Player vs door collider
  this.physics.add.collider(this.player, this.doorWall);

  // Falling books group - INCREASED RATE AND NUMBER
  this.books = this.physics.add.group({ allowGravity: true });
  this.time.addEvent({
    delay: 400, // Faster spawn rate (was 800)
    callback: this.spawnBook,
    callbackScope: this,
    loop: true,
  });

  // --- BOOK-PLAYER COLLISION ---
  this.physics.add.overlap(this.player, this.books, this.hitByBook, null, this);

  // Timer
  this.timeRemaining = 15;
  this.timerEvent = this.time.addEvent({
    delay: 1000,
    callback: this.tick,
    callbackScope: this,
    loop: true,
  });
  this.timerEl.innerText = this.timeRemaining;

  // Sound (optional)
  try {
    this.sound.play("quake", { loop: true, volume: 0.4 });
  } catch (e) {}

  // Camera shake for earthquake effect (duration large so shaking persists)
  this.cameras.main.shake(15000, 0.005);

  // State
  this.safe = false;
  this.holding = false;
  this.isDucking = false;
  this.earthquakeStarted = false;

  // Start the earthquake after a short delay (gives player time)
  this.time.delayedCall(1000, () => {
    this.earthquakeStarted = true;
  });
};

// Create rounded health bar with graphics
PlayScene.prototype.createHealthBar = function () {
  // Health bar container (background with rounded corners)
  this.healthBarBg = this.add.graphics();
  this.healthBarBg.fillStyle(0x333333);
  this.healthBarBg.fillRoundedRect(10, 10, 880, 30, 15); // x, y, width, height, radius
  this.healthBarBg.lineStyle(3, 0x000000);
  this.healthBarBg.strokeRoundedRect(10, 10, 880, 30, 15);
  this.healthBarBg.setDepth(1000);

  // Health bar fill (green bar with rounded corners)
  this.healthBarFill = this.add.graphics();
  this.healthBarFill.fillStyle(0x00ff00);
  this.healthBarFill.fillRoundedRect(15, 15, 870, 20, 10); // slightly smaller with padding
  this.healthBarFill.setDepth(1001);

  // Health percentage text (centered)
  this.healthText = this.add
    .text(450, 25, "100%", {
      fontSize: "16px",
      fill: "#ffffff",
      fontWeight: "bold",
      stroke: "#000000",
      strokeThickness: 2,
    })
    .setOrigin(0.5, 0.5);
  this.healthText.setDepth(1002);
};

// ----------------- hitByBook -----------------
PlayScene.prototype.hitByBook = function (player, book) {
  // Prevent multiple hits and game-end scenarios
  if (this.gameEnded) return;

  // Check invulnerability period
  if (this.time.now - this.lastHitTime < this.invulnerabilityTime) return;

  // Check if player is in a safe position (under desk, ducking, holding)
  let inSafeZone = false;
  const pBounds = this.player.getBounds();
  this.desks.getChildren().forEach((d) => {
    if (Phaser.Geom.Intersects.RectangleToRectangle(pBounds, d.getBounds())) {
      if (this.isDucking && this.holdKey.isDown) {
        inSafeZone = true;
      }
    }
  });

  // If not in safe zone, take damage
  if (!inSafeZone) {
    this.currentHealth -= 20; // Damage per hit
    this.lastHitTime = this.time.now;

    // Update health display
    this.updateHealthBar();

    // Visual feedback - flash player red
    this.player.setTint(0xff0000);
    this.time.delayedCall(200, () => {
      if (this.player && this.player.setTint) {
        this.player.setTint(0xffffff);
      }
    });

    // Check if health reached zero
    if (this.currentHealth <= 0) {
      this.currentHealth = 0;
      this.updateHealthBar();
      this.gameEnded = true;
      // End game immediately due to health loss
      this.time.delayedCall(500, () => {
        this.endRound();
      });
    }
  }

  // Remove the book that hit
  book.destroy();
};

// ----------------- updateHealthBar -----------------
PlayScene.prototype.updateHealthBar = function () {
  // Clear and redraw the health bar fill
  this.healthBarFill.clear();

  // Calculate health percentage and width
  const healthPercentage = this.currentHealth / this.maxHealth;
  const fillWidth = 870 * healthPercentage;

  // Change color based on health level
  let color;
  if (healthPercentage > 0.6) {
    color = 0x00ff00; // Green
  } else if (healthPercentage > 0.3) {
    color = 0xffff00; // Yellow
  } else {
    color = 0xff0000; // Red
  }

  // Redraw the health bar with new width and color
  this.healthBarFill.fillStyle(color);
  this.healthBarFill.fillRoundedRect(15, 15, fillWidth, 20, 10);

  // Update health percentage text
  const percentage = Math.round(healthPercentage * 100);
  this.healthText.setText(`${percentage}%`);
};

// ----------------- spawnBook - INCREASED NUMBER AND SPEED -----------------
PlayScene.prototype.spawnBook = function () {
  if (!this.earthquakeStarted || this.gameEnded) return;

  // Spawn 3-4 books at once for more intensity (was 1)
  const numBooks = Phaser.Math.Between(1, 2);

  for (let i = 0; i < numBooks; i++) {
    // pick x away from door area to avoid unrealistic falling into door
    const minX = 120,
      maxX = 800;
    let x;
    for (let tries = 0; tries < 10; tries++) {
      x = Phaser.Math.Between(minX, maxX);
      if (Math.abs(x - this.doorCenterX) > 120) break; // avoid door range
    }

    const b = this.physics.add.image(x, -20, "book");
    b.setVelocityY(Phaser.Math.Between(300, 500)); // Faster falling speed (was 200-360)
    b.setGravityY(400);
    b.setCollideWorldBounds(true);
    b.setBounce(0.2);

    // Add to books group for collision detection
    this.books.add(b);

    // remove after some time
    this.time.delayedCall(5000, () => {
      if (b && b.destroy) b.destroy();
    });
  }
};

// ----------------- tick -----------------
PlayScene.prototype.tick = function () {
  if (this.gameEnded) return;

  this.timeRemaining -= 1;
  if (this.timerEl) this.timerEl.innerText = this.timeRemaining;
  if (this.timeRemaining <= 0) {
    this.endRound();
  }
};

// ----------------- endRound -----------------
PlayScene.prototype.endRound = function () {
  if (this.timerEvent) this.timerEvent.remove(false);
  try {
    this.sound.stopAll();
  } catch (e) {}

  // Determine final result
  let safe = false;

  // If health is zero, automatically injured
  if (this.currentHealth <= 0) {
    safe = false;
  } else {
    // Check if player is safe: inside any desk bounds AND ducking AND holding space
    const pBounds = this.player.getBounds();
    this.desks.getChildren().forEach((d) => {
      if (Phaser.Geom.Intersects.RectangleToRectangle(pBounds, d.getBounds())) {
        if (this.isDucking && this.holdKey.isDown) safe = true;
      }
    });
  }

  if (safe) {
    this.scene.start("ResultScene", {
      result: "safe",
      health: this.currentHealth,
    });
  } else {
    this.scene.start("ResultScene", {
      result: "injured",
      health: this.currentHealth,
    });
  }
};

// ----------------- update -----------------
PlayScene.prototype.update = function () {
  if (this.gameEnded) return;

  const speed = 200;
  let moving = false;

  // Horizontal
  if (this.cursors.left.isDown) {
    this.player.setVelocityX(-speed);
    this.player.anims.play("walk", true);
    this.player.flipX = true;
    moving = true;
  } else if (this.cursors.right.isDown) {
    this.player.setVelocityX(speed);
    this.player.anims.play("walk", true);
    this.player.flipX = false;
    moving = true;
  } else {
    this.player.setVelocityX(0);
  }

  // Vertical - restrict so player can't go above the top-wall region
  if (this.cursors.up.isDown) {
    if (this.player.y > 170) {
      // limit jump/hop above top wall
      this.player.setVelocityY(-160);
      moving = true;
    } else {
      this.player.setVelocityY(0);
    }
  } else if (this.cursors.down.isDown) {
    this.player.setVelocityY(150);
    moving = true;
  } else {
    // allow gravity to pull if airborne, otherwise stop vertical movement
    if (this.player.body.blocked.down) this.player.setVelocityY(0);
  }

  // Ducking control
  if (this.duckKey.isDown && !this.isDucking) {
    this.isDucking = true;
    this.player.setTexture("student_duck");
    this.player.body.setSize(20, 20).setOffset(6, 20);
    this.player.anims.play("duck", true);
  } else if (!this.duckKey.isDown && this.isDucking) {
    this.isDucking = false;
    this.player.setTexture("student");
    this.player.body.setSize(20, 40).setOffset(6, 8);
    if (moving) this.player.anims.play("walk", true);
    else this.player.anims.play("idle", true);
  }

  // Animation when not ducking
  if (!this.isDucking) {
    if (moving) this.player.anims.play("walk", true);
    else this.player.anims.play("idle", true);
  }

  // Holding detection: under desk + ducking + holding SPACE
  let inDesk = false;
  const pB = this.player.getBounds();
  this.desks.getChildren().forEach((d) => {
    if (Phaser.Geom.Intersects.RectangleToRectangle(pB, d.getBounds()))
      inDesk = true;
  });

  if (inDesk && this.isDucking && this.holdKey.isDown) {
    this.holding = true;
    if (!this.player.duckGlow) {
      this.player.duckGlow = this.add.circle(
        this.player.x,
        this.player.y - 20,
        15,
        0x00ff00,
        0.28
      );
    }
  } else {
    this.holding = false;
    if (this.player.duckGlow) {
      this.player.duckGlow.destroy();
      this.player.duckGlow = null;
    }
  }

  // Update glow position
  if (this.player.duckGlow) {
    this.player.duckGlow.x = this.player.x;
    this.player.duckGlow.y = this.player.y - 20;
  }
};

/* ------------------ ResultScene ------------------ */
function ResultScene() {
  Phaser.Scene.call(this, { key: "ResultScene" });
}
ResultScene.prototype = Object.create(Phaser.Scene.prototype);
ResultScene.prototype.constructor = ResultScene;

ResultScene.prototype.init = function (data) {
  this.result = data.result;
  this.finalHealth = data.health;
};

ResultScene.prototype.create = function () {
  // Show result text in the UI area (re-uses HTML)
  const startBtn = document.getElementById("start-btn");
  const resultDiv = document.getElementById("result");
  
  // Set values in the registry for the enhanced UI to access
  this.registry.set('result', this.result);
  this.registry.set('health', this.finalHealth);

  if (this.result === "safe") {
    resultDiv.innerText = `SAFE ✅ — You followed Duck, Cover & Hold! Final Health: ${this.finalHealth}%`;
    resultDiv.style.color = "lightgreen";
  } else {
    if (this.finalHealth <= 0) {
      resultDiv.innerText = `INJURED ❌ — Your health reached zero! You should duck and hold under a desk to avoid falling debris.`;
    } else {
      resultDiv.innerText = `INJURED ❌ — You should duck and hold under a desk. Final Health: ${this.finalHealth}%`;
    }
    resultDiv.style.color = "salmon";
  }

  startBtn.disabled = false;
};
