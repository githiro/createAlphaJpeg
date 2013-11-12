(function($, undefined) {
  $.fn.createAlphaJpeg = function(options) {
    var $this = this,
        $images = $this.find('img').add($this.filter('img')),
        len = $images.length,
        blankGif = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==',
        settings = $.extend({
          afterEachImageDrawed: function(){  },
          afterAllImagesDrawed: function(){  },
          origSrc: "origsrc",
          filterSrc: "filtersrc",
          jpegSrc: "jpegsrc",
          bugBrowserUA: ['msie 9'],
          alphaJpegClass : 'alphaJpeg'
        }, options),
        canUseCachedImages = function() {
          var ua = window.navigator.userAgent.toLowerCase();
          var m = ua.match(/msie ([0-9]*)/);
          if (m != null && $.inArray(m[0], settings.bugBrowserUA) !== -1) {
            return false;
          } else {
            return true;
          }
        }(),
        isCanvasSupported = function() {
          var elem = document.createElement('canvas');
          return !!(elem.getContext && elem.getContext('2d'));
        }(),
        $currentImage = [],
        filterImg = [],
        jpegImage = [],
        $canvasImage = [],
        drawedImagesCnt = 0;
    // functions
    function loadFilter(id) {
      filterImg[id] = new Image();
      filterImg[id].onload = function(){ createJpeg(id) };
      var src = $currentImage[id].attr("data-" + settings.filterSrc);
      src = (canUseCachedImages)? src : src + "?" + new Date().getTime();
      filterImg[id].src = blankGif;
      filterImg[id].src = src;
    }
    function createJpeg(id) {
      jpegImage[id] = new Image();
      jpegImage[id].onload = function(){ createCanvas(id) };
      var src = $currentImage[id].attr("data-" + settings.jpegSrc);
      src = (canUseCachedImages)? src : src + "?" + new Date().getTime();
      jpegImage[id].src = blankGif;//webkit hack from https://groups.google.com/forum/#!topic/jquery-dev/7uarey2lDh8
      jpegImage[id].src = src;
    }
    function createCanvas(id) {
      var w = $currentImage[id].width();
      var h = $currentImage[id].height();
      $canvasImage[id] = $('<canvas class="' + settings.alphaJpegClass + '" width="' + w + '" height="' + h + '"></canvas>');
      $currentImage[id].replaceWith($canvasImage[id]);
      var ctx = $canvasImage[id][0].getContext('2d');
      ctx.drawImage(jpegImage[id], 0, 0, w, h);
      ctx.globalCompositeOperation = 'xor';
      ctx.drawImage(filterImg[id], 0, 0, w, h);
      drawedImagesCnt++;
      settings.afterEachImageDrawed.call($this, $canvasImage);
      if (drawedImagesCnt === len) settings.afterAllImagesDrawed.call($this, $canvasImage);
    }
    for (var i = 0; i < len; i++) {
      $currentImage[i] = $images.eq(i);
      if ($currentImage[i].attr("data-" + settings.origSrc) == null) break;
      if (!isCanvasSupported) {//for non-canvas support browser
        $currentImage[i].attr("src", $currentImage[i].attr("data-" + settings.origSrc));
      } else {
        loadFilter(i);
      }
    }
    return $this;
  };
})(jQuery);