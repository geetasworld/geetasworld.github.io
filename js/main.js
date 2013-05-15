(function () {
    'use strict';

    var vjs,
        i,
        l,
        tweets,
        modals = document.querySelectorAll('.modal'),
        loaded = [],
        buttons = document.querySelectorAll('.chapter'),
        playableVideo = 0,
        variables = {};

    function loadVideo(trackid, elementid) {
        // Only load videos once
        if (loaded.indexOf(trackid) > -1) {
            return;
        }
        loaded.push(trackid);
        vjs = VideoJS(document.getElementById(elementid).querySelector('video'));
        vjs.ready(function () {
            hapyak.viewer({
                gzip: true,
                player: vjs,
                environment: 'feature',
                userId: 'kaiiscranky',
                apiKey: '1a88de4bb4d7f969c1282ff5910602f9',
                videoType: 'videojs',
                trackId: trackid,
                autoplay: false,
                variables: variables
            });
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

    function makeVideoPlayable(index) {
        var button;

        if (index + 1 < playableVideo || index > playableVideo) {
            return;
        }

        button = buttons[index];
        button.className = 'chapter active';

        loadVideo(button.getAttribute('data-trackid'), button.getAttribute('data-target').split('#')[1]);

        button.addEventListener('click', function() {
            $(this.getAttribute('data-target')).on('show', function onShow() {
                var video = this.querySelector('video'),
                    self = this;

                $(this).off('show', onShow);

                video.currentTime = 0;

                playableVideo = Math.max(index + 1, playableVideo);

                video.addEventListener('ended', function endedEvent() {
                    $(self).modal('hide');
                    this.removeEventListener('ended', endedEvent, false);
                }, false);

                video.play();

                makeVideoPlayable(playableVideo);
            })
        }, false);
    }

    window.receiveTweets = function(data) {
        var i,
            l,
            data_tweets = data.results;

        for (i = 0; i < data_tweets.length; i++) {
            data_tweets[i].sortProfile = profileTweet(data_tweets[i]);
        }

        data_tweets.sort(tweetSort);

        tweets = data_tweets;

        for (i = 0, l = Math.min(9, tweets.length); i < l; i++) {
            variables['tweet' + (i + 1)] = tweets[i].cleanedText;
        }

        makeVideoPlayable(0);
    };

    for (i = 0, l = modals.length; i < l; i++) {
        $('#' + modals[i].id).on('hide', function() {
            var video = this.querySelector('video');
            video.pause();
        });
    }

    loadTweets();
})();