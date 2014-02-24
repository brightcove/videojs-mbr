/*
 * video-js-mbr
 *
 *
 * Copyright (c) 2014 Brightcove
 * All rights reserved.
 */

(function (window, videojs) {

  videojs.mbr = {
    manualMode: false,
    bitrateLimit: -1,
    bandwidthOverride: -1
  }

  var init = function (options) {
    console.log('init', options);
  }

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