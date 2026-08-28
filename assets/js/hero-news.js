/* =========================================================
   MUHAMMAD SOHAIL AKHTAR
   HERO NEWS CAROUSEL
   Mathematics • AI • Autonomous Systems

   Features:
   - Automatic rotation
   - Previous / Next navigation
   - Clickable dots
   - Pause on hover
   - Resume after hover
   - Progress indicator
   - Keyboard navigation
   - Touch / swipe support
   - Reduced-motion support
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       01. SELECT HERO NEWS ELEMENTS
       ===================================================== */

    const newsSection = document.querySelector(".hero-news");

    /*
     * If the news section does not exist on the page,
     * safely stop the script.
     */
    if (!newsSection) {
        return;
    }


    const newsItems = Array.from(
        newsSection.querySelectorAll(".hero-news-item")
    );

    const dots = Array.from(
        newsSection.querySelectorAll(".hero-news-dot")
    );

    const previousButton =
        newsSection.querySelector(".hero-news-arrow.prev");

    const nextButton =
        newsSection.querySelector(".hero-news-arrow.next");

    const progressBar =
        newsSection.querySelector(".hero-news-progress-bar");


    /* =====================================================
       02. BASIC VALIDATION
       ===================================================== */

    if (newsItems.length === 0) {
        return;
    }


    /* =====================================================
       03. CAROUSEL SETTINGS
       ===================================================== */

    const AUTOPLAY_DURATION = 6500;

    let currentIndex = 0;

    let autoplayTimer = null;

    let progressTimer = null;

    let isPaused = false;


    /* =====================================================
       04. REDUCED MOTION
       ===================================================== */

    const prefersReducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    /* =====================================================
       05. UPDATE NEWS ITEM
       ===================================================== */

    function updateNews(index) {

        /*
         * Keep index inside valid range.
         */
        if (index < 0) {
            index = newsItems.length - 1;
        }

        if (index >= newsItems.length) {
            index = 0;
        }

        currentIndex = index;


        /* -------------------------------------------------
           UPDATE NEWS ITEMS
           ------------------------------------------------- */

        newsItems.forEach((item, itemIndex) => {

            const isActive =
                itemIndex === currentIndex;

            item.classList.toggle(
                "active",
                isActive
            );

            item.setAttribute(
                "aria-hidden",
                isActive ? "false" : "true"
            );

        });


        /* -------------------------------------------------
           UPDATE DOTS
           ------------------------------------------------- */

        dots.forEach((dot, dotIndex) => {

            const isActive =
                dotIndex === currentIndex;

            dot.classList.toggle(
                "active",
                isActive
            );

            dot.setAttribute(
                "aria-selected",
                isActive ? "true" : "false"
            );

        });


        /* -------------------------------------------------
           RESTART PROGRESS
           ------------------------------------------------- */

        resetProgress();

    }


    /* =====================================================
       06. NEXT NEWS
       ===================================================== */

    function showNext() {

        updateNews(
            currentIndex + 1
        );

    }


    /* =====================================================
       07. PREVIOUS NEWS
       ===================================================== */

    function showPrevious() {

        updateNews(
            currentIndex - 1
        );

    }


    /* =====================================================
       08. AUTOPLAY
       ===================================================== */

    function startAutoplay() {

        /*
         * Do not autoplay if the user prefers
         * reduced motion.
         */
        if (prefersReducedMotion) {
            return;
        }


        stopAutoplay();


        autoplayTimer = setInterval(() => {

            if (!isPaused) {
                showNext();
            }

        }, AUTOPLAY_DURATION);

    }


    /* =====================================================
       09. STOP AUTOPLAY
       ===================================================== */

    function stopAutoplay() {

        if (autoplayTimer) {

            clearInterval(
                autoplayTimer
            );

            autoplayTimer = null;
        }

    }


    /* =====================================================
       10. PROGRESS BAR
       ===================================================== */

    function startProgress() {

        if (!progressBar) {
            return;
        }


        /*
         * Reduced-motion users do not need
         * animated progress.
         */
        if (prefersReducedMotion) {

            progressBar.style.width = "0%";

            return;
        }


        let startTime = performance.now();


        function animateProgress(currentTime) {

            /*
             * Stop if the page has changed state.
             */
            if (isPaused) {
                progressTimer = null;
                return;
            }


            const elapsed =
                currentTime - startTime;


            const percentage =
                Math.min(
                    (elapsed / AUTOPLAY_DURATION) * 100,
                    100
                );


            progressBar.style.width =
                `${percentage}%`;


            if (percentage < 100) {

                progressTimer =
                    requestAnimationFrame(
                        animateProgress
                    );

            } else {

                progressTimer = null;
            }

        }


        progressTimer =
            requestAnimationFrame(
                animateProgress
            );

    }


    /* =====================================================
       11. RESET PROGRESS
       ===================================================== */

    function resetProgress() {

        if (!progressBar) {
            return;
        }


        if (progressTimer) {

            cancelAnimationFrame(
                progressTimer
            );

            progressTimer = null;
        }


        progressBar.style.width = "0%";


        if (!isPaused) {
            startProgress();
        }

    }


    /* =====================================================
       12. PAUSE CAROUSEL
       ===================================================== */

    function pauseCarousel() {

        isPaused = true;


        if (progressTimer) {

            cancelAnimationFrame(
                progressTimer
            );

            progressTimer = null;
        }

    }


    /* =====================================================
       13. RESUME CAROUSEL
       ===================================================== */

    function resumeCarousel() {

        isPaused = false;

        resetProgress();

    }


    /* =====================================================
       14. DOT CLICK EVENTS
       ===================================================== */

    dots.forEach((dot, index) => {

        dot.addEventListener(
            "click",
            () => {

                updateNews(index);

                /*
                 * Restart autoplay after manual
                 * interaction.
                 */
                if (!prefersReducedMotion) {
                    startAutoplay();
                }

            }
        );

    });


    /* =====================================================
       15. NEXT BUTTON
       ===================================================== */

    if (nextButton) {

        nextButton.addEventListener(
            "click",
            () => {

                showNext();

                if (!prefersReducedMotion) {
                    startAutoplay();
                }

            }
        );

    }


    /* =====================================================
       16. PREVIOUS BUTTON
       ===================================================== */

    if (previousButton) {

        previousButton.addEventListener(
            "click",
            () => {

                showPrevious();

                if (!prefersReducedMotion) {
                    startAutoplay();
                }

            }
        );

    }


    /* =====================================================
       17. PAUSE ON HOVER
       ===================================================== */

    newsSection.addEventListener(
        "mouseenter",
        pauseCarousel
    );


    /* =====================================================
       18. RESUME AFTER HOVER
       ===================================================== */

    newsSection.addEventListener(
        "mouseleave",
        resumeCarousel
    );


    /* =====================================================
       19. KEYBOARD NAVIGATION
       ===================================================== */

    newsSection.addEventListener(
        "keydown",
        (event) => {

            switch (event.key) {

                case "ArrowRight":

                    event.preventDefault();

                    showNext();

                    if (!prefersReducedMotion) {
                        startAutoplay();
                    }

                    break;


                case "ArrowLeft":

                    event.preventDefault();

                    showPrevious();

                    if (!prefersReducedMotion) {
                        startAutoplay();
                    }

                    break;


                case "Home":

                    event.preventDefault();

                    updateNews(0);

                    if (!prefersReducedMotion) {
                        startAutoplay();
                    }

                    break;


                case "End":

                    event.preventDefault();

                    updateNews(
                        newsItems.length - 1
                    );

                    if (!prefersReducedMotion) {
                        startAutoplay();
                    }

                    break;

            }

        }
    );


    /* =====================================================
       20. TOUCH / SWIPE SUPPORT
       ===================================================== */

    let touchStartX = 0;

    let touchEndX = 0;

    const SWIPE_THRESHOLD = 50;


    newsSection.addEventListener(
        "touchstart",
        (event) => {

            touchStartX =
                event.changedTouches[0].screenX;

        },
        {
            passive: true
        }
    );


    newsSection.addEventListener(
        "touchend",
        (event) => {

            touchEndX =
                event.changedTouches[0].screenX;


            handleSwipe();

        },
        {
            passive: true
        }
    );


    function handleSwipe() {

        const difference =
            touchEndX - touchStartX;


        /*
         * Swipe left → next
         */
        if (
            difference < -SWIPE_THRESHOLD
        ) {

            showNext();

            if (!prefersReducedMotion) {
                startAutoplay();
            }

        }


        /*
         * Swipe right → previous
         */
        else if (
            difference > SWIPE_THRESHOLD
        ) {

            showPrevious();

            if (!prefersReducedMotion) {
                startAutoplay();
            }

        }

    }


    /* =====================================================
       21. PAGE VISIBILITY
       ===================================================== */

    document.addEventListener(
        "visibilitychange",
        () => {

            if (
                document.hidden
            ) {

                stopAutoplay();

            } else {

                if (
                    !prefersReducedMotion
                ) {

                    startAutoplay();

                }

                resetProgress();

            }

        }
    );


    /* =====================================================
       22. INITIAL STATE
       ===================================================== */

    updateNews(0);


    /* =====================================================
       23. START AUTOPLAY
       ===================================================== */

    if (!prefersReducedMotion) {

        startAutoplay();

    }


    /* =====================================================
       24. DEBUG MESSAGE
       ===================================================== */

    console.log(
        `Hero News initialized: ${newsItems.length} items`
    );

});
