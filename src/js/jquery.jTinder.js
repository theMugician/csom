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
			handlerDisabled: false
		};

	var container = null;
	var panes = null;
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
			//current_pane = panes.length - 1;
			current_pane = 0;

			$(element).bind('touchstart mousedown', this.handler);
			$(element).bind('touchmove mousemove', this.handler);
			$(element).bind('touchend mouseup', this.handler);
		},

		showPane: function (index) {
			panes.eq(current_pane).hide();
			current_pane = index;
		},

		showMessage: function (elm) {
			message.show();
			var cur = panes.eq(current_pane);
			var type = cur.data("type");
			var desc = cur.data("desc");

		},

		closeMessage: function () {

		},

    renderList: function() {
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
            item += "<li data-type=\"" + elm.type + "\" data-desc=\"" + elm.desc + "\" class=\"pane" + index + status + "\">";
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
			panes.eq(current_pane).animate({"transform": "translate(-" + (pane_width) + "px," + (pane_width*-1.5) + "px) rotate(-60deg)"}, $that.settings.animationSpeed, function () {
				if($that.settings.onDislike) {
					$that.settings.onDislike(panes.eq(current_pane));
				}
				$that.next();
			});
		},

		like: function() {
			panes.eq(current_pane).animate({"transform": "translate(" + (pane_width) + "px," + (pane_width*-1.5) + "px) rotate(60deg)"}, $that.settings.animationSpeed, function () {
				if($that.settings.onLike) {
					$that.settings.onLike(panes.eq(current_pane));
				}
				$that.next();
			});
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
									if($that.settings.onLike) {
										$that.settings.onLike(panes.eq(current_pane));
									}
									$that.next();
								});
							} else {
								panes.eq(current_pane).animate({"transform": "translate(-" + (pane_width) + "px," + (posY + pane_width) + "px) rotate(-60deg)"}, $that.settings.animationSpeed, function () {
									if($that.settings.onDislike) {
										$that.settings.onDislike(panes.eq(current_pane));
									}
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
