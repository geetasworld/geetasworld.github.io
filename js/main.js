(function () {
    'use strict';

    var videoName = window.location.hash && window.location.hash.substr(1) || 'placeholder',
        sourceElem = document.createElement('source'),
        vjs;

    function loadVideo() {
        vjs = VideoJS('video');
        vjs.ready(function () {
            var req = new XMLHttpRequest(),
                onReqLoad,
                chapterObject;

            onReqLoad = function (response) {
                chapterObject = JSON.parse(response.target.responseText);
                hapyak.viewer({
                    gzip: true,
                    player: vjs,
                    environment: 'feature',
                    userId: 'kaiiscranky',
                    apiKey: '1a88de4bb4d7f969c1282ff5910602f9',
                    videoType: 'videojs',
                    videoHeight: 540,
                    videoWidth: 960,
                    trackId: chapterObject[videoName],
                    autoplay: false
                });
            };

            req.onload = onReqLoad;
            req.open('get', 'js/data.json', true);
            req.send();
        });
    }

    sourceElem.src = 'http://video.chirls.com/geeta/' + videoName + '.mp4';
    sourceElem.type = 'video/mp4';
    document.getElementById('video').appendChild(sourceElem);

    loadVideo();
})();