(function () {
    'use strict';

    var NAV_LINKS = [
        { key: 'home', href: 'index.html', label: 'HOME' },
        { key: 'about', href: 'about-us.html', label: 'ABOUT' },
        { key: 'services', href: 'services.html', label: 'SERVICES' },
        { key: 'works', href: 'project.html', label: 'WORKS' },
        { key: 'contact', href: 'contact.html', label: 'Contact Us' }
    ];

    var VARIANTS = {
        home: {
            headerClass: 'header header-2',
            logoWrapperClass: 'logo p-3',
            logoImgClass: 'w-100',
            logoSrc: 'assets/imgs/logo/logo-2.svg',
            rightAction: 'search'
        },
        dark: {
            headerClass: 'header header-1',
            logoWrapperClass: 'logo',
            logoImgClass: '',
            logoSrc: 'assets/imgs/logo/logo.svg',
            rightAction: 'cta'
        },
        light: {
            headerClass: 'header header-1 breadcrumb-header',
            logoWrapperClass: 'logo',
            logoImgClass: '',
            logoSrc: 'assets/imgs/logo/logo-2.svg',
            rightAction: 'cta'
        }
    };

    function buildNav(activeKey) {
        return NAV_LINKS.map(function (link) {
            var isActive = link.key === activeKey;
            return '<li' + (isActive ? ' class="active"' : '') + '>' +
                '<a href="' + link.href + '"' + (isActive ? ' aria-current="page"' : '') + '>' + link.label + '</a>' +
                '</li>';
        }).join('');
    }

    function buildRightAction(rightAction) {
        if (rightAction === 'cta') {
            return '' +
                '<div class="header__button d-none d-sm-inline-flex">' +
                    '<div class="ruhe-btn-group">' +
                        '<a class="ruhe-btn ruhe-btn-circle" href="contact.html"><i class="fa-solid fa-arrow-right"></i></a>' +
                        '<a class="ruhe-btn ruhe-btn-primary" href="contact.html">Let\'s Talk</a>' +
                        '<a class="ruhe-btn ruhe-btn-circle" href="contact.html"><i class="fa-solid fa-arrow-right"></i></a>' +
                    '</div>' +
                '</div>' +
                '<div class="header__hamburger">' +
                    '<div class="sidebar__toggle">' +
                        '<button class="bar-icon">' +
                            '<span></span><span></span><span></span>' +
                        '</button>' +
                    '</div>' +
                '</div>';
        }

        return '' +
            '<div class="header__search d-none d-sm-inline-flex">' +
                '<button id="popup-search-box" class="search-open-btn">' +
                    '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">' +
                        '<path d="M8.6 16.2C12.7974 16.2 16.2 12.7974 16.2 8.6C16.2 4.40264 12.7974 1 8.6 1C4.40264 1 1 4.40264 1 8.6C1 12.7974 4.40264 16.2 8.6 16.2Z" stroke="#222222" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />' +
                        '<path d="M17.0004 17.0004L15.4004 15.4004" stroke="#222222" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />' +
                    '</svg>' +
                '</button>' +
            '</div>' +
            '<div class="header__hamburger">' +
                '<div class="sidebar__toggle">' +
                    '<button class="bar-icon">' +
                        '<span></span><span></span>' +
                    '</button>' +
                '</div>' +
            '</div>';
    }

    // Off-canvas drawer + its overlays. main.js fills .mobile-menu from #mobile-menu
    // and toggles .info-open / .overlay-open on these elements.
    function buildDrawer() {
        return '' +
            '<div class="fix">' +
                '<div class="offcanvas__area">' +
                    '<div class="offcanvas__wrapper">' +
                        '<div class="offcanvas__content">' +
                            '<div class="offcanvas__top d-flex justify-content-between align-items-center">' +
                                '<div class="offcanvas__logo">' +
                                    '<a href="index.html">' +
                                        '<img src="assets/imgs/logo/logo.svg" alt="Vasantha Ads & Arts logo">' +
                                    '</a>' +
                                '</div>' +
                                '<div class="offcanvas__close">' +
                                    '<button class="offcanvas-close-icon animation--flip" aria-label="Close menu">' +
                                        '<span class="offcanvas-m-lines">' +
                                            '<span class="offcanvas-m-line line--1"></span><span class="offcanvas-m-line line--2"></span><span class="offcanvas-m-line line--3"></span>' +
                                        '</span>' +
                                    '</button>' +
                                '</div>' +
                            '</div>' +
                            '<div class="mobile-menu fix"></div>' +
                            '<div class="offcanvas__social">' +
                                '<h3 class="offcanvas__title mb-20">Subscribe & Follow</h3>' +
                                '<ul>' +
                                    '<li><a href="https://www.facebook.com/"><i class="fab fa-facebook-f"></i></a></li>' +
                                    '<li><a href="https://pinterest.com/"><i class="fa-brands fa-pinterest-p"></i></a></li>' +
                                    '<li><a href="https://youtube.com/"><i class="fab fa-youtube"></i></a></li>' +
                                    '<li><a href="https://linkedin.com/"><i class="fab fa-linkedin"></i></a></li>' +
                                '</ul>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<div class="offcanvas__overlay"></div>' +
            '<div class="offcanvas__overlay-white"></div>';
    }

    // Full-width search overlay opened by .search-open-btn.
    function buildSearchPopup() {
        return '' +
            '<div class="search__popup">' +
                '<div class="container">' +
                    '<div class="row gx-30">' +
                        '<div class="col-xxl-12">' +
                            '<div class="search__wrapper">' +
                                '<div class="search__top d-flex justify-content-between align-items-center">' +
                                    '<div class="search__logo">' +
                                        '<a href="index.html">' +
                                            '<img src="assets/imgs/logo/logo.svg" alt="Vasantha Ads & Arts logo">' +
                                        '</a>' +
                                    '</div>' +
                                    '<div class="search__close">' +
                                        '<button type="button" class="search__close-btn search-close-btn" aria-label="Close search">' +
                                            '<svg width="18" height="18" viewBox="0 0 18 18" fill="none">' +
                                                '<path d="M17 1L1 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />' +
                                                '<path d="M1 1L17 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />' +
                                            '</svg>' +
                                        '</button>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="search__form">' +
                                    '<form action="#">' +
                                        '<div class="search__input">' +
                                            '<input class="search-input-field" type="text" placeholder="Type here to search...">' +
                                            '<span class="search-focus-border"></span>' +
                                            '<button type="submit" aria-label="Search">' +
                                                '<svg width="20" height="20" viewBox="0 0 20 20" fill="none">' +
                                                    '<path d="M9.55 18.1C14.272 18.1 18.1 14.272 18.1 9.55C18.1 4.82797 14.272 1 9.55 1C4.82797 1 1 4.82797 1 9.55C1 14.272 4.82797 18.1 9.55 18.1Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />' +
                                                    '<path d="M19.0002 19.0002L17.2002 17.2002" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />' +
                                                '</svg>' +
                                            '</button>' +
                                        '</div>' +
                                    '</form>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>';
    }

    class SiteHeader extends HTMLElement {
        connectedCallback() {
            var variantKey = this.getAttribute('variant') || 'dark';
            var variant = VARIANTS[variantKey] || VARIANTS.dark;
            var activeKey = this.getAttribute('active') || 'home';

            this.innerHTML = buildDrawer() +
                '<div id="header-stickys" class="' + variant.headerClass + '">' +
                    '<div class="container-fluid">' +
                        '<div class="mega__menu-wrapper p-relative">' +
                            '<div class="header__main">' +
                                '<div class="header__left">' +
                                    '<div class="header-1__logo">' +
                                        '<a href="index.html">' +
                                            '<div class="' + variant.logoWrapperClass + '">' +
                                                '<img src="' + variant.logoSrc + '" style="width:100%" alt="Vasantha Ads & Arts logo"' + (variant.logoImgClass ? ' class="' + variant.logoImgClass + '"' : '') + '>' +
                                            '</div>' +
                                        '</a>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="header__middle">' +
                                    '<div class="mean__menu-wrapper d-none d-xl-block">' +
                                        '<div class="main-menu main-menu-2">' +
                                            '<nav id="mobile-menu">' +
                                                '<ul>' + buildNav(activeKey) + '</ul>' +
                                            '</nav>' +
                                        '</div>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="header__right">' +
                                    '<div class="header__action d-flex align-items-center">' +
                                        buildRightAction(variant.rightAction) +
                                    '</div>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                buildSearchPopup();
        }
    }

    if (!customElements.get('site-header')) {
        customElements.define('site-header', SiteHeader);
    }
})();
