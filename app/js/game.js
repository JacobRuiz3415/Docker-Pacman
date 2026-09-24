var game = {
  resources: [
    { name: "tileset",      type: "image", src: "data/img/tileset.png" },
    { name: "levelSprites", type: "image", src: "data/img/levelSprites.png" },
    { name: "collision",   type: "image", src: "data/img/collision.png" },
    { name: "boots",       type: "image", src: "data/img/boots.png" },
    { name: "level1",      type: "tmx",   src: "data/map/level1.tmx" },
    { name: "player",      type: "image", src: "data/img/player.png" },
    { name: "coin",        type: "image", src: "data/img/coin.png" },
    { name: "enemy",       type: "image", src: "data/img/enemy.png" }
  ],

  onload: function () {
    // Initialize 640x480 viewport scaled automatically
    if (!me.video.init("screen", 640, 480, true, 1)) {
      alert("HTML5 Canvas is not supported by your browser.");
      return;
    }

    // Initialize audio if available
    me.audio.init("mp3,ogg");

    // Preload resources and trigger the callback defined in the older melonJS API
    me.loader.onload = this.loaded.bind(this);
    me.loader.preload(game.resources);
  },

  loaded: function () {
    // Register screens
    me.state.set(me.state.PLAY, new game.PlayScreen());

    // Register entities using the names created by the TMX object layer
    me.entityPool.add("player", game.PlayerEntity);
    me.entityPool.add("coin", game.CoinEntity);
    me.entityPool.add("enemyentity", game.EnemyEntity);
    me.entityPool.add("boots", me.InvisibleEntity);

    // Keybindings
    me.input.bindKey(me.input.KEY.LEFT,  "left");
    me.input.bindKey(me.input.KEY.RIGHT, "right");
    me.input.bindKey(me.input.KEY.SPACE, "jump", true);
    me.input.bindKey(me.input.KEY.UP,    "jump", true);

    // Transition directly to PlayScreen
    me.state.change(me.state.PLAY);
  }
};

onReady(function () {
  game.onload();
});