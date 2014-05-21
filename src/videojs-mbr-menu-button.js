/**
 * The component for controller rendition selection in a multibitrate stream
 *
 * @param {vjs.Player|Object} player
 * @param {Object=} options
 * @constructor
 */
videojs.MbrMenuButton = videojs.MenuButton.extend({
  /** @constructor */
  init: function(player, options){
    videojs.MenuButton.call(this, player, options);

    this.createEl();
    this.updateVisibility();

    player.on('ready', videojs.bind(this, this.onPlayerReady));
  }
});

videojs.MbrMenuButton.prototype.createEl = function(){
  var el = videojs.Component.prototype.createEl.call(this, 'div', {
    className: 'vjs-mbr-control vjs-menu-button vjs-control',
    innerHTML: '<div class=\"vjs-control-content\"><span class=\"vjs-control-text\">Playback Rate</span></div>'
  });

  // NOTE: There is a bug in Component.createEl that overrides the settings
  // listed in the call method above when used outside vjs core.
  this.addClass('vjs-mbr-control');
  this.removeClass('undefined');

  return el;
};

/**
 * Hide mbr controls when they're no rendition options to select
 */
videojs.MbrMenuButton.prototype.updateVisibility = function(){
  if (this.mbrSupported()){
    this.show();
  } else {
    this.hide();
  }
};

/**
 * Determine if multiple renditions were loaded
 * TODO: This is currently setup ONLY for our HLS plugin.
 */
videojs.MbrMenuButton.prototype.mbrSupported = function(){
  return this.player().hls
    && this.player().hls.playlists
    && this.player().hls.playlists.master
    && this.player().hls.playlists.master.playlists
    && this.player().hls.playlists.master.playlists.length > 1
  ;
};

videojs.MbrMenuButton.prototype.onPlayerReady = function(){
  var self = this;
  var player = self.player();

  if (player.hls) {
    if (player.hls.playlists.state === 'HAVE_NOTHING') {
      player.hls.playlists.on('loadedmetadata', function() {
        if (player.hls.playlists.master.playlists.length > 1) {
          var menuOptions = [];
          var index = 0;

          while (index < player.hls.playlists.master.playlists.length) {
            menuOptions.push(player.hls.playlists.master.playlists[index]);
            index++;
          }

          player.options()['renditions'] = menuOptions;

          self.updateVisibility();

          // Clear the HLS invalid src error in vjs
          if(player.error().code === 4) player.error(null);
        }
        console.log(player.hls.playlists.master.playlists.length);
      });
    }
  }
};