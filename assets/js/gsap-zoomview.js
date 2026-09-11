/*!
 * GSAP ZoomView v1.0.0
 * ---------------------------------------------------------------------------
 * A soft, scroll-scrubbed zoom for ANY image — driven entirely by a class.
 *
 *   · Image enters the viewport  →  scale eases OUT to its natural size (1)
 *   · Image rests while centred  →  held at natural size (configurable plateau)
 *   · Image leaves the viewport  →  scale eases back IN (zoomed)
 *
 * Requires: GSAP 3.x + ScrollTrigger
 *
 * Markup — two supported patterns:
 *
 *   1) Class on the image (auto-wrapped in an overflow mask):
 *      <img class="zoom-view" src="hero.jpg" alt="">
 *
 *   2) Class on your own wrapper (wrapper becomes the mask):
 *      <div class="zoom-view" data-zoom-ratio="16/9">
 *        <img src="hero.jpg" alt="">
 *      </div>
 *
 * Per-element overrides (all optional):
 *   data-zoom-scale="1.18"          zoomed scale when out of view
 *   data-zoom-rest="1"              resting scale when in view
 *   data-zoom-hold="0.55"           plateau length, relative to one ramp (0 = none)
 *   data-zoom-ease-in="power2.out"  ease used while entering
 *   data-zoom-ease-out="power2.in"  ease used while leaving
 *   data-zoom-start="top bottom"    ScrollTrigger start
 *   data-zoom-end="bottom top"      ScrollTrigger end
 *   data-zoom-origin="50% 50%"      transform-origin
 *   data-zoom-scrub="true"          true | number (seconds of smoothing, e.g. 0.6)
 *   data-zoom-ratio="16/9"          aspect-ratio for the mask | "fill" | omit for natural
 *   data-zoom-wrap="false"          opt out of auto-wrapping (triggers off the
 *                                   existing parent, or the element itself)
 *   data-zoom-markers="true"        ScrollTrigger debug markers
 *
 * API:
 *   ZoomView.init(root?, opts?)     initialise every .zoom-view (idempotent)
 *   ZoomView.create(el, opts?)      initialise a single element
 *   ZoomView.get(el)                → instance | null
 *   ZoomView.observe(root?)         auto-init elements added later (MutationObserver)
 *   ZoomView.refresh()              ScrollTrigger.refresh()
 *   ZoomView.destroy(el?)           tear down one element, or all
 *   ZoomView.config({...})          change global defaults before init
 *
 * Accessibility: honours prefers-reduced-motion (no transform is applied at all).
 * Author: Srinivas · License: MIT
 * ---------------------------------------------------------------------------
 */
(function (root, factory) {
  'use strict';
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else {
    root.ZoomView = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
 
  /* ---------------------------------------------------------------- config */
 
  var VERSION = '1.0.0';
 
  var DEFAULTS = {
    selector: '.zoom-view',
    scale: 1.18,
    rest: 1,
    hold: 0.55,
    easeIn: 'power2.out',
    easeOut: 'power2.in',
    start: 'top bottom',
    end: 'bottom top',
    origin: '50% 50%',
    scrub: true,
    ratio: null,
    wrap: true,
    markers: false,
    respectReducedMotion: true,
    invalidateOnRefresh: true
  };
 
  var FRAME_CLASS = 'zoom-view__frame';
  var AUTO_CLASS = 'zoom-view__frame--auto';
  var FILL_CLASS = 'zoom-view__frame--fill';
  var MEDIA_TAGS = { IMG: 1, VIDEO: 1, PICTURE: 1, CANVAS: 1, SVG: 1 };
  var STYLE_ID = 'zoom-view-styles';
 
  var instances = [];
  var observer = null;
  var stylesInjected = false;
 
  /* ----------------------------------------------------------- environment */
 
  function hasDOM() {
    return typeof window !== 'undefined' && typeof document !== 'undefined';
  }
 
  function getGsap() {
    return (typeof window !== 'undefined' && window.gsap) || null;
  }
 
  function getScrollTrigger() {
    var g = getGsap();
    if (!g) return null;
    return (typeof window !== 'undefined' && window.ScrollTrigger) ||
      (g.core && g.core.globals && g.core.globals().ScrollTrigger) || null;
  }
 
  function ensureRegistered() {
    var g = getGsap();
    var st = getScrollTrigger();
    if (!g || !st) return null;
    if (!g.core.globals().ScrollTrigger) g.registerPlugin(st);
    return { gsap: g, ScrollTrigger: st };
  }
 
  /* ---------------------------------------------------------------- styles */
 
  function injectStyles() {
    if (stylesInjected || !hasDOM()) return;
    if (document.getElementById(STYLE_ID)) { stylesInjected = true; return; }
 
    var css = [
      '.' + FRAME_CLASS + '{position:relative;display:block;overflow:hidden;isolation:isolate;}',
      '.' + FRAME_CLASS + '>img,.' + FRAME_CLASS + '>video,.' + FRAME_CLASS + '>picture,.' + FRAME_CLASS + '>canvas,',
      '.' + FRAME_CLASS + '>picture>img{',
      'display:block;width:100%;height:100%;max-width:none;object-fit:cover;backface-visibility:hidden;}',
      '.' + AUTO_CLASS + '>img,.' + AUTO_CLASS + '>video,.' + AUTO_CLASS + '>picture,.' + AUTO_CLASS + '>canvas,',
      '.' + AUTO_CLASS + '>picture>img{height:auto;}',
      '.' + FILL_CLASS + '{height:100%;}',
      '@media (prefers-reduced-motion: reduce){.' + FRAME_CLASS + '>*{transform:none !important;}}'
    ].join('');
 
    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.appendChild(document.createTextNode(css));
    (document.head || document.documentElement).appendChild(style);
    stylesInjected = true;
  }
 
  /* -------------------------------------------------------------- utilities */
 
  function toArray(v) {
    return Array.prototype.slice.call(v);
  }
 
  function resolveTargets(target, rootEl, selector) {
    var scope = rootEl || document;
    if (!target) return toArray(scope.querySelectorAll(selector));
    if (typeof target === 'string') return toArray(scope.querySelectorAll(target));
    if (target.nodeType === 1) return [target];
    if (target.length != null) return toArray(target);
    return [];
  }
 
  function num(value, fallback) {
    var n = parseFloat(value);
    return isNaN(n) ? fallback : n;
  }
 
  function bool(value, fallback) {
    if (value == null || value === '') return fallback;
    value = String(value).toLowerCase();
    if (value === 'true' || value === '1' || value === 'yes') return true;
    if (value === 'false' || value === '0' || value === 'no') return false;
    return fallback;
  }
 
  function parseScrub(value, fallback) {
    if (value == null || value === '') return fallback;
    var asBool = String(value).toLowerCase();
    if (asBool === 'true') return true;
    if (asBool === 'false') return false;
    var n = parseFloat(value);
    return isNaN(n) ? fallback : n;
  }
 
  function readOptions(el, base) {
    var d = el.dataset || {};
    return {
      scale: num(d.zoomScale, base.scale),
      rest: num(d.zoomRest, base.rest),
      hold: Math.max(0, num(d.zoomHold, base.hold)),
      easeIn: d.zoomEaseIn || base.easeIn,
      easeOut: d.zoomEaseOut || base.easeOut,
      start: d.zoomStart || base.start,
      end: d.zoomEnd || base.end,
      origin: d.zoomOrigin || base.origin,
      scrub: parseScrub(d.zoomScrub, base.scrub),
      ratio: d.zoomRatio != null && d.zoomRatio !== '' ? d.zoomRatio : base.ratio,
      wrap: bool(d.zoomWrap, base.wrap),
      markers: bool(d.zoomMarkers, base.markers),
      respectReducedMotion: base.respectReducedMotion,
      invalidateOnRefresh: base.invalidateOnRefresh
    };
  }
 
  function isMedia(el) {
    // tagName is lowercase for inline SVG in HTML documents.
    return !!MEDIA_TAGS[String(el.tagName).toUpperCase()];
  }
 
  function isLayoutParent(node) {
    return !!node && node.nodeType === 1 &&
      node !== document.body && node !== document.documentElement;
  }
 
  /* ------------------------------------------------------- frame + target */
 
  /**
   * Works out which element is the overflow mask (frame) and which element
   * actually gets scaled (target). Wraps the node when needed.
   */
  function buildStructure(el, cfg) {
    var frame, target, wrapped = false;
 
    if (isMedia(el)) {
      target = el;
      var parent = el.parentNode;
 
      if (parent && parent.classList && parent.classList.contains(FRAME_CLASS)) {
        frame = parent;                       // already wrapped (re-init safe)
      } else if (cfg.wrap && parent) {
        frame = document.createElement('div');
        frame.className = FRAME_CLASS;
 
        // Carry the image's corner radius onto the mask so clipping stays correct.
        var computed = window.getComputedStyle(el);
        var radius = computed.borderRadius;
        if (radius && radius !== '0px') frame.style.borderRadius = radius;
 
        parent.insertBefore(frame, el);
        frame.appendChild(el);
        wrapped = true;
      } else {
        // wrap:false — trigger off an existing container, never <body>,
        // otherwise the ramp would span the whole document.
        frame = isLayoutParent(parent) ? parent : el;
      }
    } else {
      // Class sits on the wrapper: the wrapper is the mask.
      frame = el;
      frame.classList.add(FRAME_CLASS);
      target = el.querySelector('img,video,picture,canvas') || el.firstElementChild || el;
    }
 
    if (frame !== target) {
      if (cfg.ratio === 'fill') {
        frame.classList.add(FILL_CLASS);
      } else if (cfg.ratio) {
        frame.style.aspectRatio = String(cfg.ratio).replace('/', ' / ');
      } else {
        frame.classList.add(AUTO_CLASS);
      }
    }
 
    return { frame: frame, target: target, wrapped: wrapped };
  }
 
  /* ------------------------------------------------------------- instance */
 
  function Instance(el, cfg) {
    var lib = ensureRegistered();
    if (!lib) {
      console.warn('[ZoomView] GSAP and/or ScrollTrigger not found — skipping "' +
        (el.className || el.tagName) + '".');
      return null;
    }
 
    injectStyles();
 
    var gsap = lib.gsap;
    var structure = buildStructure(el, cfg);
 
    this.el = el;
    this.config = cfg;
    this.frame = structure.frame;
    this.target = structure.target;
    this.wrapped = structure.wrapped;
    this.timeline = null;
    this.scrollTrigger = null;
 
    var self = this;
    var query = cfg.respectReducedMotion
      ? '(prefers-reduced-motion: no-preference)'
      : 'all';
 
    // gsap.matchMedia reverts every inline style it created when the media
    // query stops matching — so reduced-motion users end up with clean markup.
    this.mm = gsap.matchMedia();
    this.mm.add(query, function () {
      var ramp = 1;
      var hold = cfg.hold;
 
      gsap.set(self.target, {
        scale: cfg.scale,
        transformOrigin: cfg.origin,
        willChange: 'transform',
        force3D: true
      });
 
      var tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: self.frame,
          start: cfg.start,
          end: cfg.end,
          scrub: cfg.scrub,
          markers: cfg.markers,
          invalidateOnRefresh: cfg.invalidateOnRefresh
        }
      });
 
      tl.to(self.target, { scale: cfg.rest, ease: cfg.easeIn, duration: ramp });
      if (hold > 0) tl.to({}, { duration: hold });
      tl.to(self.target, { scale: cfg.scale, ease: cfg.easeOut, duration: ramp });
 
      self.timeline = tl;
      self.scrollTrigger = tl.scrollTrigger;
 
      return function cleanup() {
        tl.scrollTrigger && tl.scrollTrigger.kill();
        tl.kill();
        self.timeline = null;
        self.scrollTrigger = null;
      };
    });
 
    // Images that decode after init would measure at the wrong height.
    if (this.target.tagName === 'IMG' && !this.target.complete) {
      this._onLoad = function () { ZoomView.refresh(); };
      this.target.addEventListener('load', this._onLoad, { once: true });
      this.target.addEventListener('error', this._onLoad, { once: true });
    }
 
    el.__zoomView = this;
    instances.push(this);
  }
 
  Instance.prototype.refresh = function () {
    if (this.scrollTrigger) this.scrollTrigger.refresh();
    return this;
  };
 
  Instance.prototype.destroy = function (unwrap) {
    if (this._onLoad && this.target) {
      this.target.removeEventListener('load', this._onLoad);
      this.target.removeEventListener('error', this._onLoad);
      this._onLoad = null;
    }
 
    if (this.mm) this.mm.kill(true);
    this.mm = null;
 
    if (this.frame !== this.target) {
      this.frame.classList.remove(AUTO_CLASS, FILL_CLASS);
      this.frame.style.aspectRatio = '';
      if (unwrap !== false && this.wrapped && this.frame.parentNode) {
        this.frame.parentNode.insertBefore(this.target, this.frame);
        this.frame.parentNode.removeChild(this.frame);
      } else if (!this.wrapped) {
        this.frame.classList.remove(FRAME_CLASS);
      }
    }
 
    if (this.target) this.target.style.willChange = '';
 
    delete this.el.__zoomView;
    var i = instances.indexOf(this);
    if (i > -1) instances.splice(i, 1);
    return null;
  };
 
  /* ------------------------------------------------------------ public API */
 
  var ZoomView = {
    version: VERSION,
    defaults: DEFAULTS,
 
    config: function (opts) {
      for (var key in opts) {
        if (Object.prototype.hasOwnProperty.call(opts, key)) DEFAULTS[key] = opts[key];
      }
      return ZoomView;
    },
 
    create: function (el, opts) {
      if (!el || el.nodeType !== 1) return null;
      if (el.__zoomView) return el.__zoomView;
 
      var base = {};
      for (var k in DEFAULTS) {
        if (Object.prototype.hasOwnProperty.call(DEFAULTS, k)) base[k] = DEFAULTS[k];
      }
      for (var o in (opts || {})) {
        if (Object.prototype.hasOwnProperty.call(opts, o)) base[o] = opts[o];
      }
 
      var instance = new Instance(el, readOptions(el, base));
      return instance && instance.el ? instance : null;
    },
 
    init: function (rootOrOpts, maybeOpts) {
      if (!hasDOM()) return [];
 
      var rootEl = null, opts = maybeOpts || {};
      if (rootOrOpts && rootOrOpts.nodeType === 1) rootEl = rootOrOpts;
      else if (typeof rootOrOpts === 'string') rootEl = document.querySelector(rootOrOpts);
      else if (rootOrOpts) opts = rootOrOpts;
 
      var selector = opts.selector || DEFAULTS.selector;
      var created = [];
 
      resolveTargets(null, rootEl, selector).forEach(function (el) {
        var instance = ZoomView.create(el, opts);
        if (instance) created.push(instance);
      });
 
      return created;
    },
 
    get: function (el) {
      return (el && el.__zoomView) || null;
    },
 
    all: function () {
      return instances.slice();
    },
 
    refresh: function () {
      var st = getScrollTrigger();
      if (st) st.refresh();
      return ZoomView;
    },
 
    destroy: function (el, unwrap) {
      if (el) {
        var instance = ZoomView.get(el);
        if (instance) instance.destroy(unwrap);
      } else {
        instances.slice().forEach(function (i) { i.destroy(unwrap); });
      }
      return ZoomView;
    },
 
    /** Auto-initialise .zoom-view elements injected after page load. */
    observe: function (rootEl) {
      if (!hasDOM() || typeof MutationObserver === 'undefined') return ZoomView;
      if (observer) observer.disconnect();
 
      var scope = rootEl || document.body;
      var selector = DEFAULTS.selector;
 
      observer = new MutationObserver(function (mutations) {
        var found = false;
        mutations.forEach(function (m) {
          toArray(m.addedNodes).forEach(function (node) {
            if (node.nodeType !== 1) return;
            if (node.matches && node.matches(selector)) { ZoomView.create(node); found = true; }
            if (node.querySelectorAll) {
              toArray(node.querySelectorAll(selector)).forEach(function (child) {
                ZoomView.create(child); found = true;
              });
            }
          });
        });
        if (found) ZoomView.refresh();
      });
 
      observer.observe(scope, { childList: true, subtree: true });
      return ZoomView;
    },
 
    unobserve: function () {
      if (observer) observer.disconnect();
      observer = null;
      return ZoomView;
    }
  };
 
  /* ----------------------------------------------------------- auto-start */
 
  if (hasDOM()) {
    var boot = function () {
      if (document.documentElement.hasAttribute('data-zoom-auto') &&
        document.documentElement.getAttribute('data-zoom-auto') === 'false') return;
      ZoomView.init();
    };
 
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', boot, { once: true });
    } else {
      boot();
    }
 
    // Late-decoding fonts/images shift layout — one refresh after full load.
    window.addEventListener('load', function () { ZoomView.refresh(); }, { once: true });
  }
 
  return ZoomView;
}));