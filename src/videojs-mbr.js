/*
 * video-js-mbr
 *
 *
 * Copyright (c) 2014 Brightcove
 * All rights reserved.
 */

(function (window, videojs) {

  videojs.mbr = {
    autoSwitch: true,
    currentIndex: 0,
    bandwidth: -1
  };

  var init = function (options) {
    var player = this,
    autoSwitch = (options && options.autoSwitch !== undefined) ? options.autoSwitch : videojs.mbr.autoSwitch,
    bandwidthOverride = (options && options.bandwidthOverride !== undefined) ? options.bandwidthOverride : videojs.mbr.bandwidth,
    currentIndex = (options && options.currentIndex !== undefined) ? options.currentIndex : videojs.mbr.currentIndex,

    originalSelectPlaylistFunction,
    originalBandwidthFunction,

    onBandwidthOverride = function(value) {
      if(value) {
        // Don't do anything here, we are using the override value on getter.
      } else {
        //console.log('bandwidth overridden');
        return bandwidthOverride;
      }
    },

    onManualModeSelectPlaylistOverride = function() {
      console.log('selectPlaylist overridden due to manual mode');
      var playlists = player.hls.master.playlists.slice();
      return playlists[currentIndex];
    };

    player.mbr.autoSwitch = function (value) {
      if (value !== undefined) {
        //console.log('setting autoswitch:', value);

        autoSwitch = value;

        if(autoSwitch) {
          player.hls.selectPlaylist = originalSelectPlaylistFunction;
        } else {
          player.hls.selectPlaylist = onManualModeSelectPlaylistOverride;
        }

      } else {
        return autoSwitch;
      }
    };

    player.mbr.bandwidthOverride = function (bandwidth) {
      if (bandwidth) {
        //console.log('setting bandwidth override:', bandwidth);
        bandwidthOverride = bandwidth;
        if (player.hls && player.hls.sourceBuffer) {
          if (bandwidth === -1) {
            player.hls.bandwidth = originalBandwidthFunction;
          } else {
            player.hls.bandwidth = onBandwidthOverride;
          }
        }
      } else {
        return bandwidthOverride;
      }
    };

    player.mbr.currentIndex = function (index) {
      if (index !== undefined) {
        console.log('setting current index:', index);
        if (currentIndex !== index) {
          currentIndex = index;

          console.log('needs switch');
          player.hls.media = player.hls.selectPlaylist();
          player.currentTime(player.currentTime());
        }
      } else {
        return currentIndex;
      }
    };

    /*
     Event Handlers
     */

    player.on('loadedmanifest', function () {
      if (player.hls.media === undefined) {
        if (player.hls.master.playlists &&
            player.hls.master.playlists instanceof Array &&
            player.hls.master.playlists.length > 1) {

          console.log('MBR SOURCE DETECTED BY PLUGIN');

          originalBandwidthFunction = player.hls.bandwidth;
          originalSelectPlaylistFunction = player.hls.selectPlaylist;

          player.mbr.autoSwitch(autoSwitch);
          player.mbr.currentIndex(currentIndex);
          player.mbr.bandwidthOverride(bandwidthOverride);

        }
      }
    });

  };

  videojs.plugin('mbr', function () {
    var initialize = function () {
      return function () {
        this.mbr = initialize();
        init.apply(this, arguments);
      };
    };
    initialize().apply(this, arguments);
  });

})(window, window.videojs);