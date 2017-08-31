/*
 * jTinder v.1.0.0
 * https://github.com/do-web/jTinder
 * Requires jQuery 1.7+, jQuery transform2d
 *
 * Copyright (c) 2014, Dominik Weber
 * Licensed under GPL Version 2.
 * https://github.com/do-web/jTinder/blob/master/LICENSE
 */
;(function ($, window, document, undefined) {
	var pluginName = "jTinder",
		defaults = {
			onDislike: null,
			onLike: null,
			animationRevertSpeed: 200,
			animationSpeed: 400,
			threshold: 1,
			likeSelector: '.like',
			dislikeSelector: '.dislike',
			handlerDisabled: true
		};

	var container = null;
	var panes = null;
	var modal = null;
	var home = null;	
	var message_container = null;
	var message_header = null;
	var message_type = null;
	var message_desc = null;
	var message_button = null;
	var final_container = null;
	var final_header = null;
	var play_button = null;
	var correct_count = 0;
	var $that = null;
	var xStart = 0;
	var yStart = 0;
	var touchStart = false;
	var posX = 0, posY = 0, lastPosX = 0, lastPosY = 0, pane_width = 0, pane_count = 0, current_pane = 0;
	var list = [
	  {
	    "type": "Mansion",
	    "desc": "This beautiful home in Point Grey is going for well over 2.4 Million. Start saving up for that down payment.",
	    "img": "1.jpg"
	  },
	  {
	    "type": "Shack",
	    "desc": "This is definitely a shack",
	    "img": "2.jpg"
	  },
	  {
	    "type": "Shack",
	    "desc": "This a Shack. There is now way Jim Pattison lives here",
	    "img": "3.jpg"
	  },
	  {
	    "type": "Mansion",
	    "desc": "This glamourous shed sold for $1,190,000",
	    "img": "6.jpg"
	  },
	  {
	    "type": "Shack",
	    "desc": "Just another shack. No mansion here",
	    "img": "4.jpg"
	  },
	  {
	    "type": "Mansion",
	    "desc": "Another beautiful point grey home that closed for over 9 million dollars. Most likely it will be a tear down.",
	    "img": "5.jpg"
	  },
	  {
	    "type": "Mansion",
	    "desc": "This 3 bedroom home is going for only $4,188,000. What a steal of a deal.",
	    "img": "7.jpg"
	  },
	  {
	    "type": "Shack",
	    "desc": "This shack has everything you need!",
	    "img": "8.jpg"
	  },
	  {
	    "type": "Mansion",
	    "desc": "Beautiful deal for over 1.3 million. BBQ included",
	    "img": "9.jpg"
	  },
	  {
	    "type": "Mansion",
	    "desc": "Get three bedrooms and a gate for 1.9 million",
	    "img": "10.jpg"
	  },
	  {
	    "type": "Shack",
	    "desc": "Perfect for those outdoor getaways",
	    "img": "11.jpg"
	  },
	  {
	    "type": "Shack",
	    "desc": "This is definitely no rain forest shack",
	    "img": "12.jpg"
	  },
	  {
	    "type": "Mansion",
	    "desc": "1.39 million! This home might look a little rusty on the outside but with 5 bedrooms you can't beat the price",
	    "img": "13.jpg"
	  },
	  {
	    "type": "Mansion",
	    "desc": "This a steal for a lush green yard",
	    "img": "14.jpg"
	  },
	  {
	    "type": "Shack",
	    "desc": "This one's a little too obvious for a mansion",
	    "img": "15.jpg"
	  },
	  {
	    "type": "Mansion",
	    "desc": "Another east van special, too shacklike",
	    "img": "16.jpg"
	  },
	  {
	    "type": "Mansion",
	    "desc": "The keys await your new mansion",
	    "img": "17.jpg"
	  },
	  {
	    "type": "Shack",
	    "desc": "Great for your next weekend getaway in the woods",
	    "img": "18.jpg"
	  },
	  {
	    "type": "Mansion",
	    "desc": "This fine hastings east estate comes with a massive garden",
	    "img": "19.jpg"
	  },
	  {
	    "type": "Shack",
	    "desc": "Sometimes it can be confusing differentiating a shack from a mansion",
	    "img": "20.jpg"
	  },
	  {
	    "type": "Mansion",
	    "desc": "ENDLESS POTENTIAL to build your dream home or update the current one",
	    "img": "21.jpg"
	  }
	]

	function Plugin(element, options) {
		this.element = element;
		this.settings = $.extend({}, defaults, options);
		this._defaults = defaults;
		this._name = pluginName;
		this.init(element);
	}

	Plugin.prototype = {

		init: function (element) {
			container = $(">ul", element);
      $that = this;
      $that.renderList();
      panes = $(">ul>li", element);
			pane_width = container.width();
			pane_count = panes.length;
			home = $(".home");
			//current_pane = panes.length - 1;
			current_pane = 0;
			modal = $(".modal");
			message_container = $(".message");
			message_header = $(".message h1");
			message_type = $(".message h2");
			message_desc = $(".message p");
			message_button = $(".message .next-btn.btn");
			play_button = $(".home .play.btn");

			final_container = $(".finish");
			final_header = $(".finish .count");
			reset_button = $(".finish .play.btn");

			$(element).bind('touchstart mousedown', this.handler);
			$(element).bind('touchmove mousemove', this.handler);
			$(element).bind('touchend mouseup', this.handler);
			message_button.bind('touchstart click', this.closeModal);
			play_button.bind('touchstart click', this.play);
			reset_button.bind('touchstart click', this.reset);
		},

		showPane: function (index) {
			panes.eq(current_pane).hide();
			current_pane = index;
		},

		showMessage: function (item, chosen) {
			$that.settings.handlerDisabled = true;
			//var cur = panes.eq(current_pane);
			var type = item.data("type");
			var desc = item.data("desc");
			var img = "url(img/" + item.data("img");
			var header = ( type === chosen ? "Correct!" : "Wrong!" );
			var header_class = ( type === chosen ? "correct" : "error" );
			if(type === chosen) { correct_count++};
			modal.addClass("display");
			message_container.css("background-image", img);
			message_header.removeClass();
			message_header.html(header).addClass(header_class);
			message_type.removeClass();
			message_type.html(type).addClass(type);
			message_desc.html(desc);
		},

		closeModal: function () {
			$that.settings.handlerDisabled = false;
			modal.removeClass("display");
			if(current_pane === panes.length) {
				$that.finish();
			}
		},

		play: function () {
			$that.settings.handlerDisabled = false;
			modal.removeClass("display");
			home.removeClass("display");
			message_container.addClass("display");
		},

		finish: function () {
			var outcome = "You got " + correct_count + " out of " + panes.length + " correct!";
			message_container.removeClass("display");
			final_header.html(outcome);
			final_container.addClass("display");
			modal.addClass('display');
		},

		reset: function () {
			$that.settings.handlerDisabled = false;
			$that.renderList();
			correct_count = 0;
			current_pane = 0;
      panes = $(">ul>li", "div#tinderslide");
			pane_count = panes.length;
			final_container.removeClass("display");	
			modal.removeClass("display");
			message_container.addClass("display");
		},

    renderList: function() {
    	container.html("");
      var items = "";
      list.forEach(function(elm, i){
        var index = i + 1;
        var status = "";
        switch(index) {
			    case 1:
		        status = " active"
		        break;
			    case 2:
		        status = " next"
		        break;
		      case 3:
		        status = " last"
		        break;
			    default:
			        status = ""
				}
				
        var item="";
            item += "<li data-type=\"" + elm.type + "\" data-desc=\"" + elm.desc + "\" data-img=\"" + elm.img + "\" class=\"pane" + index + status + "\">";
            item += "  <div class=\"item\">";
            item += "    <div style='background-image: url(img\/" + elm.img + ")' class=\"img\"><\/div>";
            item += "    <div class=\"like\"><\/div>";
            item += "    <div class=\"dislike\"><\/div>";
            item += "  <\/div>  ";
            item += "<\/li>";

        items += item;   
      })
      container.html(items);
    },

		control: function () {
	    $('.active').removeClass('active');
	    $('.next').addClass('active').removeClass('next');
	    $('.last').addClass('next').removeClass('last').next().show().addClass('last');
	  },

		next: function () {
			//return this.showPane(current_pane - 1);
			$that.control();
			return this.showPane(current_pane + 1);
		},

		dislike: function() {
			if(!$that.settings.handlerDisabled) {
				panes.eq(current_pane).animate({"transform": "translate(-" + (pane_width) + "px," + (pane_width*-1.5) + "px) rotate(-60deg)"}, $that.settings.animationSpeed, function () {
					$that.showMessage(panes.eq(current_pane), "Shack");
					/*
					if($that.settings.onDislike) {
						$that.settings.onDislike(panes.eq(current_pane));
					}
					*/
					$that.next();
				});
			}
		},

		like: function() {
			if(!$that.settings.handlerDisabled) {
				panes.eq(current_pane).animate({"transform": "translate(" + (pane_width) + "px," + (pane_width*-1.5) + "px) rotate(60deg)"}, $that.settings.animationSpeed, function () {
					$that.showMessage(panes.eq(current_pane), "Mansion");
					/*
					if($that.settings.onLike) {
						$that.settings.onLike(panes.eq(current_pane));
					}
					*/
					$that.next();
				});
			}	
		},

		handler: function (ev) {
			ev.preventDefault();
			if(!$that.settings.handlerDisabled) {
				switch (ev.type) {
					case 'touchstart':
						if(touchStart === false) {
							touchStart = true;
							xStart = ev.originalEvent.touches[0].pageX;
							yStart = ev.originalEvent.touches[0].pageY;
						}
					case 'mousedown':
						if(touchStart === false) {
							touchStart = true;
							xStart = ev.pageX;
							yStart = ev.pageY;
						}
					case 'mousemove':
					case 'touchmove':
						if(touchStart === true) {
							var pageX = typeof ev.pageX == 'undefined' ? ev.originalEvent.touches[0].pageX : ev.pageX;
							var pageY = typeof ev.pageY == 'undefined' ? ev.originalEvent.touches[0].pageY : ev.pageY;
							var deltaX = parseInt(pageX) - parseInt(xStart);
							var deltaY = parseInt(pageY) - parseInt(yStart);
							var percent = ((100 / pane_width) * deltaX) / pane_count;
							posX = deltaX + lastPosX;
							posY = deltaY + lastPosY;

							panes.eq(current_pane).css("transform", "translate(" + posX + "px," + posY + "px) rotate(" + (percent / 2) + "deg)");

							var opa = (Math.abs(deltaX) / $that.settings.threshold) / 100 + 0.2;
							if(opa > 1.0) {
								opa = 1.0;
							}
							if (posX >= 0) {
								panes.eq(current_pane).find($that.settings.likeSelector).css('opacity', opa);
								panes.eq(current_pane).find($that.settings.dislikeSelector).css('opacity', 0);
							} else if (posX < 0) {

								panes.eq(current_pane).find($that.settings.dislikeSelector).css('opacity', opa);
								panes.eq(current_pane).find($that.settings.likeSelector).css('opacity', 0);
							}
						}
						break;
					case 'mouseup':
					case 'touchend':
						touchStart = false;
						var pageX = (typeof ev.pageX == 'undefined') ? ev.originalEvent.changedTouches[0].pageX : ev.pageX;
						var pageY = (typeof ev.pageY == 'undefined') ? ev.originalEvent.changedTouches[0].pageY : ev.pageY;
						var deltaX = parseInt(pageX) - parseInt(xStart);
						var deltaY = parseInt(pageY) - parseInt(yStart);

						posX = deltaX + lastPosX;
						posY = deltaY + lastPosY;
						var opa = Math.abs((Math.abs(deltaX) / $that.settings.threshold) / 100 + 0.2);

						if (opa >= 1) {
							if (posX > 0) {
								panes.eq(current_pane).animate({"transform": "translate(" + (pane_width) + "px," + (posY + pane_width) + "px) rotate(60deg)"}, $that.settings.animationSpeed, function () {
									$that.showMessage(panes.eq(current_pane), "Mansion");
									/*if($that.settings.onLike) {
										$that.settings.onLike(panes.eq(current_pane), "Mansion");
									}
									*/
									$that.next();
								});
							} else {
								panes.eq(current_pane).animate({"transform": "translate(-" + (pane_width) + "px," + (posY + pane_width) + "px) rotate(-60deg)"}, $that.settings.animationSpeed, function () {
									$that.showMessage(panes.eq(current_pane), "Shack");
									/*
									if($that.settings.onDislike) {
										$that.settings.onDislike(panes.eq(current_pane), "Shack");
									}*/
									$that.next();
								});
							}
						} else {
							lastPosX = 0;
							lastPosY = 0;
							panes.eq(current_pane).animate({"transform": "translate(0px,0px) rotate(0deg)"}, $that.settings.animationRevertSpeed);
							panes.eq(current_pane).find($that.settings.likeSelector).animate({"opacity": 0}, $that.settings.animationRevertSpeed);
							panes.eq(current_pane).find($that.settings.dislikeSelector).animate({"opacity": 0}, $that.settings.animationRevertSpeed);
						}
						break;
				}
			}
		}
	};

	$.fn[ pluginName ] = function (options) {
		this.each(function () {
			if (!$.data(this, "plugin_" + pluginName)) {
				$.data(this, "plugin_" + pluginName, new Plugin(this, options));
			}
			else if ($.isFunction(Plugin.prototype[options])) {
				$.data(this, 'plugin_' + pluginName)[options]();
		    }
		});

		return this;
	};

})(jQuery, window, document);
