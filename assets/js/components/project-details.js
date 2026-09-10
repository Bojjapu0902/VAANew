(function () {
    'use strict';

    function setText(selector, text) {
        var el = document.querySelector(selector);
        if (el) {
            el.textContent = text;
        }
    }

    function setImg(selector, src, alt) {
        var el = document.querySelector(selector);
        if (el) {
            el.setAttribute('src', src);
            if (alt) {
                el.setAttribute('alt', alt);
            }
        }
    }

    function infoLine(work) {
        var info = work.info || {};
        return Object.keys(info).map(function (key) {
            return key + ': ' + info[key];
        }).join('  |  ');
    }

    function render(data, work) {
        var categoryLabel = WorksAPI.categoryLabel(data, work.category);
        var gallery = work.gallery || [];

        document.title = work.title + ' - VAA Works';

        setText('.project-details-breadcrumb__sub-title', categoryLabel + ' — Portfolio Details');
        setText('.project-details-breadcrumb__title', work.title);

        var descEl = document.querySelector('.project-details-breadcrumb__content > p');
        if (descEl) {
            descEl.textContent = work.role || '';
        }

        setImg('.project-details-breadcrumb__thumb img', work.hero || work.image, work.title);

        var challengeItemSelector = '.project-details__item:not(.project-details__item-one)';
        var challengeHeading = document.querySelector(challengeItemSelector + ' .project-details__bradding');
        if (challengeHeading) {
            challengeHeading.textContent = 'The Challenge';
        }
        var challengeParas = document.querySelectorAll(challengeItemSelector + ' > .project-details__dec');
        if (challengeParas[0]) {
            challengeParas[0].textContent = work.challenge || '';
        }
        if (challengeParas[1]) {
            challengeParas[1].textContent = infoLine(work);
        }
        var challengeThumbs = document.querySelectorAll(challengeItemSelector + ' .project-details__wrap .thumb-item img');
        if (challengeThumbs[0]) {
            challengeThumbs[0].setAttribute('src', gallery[0] || work.hero || work.image);
            challengeThumbs[0].setAttribute('alt', work.title);
        }
        if (challengeThumbs[1]) {
            challengeThumbs[1].setAttribute('src', gallery[1] || work.hero || work.image);
            challengeThumbs[1].setAttribute('alt', work.title);
        }

        var resultHeading = document.querySelector('.project-details__item-one .project-details__bradding');
        if (resultHeading) {
            resultHeading.textContent = 'The Result';
        }
        var resultParas = document.querySelectorAll('.project-details__item-one > .project-details__dec');
        if (resultParas[0]) {
            resultParas[0].textContent = work.result || '';
        }
        if (resultParas[1]) {
            resultParas[1].textContent = 'Role: ' + (work.role || '');
        }
        var resultThumbs = document.querySelectorAll('.project-details__item-one .project-details__wrap-one .thumb-item img');
        if (resultThumbs[0]) {
            resultThumbs[0].setAttribute('src', gallery[1] || work.hero || work.image);
            resultThumbs[0].setAttribute('alt', work.title);
        }
        if (resultThumbs[1]) {
            resultThumbs[1].setAttribute('src', gallery[0] || work.hero || work.image);
            resultThumbs[1].setAttribute('alt', work.title);
        }
        setImg('.project-details__item-one .project-details__wrap-thumb img', work.hero || work.image, work.title);
        var closingPara = document.querySelector('.project-details__item-one > .project-details__dec:last-of-type');
        if (closingPara) {
            closingPara.textContent = infoLine(work);
        }

        if (window.ScrollTrigger) {
            window.ScrollTrigger.refresh();
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        if (!document.querySelector('.project-details-breadcrumb__title')) {
            return;
        }
        var id = WorksAPI.getParam('id');
        WorksAPI.load().then(function (data) {
            var work = (id && WorksAPI.getById(data.works, id)) || data.works[0];
            render(data, work);
        }).catch(function (err) {
            console.error('Could not load project details:', err);
        });
    });
})();
