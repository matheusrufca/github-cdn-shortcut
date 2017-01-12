$(function() {
		var self = {};

		function init() {
			console.debug('init');

			if(window.location.host != "github.com"){ return; }

			self.rawUrl = _getRawUrl();

			createCdnButton();
		};

		function createCdnButton() {
			var cdnUrl,  $btn, btnTpl = '<a href="<cdnUrl>" class="btn btn-sm js-update-url-with-hash BtnGroup-item" target="_blank">CDN</a>';
			var $btnContainer = $('.file .file-header .file-actions .BtnGroup');

			cdnUrl = _getCdnUrl(self.rawUrl || '');
			$btn = $(btnTpl.replace('<cdnUrl>', cdnUrl));

			$btnContainer.append($btn);
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

				console.debug('raw: '+ rawUrl);
				console.debug('cdn: '+ ['https://', cdnUrl].join(''));


			return ['https://', cdnUrl].join('');
		};

		function _removeHttpOrHttps(url) {
			return (url || '').replace(/^(https?:|)\/\//, '');
		};

		init();
	});
