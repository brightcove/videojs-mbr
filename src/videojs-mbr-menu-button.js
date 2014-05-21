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
              var menuOptions = [];
              var index = 0;

              while (index < player.hls.playlists.master.playlists.length) {
                menuOptions.push(player.hls.playlists.master.playlists[index]);
                index++;
              }

              console.log('Menu Options', menuOptions);

              console.log(this.items);

              //this.createMenu();
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