(function (window) {
    'use strict';

    var DATA_URL = 'data/works.json';
    var cachedPromise = null;

    function loadWorks() {
        if (!cachedPromise) {
            cachedPromise = fetch(DATA_URL).then(function (res) {
                if (!res.ok) {
                    throw new Error('Failed to load works.json: ' + res.status);
                }
                return res.json();
            });
        }
        return cachedPromise;
    }

    function getById(works, id) {
        for (var i = 0; i < works.length; i++) {
            if (works[i].id === id) {
                return works[i];
            }
        }
        return null;
    }

    function getParam(name) {
        return new URLSearchParams(window.location.search).get(name);
    }

    function categoryLabel(data, categoryId) {
        for (var i = 0; i < data.categories.length; i++) {
            if (data.categories[i].id === categoryId) {
                return data.categories[i].label;
            }
        }
        return categoryId;
    }

    window.WorksAPI = {
        load: loadWorks,
        getById: getById,
        getParam: getParam,
        categoryLabel: categoryLabel
    };
})(window);
