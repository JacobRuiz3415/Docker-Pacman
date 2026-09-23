var game = {
  resources: [
    { name: "tileset", type: "image", src: "data/img/tileset.png" },
    { name: "level1",  type: "tmx",   src: "data/map/level1.json" },
    { name: "player",  type: "image", src: "data/img/player.png" },
    { name: "coin",    type: "image", src: "data/img/coin.png" },
    { name: "enemy",   type: "image", src: "data/img/enemy.png" }
  ],

  onload: function () {
    // Initialize 640x480 viewport scaled automatically
    if (!me.video.init(640, 480, { wrapper: "screen", scale: "auto" })) {
      alert("HTML5 Canvas is not supported by your browser.");
      return;
    }

    // Initialize audio if available
    me.audio.init("mp3,ogg");

    // Preload resources and pass callback
    me.loader.preload(game.resources, this.loaded.bind(this));
  },

  loaded: function () {
    // Register screens
    me.state.set(me.state.PLAY, new game.PlayScreen());

    // Register entities in the melonJS entity pool
    me.pool.register("mainPlayer", game.PlayerEntity);
    me.pool.register("CoinEntity", game.CoinEntity);
    me.pool.register("EnemyEntity", game.EnemyEntity);

    // Keybindings
    me.input.bindKey(me.input.KEY.LEFT,  "left");
    me.input.bindKey(me.input.KEY.RIGHT, "right");
    me.input.bindKey(me.input.KEY.SPACE, "jump", true);
    me.input.bindKey(me.input.KEY.UP,    "jump", true);

    // Transition directly to PlayScreen
    me.state.change(me.state.PLAY);
  }
};