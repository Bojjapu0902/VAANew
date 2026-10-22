(function (window) {
    'use strict';

    var DATA_URL = 'data/service-details.json';
    var DETAILS_PAGE = 'services-details.html';
    var cachedPromise = null;

    function loadServices() {
        if (!cachedPromise) {
            cachedPromise = fetch(DATA_URL).then(function (res) {
                if (!res.ok) {
                    throw new Error('Failed to load service-details.json: ' + res.status);
                }
                return res.json();
            });
        }
        return cachedPromise;
    }

    function getById(services, id) {
        for (var i = 0; i < services.length; i++) {
            if (services[i].id === id) {
                return services[i];
            }
        }
        return null;
    }

    function getParam(name) {
        return new URLSearchParams(window.location.search).get(name);
    }

    function detailsUrl(service) {
        return DETAILS_PAGE + '?id=' + encodeURIComponent(service.id);
    }

    function escapeHtml(str) {
        return String(str).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    // Same reveal main.js gives .fade-top elements at load; main.js has
    // already run by the time the JSON arrives, so injected items need it too.
    function fadeTop(elements) {
        if (!window.gsap || !window.ScrollTrigger) {
            return;
        }
        Array.prototype.forEach.call(elements, function (element, index) {
            var delay = index * 0.1;
            window.gsap.set(element, { opacity: 0, y: 70 });
            window.ScrollTrigger.create({
                trigger: element,
                start: 'top 95%',
                end: 'bottom bottom',
                scrub: false,
                toggleActions: 'play none none reverse',
                onEnter: function () {
                    window.gsap.to(element, { opacity: 1, y: 0, duration: 0.6, delay: delay });
                },
                onLeaveBack: function () {
                    window.gsap.to(element, { opacity: 0, y: 70, duration: 0.5 });
                }
            });
        });
    }

    // Kill the ScrollTriggers main.js attached to elements we are replacing.
    function killTriggersWithin(container) {
        if (!window.ScrollTrigger) {
            return;
        }
        window.ScrollTrigger.getAll().forEach(function (st) {
            if (st.trigger && container.contains(st.trigger)) {
                st.kill();
            }
        });
    }

    function refreshScrollTrigger() {
        if (window.ScrollTrigger) {
            window.ScrollTrigger.refresh();
        }
    }

    window.ServicesAPI = {
        load: loadServices,
        getById: getById,
        getParam: getParam,
        detailsUrl: detailsUrl,
        escapeHtml: escapeHtml,
        fadeTop: fadeTop,
        killTriggersWithin: killTriggersWithin,
        refreshScrollTrigger: refreshScrollTrigger
    };
})(window);
