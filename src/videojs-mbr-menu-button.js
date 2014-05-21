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

    var self = this;

    self.createEl();
    self.hide();

    player.on('ready', videojs.bind(this, this.onPlayerReady));
  }
});

videojs.MbrMenuButton.prototype.createEl = function(){
  var el = videojs.Component.prototype.createEl.call(this, 'div', {
    className: 'vjs-mbr-control vjs-menu-button vjs-control',
    innerHTML: '<div class=\"vjs-control-content\"><span class=\"vjs-control-text\">Playback Rate</span></div>'
  });

  this.addClass('vjs-mbr-control');
  this.removeClass('undefined');

  return el;
};


videojs.MbrMenuButton.prototype.updateVisibility = function(){
  console.log('updateVis', this.mbrSupported());
  if (this.mbrSupported()) {
    this.show();
  } else {
    this.hide();
  }
};

videojs.MbrMenuButton.prototype.mbrSupported = function(){
  return true;
};


videojs.MbrMenuButton.prototype.onPlayerReady = function(){
  var self = this;
  var player = self.player();

  if (player.hls) {
    if (player.hls.playlists.state === 'HAVE_NOTHING') {
      player.hls.playlists.on('loadedmetadata', function() {
        if (player.hls.playlists.master.playlists.length > 1) {
          console.log('MBR SOURCE DETECTED BY PLUGIN');
          var menuOptions = [];
          var index = 0;

          while (index < player.hls.playlists.master.playlists.length) {
            menuOptions.push(player.hls.playlists.master.playlists[index]);
            index++;
          }

          console.log('Menu Options', menuOptions);

          self.updateVisibility();
        }
        console.log(player.hls.playlists.master.playlists.length);
      });
    }
  }
};