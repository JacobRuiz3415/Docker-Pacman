game.PlayScreen = me.ScreenObject.extend({
  onResetEvent: function () {
    // Load map exported from Tiled
    me.levelDirector.loadLevel("level1");
  },

  onDestroyEvent: function () {}
});