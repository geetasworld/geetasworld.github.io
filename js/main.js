(function () {
    'use strict';

    var vjs = VideoJS('video');
    vjs.ready(function () {
        hapyak.viewer({
            gzip: true,
            player: vjs,
            environment: 'feature',
            userId: 'kaiiscranky',
            apiKey: 'e60c6227ec3d70d1e8391365987cf57e',
            videoType: "videojs",
            trackId: 2627,
            autoplay: false
        });
    });
})();