// Wait for page to load
document.addEventListener('DOMContentLoaded', function() {
    
    // Get all the elements we need
    const navbar = document.getElementById('navbar');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const loader = document.getElementById('loader');
    const loaderElem = document.getElementById('loader-elem');
    const loaderText = document.getElementById('loader-text');
    const contactForm = document.querySelector('.contact-form');
    const ctaButton = document.querySelector('.cta-button');
    const allNavLinks = document.querySelectorAll('.nav-links a');
    
    // ========== LOADER ANIMATION WITH GSAP ==========
    function startLoaderAnimation() {
        // Split text into individual letters for animation
        const text = loaderText.textContent;
        loaderText.innerHTML = "";
        
        // Create spans for each letter
        text.split("").forEach(letter => {
            const span = document.createElement("span");
            span.classList.add("letter");
            span.textContent = letter === " " ? "\u00A0" : letter; // Non-breaking space
            loaderText.appendChild(span);
        });

        // GSAP Timeline for smooth animations
        const tl = gsap.timeline();
        
        tl.to(".letter", {
            opacity: 1,
            x: 0,
            duration: 0.1,
            stagger: 0.05, // Animate letters one by one
            ease: "power2.out"
        })
        .to("#loader-elem", {
            height: "100%",
            duration: 1,
            delay: 0.5,
            ease: "expo.inOut"
        })
        .to("#loader", {
            y: "-100%",
            duration: 1.5,
            delay: -1,
            ease: "expo.inOut"
        })
        .to("#loader-elem", {
            y: "-100%",
            duration: 1.5,
            delay: -1.3,
            ease: "expo.inOut"
        })
        .call(() => {
            // Show navbar after loader finishes
            navbar.classList.add('show');
            loader.style.display = 'none';
            loaderElem.style.display = 'none';
        });
    }

    // ========== SMOOTH SCROLLING ==========
    function smoothScrollTo(target) {
        if (!target) return;
        
        const navbarHeight = navbar.offsetHeight || 0;
        const targetPosition = target.offsetTop - navbarHeight;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }

    // ========== MOBILE MENU TOGGLE ==========
    function toggleMobileMenu() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    }

    // ========== NAVIGATION CLICK HANDLER ==========
    function handleNavClick(e) {
        const href = e.target.getAttribute('href');
        
        // Only handle internal links (starting with #)
        if (!href || !href.startsWith('#')) return;
        
        e.preventDefault();
        
        // Close mobile menu if open
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        
        // Scroll to section
        const target = document.querySelector(href);
        smoothScrollTo(target);
    }

    // ========== ACTIVE NAV LINK HIGHLIGHTING ==========
    function updateActiveNavLink() {
        const scrollPosition = window.scrollY + 100;
        const sections = document.querySelectorAll('.section, #home');

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                // Remove active class from all links
                allNavLinks.forEach(link => link.classList.remove('active'));
                
                // Add active class to current section link
                const activeLink = document.querySelector(`.nav-links a[href="#${section.id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }

    // ========== CONTACT FORM HANDLER ==========
    function handleContactForm(e) {
        e.preventDefault();
        
        // Get form inputs
        const inputs = e.target.querySelectorAll('input, textarea');
        const name = inputs[0].value.trim();
        const email = inputs[1].value.trim();
        const message = inputs[2].value.trim();
        
        // Simple validation
        if (!name || !email || !message) {
            alert('Please fill in all fields.');
            return;
        }
        
        const submitButton = e.target.querySelector('.submit-button');
        const originalText = submitButton.textContent;
        
        // Show loading state
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        // Simulate sending (replace with real form submission)
        setTimeout(() => {
            submitButton.textContent = 'Message Sent!';
            
            // Reset after 2 seconds
            setTimeout(() => {
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                e.target.reset();
            }, 2000);
        }, 1000);
    }

    // ========== CTA BUTTON HANDLER ==========
    function handleCTAClick() {
        const workSection = document.getElementById('work');
        smoothScrollTo(workSection);
    }

    // ========== SCROLL ANIMATIONS ==========
    function initScrollAnimations() {
        // Simple scroll animations for sections
        const sections = document.querySelectorAll('.section');
        
        // Set initial state for animations
        sections.forEach(section => {
            if (section.id !== 'home') {
                gsap.set(section, {
                    opacity: 0,
                    y: 30
                });
            }
        });

        // Animate sections when they come into view
        sections.forEach(section => {
            if (section.id !== 'home') {
                gsap.to(section, {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: section,
                        start: "top 80%",
                        once: true // Only animate once
                    }
                });
            }
        });
    }

    // ========== INITIALIZE SWIPER FOR WORK SECTION ==========
    function initSwiper() {
        const swiper = new Swiper('.work-swiper', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        });
    }

    // ========== LOCOMOTIVE SCROLL INITIALIZATION ==========
    function initSmoothScroll() {
        const scroll = new LocomotiveScroll({
            el: document.querySelector("#main"),
            smooth: true
        });
        
        // Update ScrollTrigger when Locomotive Scroll updates
        scroll.on("scroll", ScrollTrigger.update);
        
        // Tell ScrollTrigger to use these proxy methods
        ScrollTrigger.scrollerProxy("#main", {
            scrollTop(value) {
                return arguments.length ? scroll.scrollTo(value, 0, 0) : scroll.scroll.instance.scroll.y;
            },
            getBoundingClientRect() {
                return {top: 0, left: 0, width: window.innerWidth, height: window.innerHeight};
            },
            pinType: document.querySelector("#main").style.transform ? "transform" : "fixed"
        });
        
        // Refresh ScrollTrigger and update LocomotiveScroll
        ScrollTrigger.addEventListener("refresh", () => scroll.update());
        ScrollTrigger.refresh();
    }

    // ========== EVENT LISTENERS ==========
    
    // Hamburger menu click
    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }

    // Navigation links click
    allNavLinks.forEach(link => {
        link.addEventListener('click', handleNavClick);
    });

    // Contact form submit
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }

    // CTA button click
    if (ctaButton) {
        ctaButton.addEventListener('click', handleCTAClick);
    }

    // Scroll event for active nav link
    window.addEventListener('scroll', updateActiveNavLink);

    // Close mobile menu on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        }
    });

    // ========== INITIALIZE EVERYTHING ==========
    
    // Start loader animation
    startLoaderAnimation();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize Swiper
    initSwiper();
    
    // Initialize smooth scroll
    initSmoothScroll();
    
    // Set initial active nav link
    updateActiveNavLink();
    
    console.log('Portfolio initialized successfully!');
});

// ========== CLEANUP ON PAGE UNLOAD ==========
window.addEventListener('beforeunload', () => {
    // Clean up any animations or intervals if needed
    console.log('Cleaning up...');
});