window.addEventListener('load', function () {
	startButton.addEventListener('click', function () {
		const protocol = window.location.protocol;
		const host = window.location.host;

		window.location.replace(`${protocol}//${host}/game.html`);
	});
});
