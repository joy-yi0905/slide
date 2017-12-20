import './../css/zepto.slide.less';
import Press from './../js/press';

;(function($) {

  function imgLoad(src, callback) {
    let img = $('<img />');

    img.on('load', () => {
      callback();
    });

    img.attr('src', src);
  }

  function Slide(
    slideEle,
    options,
    defaults = {
      mode: 'dir-left-right',
      dirType: 'horizontal',
      loop: false,
      index: 1,
      autoplay: true,
      interval: 3000,
      animateTime: 500,
      switchTriggerRange: 0.3,
      indicator: true,
      action: false,
      dragAttach: true,
      slideW: 0,
      slideH: 0,
      bgColor: ['rgba(0, 0, 0, 0.5)', 'rgba(153, 0, 0, 0.5)', 'rgba(51, 153, 0, 0.5)'],
      data: [
        {
          html: `
                <style type="text/css">
                  .user-content {box-sizing: border-box;padding: 5px 20px 20px; color: #fff;}
                </style>
                <div class="user-content">
                  <h2>page1</h2>
                  <p>This is page1 content</p>
                </div>`
        },
        {
          html: `<div class="user-content">
                  <h2>page2</h2>
                  <p>This is page22 content</p>
                </div>`
        },
        {
          html: `<div class="user-content">
                  <h2>page3</h2>
                  <p>This is page333 content</p>
                </div>`
        }
      ],
      callback: () => {}
    }) {

    this.slideEle = slideEle;
    this.opts = $.extend({}, defaults, options);

    this.timer = null;
    this.isSwitching = false;
    this.isInit = true;
    this.isAnimate = true;
    this.pageIndex = 0;
    this.indicatorIndex = 0;
    this.imgIndex = -1;
    this.dragDistance = 0;

    this.isHorizontal = this.opts.dirType === 'horizontal';
    this.slideW = this.opts.slideW || slideEle.width();
    this.slideH = this.opts.slideH;
    this.slideWH = 0;

    this.data = this.opts.data;
    this.pageLength = this.opts.data.length;

    this.slidePage = null;
    this.pageItem = null;
    this.indicatorItem = null;
    this.prev = null;
    this.next = null;

    this.switchClass = '';
    this.canScroll = false;

    this.init();
  }

  $.extend(Slide.prototype, {
    init() {

      if (this.opts.index > this.pageLength) {
        throw Error('设置的显示索引不能超过轮播总数');
      }

      if (this.pageLength <= 1) {
        this.opts.autoplay = false;
        this.opts.loop = false;
        this.opts.action = false;
      }

      this.createSlide();
      this.resetSlide();
    },

    createSlide() {
      this.createSlidePage();
      this.opts.indicator && this.createSlideIndicator();
      this.opts.action && this.createSlideAction();
    },

    createSlidePage() {
      let slideH = this.slideH;
      let bgColor = this.opts.bgColor;

      this.slidePage = $('<div class="slide-page" />');

      for (let i = 0; i < this.pageLength; i++) {
        let page = $('<div class="page-item" />');

        for (let n in this.data[i]) {
          if (n === 'img') {
            page.html(`<div class="slide-content"><img src="${this.data[i][n]}" /></div>`).appendTo(this.slidePage);

            if (this.imgIndex === -1) this.imgIndex = i;
          } else if (n === 'html') {
            page.html(`<div class="slide-content">${this.data[i][n]}</div>`).css('background-color', bgColor[i % bgColor.length]).appendTo(this.slidePage);
          }
        }
      }

      this.slidePage.appendTo(this.slideEle);

      if (this.opts.loop) {
        const first = this.slideEle.find('.page-item').eq(0).clone(),
          last = this.slideEle.find('.page-item').eq(-1).clone();

        this.slidePage.append(first).prepend(last);
      }

      this.pageItem = this.slideEle.find('.page-item');
    },

    createSlideIndicator() {
      const slideIndicator = $('<div class="slide-indicator" />');

      for (let i = 0; i < this.pageLength; i++) {
        let indicator = $('<a href="javascript:;" class="indicator-item" />');

        indicator.appendTo(slideIndicator);
      }

      slideIndicator.appendTo(this.slideEle);

      this.indicatorItem = this.slideEle.find('.indicator-item');

      this.switchIndicator();
    },

    createSlideAction() {
      const slideAction = $('<div class="slide-action" />');

      this.prev = $('<a href="javascript:;" class="action-item prev" />');
      this.next = $('<a href="javascript:;" class="action-item next" />');

      this.prev.add(this.next).appendTo(slideAction);

      slideAction.appendTo(this.slideEle);

      this.switchAction();
    },

    setSlideHeigh(callback) {
      this.slideWH = this.isHorizontal ? this.slideW : this.slideH;

      if (this.slideH) {
        this.slideEle.height(this.slideH);

        callback();
      } else {
        if (this.imgIndex !== -1) {  // contain slide image, first image height
          imgLoad(this.data[this.imgIndex].img, () => {
            this.slideH = this.pageItem.eq(this.opts.loop ? this.imgIndex + 1 : this.imgIndex).height();

            callback();
          });
        } else { // get page maxHeight
          const pageHeightArr = [];

          this.pageItem.height('auto');

          $.each(this.pageItem, (index, item) => {
            pageHeightArr.push($(item).height());
          });

          this.slideH = Math.max.apply(Math, pageHeightArr);

          callback();
        }
      }
    },

    resetSlide() {

      this.slideEle.find('.slide-page').on('dragstart dragmove dragend', (event) => {
        event.preventDefault();
      });

      if (this.opts.mode === 'dir-left-right') {
        if (this.opts.dirType === 'vertical') {
          this.slideEle.addClass('slide-dir-vertical');
        }

        new Press(this.slidePage.get(0));

        this.pressStart();
        this.pressMove();
        this.pressEnd();
      } else if (this.opts.mode === 'fade-in-out') {
        const transitionVal = `${this.opts.animateTime}ms opacity linear`;

        this.opts.loop = false;

        this.slideEle.addClass('slide-fade');

        this.pageItem.css({
          '-webkit-transition': transitionVal,
          'transition': transitionVal
        });
      }

      this.opts.index--;

      this.setSlideHeigh(() => {
        if (this.opts.mode === 'dir-left-right' && this.opts.dirType === 'vertical') {
          this.slideWH = this.slideH;
        }

        this.pageItem.height(this.slideH);
        this.slideEle.height(this.slideH);

        this.setIndex();

        this.registerPageCallback();

        this.startTimer(0);

        this.setPageHeight();
      });
    },

    setPageHeight() {
      let that = this;

      this.pageItem.each(function(index, item) {
        let pageContent = $(item).children();

        if (that.opts.dirType === 'vertical' && pageContent.height() > that.slideH) {
          $(item).addClass('prev')
          .css({
            overflowY: 'auto'
          })
          .data('scroll', pageContent.height());
        }
      });
    },

    registerPageCallback() {
      let that = this;

      this.data.map((item, index) => {

        this.pageItem.eq(this.opts.loop ? index + 1 : index)
        .on('click', (e) => {
          item.callback && item.callback();
        })
        .on('touchmove', (e) => { // Prevent default scrolling from vertical direction
          !this.canScroll && e.preventDefault();
        });

      });

      this.pageItem
      .on('scroll', function() {
        let scrollTop = $(this).scrollTop();

        if ($(this).data('scroll')) {
          if (scrollTop === 0) {
            that.canScroll = false;
            that.switchClass = 'prev';
          } else if (scrollTop === $(this).data('scroll') - that.slideH) {
            that.canScroll = false;
            that.switchClass = 'next';
          } else {
            that.canScroll = true;
            $(this).removeClass('prev next');
          }
        }
      });
    },

    pressStart() {

      this.slidePage.on('pressStart', (e) => {
        this.dragDistance = 0;
        this.clearTimer();

        let currentPage = this.pageItem.eq(this.pageIndex);

        if (currentPage.data('scroll') && !this.canScroll) {
          if (this.switchClass === 'prev') {
            currentPage.removeClass('prev next').addClass('prev');
          } else if (this.switchClass === 'next') {
            currentPage.removeClass('prev next').addClass('next');
          }
        }
      });
    },

    pressMove() {

      let moveDistance = 0;

      this.slidePage.on('pressMove', (e) => {

        let currentPage = this.pageItem.eq(this.pageIndex);

        if (currentPage.data('scroll')) {
          if ((currentPage.hasClass('prev') && e.detail.offsetY < 0) || (currentPage.hasClass('next') &&  e.detail.offsetY > 0)) {
            this.canScroll = true;
          }

          if (!currentPage.hasClass('prev') && !currentPage.hasClass('next')) return;
        }

        if (!this.canScroll) {
          this.dragDistance = this.isHorizontal ? e.detail.offsetX : e.detail.offsetY;

          moveDistance = this.slidePage.data('translate') + this.dragDistance;

          this.opts.dragAttach && this.setPageTransform(moveDistance);
        }

      });
    },

    pressEnd() {

      this.slidePage.on('pressEnd', (e) => {

        if (Math.abs(this.dragDistance) >= this.opts.switchTriggerRange * this.slideWH) { // trigger switch
          if (this.dragDistance > 0) { // left -> right
            if (this.opts.loop) {
              this.opts.index--;
            } else {
              if (this.opts.index !== 0) { // ignore first
                this.opts.index--;
              }
            }
          } else { // right -> left
            if (this.opts.loop) {
              this.opts.index++;
            } else {
              if (this.opts.index !== this.pageLength - 1) { // ignore last
                this.opts.index++;
              }
            }
          }
        }

        this.setIndex();

        this.startTimer();
      });
    },

    setPageTransform(moveDistance) {

      const transformDistance = this.isHorizontal ? `translateX(${moveDistance}px)` : `translateY(${moveDistance}px)`;

      this.slidePage.css({
        '-webkit-transform': transformDistance,
        'transform': transformDistance,
      });
    },

    clearTimer() {
      clearInterval(this.timer);
    },

    startTimer(interval = this.opts.animateTime) {
      clearInterval(this.timer);

      setTimeout(() => {
        this.opts.autoplay && this.switchTimer();
      }, interval);
    },

    switchTimer() {

      this.clearTimer();

      this.timer = setInterval(() => {

        let index = this.opts.index;

        if (index === this.pageLength - 1 && !this.opts.loop) {
          index = 0;
        } else {
          index++;
        }

        this.opts.index = index;

        this.setIndex();
      }, this.opts.interval + this.opts.animateTime);
    },

    switchAction() {

      const actionCallback = (index) => {
        this.opts.index = index;
        this.setIndex();
        this.startTimer();
      };

      this.prev.on('click', () => {

        let index = this.opts.index;

        if (this.isSwitching) return;

        if (index === 0 && !this.opts.loop) {
          index = this.pageLength - 1;
        } else {
          index--;
        }

        actionCallback(index);
      });

      this.next.on('click', () => {

        let index = this.opts.index;

        if (this.isSwitching) return;

        if (index === this.pageLength - 1 && !this.opts.loop) {
          index = 0;
        } else {
          index++;
        }

        actionCallback(index);
      });
    },

    switchIndicator() {
      const that = this;

      var indicatorCallback = (index) => {
        this.opts.index = index;
        this.setIndex();
        this.startTimer();
      };

      this.indicatorItem.on('click', function() {
        indicatorCallback(that.indicatorItem.index($(this)));
      });
    },

    setIndex() {
      let index = this.opts.index;

      this.pageIndex = index;
      this.indicatorIndex = index;

      if (this.opts.loop) {
        this.pageIndex += 1;

        if (this.pageIndex === this.pageLength + 1) { // last item
          this.indicatorIndex = 0;
        } else if (this.pageIndex === 0) { // first item
          this.indicatorIndex = this.pageLength - 1;
        }
      }

      if (this.isInit) {
        this.isAnimate = false;
      }

      this.switchPage(this.isAnimate);
    },

    switchPage() {

      let pageIndex = this.pageIndex;
      let indicatorIndex = this.indicatorIndex;

      // console.log(pageIndex, indicatorIndex, this.slideWH);

      const isAnimate = this.isAnimate;

      const moveDistance = -pageIndex * this.slideWH;
      const transformDistance = this.isHorizontal ? `translateX(${moveDistance}px)` : `translateY(${moveDistance}px)`;

      const transitionVal = `${this.opts.animateTime}ms transform`;

      if (this.opts.mode === 'dir-left-right') {
        this.slidePage.css({
          '-webkit-transform': transformDistance,
          'transform': transformDistance,
          '-webkit-transition': isAnimate ? transitionVal : '',
          'transition': isAnimate ? transitionVal : ''
        }).data('translate', moveDistance);
      }

      this.pageItem.removeClass('current').eq(pageIndex).addClass('current');

      this.opts.indicator && this.indicatorItem.removeClass('current').eq(indicatorIndex).addClass('current');

      this.isSwitching = true;

      setTimeout(() => {
        this.switchCallback(pageIndex, indicatorIndex);
      }, isAnimate ? this.opts.animateTime : 0);
    },

    switchCallback() {

      let pageIndex = this.pageIndex;
      let indicatorIndex = this.indicatorIndex;

      this.slidePage.css({
        '-webkit-transition': '',
        'transition': ''
      });

      this.isSwitching = false;
      this.isInit = false;
      this.isAnimate = true;

      if (this.opts.loop) {
        if (pageIndex === 0) { // first item
          this.pageIndex = this.pageLength;
          this.indicatorIndex = this.opts.index = this.pageLength - 1;

          this.isAnimate = false;

          return this.switchPage();
        } else if (pageIndex === this.pageLength + 1) { // last item
          this.pageIndex = 1;
          this.indicatorIndex = this.opts.index = 0;

          this.isAnimate = false;

          return this.switchPage(); // In case of 'this.opts.callback' trigger twice, use the 'return' statement
        }
      }

      this.opts.callback(this.opts.index + 1);
    }
  });

  $.fn.slide = function(options) {
    $(this).each((index, item) => {
      new Slide($(item), options);
    });
  };
})(Zepto);


