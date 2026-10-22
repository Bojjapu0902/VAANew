(function () {
    'use strict';

    var ARROW_SVG = '<svg width="27" height="23" viewBox="0 0 27 23" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="M1.58203 11.6289L25.567 11.6289" stroke="#717171" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />' +
        '<path d="M15.5762 1.63452L25.5699 11.6283L15.5762 21.622" stroke="#717171" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />' +
        '</svg>';

    var esc = ServicesAPI.escapeHtml;

    // ---- Home page: hover list ("service-3") ----------------------------

    function renderHome(services) {
        var list = document.querySelector('.service-3__list');
        var imgWrapper = document.querySelector('.service-3__img-wrapper');
        if (!list) {
            return;
        }

        list.innerHTML = services.map(function (service, i) {
            return '' +
                '<a href="' + esc(ServicesAPI.detailsUrl(service)) + '">' +
                '<div class="service-3__item' + (i === 0 ? ' active' : '') + '" data-service="' + (i + 1) + '">' +
                '<div class="service-3__text-wrapper">' +
                '<div class="service-3__number"><span>' + esc(service.number) + '</span></div>' +
                '<h4 class="service-3__title">' + esc(service.title) + '</h4>' +
                '</div>' +
                '<div class="service-3__link"><span>' + ARROW_SVG + '</span></div>' +
                '</div>' +
                '</a>';
        }).join('');

        if (imgWrapper) {
            imgWrapper.innerHTML = services.map(function (service, i) {
                return '<img src="' + esc(service.image) + '" alt="' + esc(service.title) + '" class="service-3__img' + (i === 0 ? ' active' : '') + '">';
            }).join('');
        }

        // main.js bound its hover handlers to the static markup we just
        // replaced, so wire the same behaviour onto the new items.
        var items = list.querySelectorAll('.service-3__item');
        var images = imgWrapper ? imgWrapper.querySelectorAll('.service-3__img') : [];
        Array.prototype.forEach.call(items, function (item, index) {
            item.addEventListener('mouseenter', function () {
                if (item.classList.contains('active')) {
                    return;
                }
                Array.prototype.forEach.call(items, function (el) { el.classList.remove('active'); });
                Array.prototype.forEach.call(images, function (el) { el.classList.remove('active'); });
                item.classList.add('active');
                if (images[index]) {
                    images[index].classList.add('active');
                }
            });
        });

        ServicesAPI.refreshScrollTrigger();
    }

    // ---- Services page: numbered rows ("services-list") -----------------

    function renderServicesPage(services) {
        var wrapper = document.querySelector('.services-list__wrapper');
        if (!wrapper) {
            return;
        }

        ServicesAPI.killTriggersWithin(wrapper);

        wrapper.innerHTML = services.map(function (service) {
            var href = esc(ServicesAPI.detailsUrl(service));
            return '' +
                '<div class="services-list__item fade-top">' +
                '<span class="services-list__number">' + esc(service.number) + '</span>' +
                '<h3 class="services-list__title"><a href="' + href + '">' + esc(service.title) + '</a></h3>' +
                '<ul class="services-list__points">' +
                service.points.map(function (point) { return '<li>' + esc(point) + '</li>'; }).join('') +
                '</ul>' +
                '<div class="services-list__thumb zoom-view zoom-view__frame" data-zoom-ratio="4/3" data-zoom-scale="1.34" data-zoom-hold="0.9" data-zoom-scrub="0.8" style="aspect-ratio: 4 / 3">' +
                '<a href="' + href + '"><img src="' + esc(service.thumb) + '" alt="' + esc(service.thumbAlt || service.title) + '"></a>' +
                '</div>' +
                '</div>';
        }).join('');

        ServicesAPI.fadeTop(wrapper.querySelectorAll('.fade-top'));
        if (window.ZoomView) {
            window.ZoomView.init(wrapper);
        }
        ServicesAPI.refreshScrollTrigger();
    }

    document.addEventListener('DOMContentLoaded', function () {
        var isHome = document.querySelector('.service-3__list');
        var isServicesPage = document.querySelector('.services-list__wrapper');
        if (!isHome && !isServicesPage) {
            return;
        }

        ServicesAPI.load().then(function (data) {
            renderHome(data.services);
            renderServicesPage(data.services);
        }).catch(function (err) {
            console.error('Could not load services:', err);
        });
    });
})();
