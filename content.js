$(function () {
	var self = {};

	function init() {
		console.debug('init');

		if (window.location.host != "github.com") { return; }

		self.rawUrl = _getRawUrl();

		injectTemplate(); //inject template on document and create buttons
	};


	function injectTemplate() {
		$.get(chrome.extension.getURL('templates/tpl_cdn_button.html'), function (data) {
			$(data).appendTo('body');


			createCdnButton();
		});
	};

	function createCdnButton() {
		var cdnUrl, scriptTagUrl, btnTpl, rawCdnButton;
		var $cdnButton, $btnContainer = $('.file .file-header .file-actions .BtnGroup');


		btnTpl = $('#tpl_cdn_button').html();
		cdnUrl = _getCdnUrl(self.rawUrl || '');
		scriptTagUrl = _getCdnScript(cdnUrl || '');


		rawCdnButton = S(btnTpl)
			.replaceAll('{{cdnUrl}}', cdnUrl)
			.replaceAll('{{scriptTag}}', scriptTagUrl)
			.s;

		$cdnButton = $(rawCdnButton);

		$btnContainer.after($cdnButton);
	};

	

	function _getRawUrl() {
		return $('a#raw-url').attr('href');
	};


	function _getCdnUrl(rawUrl) {
		var cdnUrl,
		splittedCdnUrl,
		cdnUrlTpl = 'cdn.rawgit.com/<user>/<repo>/<tag>/<file>';

		splittedCdnUrl = _removeHttpOrHttps(rawUrl || '').split('/');

		cdnUrl = cdnUrlTpl
			.replace('<user>', splittedCdnUrl[1])
			.replace('<repo>', splittedCdnUrl[2])
			.replace('<tag>', splittedCdnUrl[4])
			.replace('<file>', splittedCdnUrl[5]);

		console.debug('raw: ' + rawUrl);
		console.debug('cdn: ' + ['https://', cdnUrl].join(''));


		return ['https://', cdnUrl].join('');
	};


	function _getCdnScript(cdnUrl) {
		var output, tplScriptTag = '<script src="{{cdnUrl}}"></script>';

		output = S(tplScriptTag)
			.replaceAll('{{cdnUrl}}', cdnUrl)
			.replaceAll('"', "'")
			.s;

		return output;
	};


	function _removeHttpOrHttps(url) {
		return (url || '').replace(/^(https?:|)\/\//, '');
	};


	function _onCopyClick(event) {
		var text, $clipboardArea = $('.clipboard-area');

		text = $(event.target).data('clipboard');
		text = S(text).replaceAll("'", '"').s;

		$clipboardArea.val(text);

		try {
			$clipboardArea[0].select();
			document.execCommand('copy');
		} catch (err) {
			console.error('Oops, unable to copy');
		} finally {
			$clipboardArea.val('');
		}
	};


	init();


	$(document).on('click', 'a.copy-btn', _onCopyClick);
});