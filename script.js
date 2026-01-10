document.addEventListener('DOMContentLoaded', function() {
    // ==== HOMEPAGE ====
    const homepage = document.querySelector('.homepage');
    if (homepage) {
        const cursorTrail = document.getElementById('cursor-trail');

        // Array of gallery images
        const galleryImages = [
            'Images/Gallery/Group 12.png',
            'Images/Gallery/Group 13.png',
            'Images/Gallery/Group 14.png',
            'Images/Gallery/Group 15.png',
            'Images/Gallery/Group 16.png',
            'Images/Gallery/Group 17.png',
            'Images/Gallery/Group 18.png',
            'Images/Gallery/Group 19.png',
            'Images/Gallery/Group 20.png',
            'Images/Gallery/Group 21.png',
            'Images/Gallery/Group 22.png',
            'Images/Gallery/Group 23.png',
            'Images/Gallery/Group 24.png',
            'Images/Gallery/Group 25.png',
            'Images/Gallery/Group 26.png',
            'Images/Gallery/Group 27.png',
            'Images/Gallery/Group 28.png',
            'Images/Gallery/Group 29.png',
            'Images/Gallery/Group 30.png',
            'Images/Gallery/Group 31.png',
            'Images/Gallery/Group 32.png',
            'Images/Gallery/Group 33.png',
            'Images/Gallery/Group 34.png',
            'Images/Gallery/Group 35.png',
            'Images/Gallery/Group 36.png',
            'Images/Gallery/Group 38.png',
            'Images/Gallery/Group 39.png',
            'Images/Gallery/Group 40.png',
            'Images/Gallery/Group 41.png',
            'Images/Gallery/Group 42.png',
            'Images/Gallery/Group 43.png',
            'Images/Gallery/Group 47.png'
        ];

        let currentImageIndex = 0;
        let lastImageTime = 0;
        const separationTime = 60;

        // Track cursor movement for center text reveal
        let totalMovement = 0;
        let lastX = 0;
        let lastY = 0;
        let hasShownText = false;
        const movementThreshold = 5000; // pixels of movement
        const centerText = document.getElementById('centerText');

        // Check if device is mobile/touch
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;

        // Function to create image at specific position
        function createImageAt(x, y) {
            const img = document.createElement('img');
            img.src = galleryImages[currentImageIndex];
            img.className = 'cursor-image';
            img.style.left = (x - 50) + 'px';
            img.style.top = (y - 50) + 'px';
            img.style.opacity = '1';

            cursorTrail.appendChild(img);

            setTimeout(function() {
                img.style.opacity = '0';
                setTimeout(function() {
                    img.remove();
                }, 1000);
            }, 500);

            currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
        }

        // Mobile touch drawing interaction
        if (isMobile) {
            let isTouching = false;
            let touchReleased = false;
            const mobileMovementThreshold = 800; // Minimum drawing before text appears
            const drawPrompt = document.getElementById('drawPrompt');

            homepage.addEventListener('touchstart', function(e) {
                isTouching = true;
                const touch = e.touches[0];
                lastX = touch.clientX;
                lastY = touch.clientY;

                // Hide "draw here" prompt on first touch
                if (drawPrompt && drawPrompt.style.opacity !== '0') {
                    gsap.to(drawPrompt, {
                        opacity: 0,
                        duration: 0.5,
                        ease: 'power2.out'
                    });
                }
            }, { passive: true });

            homepage.addEventListener('touchmove', function(e) {
                if (!isTouching) return;

                const touch = e.touches[0];
                const currentTime = Date.now();

                // Track movement distance
                if (lastX !== 0 && lastY !== 0) {
                    const dx = touch.clientX - lastX;
                    const dy = touch.clientY - lastY;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    totalMovement += distance;
                }

                // Create image trail while drawing
                if (currentTime - lastImageTime >= separationTime) {
                    createImageAt(touch.clientX, touch.clientY);
                    lastImageTime = currentTime;
                }

                lastX = touch.clientX;
                lastY = touch.clientY;
            }, { passive: true });

            homepage.addEventListener('touchend', function(e) {
                isTouching = false;

                // Show text when user releases touch (if they drew enough)
                if (!hasShownText && !touchReleased && totalMovement >= mobileMovementThreshold) {
                    touchReleased = true;

                    // Small delay to let last images appear
                    setTimeout(function() {
                        gsap.to(centerText, {
                            opacity: 1,
                            duration: 1.5,
                            ease: 'power2.out'
                        });
                        hasShownText = true;

                        setTimeout(function() {
                            gsap.to(centerText, {
                                opacity: 0,
                                duration: 0.5,
                                ease: 'power2.out',
                                onComplete: function() {
                                    centerText.innerHTML = '<span class="bold-text">click</span> to know more';
                                    gsap.to(centerText, {
                                        opacity: 1,
                                        duration: 1,
                                        ease: 'power2.out'
                                    });
                                }
                            });
                        }, 1500);
                    }, 300);
                }
            }, { passive: true });
        }

        // Cursor trail animation for desktop
        if (!isMobile) {
            let cursorStopTimer = null;
            let hasMovedEnough = false;
            const minMovementForText = 500; // Minimum movement before text can appear

            homepage.addEventListener('mousemove', function(e) {
                const currentTime = Date.now();

                // Track total cursor movement
                if (lastX !== 0 && lastY !== 0) {
                    const dx = e.clientX - lastX;
                    const dy = e.clientY - lastY;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    totalMovement += distance;

                    // Mark that user has moved enough
                    if (totalMovement >= minMovementForText) {
                        hasMovedEnough = true;
                    }
                }
                lastX = e.clientX;
                lastY = e.clientY;

                // Create image trail
                if (currentTime - lastImageTime >= separationTime) {
                    createImageAt(e.clientX, e.clientY);
                    lastImageTime = currentTime;
                }

                // Clear previous timer
                if (cursorStopTimer) {
                    clearTimeout(cursorStopTimer);
                }

                // Set timer to detect when cursor stops
                if (!hasShownText && hasMovedEnough) {
                    cursorStopTimer = setTimeout(function() {
                        // Cursor has stopped moving, show text
                        gsap.to(centerText, {
                            opacity: 1,
                            duration: 1.5,
                            ease: 'power2.out'
                        });
                        hasShownText = true;

                        // Change text after 2 seconds
                        setTimeout(function() {
                            gsap.to(centerText, {
                                opacity: 0,
                                duration: 0.5,
                                ease: 'power2.out',
                                onComplete: function() {
                                    centerText.innerHTML = '<span class="bold-text">click</span> to know more';
                                    gsap.to(centerText, {
                                        opacity: 1,
                                        duration: 1,
                                        ease: 'power2.out'
                                    });
                                }
                            });
                        }, 2000);
                    }, 800); // Wait 800ms after cursor stops
                }
            });
        }

        // Click to go to About page
        homepage.addEventListener('click', function() {
            // On mobile, only allow click after text has appeared
            if (isMobile && !hasShownText) {
                return;
            }
            window.location.href = 'about.html';
        });
    }

    // ==== ABOUT PAGE ====
    const aboutPage = document.querySelector('.about-page');
    if (aboutPage) {
        const intro = aboutPage.querySelector('.intro');
        const infoColumns = aboutPage.querySelector('.info-columns');

        // Fade in animations
        if (intro) {
            gsap.to(intro, {
                opacity: 1,
                duration: 1.2,
                ease: 'power2.out',
                delay: 0.1
            });
        }

        if (infoColumns) {
            gsap.to(infoColumns, {
                opacity: 1,
                duration: 1.2,
                ease: 'power2.out',
                delay: 0.3
            });
        }

        // Click to go to Projects page (desktop only)
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
        if (!isMobile) {
            aboutPage.addEventListener('click', function() {
                window.location.href = 'projects.html';
            });
        }
    }

    // ==== PROJECTS PAGE ====
    const projectsGrid = document.querySelector('.projects-grid');
    if (projectsGrid) {
        gsap.to(projectsGrid, {
            opacity: 1,
            duration: 1.2,
            ease: 'power2.out',
            delay: 0.2
        });

        // Video hover play functionality
        const videoItems = projectsGrid.querySelectorAll('.project-video');
        videoItems.forEach(item => {
            const video = item.querySelector('video');
            if (video) {
                item.addEventListener('mouseenter', () => {
                    video.play();
                });
                item.addEventListener('mouseleave', () => {
                    video.pause();
                    video.currentTime = 0;
                });
            }
        });

        // Freeze GIF functionality
        const projectItems = projectsGrid.querySelectorAll('.project-item');
        projectItems.forEach(item => {
            const gifImage = item.querySelector('img[src$=".gif"]');
            if (gifImage && !item.classList.contains('project-hover-swap')) {
                const originalSrc = gifImage.src;
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                // Create a frozen version of the GIF
                const freezeGif = () => {
                    canvas.width = gifImage.naturalWidth || gifImage.width;
                    canvas.height = gifImage.naturalHeight || gifImage.height;
                    ctx.drawImage(gifImage, 0, 0);
                    gifImage.dataset.originalSrc = originalSrc;
                    gifImage.src = canvas.toDataURL('image/png');
                };

                // Wait for image to load before freezing
                if (gifImage.complete) {
                    freezeGif();
                } else {
                    gifImage.addEventListener('load', freezeGif);
                }

                // Play GIF on hover
                item.addEventListener('mouseenter', () => {
                    if (gifImage.dataset.originalSrc) {
                        gifImage.src = gifImage.dataset.originalSrc;
                    }
                });

                // Freeze GIF when hover ends
                item.addEventListener('mouseleave', () => {
                    if (gifImage.dataset.originalSrc) {
                        freezeGif();
                    }
                });
            }
        });
    }

    // ==== PROJECT DETAIL GALLERY ====
    const projectGallery = document.getElementById('projectGallery');
    const galleryCursor = document.getElementById('galleryCursor');

    if (projectGallery && galleryCursor) {
        const slides = projectGallery.querySelectorAll('.gallery-slide');
        let currentSlide = 0;
        const totalSlides = slides.length;

        function updateCursor() {
            galleryCursor.textContent = `${currentSlide + 1}/${totalSlides}`;
        }

        function nextSlide() {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % totalSlides;
            slides[currentSlide].classList.add('active');
            updateCursor();
        }

        function prevSlide() {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            slides[currentSlide].classList.add('active');
            updateCursor();
        }

        projectGallery.addEventListener('mousemove', function(e) {
            galleryCursor.style.left = e.clientX + 15 + 'px';
            galleryCursor.style.top = e.clientY + 15 + 'px';
        });

        projectGallery.addEventListener('click', function(e) {
            const rect = projectGallery.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const galleryWidth = rect.width;

            if (clickX > galleryWidth / 2) {
                nextSlide();
            } else {
                prevSlide();
            }
        });

        // Touch/swipe navigation for mobile
        let touchStartX = 0;
        let touchEndX = 0;

        projectGallery.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        }, false);

        projectGallery.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, false);

        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
        }

        updateCursor();
    }

    // ==== CONTACT PAGE ====
    const contactPage = document.querySelector('.contact-page');
    if (contactPage) {
        const formGroups = contactPage.querySelectorAll('.form-group');
        const submitBtn = contactPage.querySelector('.submit-btn');

        // Staggered fade-in for form groups and line trace animation
        formGroups.forEach((group, index) => {
            const inputLine = group.querySelector('.input-line');
            const baseDelay = 0.1 + (index * 0.2);

            // Fade in the form group (label + input)
            gsap.to(group, {
                opacity: 1,
                duration: 1.4,
                ease: 'sine.out',
                delay: baseDelay
            });

            // Trace the line from left to right
            if (inputLine) {
                gsap.to(inputLine, {
                    scaleX: 1,
                    duration: 1,
                    ease: 'sine.inOut',
                    delay: baseDelay + 0.3
                });
            }
        });

        // Fade in submit button after form groups
        if (submitBtn) {
            gsap.to(submitBtn, {
                opacity: 1,
                duration: 1.4,
                ease: 'sine.out',
                delay: 0.1 + (formGroups.length * 0.2) + 0.3
            });

            // Thank you popup animation on click
            const thankYouPopup = document.querySelector('.thank-you-popup');
            const thankYouImage = document.querySelector('.thank-you-image');

            // Gallery images for random selection
            const galleryImages = [
                'Images/Gallery/Group 12.png',
                'Images/Gallery/Group 13.png',
                'Images/Gallery/Group 14.png',
                'Images/Gallery/Group 15.png',
                'Images/Gallery/Group 16.png',
                'Images/Gallery/Group 17.png',
                'Images/Gallery/Group 18.png',
                'Images/Gallery/Group 19.png',
                'Images/Gallery/Group 20.png',
                'Images/Gallery/Group 21.png',
                'Images/Gallery/Group 22.png',
                'Images/Gallery/Group 23.png',
                'Images/Gallery/Group 24.png',
                'Images/Gallery/Group 25.png'
            ];

            submitBtn.addEventListener('click', function(e) {
                // Get button position
                const rect = submitBtn.getBoundingClientRect();
                const x = rect.left + rect.width / 2;
                const y = rect.top - 20;

                // Set random image
                const randomImage = galleryImages[Math.floor(Math.random() * galleryImages.length)];
                thankYouImage.src = randomImage;

                // Position popup above button
                thankYouPopup.style.left = x + 'px';
                thankYouPopup.style.top = y + 'px';
                thankYouPopup.style.transform = 'translate(-50%, -100%)';

                // Animate popup
                gsap.fromTo(thankYouPopup,
                    { opacity: 0, y: 10 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.5,
                        ease: 'sine.out',
                        onComplete: function() {
                            gsap.to(thankYouPopup, {
                                opacity: 0,
                                y: -10,
                                duration: 0.5,
                                ease: 'sine.in',
                                delay: 1.2
                            });
                        }
                    }
                );
            });
        }
    }

    // ==== MOBILE MENU ====
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.getElementById('nav');
    let isMenuOpen = false;

    function initMobileMenu() {
        if (window.innerWidth <= 768) {
            gsap.set(nav, {
                height: 0,
                opacity: 0,
                display: 'flex'
            });
        } else {
            gsap.set(nav, {
                height: 'auto',
                opacity: 1,
                display: 'flex'
            });
        }
    }

    if (menuToggle) {
        initMobileMenu();

        menuToggle.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                if (!isMenuOpen) {
                    menuToggle.textContent = '[-]';
                    gsap.to(nav, {
                        height: 'auto',
                        opacity: 1,
                        duration: 0.6,
                        ease: 'power2.out'
                    });
                    isMenuOpen = true;
                } else {
                    menuToggle.textContent = '[+]';
                    gsap.to(nav, {
                        height: 0,
                        opacity: 0,
                        duration: 0.5,
                        ease: 'power2.in'
                    });
                    isMenuOpen = false;
                }
            }
        });

        window.addEventListener('resize', function() {
            initMobileMenu();
            if (window.innerWidth > 768) {
                isMenuOpen = false;
                menuToggle.textContent = '[+]';
            }
        });
    }
});
