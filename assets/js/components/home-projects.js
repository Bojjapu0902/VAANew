(function () {
    'use strict';

    // The grid CSS (.project-section-3__item:nth-child(n)) hard-codes a
    // mosaic layout for exactly 10 project slots + the trailing "All
    // Projects" button, so we keep that slot count and only swap in data.
    var HAS_INFO = [true, false, false, true, true, true, false, true, true, true];
    var CURSOR_TEXT = "\n                                                <div class='btn2'>\n                                                <span>See <br> Work </span>\n                                                <div class='arrow'><i class='fa fa-regular fa-arrow-right'></i></div>\n                                                </div>";

    function escapeHtml(str) {
        return String(str).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    function buildTags(data, work) {
        var tags = [WorksAPI.categoryLabel(data, work.category)];
        if (work.meta) {
            tags.push(work.meta);
        }
        return tags;
    }

    function buildItem(data, work, hasInfo) {
        var tags = buildTags(data, work);
        var tagsHtml = tags.map(function (t) {
            return '<li>' + escapeHtml(t) + '</li>';
        }).join('');
        var href = 'project-details.html?id=' + encodeURIComponent(work.id);

        var html = '' +
            '<div class="project-section-3__item">' +
            '<div class="project-section-3__thumb" data-cursor-text="' + escapeHtml(CURSOR_TEXT) + '" data-cursor-class="-big">' +
            '<a href="' + href + '">' +
            '<img src="' + escapeHtml(work.image) + '" alt="' + escapeHtml(work.title) + '">' +
            '<ul class="project-section-3__tag">' + tagsHtml + '</ul>' +
            '</a>' +
            '</div>';

        if (hasInfo) {
            html += '' +
                '<div class="project-section-3__info">' +
                '<h3 class="project-section-3__info__title"><a href="' + href + '">' + escapeHtml(work.title) + '</a></h3>' +
                '</div>';
        }

        html += '</div>';
        return html;
    }

    function refreshScrollTrigger() {
        if (window.ScrollTrigger) {
            window.ScrollTrigger.refresh();
        }
    }

    function waitForImagesThenRefresh(wrapper) {
        var imgs = wrapper.querySelectorAll('img');
        var pending = imgs.length;
        if (pending === 0) {
            refreshScrollTrigger();
            return;
        }
        function done() {
            pending--;
            if (pending <= 0) {
                refreshScrollTrigger();
            }
        }
        imgs.forEach(function (img) {
            if (img.complete) {
                done();
            } else {
                img.addEventListener('load', done);
                img.addEventListener('error', done);
            }
        });
        // Safety net in case some image events never fire.
        setTimeout(refreshScrollTrigger, 500);
    }

    function render(data) {
        var wrapper = document.querySelector('.project-section-3__wrapper');
        if (!wrapper) {
            return;
        }
        var btnItem = wrapper.querySelector('.project-section-3__btn');
        var btnItemParent = btnItem ? btnItem.closest('.project-section-3__item') : null;

        var works = data.works.slice(0, HAS_INFO.length);
        var itemsHtml = works.map(function (work, i) {
            return buildItem(data, work, HAS_INFO[i]);
        }).join('');

        if (btnItemParent) {
            btnItemParent.insertAdjacentHTML('beforebegin', itemsHtml);
        } else {
            wrapper.innerHTML = itemsHtml;
        }

        refreshScrollTrigger();
        waitForImagesThenRefresh(wrapper);
    }

    document.addEventListener('DOMContentLoaded', function () {
        var wrapper = document.querySelector('.project-section-3__wrapper');
        if (!wrapper) {
            return;
        }

        // Remove the original static demo items now (keep the "All Projects"
        // button item), then inject the real ones once data arrives.
        var btnItem = wrapper.querySelector('.project-section-3__btn');
        var btnItemParent = btnItem ? btnItem.closest('.project-section-3__item') : null;
        Array.prototype.slice.call(wrapper.children).forEach(function (child) {
            if (child !== btnItemParent) {
                child.remove();
            }
        });

        WorksAPI.load().then(render).catch(function (err) {
            console.error('Could not load projects:', err);
        });
    });
})();
