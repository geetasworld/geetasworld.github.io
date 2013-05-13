(function () {
    'use strict';

    var vjs = VideoJS('video');
    vjs.ready(function () {
        hapyak.viewer({
            gzip: true,
            player: vjs,
            userId: 'kaiiscranky',
            //apiKey: '1a88de4bb4d7f969c1282ff5910602f9',
            videoType: "videojs",
            trackId: 2627,
            autoplay: false
        });
    });
})();