(function () {
    'use strict';

    var twitterData,
        chapters = [
            2654, 2655, 2656, 2657, 2658
        ],
        background = document.getElementById('background');

    function getTwitterData () {
        var s = document.createElement('script');
        s.src = '//search.twitter.com/search.json?q=%23womendrivers&count=10&rpp=10&callback=twitterCallback';
        s.setAttribute('data-twitter-data', true);
        document.head.appendChild(s);
    };

    var vjs,
        //i,
        //l,
        tweets,
        modals = document.querySelectorAll('.modal'),
        loaded = [],
        playableVideo = 0,
        variables = {},
        container = document.querySelector('.main'),
        img = document.getElementById('path'),
        buttons = document.querySelectorAll('.chapter');

    function resize() {
        var height = img.offsetHeight;
        container.style.height = height + 'px';
    }

    function setupMenuButtons () {
        var aboutButton = document.querySelector('#about-button');
        var shareButton = document.querySelector('#share-button');
        var savedVideosButton = document.querySelector('#saved-videos-button');
        var joinButton = document.querySelector('#join-button');

        var joinOverlay = document.querySelector('#join-overlay');
        var joinTextArea = joinOverlay.querySelector('textarea');
        var joinTwitterButton = document.querySelector('#join-twitter-button');
        var joinTwitterFeedList = document.querySelector('#join-twitter-feed ul');

        joinOverlay.classList.add('fadeable');

        window.twitterCallback = function (data) {
            var scripts = document.querySelectorAll('script[data-twitter-data]');
            Array.prototype.forEach.call(scripts, function (script) {
                script.parentNode.removeChild(script);
            });
            setTimeout(getTwitterData, 5000);
            twitterData = data;

            joinTwitterFeedList.innerHTML = '';
            twitterData.results.forEach(function (result) {
                var twitterTextDiv = document.createElement('li');
                twitterTextDiv.innerHTML = result.text;
                joinTwitterFeedList.appendChild(twitterTextDiv);
            });

            resize();
        }

        getTwitterData();

        function onJoinButtonClick (e) {
            joinOverlay.classList.toggle('hidden');
        }

        joinTwitterButton.addEventListener('click', function (e) {
            window.open('https://twitter.com/share?text=' + escape(joinTextArea.value) +
                '&url=' + escape('http://geetasworld.github.io/'), '_blank');
        }, false);

        joinButton.addEventListener('click', onJoinButtonClick, false);

        resize();
    }

    function fadeIn() {
        document.querySelector('.main').className = 'main';
    }

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
        var button,
            videoDiv,
            video,
            closeButton;

        function hideVideo() {
            video.pause();
            background.play();
            videoDiv.className = '';
            container.style.display = '';
            resize();
        }

        if (index + 1 < playableVideo || index > playableVideo || index >= buttons.length) {
            return;
        }

        button = buttons[index];
        console.log('hi', button, index, buttons.length);
        button.className = 'chapter active';

        loadVideo(chapters[index], 'video' + (index + 1));

        videoDiv = document.getElementById('video' + (index + 1));
        video = videoDiv.querySelector('video');
        video.addEventListener('ended', function () {
            hideVideo();
            video.currentTime = 0;
        }, false);

        button.addEventListener('click', function () {
            background.pause();
            video.play();
            videoDiv.className = 'active';
            container.style.display = 'none';

            //playableVideo = Math.max(index + 1, playableVideo);
            //$(this.getAttribute('data-target')).on('hide', function onHide() {
            //    makeVideoPlayable(playableVideo);
            //});
        }, false);

        closeButton = videoDiv.querySelector('.close');
        closeButton.addEventListener('click', hideVideo, false);
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

        //Abhi asked to make all videos playable right away
        playableVideo = 1;
        makeVideoPlayable(1); playableVideo++;
        makeVideoPlayable(2); playableVideo++;
        makeVideoPlayable(3); playableVideo++;
        makeVideoPlayable(4); playableVideo++;
    };

    /*
    for (i = 0, l = modals.length; i < l; i++) {
        $('#' + modals[i].id).on('hide', function() {
            var video = this.querySelector('video');
            video.pause();
        });
    }
    */

    window.addEventListener('resize', resize, false);
    resize();
    loadTweets();

    if (background.duration) {
        setTimeout(fadeIn, 1000);
    } else {
        setTimeout(fadeIn, 4000);
        document.getElementById('background').addEventListener('loadedmetadata', function () {
            console.log('loadedmetadata');
            setTimeout(fadeIn, 1000);
        }, false);
    }

    setupMenuButtons();
})();
