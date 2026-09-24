// --- PLAYER ENTITY ---
game.PlayerEntity = me.ObjectEntity.extend({
  init: function (x, y, settings) {
    this.parent(x, y, {
      image: "player",
      width: 64,
      height: 64
    });

    // Kinematics: horizontal velocity = 3, jump impulse = 12
    this.setVelocity(3, 12);
    this.setFriction(0.4, 0);

    // Camera locks on player
    me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);

    // Sprite animations
    this.addAnimation("walk", [0, 1, 2, 3], 100);
    this.addAnimation("stand", [0]);
    this.setCurrentAnimation("stand");
  },

  update: function (dt) {
    if (me.input.isKeyPressed("left")) {
      this.vel.x -= this.accel.x * me.timer.tick;
      this.flipX(true);
    } else if (me.input.isKeyPressed("right")) {
      this.vel.x += this.accel.x * me.timer.tick;
      this.flipX(false);
    } else {
      this.vel.x = 0;
    }

    if (me.input.isKeyPressed("jump")) {
      if (!this.jumping && !this.falling) {
        this.vel.y = -this.maxVel.y * me.timer.tick;
        this.jumping = true;
      }
    }

    // Apply physics integration and resolve map collisions
    this.updateMovement();

    // Switch animation state
    if (this.vel.x !== 0) {
      if (!this.isCurrentAnimation("walk")) {
        this.setCurrentAnimation("walk");
      }
    } else {
      this.setCurrentAnimation("stand");
    }

    return (this.parent(dt) || this.vel.x !== 0 || this.vel.y !== 0);
  },

  onCollision: function (response, other) {
    return true; // Collide with solid tiles
  }
});

// --- COIN ENTITY ---
game.CoinEntity = me.CollectableEntity.extend({
  init: function (x, y, settings) {
    this.parent(x, y, settings);
  },
  onCollision: function (response, other) {
    me.game.remove(this);
    return false;
  }
});

// --- PATROLLING ENEMY ENTITY ---
game.EnemyEntity = me.ObjectEntity.extend({
  init: function (x, y, settings) {
    this.parent(x, y, { image: "enemy", width: 48, height: 48 });
    this.startX = x;
    this.endX = x + (settings.width || 120);
    this.pos.x = x;
    this.walkLeft = false;
    this.setVelocity(2, 6);
  },

  update: function (dt) {
    if (this.walkLeft && this.pos.x <= this.startX) {
      this.walkLeft = false;
    } else if (!this.walkLeft && this.pos.x >= this.endX) {
      this.walkLeft = true;
    }

    this.vel.x += (this.walkLeft) ? -this.accel.x * me.timer.tick : this.accel.x * me.timer.tick;
    this.updateMovement();
    return true;
  },

  onCollision: function (response, other) {
    // Mario-style jump stomp
    if (response.overlapV.y > 0 && other.falling) {
      me.game.remove(this);
    } else {
      // Player takes damage -> reload level
      me.game.viewport.fadeIn("#e74c3c", 200, function () {
        me.levelDirector.reloadLevel();
      });
    }
    return false;
  }
});