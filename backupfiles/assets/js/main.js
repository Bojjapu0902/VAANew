(function ($) {
    "use strict";
    var windowOn = $(window);


    /*-----------------------------------------------------------------------------------

        Template Name: Ruhe - Digital Agency HTML Template.
        Author: RRDevs
        Support: https://support.rrdevs.net
        Description: Ruhe Digital Agency HTML Template.
        Version: 1.0
        Developer: Mamun khan (https://github.com/mk-mamun-khan)

    -----------------------------------------------------------------------------------

      /*======================================
        Preloader activation
        ========================================*/

    $(window).on('load', function (event) {
        $('#preloader').delay(1000).fadeOut(500);

        $('.odometer').waypoint(function (direction) {
            if (direction === 'down') {
                let countNumber = $(this.element).attr("data-count");
                $(this.element).html(countNumber);
            }
        }, {
            offset: '80%'
        });
    });

    // hover reveal start
    const hoveritem = document.querySelectorAll(".rr-hover-reveal-item");

    function moveImage(e, hoveritem, index) {
        const item = hoveritem.getBoundingClientRect();
        const x = e.clientX - item.x;
        const y = e.clientY - item.y;
        if (hoveritem.children[index]) {
            hoveritem.children[index].style.transform = `translate(${x}px, ${y}px)`;
        }
    }
    hoveritem.forEach((item, i) => {
        item.addEventListener("mousemove", (e) => {
            setInterval(moveImage(e, item, 1), 50);
        });
    });
    // hover reveal end

    $(".preloader-close").on("click", function () {
        $('#preloader').delay(2000).fadeOut(500);

        $('.odometer').waypoint(function (direction) {
            if (direction === 'down') {
                let countNumber = $(this.element).attr("data-count");
                $(this.element).html(countNumber);
            }
        }, {
            offset: '80%'
        });
    })

    //GSAP START

    // Check if any elements with the class ".end" exist
    if (document.querySelector('.end')) {
        let endTl = gsap.timeline({
            repeat: -1,
            delay: 1,
            scrollTrigger: {
                trigger: '.end',
                start: 'bottom 100%-=50px'
            }
        });

        gsap.set('.end', {
            opacity: 0
        });

        gsap.to('.end', {
            opacity: 1,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.end',
                start: 'bottom 100%-=50px',
                once: true
            }
        });

        let mySplitText = new SplitText(".end", {
            type: "words,chars"
        });
        let chars = mySplitText.chars;
        let endGradient = chroma.scale(['#fff']);

        endTl.to(chars, {
            duration: 0.5,
            scaleY: 0.6,
            ease: "power3.out",
            stagger: 0.04,
            transformOrigin: 'center bottom'
        });
        endTl.to(chars, {
            yPercent: -20,
            ease: "elastic",
            stagger: 0.03,
            duration: 0.8
        }, 0.5);
        endTl.to(chars, {
            scaleY: 1,
            ease: "elastic.out(1.5, 0.2)",
            stagger: 0.03,
            duration: 1.5
        }, 0.5);
        endTl.to(chars, {
            color: (i, el, arr) => {
                return endGradient(i / arr.length).hex();
            },
            ease: "power2.out",
            stagger: 0.03,
            duration: 0.3
        }, 0.5);
        endTl.to(chars, {
            yPercent: 0,
            ease: "back",
            stagger: 0.03,
            duration: 0.8
        }, 0.7);
        endTl.to(chars, {
            color: '#fff',
            duration: 1.4,
            stagger: 0.05
        });
    }

    /////////////////////////////////////////////////////

    //return img gsap
    gsap.registerPlugin(ScrollTrigger);

    //GSAP smooth animation
    gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin);

    if ($('#smooth-wrapper').length && $('#smooth-content').length) {

        gsap.config({
            nullTargetWarn: false,
        });

        let smoother = ScrollSmoother.create({
            smooth: 2,
            effects: true,
            smoothTouch: false,
            normalizeScroll: false,
            ignoreMobileResize: true,
        });
    }

    /*======================================
   Data Css js
   ========================================*/
    $("[data-background]").each(function () {
        $(this).css(
            "background-image",
            "url( " + $(this).attr("data-background") + "  )"
        );
    });

    $("[data-width]").each(function () {
        $(this).css("width", $(this).attr("data-width"));
    });

    $("[data-bg-color]").each(function () {
        $(this).css("background-color", $(this).attr("data-bg-color"));
    });

    /*======================================
      Mobile Menu Js
      ========================================*/
    $("#mobile-menu").meanmenu({
        meanMenuContainer: ".mobile-menu",
        meanScreenWidth: "1199",
        meanExpand: ['<i class="fa-regular fa-angle-right"></i>'],
    });

    /*======================================
      Sidebar Toggle
      ========================================*/
    $(".offcanvas__close,.offcanvas__overlay").on("click", function () {
        $(".offcanvas__area").removeClass("info-open");
        $(".offcanvas__overlay").removeClass("overlay-open");
    });
    // Scroll to bottom then close navbar
    $(window).scroll(function () {
        if ($("body").scrollTop() > 0 || $("html").scrollTop() > 0) {
            $(".offcanvas__area").removeClass("info-open");
            $(".offcanvas__overlay").removeClass("overlay-open");
        }
    });
    $(".sidebar__toggle").on("click", function () {
        $(".offcanvas__area").addClass("info-open");
        $(".offcanvas__overlay").addClass("overlay-open");
    });

    /*======================================
      Body overlay Js
      ========================================*/
    $(".body-overlay").on("click", function () {
        $(".offcanvas__area").removeClass("opened");
        $(".body-overlay").removeClass("opened");
    });

    /*======================================
      Sticky Header Js
      ========================================*/

    $(window).scroll(function () {
        if ($(this).scrollTop() > 250) {
            $("#header-sticky").addClass("rs-sticky");
        } else {
            $("#header-sticky").removeClass("rs-sticky");
        }
    });

    /*======================================
      MagnificPopup image view
      ========================================*/
    $(".popup-image").magnificPopup({
        type: "image",
        gallery: {
            enabled: true,
        },
    });

    /*======================================
      MagnificPopup video view
      ========================================*/
    $(".popup-video").magnificPopup({
        type: "iframe",
    });


    /*======================================
      Wow Js
      ========================================*/
    if ($('.wow').length) {
        var wow = new WOW({
            boxClass: 'wow',
            animateClass: 'animated',
            offset: 0,
            mobile: false,
            live: true
        });
        wow.init();
    }


    /*======================================
    Smoth animatio Js
    ========================================*/
    $(document).on('click', '.smoth-animation', function (event) {
        event.preventDefault();
        $('html, body').animate({
            scrollTop: $($.attr(this, 'href')).offset().top - 50
        }, 300);
    });

    // Popup Search Box
    $(".search-open-btn").on("click", function () {
        $(".search__popup").addClass("search-opened");
    });

    $(window).scroll(function () {
        if ($("body").scrollTop() > 0 || $("html").scrollTop() > 0) {
            $(".search__popup").removeClass("search-opened");
        }
    });

    $(".search-close-btn").on("click", function () {
        $(".search__popup").removeClass("search-opened");
    });


    $('.lan-select select, .nice-select-select select').niceSelect();
    $('.take-appointment-3__form-input-select select').niceSelect();


    $('#contact__form').submit(function (event) {
        event.preventDefault();
        var form = $(this);
        $('.loading-form').show();

        setTimeout(function () {
            $.ajax({
                type: form.attr('method'),
                url: form.attr('action'),
                data: form.serialize()
            }).done(function (data) {
                $('.loading-form').hide();
                $('.contact__form').append('<p class="success-message mt-3 mb-0">Your message has been sent successfully.</p>');
            }).fail(function (data) {
                $('.loading-form').hide();
                $('.contact__form').append('<p class="error-message mt-3 mb-0">Something went wrong. Please try again later.</p>');

            });
        }, 1000);
    });

    $('#showlogin').on('click', function () {
        $('#checkout-login').slideToggle(400);
    });
    $('#showcoupon').on('click', function () {
        $('#checkout_coupon').slideToggle(400);
    });


    // Custom Cursor
    $("body").append('<div class="mt-cursor"></div>');
    var cursor = $(".mt-cursor"),
        linksCursor = $("a, .swiper-nav, button, .cursor-effect"),
        crossCursor = $(".cross-cursor");

    $(window).on("mousemove", function (e) {
        cursor.css({
            transform: "translate(" + (e.clientX - 15) + "px," + (e.clientY - 15) + "px)",
            visibility: "inherit",
        });
    });

    // Page Scroll Percentage
    function scrollTopPercentage() {
        const scrollPercentage = () => {
            const scrollTopPos = document.documentElement.scrollTop;
            const calcHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollValue = Math.round((scrollTopPos / calcHeight) * 100);
            const scrollElementWrap = $("#scroll-percentage");

            scrollElementWrap.css("background", `conic-gradient( var(--rr-theme-primary2) ${scrollValue}%, var(--rr-common-white) ${scrollValue}%)`);

            // ScrollProgress
            if (scrollTopPos > 100) {
                scrollElementWrap.addClass("active");
            } else {
                scrollElementWrap.removeClass("active");
            }

            if (scrollValue < 96) {
                $("#scroll-percentage-value").text(`${scrollValue}%`);
            } else {
                $("#scroll-percentage-value").html('<i class="fa-sharp fa-regular fa-arrow-up-long"></i>');
            }
        }
        window.onscroll = scrollPercentage;
        window.onload = scrollPercentage;

        // Back to Top
        function scrollToTop() {
            document.documentElement.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        }

        $("#scroll-percentage").on("click", scrollToTop);
    }

    scrollTopPercentage();


    // Register GSAP plugins
    var device_width = window.screen.width;

    // Pin Active
    var pin_fixed = document.querySelector('.pin-element');
    if (pin_fixed && device_width > 1199) {

        gsap.to(".pin-element", {
            scrollTrigger: {
                trigger: ".pin-area",
                pin: ".pin-element",
                start: "top -45%",
                end: "bottom 90%",
                pinSpacing: false,
            }
        });
    }


    if ($('.pin-area-3').length > 0) {
        let mm = gsap.matchMedia();
        mm.add("(min-width: 768px)", () => {
            return gsap.to('.pin-element_3', {
                opacity: 1,
                scrollTrigger: {
                    trigger: '.pin-area-3',
                    scrub: 1,
                    start: 'top 30%',
                    end: "bottom 100%",
                    pin: '.pin-element_3',
                    pinSpacing: false,
                    markers: false,
                    toggleActions: 'play reverse play reverse',
                }
            });
        });
    }


    // button hover animation
    $('.tp-hover-btn').on('mouseenter', function (e) {
        var x = e.pageX - $(this).offset().left;
        var y = e.pageY - $(this).offset().top;

        $(this).find('.tp-btn-circle-dot').css({
            top: y,
            left: x
        });
    });

    $('.tp-hover-btn').on('mouseout', function (e) {
        var x = e.pageX - $(this).offset().left;
        var y = e.pageY - $(this).offset().top;

        $(this).find('.tp-btn-circle-dot').css({
            top: y,
            left: x
        });
    });



    // jarallax js 
    $('.jarallax').jarallax({
        speed: 0.2,
    });

    var hoverBtns = gsap.utils.toArray(".tp-hover-btn-wrapper");

    const hoverBtnItem = gsap.utils.toArray(".tp-hover-btn-item");
    hoverBtns.forEach((btn, i) => {
        $(btn).mousemove(function (e) {
            callParallax(e);
        });

        function callParallax(e) {
            parallaxIt(e, hoverBtnItem[i], 80);
        }

        function parallaxIt(e, target, movement) {
            var $this = $(btn);
            var relX = e.pageX - $this.offset().left;
            var relY = e.pageY - $this.offset().top;

            gsap.to(target, 0.5, {
                x: ((relX - $this.width() / 2) / $this.width()) * movement,
                y: ((relY - $this.height() / 2) / $this.height()) * movement,
                ease: Power2.easeOut,
            });
        }
        $(btn).mouseleave(function (e) {
            gsap.to(hoverBtnItem[i], 0.5, {
                x: 0,
                y: 0,
                ease: Power2.easeOut,
            });
        });
    });


    //tp-btn-trigger-2
    if ($('.tp-btn-trigger-2').length > 0) {

        gsap.set(".tp-btn-bounce-2", {
            y: -100,
            opacity: 0
        });
        var mybtn = gsap.utils.toArray(".tp-btn-bounce-2");
        mybtn.forEach((btn) => {
            var $this = $(btn);
            gsap.to(btn, {
                scrollTrigger: {
                    trigger: $this.closest('.tp-btn-trigger-2'),
                    start: "top bottom",
                    markers: false
                },
                duration: 1,
                ease: "bounce.out",
                y: 0,
                opacity: 1,
            })
        });
    }

    // button hover animation
    $('.tp-hover-btn').on('mouseenter', function (e) {
        var x = e.pageX - $(this).offset().left;
        var y = e.pageY - $(this).offset().top;

        $(this).find('.tp-btn-circle-dot').css({
            top: y,
            left: x
        });
    });

    $('.tp-hover-btn').on('mouseout', function (e) {
        var x = e.pageX - $(this).offset().left;
        var y = e.pageY - $(this).offset().top;

        $(this).find('.tp-btn-circle-dot').css({
            top: y,
            left: x
        });
    });
    //tp-btn-trigger-2

    gsap.timeline({
        scrollTrigger: {
            trigger: '.tp-portfolio-top-text-border',
            start: 'top center',
            end: 'bottom center',
            scrub: true
        }
    })


    //RUHE Js
    // Home 1 brand slider //
    if (document.querySelectorAll(".h1-brand__slider").length > 0) {
        var swiper = new Swiper(".h1-brand__slider", {
            slidesPerView: 2,
            spaceBetween: 63,
            centeredSlides: true,
            freemode: true,
            centeredSlides: true,
            loop: true,
            speed: 8000,
            allowTouchMove: false,
            autoplay: {
                delay: 1,
                disableOnInteraction: true,
            },
            breakpoints: {
                1199: {
                    spaceBetween: 60,
                },
                992: {
                    spaceBetween: 60,
                },
                768: {
                    spaceBetween: 30,
                },
                576: {
                    spaceBetween: 30,
                },
                320: {
                    spaceBetween: 0,
                },

            },
        });
    }

    // project-h1-brand-slider //
    if (document.querySelectorAll(".project-h1-brand-slider").length > 0) {
        var swiper = new Swiper(".project-h1-brand-slider", {
            slidesPerView: "auto",
            spaceBetween: 0,
            centeredSlides: true,
            centeredSlides: true,
            loop: true,
            speed: 3000,
            allowTouchMove: false,
            autoplay: {
                delay: 1,
                disableOnInteraction: false,
            },
        });
    }


    if (document.querySelector(".testimonial-2__active")) {
        var testimonial = new Swiper(".testimonial-2__active", {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            centeredSlides: false,
            autoplay: true,
            centerMode: true,
            speed: 1000,
            pagination: {
                el: ".testimonial-2__pagination",
            },
            navigation: {
                nextEl: ".testimonial-2__button__next",
                prevEl: ".testimonial-2__button__prev",
            },
        });
    }
    // brand-slider h-2 js 
    if ('.brand-slider-2__active-1') {
        var text_slider = new Swiper(".brand-slider-2__active-1", {
            slidesPerView: 'auto',
            loop: true,
            autoplay: true,
            spaceBetween: 10,
            speed: 20000,
            allowTouchMove: false,
            autoplay: {
                delay: 1,
                reverseDirection: false,
            },
        });
    }

    if ('.brand-slider-2__active-2') {
        var text_slider = new Swiper(".brand-slider-2__active-2", {
            slidesPerView: 'auto',
            loop: true,
            autoplay: true,
            spaceBetween: 10,
            speed: 20000,
            allowTouchMove: false,
            autoplay: {
                delay: 1,
                reverseDirection: false,
            },
        });
    }


    if (document.querySelector(".testimonial__slider")) {
        var testimonial = new Swiper(".testimonial__slider", {
            slidesPerView: 1,
            spaceBetween: 50,
            loop: true,
            centeredSlides: true,
            autoplay: true,
            centerMode: true,
            speed: 1000,
            navigation: {
                prevEl: ".testimonial__slider-arrow-prev",
                nextEl: ".testimonial__slider-arrow-next",
            },
        });
    }

    if (document.querySelector(".testimonial-section-3__active")) {
        var testimonial3 = new Swiper(".testimonial-section-3__active", {
            slidesPerView: 2,
            spaceBetween: 0,
            loop: true,
            centeredSlides: false,
            autoplay: true,
            centerMode: true,
            speed: 1000,
            navigation: {
                prevEl: ".testimonial-section-3__slide__arrow-prev",
                nextEl: ".testimonial-section-3__slide__arrow-next",
            },
            breakpoints: {
                1400: {
                    slidesPerView: 2,
                },
                1200: {
                    slidesPerView: 1.5,
                    centeredSlides: true,
                    centerMode: false,
                },
                992: {
                    slidesPerView: 2,
                },
                768: {
                    slidesPerView: 1.5,
                    centeredSlides: true,
                    centerMode: false,
                },
                576: {
                    slidesPerView: 1,
                },
                320: {
                    slidesPerView: 1,
                },

            },
        });
    }

    if (document.querySelectorAll(".company-history__slide").length > 0) {
        var swiperhistory = new Swiper(".company-history__slide", {
            slidesPerView: 3.7,
            spaceBetween: 30,
            loop: true,
            slidesPerGroupSkip: 3,
            centeredSlides: false,
            autoplay: true,
            centerMode: true,
            speed: 400,
            pagination: {
                el: ".company-history__pagination",
            },
            navigation: {
                prevEl: ".company-history__button-arrow-prev",
                nextEl: ".company-history__button-arrow-next",
            },
            breakpoints: {
                1400: {
                    slidesPerView: 3.7,
                },
                1200: {
                    slidesPerView: 3,
                },
                992: {
                    slidesPerView: 2.5,
                },
                768: {
                    slidesPerView: 2.2,
                },
                576: {
                    slidesPerView: 1.5,
                },
                320: {
                    slidesPerView: 1,
                },

            },
        });
    }

    if (document.querySelectorAll(".rr-title-anim").length > 0) {
        document.addEventListener("DOMContentLoaded", () => {
            let titles = document.querySelectorAll(".rr-title-anim");

            titles.forEach(title => {
                let split = new SplitText(title, { type: "chars, words" });

                let tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: title,
                        start: "top bottom",
                        toggleActions: "play none none reverse",
                        onEnter: () => tl.timeScale(2.3),
                        onLeaveBack: () => tl.timeScale(2.3).reverse()
                    }
                });

                tl.from(split.chars, {
                    opacity: 0,
                    y: 50,
                    rotation: 1,
                    duration: 2,
                    ease: "back",
                    stagger: 0.05
                });
            });
        });
    }

    // img - custom - anim 
    if (document.querySelectorAll(".img-custom-anim-img").length > 0) {
        gsap.utils.toArray(".img-custom-anim-img").forEach((img) => {
            gsap.set(img, { opacity: 0, x: -50, clipPath: "inset(0 100% 0 0)" });

            ScrollTrigger.create({
                trigger: img,
                start: "top 95%",
                end: "bottom 5%",
                toggleActions: "play none none reverse",
                markers: false,
                onEnter: () => {
                    gsap.to(img, {
                        opacity: 1,
                        x: 0,
                        clipPath: "inset(0 0 0 0)",
                        duration: 0.5,
                        ease: "cubic-bezier(0.645, 0.045, 0.355, 1)",
                    });
                },
                onLeaveBack: () => {
                    gsap.to(img, {
                        opacity: 0,
                        x: -50,
                        clipPath: "inset(0 100% 0 0)",
                        duration: 0.3,
                    });
                }
            });
        });
    }


    //fade-top gsap animation
    if (document.querySelectorAll(".fade-wrapper").length > 0) {
        $(".fade-wrapper").each(function () {
            var section = $(this);
            var fadeItems = section.find(".fade-top");

            fadeItems.each(function (index, element) {
                var delay = index * 0.1;

                gsap.set(element, {
                    opacity: 0,
                    y: 70,
                });

                ScrollTrigger.create({
                    trigger: element,
                    start: "top 95%",
                    end: "bottom bottom",
                    scrub: false,
                    toggleActions: "play none none reverse",
                    onEnter: function () {
                        gsap.to(element, {
                            opacity: 1,
                            y: 0,
                            duration: 0.6,
                            delay: delay
                        });
                    },
                    onLeaveBack: function () {
                        gsap.to(element, { opacity: 0, y: 70, duration: 0.5 });
                    }
                });
            });
        });
    }


    /////////////////////////////////////////////////////
    // 55. Service 1 Animation
    //  hover-active

    let rItems1 = document.querySelectorAll('.h1-blog__content');
    let lItems1 = document.querySelectorAll('.h1-blog__item-thumb');

    if (rItems1.length > 0 && lItems1.length > 0) {
        rItems1.forEach((rItem, index) => {
            rItem.addEventListener('mouseenter', function () {
                if (!rItem.classList.contains('active')) {
                    handleHover(rItem, lItems1[index]);
                }
            });
        });

        function handleHover(rItem, lItem) {
            rItems1.forEach(item => {
                item.classList.remove('active');
            });

            lItems1.forEach(item => {
                item.classList.remove('active');
            });

            rItem.classList.add('active');
            lItem.classList.add('active');
        }
    }

    let rItems = document.querySelectorAll('.service-3__item');
    let lItems = document.querySelectorAll('.service-3__img');

    if (rItems.length > 0 && lItems.length > 0) {
        rItems.forEach((rItem, index) => {
            rItem.addEventListener('mouseenter', function () {
                if (!rItem.classList.contains('active')) {
                    handleHover(rItem, lItems[index]);
                }
            });
        });

        function handleHover(rItem, lItem) {
            rItems.forEach(item => {
                item.classList.remove('active');
            });

            lItems.forEach(item => {
                item.classList.remove('active');
            });

            rItem.classList.add('active');
            lItem.classList.add('active');
        }
    }


    // services-inner
    let rightItems = document.querySelectorAll('.services-inner__info__item');
    let leftItems = document.querySelectorAll('.services-image');

    if (rightItems.length > 0 && leftItems.length > 0) {
        rightItems.forEach((rightItem, index) => {
            rightItem.addEventListener('mouseenter', function () {
                handleHover(rightItem, leftItems[index]);
            });
        });

        function handleHover(rightItem, leftItem) {
            rightItems.forEach(item => {
                item.classList.remove('active');
                item.classList.add('services-inner__info__item');
            });

            leftItems.forEach(item => {
                item.classList.remove('active');
                item.classList.add('services-image');
            });

            rightItem.classList.add('active');
            leftItem.classList.add('active');
        }
    }


    // cta bg animation 
    if (document.querySelectorAll(".project-bg-area").length > 0) {
        var tl = gsap.timeline({
            ease: "none",
            scrollTrigger: {
                trigger: ".project-bg-area",
                pin: true,
                pinSpacing: true,
                scrub: 2,
                start: 'bottom 100%',
                end: "bottom 0%",
            }
        });
        tl.to(".project-bg-area .bg-circle", {
            scale: "10",
            width: '100vw',
            height: "100vh",
            delay: 0.1
        });
    }

    // video - 3 Animation 
    if (document.querySelectorAll(".pinned-3").length > 0) {
        const isMobile = window.matchMedia("(max-width: 1700px)").matches;
        if (isMobile) return;

        const tl = gsap.timeline({
            ease: "none",
            scrollTrigger: {
                trigger: ".pinned-3",
                pin: true,
                pinSpacing: false,
                scrub: 1,
                start: "top top",
                endTrigger: ".banner-section-3__video__wrapper",
                end: "bottom bottom",
                markers: false
            }
        });

        tl.to(".pinned-3 #myVideo", {
            scale: 1,
            width: "100vw",
            height: "100vh",
            right: "auto",
            xPercent: "-72",
            transformOrigin: "center center",
            ease: "power2.out"
        });
    }


    // jarallax js 
    $('.jarallax').jarallax({
        speed: 0.2,
    });


    // career-slide js 
    if ('.career-slide-1__active') {
        var text_slider = new Swiper(".career-slide-1__active", {
            slidesPerView: 'auto',
            loop: true,
            autoplay: true,
            spaceBetween: 10,
            speed: 20000,
            allowTouchMove: false,
            autoplay: {
                delay: 1,
                reverseDirection: false,
            },
        });
    }


    // project panel start
    gsap.registerPlugin(ScrollTrigger);

    if (window.innerWidth > 768) {
        let projectPanels = document.querySelectorAll('.project-panel');

        projectPanels.forEach((section) => {
            gsap.to(section, {
                scrollTrigger: {
                    trigger: section,
                    pin: section,
                    scrub: 1,
                    start: 'top top',
                    end: 'bottom bottom',
                    endTrigger: '.project-panel-area',
                    pinSpacing: false,
                    markers: false
                },
            });
        });
    } else {
        console.log("Scroll animation is disabled for mobile devices.");
    }
    // project panel end

    document.querySelectorAll('.award__item').forEach(item => {
        item.addEventListener('mouseover', function () {
            let newImage = this.getAttribute('data-image');
            let imgElement = document.querySelector('.award__thumb img');

            // GSAP fade-out effect
            gsap.to(imgElement, {
                opacity: 0, duration: 0.1, onComplete: function () {
                    imgElement.src = newImage;
                    gsap.to(imgElement, { opacity: 1, duration: 0.1 });
                }
            });
        });
    });


    // banner - section - 2
    if (document.querySelectorAll('.banner-section-2__video__wrapper').length > 0) {
        const container = document.querySelector('.banner-section-2__video__wrapper');
        const video = container.querySelector('.revealer__wrapper');

        let lastX = 0;
        let xPercent = 0;
        let isInView = false;

        const isMobile = window.matchMedia("(max-width: 1400px)").matches;
        if (isMobile) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio === 1) {
                    isInView = true;
                } else {
                    isInView = false;
                    xPercent = 0;
                    gsap.to(video, {
                        xPercent: 0,
                        duration: 0.8,
                        ease: "power3.out"
                    });
                }
            });
        }, {
            threshold: 1,
            rootMargin: "-30px 0px 0px 0px"
        });

        observer.observe(container);

        container.addEventListener('mousemove', (e) => {
            if (!isInView) return;

            const rect = container.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;

            let delta = mouseX - lastX;
            lastX = mouseX;

            let deltaPercent = (delta / rect.width) * 250;
            xPercent += deltaPercent;

            xPercent = Math.max(Math.min(xPercent, 45), -205);

            gsap.to(video, {
                xPercent: xPercent,
                duration: 0.8,
                ease: "power2.out"
            });
        });
    }

    // banner - section - 2
    if (document.querySelectorAll(".pinned").length > 0) {
        if (window.matchMedia("(min-width: 1400px)").matches) {

            var tl = gsap.timeline({
                ease: "none",
                scrollTrigger: {
                    trigger: ".pinned",
                    pin: true,
                    pinSpacing: false,
                    scrub: 2,
                    start: 'top top',
                    endTrigger: ".whitespace",
                    end: "bottom bottom",
                    markers: false,
                }
            });

            tl.to(".pinned .revealer", {
                width: '100vw',
                height: "100vh",
                x: "32px",
                delay: 0.1,
                transformOrigin: "center center",
            });
        }
    }


    document.querySelectorAll(".scroll-btn").forEach((btn, index) => {
        btn.addEventListener("click", () => {
            var sectionTarget = btn.getAttribute("data-target");
            gsap.to(window, { duration: 1, scrollTo: { y: sectionTarget, offsetY: 70 } });
        });
    });



})(jQuery);