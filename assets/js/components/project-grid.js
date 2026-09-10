(function () {
    'use strict';

    var CURSOR_TEXT = "\n                                                            <div class='btn'>\n                                                            <span>Work <i class='fa fa-regular fa-arrow-right'></i> <br>\n                                                            Details</span>\n                                                            </div>";

    function escapeHtml(str) {
        return String(str).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    function buildItem(work) {
        var href = 'project-details.html?id=' + encodeURIComponent(work.id);
        var meta = [];
        if (work.info && work.info.Discipline) {
            meta.push(work.info.Discipline);
        }
        if (work.info && work.info.Practice) {
            meta.push(work.info.Practice);
        }
        var metaHtml = meta.map(function (m) {
            return '<li>' + escapeHtml(m) + '</li>';
        }).join('');

        return '' +
            '<div class="project-section-2__item">' +
            '<div class="project-section-2__thumb" data-cursor-text="' + escapeHtml(CURSOR_TEXT) + '">' +
            '<a href="' + href + '">' +
            '<img src="' + escapeHtml(work.image) + '" alt="' + escapeHtml(work.title) + '">' +
            '</a>' +
            '</div>' +
            '<div class="project-section-2__content">' +
            '<h3 class="project-section-2__title"><a href="' + href + '">' + escapeHtml(work.title) + '</a></h3>' +
            '<ul class="project-section-2__meta">' + metaHtml + '</ul>' +
            '</div>' +
            '</div>';
    }

    function render(data) {
        var col1 = document.querySelector('[data-project-col="1"]');
        var col2 = document.querySelector('[data-project-col="2"]');
        if (!col1 || !col2) {
            return;
        }

        var col1Html = '';
        var col2Html = '';
        data.works.forEach(function (work, i) {
            if (i % 2 === 0) {
                col1Html += buildItem(work);
            } else {
                col2Html += buildItem(work);
            }
        });

        col1.innerHTML = col1Html;
        col2.innerHTML = col2Html;

        if (window.ScrollTrigger) {
            window.ScrollTrigger.refresh();
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        if (!document.querySelector('[data-project-col="1"]')) {
            return;
        }
        WorksAPI.load().then(render).catch(function (err) {
            console.error('Could not load projects:', err);
        });
    });
})();
