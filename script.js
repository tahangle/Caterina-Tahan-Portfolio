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
                                    centerText.innerHTML = window.i18n ? window.i18n.t('home.clickMore') : '<span class="bold-text">click</span> to know more';
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
                                    centerText.innerHTML = window.i18n ? window.i18n.t('home.clickMore') : '<span class="bold-text">click</span> to know more';
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

    // ==== PROJECTS PAGE - SLIDESHOW ====
    const slideshowStack = document.getElementById('slideshowStack');
    if (slideshowStack) {
        const items = slideshowStack.querySelectorAll('.slide-item');
        const infoContainer = document.getElementById('slideshowInfo');
        const titleEl = infoContainer.querySelector('.slideshow-title');
        const metaEl = infoContainer.querySelector('.slideshow-meta');

        let currentIndex = 0;
        const totalItems = items.length;
        let isAnimating = false;
        let autoPlaySpeed = 2500;
        let autoPlayTimer = null;
        let isPaused = false;
        let zCounter = 100;

        // Initialize all items - hide them
        items.forEach((item, i) => {
            gsap.set(item, {
                opacity: 0,
                x: 100,
                zIndex: i
            });
        });

        // Show first item
        gsap.set(items[0], { opacity: 1, x: 0 });
        items[0].classList.add('active');

        // Projects index
        const projectsIndex = document.getElementById('projectsIndex');
        const indexItems = projectsIndex ? projectsIndex.querySelectorAll('.index-item') : [];

        function updateProjectsIndex() {
            if (!projectsIndex) return;
            const currentItem = items[currentIndex];
            const currentHref = currentItem.getAttribute('href');

            indexItems.forEach(indexItem => {
                if (indexItem.getAttribute('href') === currentHref) {
                    indexItem.classList.add('active');
                } else {
                    indexItem.classList.remove('active');
                }
            });
        }

        // Initialize index
        updateProjectsIndex();

        function goToNext() {
            if (isAnimating) return;
            isAnimating = true;

            const currentItem = items[currentIndex];
            const nextIndex = (currentIndex + 1) % totalItems;
            const nextItem = items[nextIndex];

            zCounter++;
            gsap.set(nextItem, { zIndex: zCounter });

            // Slide current out to left, next in from right
            gsap.to(currentItem, {
                x: -100,
                opacity: 0,
                duration: 0.5,
                ease: 'power2.inOut',
                onComplete: () => {
                    currentItem.classList.remove('active');
                }
            });

            gsap.fromTo(nextItem,
                { x: 100, opacity: 0 },
                {
                    x: 0,
                    opacity: 1,
                    duration: 0.5,
                    ease: 'power2.inOut',
                    onComplete: () => {
                        nextItem.classList.add('active');
                        currentIndex = nextIndex;
                        isAnimating = false;
                        updateProjectsIndex();
                    }
                }
            );
        }

        function goToPrev() {
            if (isAnimating) return;
            isAnimating = true;

            const currentItem = items[currentIndex];
            const prevIndex = (currentIndex - 1 + totalItems) % totalItems;
            const prevItem = items[prevIndex];

            zCounter++;
            gsap.set(prevItem, { zIndex: zCounter });

            // Slide current out to right, prev in from left
            gsap.to(currentItem, {
                x: 100,
                opacity: 0,
                duration: 0.5,
                ease: 'power2.inOut',
                onComplete: () => {
                    currentItem.classList.remove('active');
                }
            });

            gsap.fromTo(prevItem,
                { x: -100, opacity: 0 },
                {
                    x: 0,
                    opacity: 1,
                    duration: 0.5,
                    ease: 'power2.inOut',
                    onComplete: () => {
                        prevItem.classList.add('active');
                        currentIndex = prevIndex;
                        isAnimating = false;
                        updateProjectsIndex();
                    }
                }
            );
        }

        // Auto-play
        function startAutoPlay() {
            autoPlayTimer = setInterval(() => {
                if (!isPaused) goToNext();
            }, autoPlaySpeed);
        }

        startAutoPlay();

        // Hover - pause and show info
        items.forEach(item => {
            item.addEventListener('mouseenter', () => {
                isPaused = true;
                titleEl.textContent = item.dataset.title;
                metaEl.textContent = item.dataset.meta;
                gsap.to(infoContainer, { opacity: 1, duration: 0.3 });
            });
            item.addEventListener('mouseleave', () => {
                isPaused = false;
                gsap.to(infoContainer, { opacity: 0, duration: 0.3 });
            });
        });

        // Scroll/wheel navigation (works even with overflow hidden)
        let isGridView = false;
        let canScroll = true;

        window.addEventListener('wheel', (e) => {
            if (isGridView) return; // Allow normal scroll in grid view
            e.preventDefault();

            if (!canScroll || isAnimating) return;

            // Combine vertical and horizontal scroll
            const delta = e.deltaY + e.deltaX;

            if (Math.abs(delta) >= 30) {
                canScroll = false;
                clearInterval(autoPlayTimer);

                if (delta > 0) {
                    goToNext();
                } else {
                    goToPrev();
                }

                // Cooldown before next scroll
                setTimeout(() => {
                    canScroll = true;
                }, 600);

                setTimeout(() => startAutoPlay(), 2000);
            }
        }, { passive: false });

        // View toggles
        const gridToggle = document.getElementById('gridToggle');
        const slideshowToggle = document.getElementById('slideshowToggle');
        const slideshowContainer = document.getElementById('slideshow');

        function switchToGrid() {
            isGridView = true;
            slideshowContainer.classList.add('grid-view');
            document.documentElement.classList.add('grid-active');
            gridToggle.classList.add('active');
            slideshowToggle.classList.remove('active');
            clearInterval(autoPlayTimer);
            // Show all items in grid and add hover info
            items.forEach(item => {
                gsap.set(item, { opacity: 1, x: 0, scale: 1 });
                // Add hover info if not already present
                if (!item.querySelector('.grid-hover-info')) {
                    const hoverInfo = document.createElement('div');
                    hoverInfo.className = 'grid-hover-info';
                    hoverInfo.innerHTML = `
                        <span class="grid-title">${item.getAttribute('data-title')}</span>
                        <span class="grid-meta">${item.getAttribute('data-meta')}</span>
                    `;
                    item.appendChild(hoverInfo);
                }
            });
        }

        // Grid view hover effects
        items.forEach(item => {
            item.addEventListener('mouseenter', () => {
                if (isGridView) {
                    gsap.to(item, {
                        scale: 1.03,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                    gsap.to(item.querySelector('img'), {
                        opacity: 0.85,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                }
            });
            item.addEventListener('mouseleave', () => {
                if (isGridView) {
                    gsap.to(item, {
                        scale: 1,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                    gsap.to(item.querySelector('img'), {
                        opacity: 1,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                }
            });
        });

        function switchToSlideshow() {
            isGridView = false;
            slideshowContainer.classList.remove('grid-view');
            document.documentElement.classList.remove('grid-active');
            slideshowToggle.classList.add('active');
            gridToggle.classList.remove('active');
            // Reset to slideshow
            items.forEach((item, i) => {
                if (i === currentIndex) {
                    gsap.set(item, { opacity: 1, x: 0 });
                    item.classList.add('active');
                } else {
                    gsap.set(item, { opacity: 0, x: 100 });
                    item.classList.remove('active');
                }
            });
            startAutoPlay();
        }

        gridToggle.addEventListener('click', switchToGrid);
        slideshowToggle.addEventListener('click', switchToSlideshow);

        // Check if mobile and set grid view as default
        const isMobileProjects = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 768;
        if (isMobileProjects) {
            switchToGrid();
        }

        // Mobile arrows
        const prevArrow = document.getElementById('prevArrow');
        const nextArrow = document.getElementById('nextArrow');

        if (prevArrow && nextArrow) {
            prevArrow.addEventListener('click', () => {
                clearInterval(autoPlayTimer);
                goToPrev();
                setTimeout(() => startAutoPlay(), 2000);
            });

            nextArrow.addEventListener('click', () => {
                clearInterval(autoPlayTimer);
                goToNext();
                setTimeout(() => startAutoPlay(), 2000);
            });
        }
    }

    // ==== PROJECTS PAGE - GRID (legacy) ====
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

    // ==== STANDARD PROJECT GALLERY (slides) ====
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
        const contactIntro = contactPage.querySelector('.contact-intro');
        const contactInfo = contactPage.querySelector('.contact-info');

        // Fade in animations (matching about page)
        if (contactIntro) {
            gsap.to(contactIntro, {
                opacity: 1,
                duration: 1.2,
                ease: 'power2.out',
                delay: 0.1
            });
        }

        if (contactInfo) {
            gsap.to(contactInfo, {
                opacity: 1,
                duration: 1.2,
                ease: 'power2.out',
                delay: 0.3
            });
        }
    }

    // ==== THANK YOU OVERLAY (keeping for future use) ====
    const thankYouCheck = false;
    if (thankYouCheck) {
        const submitBtn = document.querySelector('.submit-btn');
        if (submitBtn) {

            // Thank you overlay animation on submit
            const thankYouOverlay = document.querySelector('.thank-you-overlay');
            const thankYouCenter = document.querySelector('.thank-you-center');
            const thankYouImagesContainer = document.querySelector('.thank-you-images');

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

            // Function to create animated image
            function createThankYouImage(index, totalImages, onLastFadeOut) {
                const img = document.createElement('img');
                const randomImage = galleryImages[Math.floor(Math.random() * galleryImages.length)];
                img.src = randomImage;

                thankYouImagesContainer.appendChild(img);

                const stagger = 0.15;
                const isLast = index === totalImages - 1;

                // Animate in with delay
                gsap.to(img, {
                    opacity: 1,
                    duration: 0.4,
                    ease: 'sine.out',
                    delay: index * stagger
                });

                // Fade out
                gsap.to(img, {
                    opacity: 0,
                    duration: 0.4,
                    ease: 'sine.in',
                    delay: index * stagger + 0.3,
                    onComplete: function() {
                        img.remove();
                        if (isLast && onLastFadeOut) onLastFadeOut();
                    }
                });
            }

            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();

                // Only proceed if form is valid
                const inputs = contactForm.querySelectorAll('input, textarea');
                let isValid = true;
                inputs.forEach(input => {
                    if (!input.validity.valid) {
                        isValid = false;
                        input.closest('.form-group').classList.add('has-error');
                    }
                });

                if (!isValid) return;

                // Get form data
                const formData = new FormData(contactForm);

                // Submit via fetch to Formspree
                fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                })
                .then(response => {
                    if (response.ok) {
                        // Success - show animation
                        showThankYouAnimation();
                    } else {
                        // Error
                        alert('There was an error sending your message. Please try again.');
                    }
                })
                .catch(error => {
                    alert('There was an error sending your message. Please try again.');
                });
            });

            function showThankYouAnimation() {
                // Show overlay
                thankYouOverlay.classList.add('active');
                gsap.to(thankYouOverlay, {
                    opacity: 1,
                    duration: 0.5,
                    ease: 'sine.out'
                });

                // Create 10 images cycling in same position
                const totalImages = 10;
                for (let i = 0; i < totalImages; i++) {
                    createThankYouImage(i, totalImages, showThankYouText);
                }
            }

            function showThankYouText() {
                // Show center text after images fade out
                gsap.to(thankYouCenter, {
                    opacity: 1,
                    duration: 1,
                    ease: 'sine.out',
                    delay: 0.2
                });

                // Fade out and return to form
                setTimeout(function() {
                    gsap.to(thankYouCenter, {
                        opacity: 0,
                        duration: 0.5,
                        ease: 'sine.in'
                    });
                    gsap.to(thankYouOverlay, {
                        opacity: 0,
                        duration: 0.5,
                        ease: 'sine.in',
                        delay: 0.3,
                        onComplete: function() {
                            thankYouOverlay.classList.remove('active');
                            // Reset form
                            contactForm.reset();
                        }
                    });
                }, 1500);
            }
        }
    }

    // ==== PROJECTS INDEX (all pages) ====
    const projectsIndexGlobal = document.getElementById('projectsIndex');
    if (projectsIndexGlobal) {
        const currentPage = window.location.pathname.split('/').pop();
        const indexItemsGlobal = projectsIndexGlobal.querySelectorAll('.index-item');

        indexItemsGlobal.forEach(item => {
            const itemHref = item.getAttribute('href');
            if (itemHref === currentPage) {
                item.classList.add('active');
            }
        });
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
