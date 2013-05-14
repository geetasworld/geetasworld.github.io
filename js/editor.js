(function(hapyak) {
    'use strict';

    var hapyakEditor,
        container = document.getElementById('container'),
        apikey = document.getElementById('apikey'),
        login,
        path,
        videoName = window.location.hash && window.location.hash.substr(1) || 'placeholder',
        videoUrl = 'http://video.chirls.com/geeta/' + videoName + '.mp4';

    //calculate css path
    path = window.location.href.split('/');
    path.pop();

    function setUpEditor(key, url) {
        try {
            if (key) {
                localStorage.hapyakApiKey = key;
            } else if (localStorage.hapyakApiKey) {
                key = localStorage.hapyakApiKey;
            }
        } catch (e) {}

        if (!key) {
            if (!login) {
                login = document.getElementById('login');
                login.addEventListener('click', function () {
                    setUpEditor(apikey.value, url);
                }, false);
            }

            container.className = 'login';
            return;
        }

        container.className = '';

        hapyakEditor = hapyak.editor({
            elementId: 'container',
            environment: 'feature',
            width: 960,
            videoType: 'html5',
            videoUrl: url,
            css: path.join('/') + '/css/player.css',
            group: 'tfi',
            apiKey: key,
            userId: 'kaiiscranky',
            //trackId: 2627,
            onLoadTrack: function (p) {
                console.log('hapyak.editor.onLoadTrack reported to parent page [' + p.videoId + ', ' + p.trackId + ']');
            },
            onLoadCurrentUser: function (p) {
                console.log('hapyak.editor.onLoadCurrentUser reported to parent page [' + p.userId + ', ' + p.username + ']');
            },
            onNewTrack: function (trackId) {
                console.log('hapyak.editor.onNewTrack reported to parent page [' + trackId + ']');
            },
            onSave: function (trackId) {
                console.log('hapyak.editor.onSave reported to parent page [' + trackId + ']');
            },
            onLoad: function () {
                console.log('hapyak.editor.onLoad reported to parent page');
            }
        });
    }

    setUpEditor(null, videoUrl);
})(this.hapyak);