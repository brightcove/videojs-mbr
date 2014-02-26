/*
 * video-js-mbr
 *
 *
 * Copyright (c) 2014 Brightcove
 * All rights reserved.
 */

(function(window, videojs) {

	videojs.mbr = {
		autoSwitch: true,
		currentIndex: 0,
		bitrateLimit: -1,
		bandwidthOverride: -1
	}

	var init = function(options) {

		var player = this,
				autoSwitch = (options && options.autoSwitch) ? options.autoSwitch : videojs.mbr.autoSwitch,
				bandwidthOverride = (options && options.bandwidthOverride) ? options.bandwidthOverride : videojs.mbr.bandwidthOverride,
				bitrateLimit = (options && options.bitrateLimit) ? options.bitrateLimit : videojs.mbr.bitrateLimit,
				currentIndex = (options && options.currentIndex) ? options.currentIndex : videojs.mbr.currentIndex,

		/*
		Private Methods
		 */

		onBandwidthOverride = function() {
			player.hls.bandwidth = bandwidthOverride;
		};

		/*
			Public Methods
		*/

		player.mbr.autoSwitch = function(value) {
			if (value) {
				autoSwitch = value;
			} else {
				return autoSwitch;
			}
		}

		player.mbr.bitrateLimit = function(bitrate) {
			if(bitrate) {
				bitrateLimit = bitrate;
			} else {
				return bitrateLimit;
			}
		}

		player.mbr.bandwidthOverride = function(bandwidth) {
			if(bandwidth) {
				bandwidthOverride = bandwidth;
				if (player.hls && player.hls.bandwidth && player.hls.sourceBuffer) {
					if(bandwidth === -1) {
						player.hls.sourceBuffer.removeEventListener('update', onBandwidthOverride);
					} else {
						player.hls.sourceBuffer.addEventListener('update', onBandwidthOverride);
					}
				}
			}

			return bandwidthOverride;
		}

		player.mbr.currentIndex = function(index) {
			if(index) {
				if(currentIndex !== index) {
					currentIndex = index;
					if(autoSwitch === false) {
						player.trigger('mbr_rendition_change_request');
					}
				}
			}
			return currentIndex;
		}

		/*
			Event Handlers
		 */

		player.on('loadedmanifest', function(event) {
			if(player.hls.media === undefined) {
				if(player.hls.master.playlists &&
						player.hls.master.playlists instanceof Array &&
						player.hls.master.playlists.length > 1) {
					player.trigger('mbr_source_detected');
				}
			}
			//console.log(player.hls.master.playlists, player.hls.media);
		});

		player.on('mbr_source_detected', function() {
			console.log('MBR SOURCE DETECTED BY PLUGIN');
		});

		player.on('mbr_rendition_change_request', function() {
			console.log('user has request a manual switch of', currentIndex, player.currentTime());
		});


	}

	videojs.plugin('mbr', function() {
		var initialize = function () {
			return function() {
				this.mbr = initialize();
				init.apply(this, arguments);
			};
		};
		initialize().apply(this, arguments);
	});

})(window, window.videojs);