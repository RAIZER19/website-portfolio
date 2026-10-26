
// =====================================================
// CARL QUIAMBAO — DEVELOPER PORTFOLIO
// Interactive features
// =====================================================


/* =========================================
   SCROLL REVEAL ANIMATIONS
   ========================================= */

(() => {
    // Find the content elements we want to animate.
    const revealSelectors = [
        ".section-heading",
        ".project-card",
        ".skill-card",
        ".skill-item",
        ".timeline-item",
        ".experience-item",
        ".education-card",
        ".contact-card",
        ".about-card"
    ];

    const revealElements = document.querySelectorAll(
        revealSelectors.join(", ")
    );

    // Do nothing if this page has no matching elements.
    if (!revealElements.length) return;

    // Make sure the browser supports scroll observation.
    if (!("IntersectionObserver" in window)) return;

    // Prepare elements before enabling the reveal styles.
    revealElements.forEach((element) => {
        element.classList.add("reveal-item");
    });

    // Add a small delay between cards in the same group.
    const staggerGroups = [
        ".projects-grid",
        ".skills-grid",
        ".experience-list",
        ".education-grid"
    ];

    staggerGroups.forEach((selector) => {
        document.querySelectorAll(selector).forEach((group) => {
            const children = Array.from(group.children).filter(
                (child) => child.classList.contains("reveal-item")
            );

            children.forEach((child, index) => {
                // Keep the stagger subtle, even in larger groups.
                const delay = Math.min(index * 100, 300);
                child.style.setProperty(
                    "--reveal-delay",
                    `${delay}ms`
                );
            });
        });
    });

    // Enable the CSS reveal styles only after setup.
    document.documentElement.classList.add("js-reveal-ready");

    // Reveal content as it approaches the viewport.
    const observer = new IntersectionObserver(
        (entries, currentObserver) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");

                    // Animate each element only once.
                    currentObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -40px 0px"
        }
    );

    revealElements.forEach((element) => {
        observer.observe(element);
    });
})();


document.addEventListener("DOMContentLoaded", () => {
    // -------------------------------------------------
    // MOBILE NAVIGATION
    // -------------------------------------------------

    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");
    const navigationItems = navLinks
        ? navLinks.querySelectorAll('a[href^="#"]')
        : [];

    function closeMenu() {
        if (!menuToggle || !navLinks) return;

        navLinks.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
    }

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            const isOpen = navLinks.classList.toggle("is-open");

            menuToggle.setAttribute("aria-expanded", String(isOpen));
            menuToggle.setAttribute(
                "aria-label",
                isOpen ? "Close navigation menu" : "Open navigation menu"
            );
        });

        navigationItems.forEach((link) => {
            link.addEventListener("click", closeMenu);
        });

        // Close the menu when clicking outside it.
        document.addEventListener("click", (event) => {
            const clickedInsideNavigation =
                navLinks.contains(event.target) ||
                menuToggle.contains(event.target);

            if (!clickedInsideNavigation) {
                closeMenu();
            }
        });

        // Close the mobile menu when returning to desktop width.
        window.addEventListener("resize", () => {
            if (window.innerWidth > 780) {
                closeMenu();
            }
        });

        // Allow Escape to close the mobile menu.
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                closeMenu();
                menuToggle.focus();
            }
        });
    }

    // -------------------------------------------------
    // AUTOMATIC COPYRIGHT YEAR
    // -------------------------------------------------

    const currentYear = document.getElementById("currentYear");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    // =========================================
    // CONTACT: COPY EMAIL
    // =========================================

    const copyEmailButton = document.getElementById("copyEmail");
    const copyFeedback = document.getElementById("copyFeedback");
    const copyButtonText = document.getElementById("copyButtonText");

    if (copyEmailButton && copyFeedback && copyButtonText) {
        let feedbackTimeout;

        copyEmailButton.addEventListener("click", async () => {
            const email = copyEmailButton.dataset.email;

            if (!email) {
                copyFeedback.textContent = "Email address is unavailable.";
                return;
            }

            clearTimeout(feedbackTimeout);

            try {
                await navigator.clipboard.writeText(email);

                copyFeedback.textContent = "Email address copied successfully!";
                copyButtonText.textContent = "Copied!";
            } catch (error) {
                // Fallback for browsers where Clipboard API access fails.
                const temporaryInput = document.createElement("textarea");

                temporaryInput.value = email;
                temporaryInput.setAttribute("readonly", "");
                temporaryInput.style.position = "fixed";
                temporaryInput.style.opacity = "0";

                document.body.appendChild(temporaryInput);

                temporaryInput.select();
                temporaryInput.setSelectionRange(0, temporaryInput.value.length);

                let copied = false;

                try {
                    copied = document.execCommand("copy");
                } catch (fallbackError) {
                    copied = false;
                }

                temporaryInput.remove();

                if (copied) {
                    copyFeedback.textContent = "Email address copied successfully!";
                    copyButtonText.textContent = "Copied!";
                } else {
                    copyFeedback.textContent =
                        "Copy failed. Please copy the email address from the contact panel.";
                }
            }

            feedbackTimeout = setTimeout(() => {
                copyFeedback.textContent = "";
                copyButtonText.textContent = "Copy Email";
            }, 3500);
        });
    }

    // -------------------------------------------------
    // ACTIVE NAVIGATION HIGHLIGHT
    // -------------------------------------------------

    const pageSections = document.querySelectorAll("main section[id]");
    const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

    if ("IntersectionObserver" in window && pageSections.length > 0) {
        const sectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    const sectionId = entry.target.id;

                    navAnchors.forEach((link) => {
                        const isActive =
                            link.getAttribute("href") === `#${sectionId}`;

                        if (isActive) {
                            link.setAttribute("aria-current", "location");
                        } else {
                            link.removeAttribute("aria-current");
                        }
                    });
                });
            },
            {
                rootMargin: "-25% 0px -60% 0px",
                threshold: 0
            }
        );

        pageSections.forEach((section) => {
            sectionObserver.observe(section);
        });
    }

    // -------------------------------------------------
    // LOG INITIALIZATION
    // -------------------------------------------------

    console.info("Carl Quiambao's portfolio is ready.");
});
