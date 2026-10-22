(function () {
    'use strict';

    var esc = ServicesAPI.escapeHtml;
    var SIDEBAR_ARROW = '<svg width="7" height="14" viewBox="0 0 7 14" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        '<path opacity="0.6" d="M0 0L7 7L0 14V0Z" fill="#222222" /></svg>';

    function setText(el, text) {
        if (el) {
            el.textContent = text;
        }
    }

    // Fill the static slots in place (so their scroll animations survive);
    // drop slots the data has no entry for.
    function fillSlots(slots, items, fill) {
        Array.prototype.forEach.call(slots, function (slot, i) {
            if (items[i]) {
                fill(slot, items[i]);
            } else {
                slot.remove();
            }
        });
    }

    function setMeta(selector, value) {
        var el = document.querySelector(selector);
        if (el) {
            el.setAttribute('content', value);
        }
    }

    function swapParallaxBackground(el, src) {
        var $ = window.jQuery;
        el.setAttribute('data-background', src);
        if ($ && $.fn.jarallax) {
            try {
                $(el).jarallax('destroy');
            } catch (e) { /* not initialised yet */ }
        }
        el.style.backgroundImage = 'url(' + src + ')';
        if ($ && $.fn.jarallax) {
            $(el).jarallax({ speed: 0.2 });
        }
    }

    function renderMeta(service) {
        var title = service.title + ' | Service Details - Vasantha Ads & Arts';
        var description = service.detail.featuresIntro;
        document.title = title;
        setMeta('meta[name="description"]', description);
        setMeta('meta[property="og:title"]', title);
        setMeta('meta[property="og:description"]', description);
        setMeta('meta[name="twitter:title"]', title);
        setMeta('meta[name="twitter:description"]', description);
    }

    function renderHero(service) {
        var detail = service.detail;
        var titles = document.querySelectorAll('.services-details-breadcrumb__title');
        if (titles[0]) {
            titles[0].innerHTML = '<span>' + esc(detail.heroTop.highlight) + '</span> <br>' + esc(detail.heroTop.line2);
        }
        if (titles[1]) {
            titles[1].innerHTML = '<span>' + esc(detail.heroBottom.highlight) + '</span> ' +
                esc(detail.heroBottom.rest) + ' <br>' + esc(detail.heroBottom.line2);
        }
        setText(document.querySelector('.services-details-breadcrumb__btn .text-one'), service.title);
        setText(document.querySelector('.services-details-breadcrumb__btn .text-two'), service.title);
        var btn = document.querySelector('.services-details-breadcrumb__btn a');
        if (btn) {
            btn.setAttribute('href', ServicesAPI.detailsUrl(service));
        }
    }

    function renderSidebar(services, current) {
        var list = document.querySelector('.services-details__sidebar__list');
        if (!list) {
            return;
        }
        list.innerHTML = services.map(function (service) {
            var active = service.id === current.id;
            return '<li' + (active ? ' class="active"' : '') + '>' + SIDEBAR_ARROW +
                '<a href="' + esc(ServicesAPI.detailsUrl(service)) + '">' + esc(service.title) + '</a></li>';
        }).join('');
        // The whole row is the click target, not just the link text.
        Array.prototype.forEach.call(list.querySelectorAll('li'), function (li) {
            li.addEventListener('click', function (e) {
                if (e.target.tagName !== 'A') {
                    li.querySelector('a').click();
                }
            });
        });
    }

    function renderBody(service) {
        var detail = service.detail;

        var hero = document.querySelector('.services-details__bg__thumb');
        if (hero) {
            swapParallaxBackground(hero, detail.heroImage);
        }

        var intros = document.querySelectorAll('.services-details__dec');
        setText(intros[0], detail.featuresIntro);
        setText(intros[1], detail.problemsIntro);
        setText(intros[2], detail.faqIntro);

        fillSlots(document.querySelectorAll('.services-details__features__item'), detail.features, function (slot, feature) {
            setText(slot.querySelector('.services-details__features__title'), feature.title);
            setText(slot.querySelector('p'), feature.text);
        });

        fillSlots(document.querySelectorAll('.services-details__problems-solve__wrap'), detail.problems, function (slot, group) {
            setText(slot.querySelector('.services-details__problems-solve__title'), group.title);
            var ul = slot.querySelector('.services-details__problems-solve__list ul');
            if (ul) {
                ul.innerHTML = group.items.map(function (item) {
                    return '<li>' + esc(item) + '</li>';
                }).join('');
            }
        });

        var faqImg = document.querySelector('.services-details__faq__thumb img');
        if (faqImg) {
            faqImg.setAttribute('src', detail.faqImage);
            faqImg.setAttribute('alt', service.title);
        }

        fillSlots(document.querySelectorAll('.services-details__faq__wrap .accordion-item'), detail.faqs, function (slot, faq) {
            setText(slot.querySelector('.accordion-button'), faq.q);
            setText(slot.querySelector('.accordion-body p'), faq.a);
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        if (!document.querySelector('.services-details__sidebar__list')) {
            return;
        }
        var id = ServicesAPI.getParam('id');
        ServicesAPI.load().then(function (data) {
            var service = (id && ServicesAPI.getById(data.services, id)) || data.services[0];
            renderMeta(service);
            renderHero(service);
            renderSidebar(data.services, service);
            renderBody(service);
            ServicesAPI.refreshScrollTrigger();
        }).catch(function (err) {
            console.error('Could not load service details:', err);
        });
    });
})();
