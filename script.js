// Generare link pentru href
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('a[href^="#"]');
    const isRussianPage = document.documentElement.lang === 'ru';

    // Mapare denumiri rusești la ID-uri în latină
    const russianToLatinIds = {
        'услуги': 'servicii',
        'направления': 'destinatii',
        'преимущества': 'avantaje',
        'контакты': 'contact'
    };

    links.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); 
            const targetId = this.getAttribute('href').substring(1);
            const actualId = isRussianPage ? russianToLatinIds[targetId] || targetId : targetId;
            const targetElement = document.getElementById(actualId);

            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });

                // Modifică URL-ul în funcție de limbă
                const newUrl = isRussianPage 
                    ? `/ru/${targetId}` 
                    : `/${targetId}`;
                history.pushState(null, '', newUrl);
            }
        });
    });
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