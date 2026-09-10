(function () {
    'use strict';

    var MENU_LINKS = [
        { href: 'index.html', label: 'Home' },
        { href: 'project.html', label: 'Portfolio' },
        { href: 'services.html', label: 'Service' },
        { href: 'about-us.html', label: 'About' },
        { href: 'contact.html', label: 'Contact' }
    ];

    function buildMenu() {
        return MENU_LINKS.map(function (link) {
            return '<li><a href="' + link.href + '">' + link.label + '</a></li>';
        }).join(' ');
    }

    class SiteFooter extends HTMLElement {
        connectedCallback() {
            this.innerHTML = '' +
                '<div class="footer heading-bg overflow-hidden p-relative z-1 fade-wrapper">' +
                    '<div class="container-fluid">' +
                        '<div class="footer-top">' +
                            '<div class="footer-top-footer-title">' +
                                '<h2 class="top-title rr-title-anim">Let’s Move Forward <br> United.</h2>' +
                            '</div>' +
                            '<div class="hero">' +
                                '<div class="tp-portfolio-more tp-hover-btn-wrapper tp-btn-bounce-2 fade-top">' +
                                    '<a href="project.html" class="tp-hover-btn tp-hover-btn-item tp-btn-circle-2 tp-btn-circle-3 d-flex align-items-center justify-content-center flex-column">' +
                                        '<span class="tp-btn-circle-text-2">' +
                                            '<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">' +
                                                '<path fill-rule="evenodd" clip-rule="evenodd" d="M35.2634 0.736319L7.32521 0.390242L7.39175 5.76183L26.1669 5.9944L0.817263 31.344L4.65572 35.1825L30.0053 9.83286L30.2379 28.608L35.6095 28.6745L35.2634 0.736319ZM28.746 4.95275L2.33598 31.3628L4.63691 33.6637L4.63697 33.6637L2.33622 31.3629L28.7464 4.95276L28.746 4.95275ZM31.0471 7.25394L31.2985 27.5474L31.2987 27.5474L31.0474 7.25369L31.0471 7.25394ZM34.2028 1.79704L8.41265 1.47757L8.45259 4.70124L8.45234 4.70124L8.4124 1.47744L34.2028 1.79691L34.2028 1.79704Z" fill="white"/>' +
                                            '</svg>' +
                                        '</span>' +
                                        '<i class="tp-btn-circle-dot"></i>' +
                                    '</a>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                        '<div class="footer__menu p-relative">' +
                            '<ul>' + buildMenu() + '</ul>' +
                        '</div>' +
                        '<div class="footer__main">' +
                            '<h3 class="footer__main-title end">VAA</h3>' +
                        '</div>' +
                    '</div>' +
                    '<div class="footer__bottom-wrapper">' +
                        '<div class="container">' +
                            '<div class="footer__bottom">' +
                                '<div class="footer__copyright">' +
                                    '<a href="#">Back To Top <i class="fa-solid fa-arrow-right"></i></a>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>';
        }
    }

    if (!customElements.get('site-footer')) {
        customElements.define('site-footer', SiteFooter);
    }
})();
