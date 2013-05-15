document.addEventListener('DOMContentLoaded', function(event) {
	var modals = document.querySelectorAll(".modal");

	for (var i = 0, l = modals.length; i < l; i++) {
		$('#' + modals[i].id).on('hide', function() {
			var video = this.querySelector('video');
			video.pause();
			video.currentTime = 0;
		});
	}
}, false);