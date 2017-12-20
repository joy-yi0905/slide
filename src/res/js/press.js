var isSupportTouch = !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch);

var eventStart, eventMove, eventEnd,
  eventCancel = 'touchcancel';

  eventStart = isSupportTouch ? 'touchstart' : 'mousedown';
  eventMove = isSupportTouch ? 'touchmove' : 'mousemove';
  eventEnd = isSupportTouch ? 'touchend' : 'mouseup';

function Press(element) {
  this.element = element;

  this.doing = false;

  this.startX = 0;
  this.startY = 0;
  this.offsetX = 0;
  this.offsetY = 0;
  this.endX = 0;
  this.endY = 0;

  this.init();

  return this.element;
}

Press.prototype = {
  init: function() {
    this.element.addEventListener(isSupportTouch ? 'touchstart' : 'mousedown', this.handleStart.bind(this));
    document.addEventListener(isSupportTouch ? 'touchmove' : 'mousemove', this.handleMove.bind(this));
    document.addEventListener(isSupportTouch ? 'touchend' : 'mouseup', this.handleEnd.bind(this));
  },

  handleStart: function(e) {
    this.doing = true;

    this.startX = isSupportTouch ? e.targetTouches[0].clientX : e.clientX;
    this.startY = isSupportTouch ? e.targetTouches[0].clientY : e.clientY;

    this.trigger(
      this.element,
      'pressStart',
      {
        startX: this.startX,
        startY: this.startY,
        eventType: eventStart
      }
    );
  },

  handleMove: function(e) {

    if (!this.doing) return;

    this.offsetX = (isSupportTouch ? e.targetTouches[0].clientX : e.clientX) - this.startX;
    this.offsetY = (isSupportTouch ? e.targetTouches[0].clientY : e.clientY) - this.startY;

    this.trigger(
      this.element,
      'pressMove',
      {
        offsetX: this.offsetX,
        offsetY: this.offsetY,
        eventType: eventMove
      }
    );
  },

  handleEnd: function(e) {

    if (!this.doing) return;

    this.doing = false;

    this.endX = isSupportTouch ? e.changedTouches[0].clientX : e.clientX;
    this.endY = isSupportTouch ? e.changedTouches[0].clientY : e.clientY;

    this.trigger(
      this.element,
      'pressEnd',
      {
        endX: this.endX,
        endY: this.endY,
        eventType: eventEnd
      }
    );
  },

  trigger: function(element, type, msg) {
    var evt;

    try {
      evt = new CustomEvent(type, {detail: msg, bubbles: true, cancelable: true});
    } catch (e) { // 旧写法
      evt = document.createEvent('CustomEvent');
      evt.initCustomEvent(this.type, true, true, msg);
    }

    element.dispatchEvent(evt);
  }
};

export default Press;