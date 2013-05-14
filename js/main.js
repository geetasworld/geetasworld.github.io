(function () {
    'use strict';

    var videoName = window.location.hash && window.location.hash.substr(1) || 'placeholder',
        sourceElem = document.createElement('source'),
        vjs;

    function loadVideo(tweets) {
        vjs = VideoJS('video');
        vjs.ready(function () {
            var req = new XMLHttpRequest(),
                onReqLoad,
                chapterObject;

            onReqLoad = function (response) {
                var variables = {},
                    i, l;

                for (i = 0, l = Math.min(9, tweets.length); i < l; i++) {
                    variables['tweet' + (i + 1)] = tweets[i].cleanedText;
                }

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
                    autoplay: false,
                    variables: variables
                });
            };

            req.onload = onReqLoad;
            req.open('get', 'js/data.json', true);
            req.send();
        });
    }

    function profileTweet(tweet) {
        var obj = {
            entities: 0,
            reply: /^@/.test(tweet.text) ? 1 : 0,
            rt: /\bRT\:? @/.test(tweet.text) ? 1 : 0,
            spam: /@womendrivers/.test(tweet.text) ? 1 : 0,
            id: tweet.id,
            lengthScore: 0
        };

        if (tweet.entities) {
            obj.entities = tweet.entities.urls.length * 3 + tweet.entities.user_mentions.length * 2 + tweet.entities.hashtags.length;
        }

        tweet.cleanedText = tweet.text.replace(/(\s*@[a-zA-Z0-9_]+)+$/, '');
        tweet.cleanedText = tweet.cleanedText.replace(/^(@[a-zA-Z0-9_]+\s*)+/, '');
        tweet.cleanedText = tweet.cleanedText.replace(/\n{2,}/, '\n');

        obj.lengthScore = Math.round(Math.abs(tweet.cleanedText.length - 80) / 5);

        return obj;
    }

    function tweetSort(a, b) {
        a = a.sortProfile;
        b = b.sortProfile;

        if (a.spam !== b.spam) {
            return a.spam - b.spam;
        }

        if (a.reply !== b.reply) {
            return a.reply - b.reply;
        }

        if (a.rt !== b.rt) {
            return a.rt - b.rt;
        }

        if (a.entities !== b.entities) {
            return a.entities - b.entities;
        }

        if (a.lengthScore !== b.lengthScore) {
            return a.lengthScore - b.lengthScore;
        }

        return a.id - b.id;
    }

    function loadTweets() {
        var script = document.createElement('script');
        script.src = 'http://search.twitter.com/search.json?q=%23womendrivers&callback=receiveTweets&count=100&include_entities=true';
        document.head.appendChild(script);
    }

    window.receiveTweets = function(data) {
        var i,
            tweets = data.results;
        for (i = 0; i < tweets.length; i++) {
            tweets[i].sortProfile = profileTweet(tweets[i]);
        }

        tweets.sort(tweetSort);

        loadVideo(tweets);
    };

    sourceElem.src = 'http://video.chirls.com/geeta/' + videoName + '.mp4';
    sourceElem.type = 'video/mp4';
    document.getElementById('video').appendChild(sourceElem);

    loadTweets();
})();