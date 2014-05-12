/* MBR Plugin Control Bar Button
 ============================================================================ */
videojs.MbrButton = videojs.Component.extend({
  init: function(player, options) {
    console.log('New Control Button');

    videojs.Component.call(this, player, options);

    this.createEl('div');
    this.addClass('vjs-mbr-control');
    this.on('click', this.onClick);
  }
});

videojs.MbrButton.prototype.onClick = function() {
  console.log('you clicked it, congrats');
};