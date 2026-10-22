(function () {
    'use strict';

    // Themes are defined in assets/scss/utils/_colors.scss ($themes); the
    // active one is the data-theme attribute on <html>, set before first paint
    // by the inline snippet in each page's <head> and changed here.
    // Keep this list in step with $themes.
    var STORAGE_KEY = 'vaa-theme';
    var DEFAULT_THEME = 'light';
    var THEMES = [
        { id: 'light', label: 'Ink & Lime' },
        { id: 'dark', label: 'Midnight Lime' },
        { id: 'ember', label: 'Sand & Ember' },
        { id: 'ocean', label: 'Ocean Mist' },
        { id: 'dusk', label: 'Violet Dusk' },
        { id: 'forest', label: 'Forest Mint' }
    ];

    var root = null;
    var toggle = null;
    var menu = null;

    function find(id) {
        for (var i = 0; i < THEMES.length; i++) {
            if (THEMES[i].id === id) {
                return THEMES[i];
            }
        }
        return null;
    }

    function current() {
        var id = document.documentElement.getAttribute('data-theme');
        return find(id) ? id : DEFAULT_THEME;
    }

    function save(id) {
        try {
            localStorage.setItem(STORAGE_KEY, id);
        } catch (e) { /* private mode: the choice just won't persist */ }
    }

    function setOpen(open) {
        if (!menu) {
            return;
        }
        menu.hidden = !open;
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        if (open) {
            var checked = menu.querySelector('[aria-checked="true"]');
            if (checked) {
                checked.focus();
            }
        }
    }

    function render(id) {
        if (!toggle) {
            return;
        }
        var theme = find(id);
        toggle.setAttribute('aria-label', 'Choose theme (current: ' + theme.label + ')');
        toggle.querySelector('.vaa-theme-swatch').setAttribute('data-theme-id', id);
        toggle.querySelector('.vaa-theme-toggle__label').textContent = theme.label;
        Array.prototype.forEach.call(menu.querySelectorAll('.vaa-theme-option'), function (option) {
            option.setAttribute('aria-checked', option.getAttribute('data-theme-id') === id ? 'true' : 'false');
        });
    }

    function apply(id) {
        document.documentElement.setAttribute('data-theme', id);
        render(id);
        if (window.ScrollTrigger) {
            window.ScrollTrigger.refresh();
        }
    }

    function choose(id) {
        save(id);
        apply(id);
    }

    function build() {
        root = document.createElement('div');
        root.className = 'vaa-theme';

        menu = document.createElement('div');
        menu.className = 'vaa-theme-menu';
        menu.id = 'vaa-theme-menu';
        menu.setAttribute('role', 'menu');
        menu.setAttribute('aria-label', 'Colour theme');
        menu.hidden = true;
        menu.innerHTML = '<div class="vaa-theme-menu__title">Colour theme</div>' + THEMES.map(function (theme) {
            return '<button type="button" class="vaa-theme-option" role="menuitemradio" aria-checked="false" data-theme-id="' + theme.id + '">' +
                '<span class="vaa-theme-swatch" data-theme-id="' + theme.id + '" aria-hidden="true"></span>' +
                '<span>' + theme.label + '</span></button>';
        }).join('');

        toggle = document.createElement('button');
        toggle.type = 'button';
        toggle.className = 'vaa-theme-toggle';
        toggle.setAttribute('aria-haspopup', 'menu');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-controls', 'vaa-theme-menu');
        toggle.innerHTML = '<span class="vaa-theme-swatch" aria-hidden="true"></span>' +
            '<span class="vaa-theme-toggle__label"></span>';

        root.appendChild(menu);
        root.appendChild(toggle);
        document.body.appendChild(root);

        toggle.addEventListener('click', function () {
            setOpen(menu.hidden);
        });

        menu.addEventListener('click', function (e) {
            var option = e.target.closest('.vaa-theme-option');
            if (option) {
                choose(option.getAttribute('data-theme-id'));
                setOpen(false);
                toggle.focus();
            }
        });

        // arrow keys move between options, Escape closes
        menu.addEventListener('keydown', function (e) {
            var options = Array.prototype.slice.call(menu.querySelectorAll('.vaa-theme-option'));
            var index = options.indexOf(document.activeElement);
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault();
                var step = e.key === 'ArrowDown' ? 1 : -1;
                options[(index + step + options.length) % options.length].focus();
            }
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && !menu.hidden) {
                setOpen(false);
                toggle.focus();
            }
        });

        document.addEventListener('click', function (e) {
            if (!menu.hidden && !root.contains(e.target)) {
                setOpen(false);
            }
        });

        render(current());
    }

    // keep other open tabs in step
    window.addEventListener('storage', function (e) {
        if (e.key === STORAGE_KEY && find(e.newValue)) {
            apply(e.newValue);
        }
    });

    window.VAATheme = {
        themes: THEMES,
        get: current,
        set: function (id) {
            if (find(id)) {
                choose(id);
            }
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', build);
    } else {
        build();
    }
})();
