// --- PLAYER ENTITY ---
game.PlayerEntity = me.ObjectEntity.extend({
  init: function (x, y, settings) {
    this._super(me.ObjectEntity, "init", [x, y, {
      image: "player",
      width: 64,
      height: 64
    }]);

    // Kinematics: horizontal velocity = 3, jump impulse = 12
    this.body.setVelocity(3, 12);
    this.body.setFriction(0.4, 0);

    // Camera locks on player
    me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);

    // Sprite animations
    this.renderable.addAnimation("walk", [0, 1, 2, 3], 100);
    this.renderable.addAnimation("stand", [0]);
    this.renderable.setCurrentAnimation("stand");
  },

  update: function (dt) {
    if (me.input.isKeyPressed("left")) {
      this.body.vel.x -= this.body.accel.x * me.timer.tick;
      this.renderable.flipX(true);
    } else if (me.input.isKeyPressed("right")) {
      this.body.vel.x += this.body.accel.x * me.timer.tick;
      this.renderable.flipX(false);
    } else {
      this.body.vel.x = 0;
    }

    if (me.input.isKeyPressed("jump")) {
      if (!this.body.jumping && !this.body.falling) {
        this.body.vel.y = -this.body.maxVel.y * me.timer.tick;
        this.body.jumping = true;
      }
    }

    // Apply physics integration and resolve map collisions
    this.body.update(dt);
    me.collision.check(this);

    // Switch animation state
    if (this.body.vel.x !== 0) {
      if (!this.renderable.isCurrentAnimation("walk")) {
        this.renderable.setCurrentAnimation("walk");
      }
    } else {
      this.renderable.setCurrentAnimation("stand");
    }

    return (this._super(me.ObjectEntity, "update", [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
  },

  onCollision: function (response, other) {
    return true; // Collide with solid tiles
  }
});

// --- COIN ENTITY ---
game.CoinEntity = me.CollectableEntity.extend({
  init: function (x, y, settings) {
    this._super(me.CollectableEntity, "init", [x, y, settings]);
  },
  onCollision: function (response, other) {
    this.body.setCollisionMask(me.collision.types.NO_OBJECT);
    me.game.world.removeChild(this);
    return false;
  }
});

// --- PATROLLING ENEMY ENTITY ---
game.EnemyEntity = me.ObjectEntity.extend({
  init: function (x, y, settings) {
    this._super(me.ObjectEntity, "init", [x, y, { image: "enemy", width: 48, height: 48 }]);
    this.startX = x;
    this.endX = x + (settings.width || 120);
    this.pos.x = x;
    this.walkLeft = false;
    this.body.setVelocity(2, 6);
  },

  update: function (dt) {
    if (this.walkLeft && this.pos.x <= this.startX) {
      this.walkLeft = false;
    } else if (!this.walkLeft && this.pos.x >= this.endX) {
      this.walkLeft = true;
    }

    this.body.vel.x += (this.walkLeft) ? -this.body.accel.x * me.timer.tick : this.body.accel.x * me.timer.tick;
    this.body.update(dt);
    return true;
  },

  onCollision: function (response, other) {
    // Mario-style jump stomp
    if (response.overlapV.y > 0 && other.body.falling) {
      me.game.world.removeChild(this);
    } else {
      // Player takes damage -> reload level
      me.game.viewport.fadeIn("#e74c3c", 200, function () {
        me.levelDirector.reloadLevel();
      });
    }
    return false;
  }
});