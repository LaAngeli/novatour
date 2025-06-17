// Funcționalitate floating-contact
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Previne comportamentul implicit al linkului
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
                history.pushState(null, '', `/${targetId}`);
            }
        });
    });

    // Navighează la secțiunea corectă dacă URL-ul conține un fragment
    const path = window.location.pathname;
    const sectionMap = {
        '/servicii': '#servicii',
        '/destinatii': '#destinatii',
        '/avantaje': '#avantaje',
        '/contact': '#contact',
        '/ru/servicii': '#servicii',
        '/ru/destinatii': '#destinatii',
        '/ru/avantaje': '#avantaje',
        '/ru/contact': '#contact'
    };

    const targetSection = sectionMap[path];
    if (targetSection) {
        const targetElement = document.querySelector(targetSection);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    }
});

// Funcționalitate meniu mobil - Consolidat
document.addEventListener('DOMContentLoaded', function() {
    // Afișează un loader până când pagina este complet încărcată
    const loader = document.querySelector('.loader');
    if (loader) {
        window.addEventListener('load', () => {
            loader.style.display = 'none';
        });
    }

    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        const videoBackground = heroSection.querySelector('.video-background');
        if (videoBackground) {
            // Logică pentru video background
            const video = videoBackground.querySelector('video');
            if (video) {
                video.play().catch(function(error) {
                    console.log("Video autoplay failed:", error);
                });
            }
        }
    }

    // Restul codului existent pentru meniu etc.
    const hamburger = document.querySelector('.hamburger');
    const menu = document.querySelector('.menu');
    const body = document.body;
    const menuLinks = document.querySelectorAll('.menu a');

    hamburger?.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        menu.classList.toggle('active');
        body.classList.toggle('no-scroll');
    });

    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            menu.classList.remove('active');
            body.classList.remove('no-scroll');
        });
    });

    // Destinații scroll - Îmbunătățit
    const destinationsGrid = document.querySelector('.destinations-grid');
    const prevButton = document.querySelector('.nav-prev');
    const nextButton = document.querySelector('.nav-next');

    if (destinationsGrid && prevButton && nextButton) {
        function scrollCards(direction) {
            const card = destinationsGrid.querySelector('.destination-card');
            const cardWidth = card?.offsetWidth || 0;
            const gap = 20;
            const scrollAmount = cardWidth + gap;
            
            const currentScroll = destinationsGrid.scrollLeft;
            const targetScroll = direction === 'next' 
                ? currentScroll + scrollAmount 
                : currentScroll - scrollAmount;

            destinationsGrid.scrollTo({
                left: targetScroll,
                behavior: 'smooth'
            });

            setTimeout(updateArrowsVisibility, 500);
        }

        function updateArrowsVisibility() {
            const isAtStart = destinationsGrid.scrollLeft <= 0;
            const isAtEnd = destinationsGrid.scrollLeft >= (destinationsGrid.scrollWidth - destinationsGrid.clientWidth);
            
            // Calculăm dacă ultimul card ar fi afișat parțial
            const cardWidth = destinationsGrid.querySelector('.destination-card')?.offsetWidth || 0;
            const gap = 20;
            const remainingScroll = destinationsGrid.scrollWidth - (destinationsGrid.scrollLeft + destinationsGrid.clientWidth);
            const wouldShowPartial = remainingScroll > 0 && remainingScroll < (cardWidth + gap);
            
            prevButton.style.opacity = isAtStart ? '0.5' : '1';
            nextButton.style.opacity = (isAtEnd || wouldShowPartial) ? '0.5' : '1';
            prevButton.style.pointerEvents = isAtStart ? 'none' : 'auto';
            nextButton.style.pointerEvents = (isAtEnd || wouldShowPartial) ? 'none' : 'auto';
        }

        prevButton.addEventListener('click', () => scrollCards('prev'));
        nextButton.addEventListener('click', () => scrollCards('next'));
        destinationsGrid.addEventListener('scroll', () => {
            requestAnimationFrame(updateArrowsVisibility);
        });

        // Optimizare pentru resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(updateArrowsVisibility, 100);
        });

        updateArrowsVisibility();
    }

    // Smooth scroll pentru ancore - Optimizat
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// reCAPTCHA v3 Functions - Folosind configurația din config.js
document.addEventListener('DOMContentLoaded', function() {
    // Așteaptă ca reCAPTCHA să fie încărcat
    function waitForRecaptcha() {
        if (typeof grecaptcha !== 'undefined' && grecaptcha.ready) {
            console.log('reCAPTCHA loaded successfully');
            initRecaptcha();
        } else {
            console.log('Waiting for reCAPTCHA to load...');
            setTimeout(waitForRecaptcha, 200); // Măresc intervalul la 200ms
        }
    }

    // Verifică dacă config.js este încărcat
    function waitForConfig() {
        if (window.NovaTourConfig && window.NovaTourConfig.recaptchaSiteKey) {
            console.log('Config loaded, starting reCAPTCHA check');
            waitForRecaptcha();
        } else {
            console.log('Waiting for config to load...');
            setTimeout(waitForConfig, 100);
        }
    }

    // Funcție pentru trimiterea token-ului către backend
    async function sendTokenToBackend(token, action) {
        try {
            const response = await fetch(window.NovaTourConfig.recaptchaVerifyUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify({
                    token: token,
                    action: action
                })
            });
            
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error sending token to backend:', error);
            return { success: false, error: 'Network error' };
        }
    }

    // Funcție pentru protecția butoanelor de rezervare
    function protectBookingAction(button) {
        grecaptcha.ready(function() {
            grecaptcha.execute(window.NovaTourConfig.recaptchaSiteKey, {action: 'booking'})
            .then(async function(token) {
                console.log('reCAPTCHA token for booking:', token);
                
                // Trimite token-ul către backend pentru validare
                const result = await sendTokenToBackend(token, 'booking');
                
                if (result.success) {
                    console.log('Backend validation successful, score:', result.score);
                    // Deschide Viber după validarea reCAPTCHA
                    window.open('viber://chat?number=%2B' + window.NovaTourConfig.viberNumber.replace('+', ''), '_blank');
                } else {
                    console.warn('Backend validation failed:', result.error);
                    // Fallback - deschide Viber chiar dacă validarea eșuează
                    window.open('viber://chat?number=%2B' + window.NovaTourConfig.viberNumber.replace('+', ''), '_blank');
                }
            })
            .catch(function(error) {
                console.error('reCAPTCHA error:', error);
                // Fallback - deschide Viber chiar dacă reCAPTCHA eșuează
                window.open('viber://chat?number=%2B' + window.NovaTourConfig.viberNumber.replace('+', ''), '_blank');
            });
        });
    }

    // Funcție pentru protecția interacțiunilor de contact
    function protectContactAction(button, originalHref) {
        grecaptcha.ready(function() {
            grecaptcha.execute(window.NovaTourConfig.recaptchaSiteKey, {action: 'contact'})
            .then(async function(token) {
                console.log('reCAPTCHA token for contact:', token);
                
                // Trimite token-ul către backend pentru validare
                const result = await sendTokenToBackend(token, 'contact');
                
                if (result.success) {
                    console.log('Backend validation successful, score:', result.score);
                    // Continuă cu acțiunea originală
                    window.open(originalHref, '_blank');
                } else {
                    console.warn('Backend validation failed:', result.error);
                    // Fallback
                    window.open(originalHref, '_blank');
                }
            })
            .catch(function(error) {
                console.error('reCAPTCHA error:', error);
                // Fallback
                window.open(originalHref, '_blank');
            });
        });
    }

    // Funcție pentru protecția generală a paginii (analytics)
    function protectPageLoad() {
        grecaptcha.ready(function() {
            grecaptcha.execute(window.NovaTourConfig.recaptchaSiteKey, {action: 'page_load'})
            .then(async function(token) {
                console.log('reCAPTCHA token for page load:', token);
                
                // Trimite token-ul către backend pentru analytics
                const result = await sendTokenToBackend(token, 'page_load');
                
                if (result.success) {
                    console.log('Page load analytics sent, score:', result.score);
                } else {
                    console.warn('Page load analytics failed:', result.error);
                }
            })
            .catch(function(error) {
                console.error('reCAPTCHA error:', error);
            });
        });
    }

    // Inițializare reCAPTCHA
    function initRecaptcha() {
        // Protejează butoanele de rezervare
        const bookingButtons = document.querySelectorAll('.book-button');
        bookingButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                protectBookingAction(this);
            });
        });

        // Protejează butoanele de contact flotante
        const contactButtons = document.querySelectorAll('.floating-contact a, .contact-icon');
        contactButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const href = this.getAttribute('href');
                if (href) {
                    protectContactAction(this, href);
                }
            });
        });

        // Protejează butoanele de contact din secțiunea de contact
        const contactSectionButtons = document.querySelectorAll('.contact-card a, .social-icon');
        contactSectionButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const href = this.getAttribute('href');
                if (href) {
                    protectContactAction(this, href);
                }
            });
        });

        // Execută reCAPTCHA pentru analytics la încărcarea paginii
        setTimeout(protectPageLoad, 1000); // Delay de 1 secundă pentru a permite încărcarea completă
    }

    // Pornește verificarea pentru config și reCAPTCHA
    waitForConfig();
});