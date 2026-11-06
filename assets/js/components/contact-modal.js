(function () {
    'use strict';

    var DELAY_MS = 10000;
    var SCROLL_PX = 100;

    var SERVICES_URL = 'data/service-details.json';

    // Used until (or if) data/service-details.json can't be loaded.
    var FALLBACK_SERVICES = [
        'Branding & Identity',
        'UI/UX & Website Design',
        'Digital Marketing',
        'Social Media',
        'Creative Design',
        'Advertising Campaigns',
        'Video & Photography',
        'Content Creation',
        'Print & Outdoor Advertising',
        'Marketing Strategy',
        'Events & Promotions',
        'Performance Marketing'
    ];

    var STYLES = '' +
        ':host{position:fixed;inset:0;z-index:99999;display:none;font-family:var(--rr-ff-heading,inherit);}' +
        ':host([open]){display:block;}' +
        '*{box-sizing:border-box;}' +
        '.backdrop{position:absolute;inset:0;background:rgba(0,0,0,.6);opacity:0;transition:opacity .3s ease;}' +
        '.dialog{position:absolute;top:50%;left:50%;width:min(860px,calc(100% - 32px));max-height:calc(100% - 32px);overflow:auto;' +
            'transform:translate(-50%,-46%);opacity:0;transition:opacity .3s ease,transform .3s ease;' +
            'padding:56px 56px 48px;background:var(--vaa-paper-alt,#fff);color:var(--rr-heading-primary,#111);}' +
        ':host([visible]) .backdrop{opacity:1;}' +
        ':host([visible]) .dialog{opacity:1;transform:translate(-50%,-50%);}' +
        '.close{position:absolute;top:16px;right:16px;width:36px;height:36px;border:0;background:transparent;cursor:pointer;color:inherit;font-size:28px;line-height:1;}' +
        '.title{margin:0 0 40px;font-size:26px;font-weight:500;line-height:1;}' +
        '.grid{display:grid;grid-template-columns:1fr 1fr;column-gap:40px;}' +
        '.full{grid-column:1 / -1;}' +
        '.field{margin-bottom:40px;}' +
        '.field input,.field textarea{display:block;width:100%;height:40px;padding:0;border:0;border-radius:0;outline:0;background:transparent;' +
            'border-bottom:1px solid var(--rr-heading-primary,#111);color:inherit;font:inherit;font-size:16px;}' +
        '.field textarea{height:60px;padding-top:8px;resize:vertical;}' +
        '.field input:focus,.field textarea:focus{border-bottom-width:2px;}' +
        '.field ::placeholder{color:rgba(var(--vaa-fg-rgb,0,0,0),.6);opacity:1;}' +
        '.select{position:relative;}' +
        '.select select{display:block;width:100%;height:48px;padding:8px 48px 8px 16px;border:0;border-radius:0;outline:0;cursor:pointer;appearance:none;' +
            'background:transparent;border-bottom:1px solid var(--rr-heading-primary,#111);color:inherit;font:inherit;font-size:16px;}' +
        '.select select:focus{border-bottom-width:2px;}' +
        '.select select.empty{color:rgba(var(--vaa-fg-rgb,0,0,0),.6);}' +
        '.select select option{padding:8px 16px;color:var(--rr-heading-primary,#111);background:var(--vaa-paper-alt,#fff);}' +
        '.select::after{content:"";position:absolute;right:16px;top:19px;width:7px;height:7px;pointer-events:none;' +
            'border-right:1.5px solid currentColor;border-bottom:1.5px solid currentColor;transform:rotate(45deg);}' +
        '.actions{display:flex;align-items:center;gap:24px;}' +
        '.submit{padding:16px 32px;border:1px solid var(--rr-heading-primary,#111);background:var(--rr-heading-primary,#111);color:var(--vaa-paper-alt,#fff);font:inherit;font-size:16px;cursor:pointer;}' +
        '.submit[disabled]{opacity:.6;cursor:wait;}' +
        '.response{margin:0;font-size:15px;}' +
        '.response.success{color:rgb(73,145,0);}' +
        '.response.error{color:rgba(255,0,0,.7);}' +
        '@media (max-width:767px){' +
            '.dialog{padding:48px 24px 32px;}' +
            '.grid{grid-template-columns:1fr;}' +
            '.field{margin-bottom:32px;}' +
        '}' +
        '@media (prefers-reduced-motion:reduce){.backdrop,.dialog{transition:none;}}';

    function input(name, type, placeholder, required) {
        return '<div class="field' + (name === 'name' ? ' full' : '') + '">' +
            '<input name="' + name + '" type="' + type + '" placeholder="' + placeholder + '" aria-label="' + placeholder + '"' +
            (required ? ' required' : '') + '></div>';
    }

    function escapeHtml(str) {
        return String(str).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }

    function serviceOptions(list) {
        return '<option value="" selected>Service Required</option>' + list.map(function (label) {
            return '<option value="' + escapeHtml(label) + '">' + escapeHtml(label) + '</option>';
        }).join('');
    }

    var servicesPromise = null;

    // Same titles the services pages render, so the dropdown follows the JSON.
    function loadServiceTitles() {
        if (!servicesPromise) {
            servicesPromise = fetch(SERVICES_URL)
                .then(function (res) {
                    if (!res.ok) throw new Error(res.status);
                    return res.json();
                })
                .then(function (data) {
                    var titles = (data.services || []).map(function (s) { return s.title; }).filter(Boolean);
                    return titles.length ? titles : FALLBACK_SERVICES;
                })
                .catch(function () { return FALLBACK_SERVICES; });
        }
        return servicesPromise;
    }

    class ContactModal extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({ mode: 'open' });
            this._onKeydown = this._onKeydown.bind(this);
            this._onScroll = this._onScroll.bind(this);
        }

        connectedCallback() {
            this._render();
            this._timer = setTimeout(this.open.bind(this), this.delay);
            window.addEventListener('scroll', this._onScroll, { passive: true });
        }

        disconnectedCallback() {
            this._disarm();
            document.removeEventListener('keydown', this._onKeydown);
        }

        get delay() {
            var ms = parseInt(this.getAttribute('delay'), 10);
            return isNaN(ms) ? DELAY_MS : ms;
        }

        get scrollThreshold() {
            var px = parseInt(this.getAttribute('scroll-threshold'), 10);
            return isNaN(px) ? SCROLL_PX : px;
        }

        _render() {
            this.shadowRoot.innerHTML = '' +
                '<style>' + STYLES + '</style>' +
                '<div class="backdrop" part="backdrop"></div>' +
                '<div class="dialog" role="dialog" aria-modal="true" aria-labelledby="title" tabindex="-1">' +
                    '<button type="button" class="close" aria-label="Close">&times;</button>' +
                    '<h3 class="title" id="title">Tell us about your project</h3>' +
                    '<form action="mail.php" method="post" novalidate>' +
                        '<div class="grid">' +
                            input('name', 'text', 'Full Name', true) +
                            input('email', 'email', 'Email', true) +
                            input('phone', 'tel', 'Phone Number') +
                            input('company', 'text', 'Company Name') +
                            input('website', 'url', 'Website') +
                            '<div class="field select full"><select name="service" class="empty" aria-label="Service Required">' + serviceOptions(FALLBACK_SERVICES) + '</select></div>' +
                            '<div class="field full"><textarea name="message" placeholder="Project Description" aria-label="Project Description"></textarea></div>' +
                        '</div>' +
                        '<div class="actions">' +
                            '<button type="submit" class="submit">Submit Now</button>' +
                            '<p class="response" role="status"></p>' +
                        '</div>' +
                    '</form>' +
                '</div>';

            var root = this.shadowRoot;
            root.querySelector('.close').addEventListener('click', this.close.bind(this));
            root.querySelector('.backdrop').addEventListener('click', this.close.bind(this));
            root.querySelector('form').addEventListener('submit', this._onSubmit.bind(this));

            var select = root.querySelector('select');
            select.addEventListener('change', function () {
                select.classList.toggle('empty', select.value === '');
            });
            loadServiceTitles().then(function (titles) {
                select.innerHTML = serviceOptions(titles);
            });
        }

        _onScroll() {
            if ((window.pageYOffset || document.documentElement.scrollTop) >= this.scrollThreshold) {
                this.open();
            }
        }

        _disarm() {
            clearTimeout(this._timer);
            window.removeEventListener('scroll', this._onScroll);
        }

        _onKeydown(e) {
            if (e.key === 'Escape') this.close();
        }

        open() {
            this._disarm();
            if (this.hasAttribute('open')) return;
            this._previousFocus = document.activeElement;
            this.setAttribute('open', '');
            document.addEventListener('keydown', this._onKeydown);
            // Next frame so the opacity/transform transition runs from the closed state.
            requestAnimationFrame(function () {
                this.setAttribute('visible', '');
                this.shadowRoot.querySelector('.dialog').focus();
            }.bind(this));
        }

        close() {
            this.removeAttribute('visible');
            document.removeEventListener('keydown', this._onKeydown);
            setTimeout(function () {
                this.removeAttribute('open');
                if (this._previousFocus && this._previousFocus.focus) this._previousFocus.focus();
            }.bind(this), 300);
        }

        _onSubmit(e) {
            e.preventDefault();
            var form = e.target;
            var response = this.shadowRoot.querySelector('.response');
            var button = form.querySelector('.submit');

            if (!form.checkValidity()) {
                response.className = 'response error';
                response.textContent = 'Please enter your name and a valid email.';
                form.reportValidity();
                return;
            }

            button.disabled = true;
            fetch(form.action, { method: 'POST', body: new URLSearchParams(new FormData(form)) })
                .then(function (res) {
                    return res.text().then(function (text) {
                        if (!res.ok) throw new Error(text);
                        return text;
                    });
                })
                .then(function (text) {
                    response.className = 'response success';
                    response.textContent = text || 'Thank you! We will be in touch soon.';
                    form.reset();
                    form.querySelector('select').classList.add('empty');
                })
                .catch(function (err) {
                    response.className = 'response error';
                    response.textContent = (err && err.message) || 'Oops! An error occured and your message could not be sent.';
                })
                .then(function () { button.disabled = false; });
        }
    }

    if (!customElements.get('contact-modal')) {
        customElements.define('contact-modal', ContactModal);
    }
})();
