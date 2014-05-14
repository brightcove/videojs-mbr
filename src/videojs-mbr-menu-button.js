/* MBR Plugin Control Bar Menu
 ============================================================================ */
videojs.MbrMenuButton = videojs.MenuButton.extend({
  init: function(player, options){
    videojs.MenuButton.call(this, player, options);

    player.on('ready', function () {
      if (player.hls) {
        if (player.hls.playlists.state === 'HAVE_NOTHING') {
          player.hls.playlists.on('loadedmetadata', function() {
            console.log('loaded metadata');
            if (player.hls.playlists.master.playlists.length > 1) {
              console.log('MBR SOURCE DETECTED BY PLUGIN');
              for (var i in player.hls.playlists.master.playlists) {
                //console.log(i, player.hls.playlists.master.playlists[i]);
              }
            }
            console.log(player.hls.playlists.master.playlists.length);
          });
        }
      }
    });

    this.addClass('vjs-mbr-control');

    // Not sure why this is here, but it is.
    this.removeClass('undefined');

    this.createEl();

  }
});