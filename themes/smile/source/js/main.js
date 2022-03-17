/*
	Future Imperfect by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$menu = $('#menu'),
		$sidebar = $('#sidebar'),
		$main = $('#main');

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ null,      '480px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Menu.
		$menu
			.appendTo($body)
			.panel({
				delay: 500,
				hideOnClick: true,
				hideOnSwipe: true,
				resetScroll: true,
				resetForms: true,
				side: 'right',
				target: $body,
				visibleClass: 'is-menu-visible'
			});

	// Search (header).
		var $search = $('#search'),
			$search_input = $search.find('input');

		// $body
		// 	.on('click', '[href="#search"]', function(event) {
		//
		// 		event.preventDefault();
		//
		// 		// Not visible?
		// 			if (!$search.hasClass('visible')) {
		//
		// 				// Reset form.
		// 					$search[0].reset();
		//
		// 				// Show.
		// 					$search.addClass('visible');
		//
		// 				// Focus input.
		// 					$search_input.focus();
		//
		// 			}
		//
		// 	});

		$search_input
			.on('keydown', function(event) {

				if (event.keyCode == 27){
					$search_input.blur();
				}

				if (event.keyCode == 13) {
					search('search.json',event.target.value)
					$search_input.blur();
				}

			})
			.on('blur', function() {
				window.setTimeout(function() {
					$search.removeClass('visible');
				}, 100);
			});

	// Intro.
		var $intro = $('#intro');

		// Move to main on <=large, back to sidebar on >large.
			breakpoints.on('<=large', function() {
				$intro.prependTo($main);
			});

			breakpoints.on('>large', function() {
				$intro.prependTo($sidebar);
			});


			function search(path,value) {
				$.ajax({
					url: path,
					dataType: "json",
					success: function (datas) {
						var $resultContent = $('#search-list');
						var str = '<ul class=\"links\">';
						var keywords = value.trim().toLowerCase().split(/[\s\-]+/);
						$resultContent.innerHTML = "";
						if (value.trim().length <= 0) {
							return;
						}
						// perform local searching
						datas.forEach(function (data) {
							var isMatch = true;
							var data_title = data.title.trim().toLowerCase();
							var data_content = data.content.trim().replace(/<[^>]+>/g, "").toLowerCase();
							var data_url = data.url;
							var index_title = -1;
							var index_content = -1;
							var first_occur = -1;
							// only match artiles with not empty titles and contents
							if (data_title != '' && data_content != '') {
								keywords.forEach(function (keyword, i) {
									index_title = data_title.indexOf(keyword);
									index_content = data_content.indexOf(keyword);
									if (index_title < 0 && index_content < 0) {
										isMatch = false;
									} else {
										if (index_content < 0) {
											index_content = 0;
										}
										if (i == 0) {
											first_occur = index_content;
										}
									}
								});
							}
							// show search results
							if (isMatch) {
								str += "<li><a href='" + data_url + "' class='search-result-title'><h3>" + data_title + "</h3>";
								var content = data.content.trim().replace(/<[^>]+>/g, "");
								if (first_occur >= 0) {
									// cut out 100 characters
									var start = first_occur - 20;
									var end = first_occur + 80;
									if (start < 0) {
										start = 0;
									}
									if (start == 0) {
										end = 100;
									}
									if (end > content.length) {
										end = content.length;
									}
									var match_content = content.substr(start, end);
									// highlight all keywords
									keywords.forEach(function (keyword) {
										var regS = new RegExp(keyword, "gi");
										match_content = match_content.replace(regS, "<em class=\"search-keyword\">" + keyword + "</em>");
									});

									str += "<p>" + match_content + "...</p>"
								}
								str += "</a></li>";
							}
						});
						str += "</ul>";

						console.warn($resultContent)
						$resultContent.html(str) ;
					}
				});
			}

	const gitalk = new Gitalk({
		clientID: 'bdf9ffa2fc8dac8f90fd',
		clientSecret: 'd34067e90a41aac20aa4532f87e8c0c94d192892',
		repo: 'smile',
		owner: 'zw-slime',
		admin: ['zw-slime'],
		id: location.pathname,      // Ensure uniqueness and length less than 50
		distractionFreeMode: false  // Facebook-like distraction free mode
	})

	gitalk.render('gitalk-container')
})(jQuery);

