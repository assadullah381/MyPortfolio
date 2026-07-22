document.addEventListener('DOMContentLoaded', () => {
    // --- Portfolio Filtering and Progressive Loading ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards = Array.from(document.querySelectorAll('#portfolio-grid .card'));
    const loadMoreBtn = document.querySelector('#load-more');
    let visibleCount = 9;

    const updateCardVisibility = () => {
        const activeFilter = document.querySelector('.filter-btn.active')?.getAttribute('data-filter') || 'all';

        cards.forEach((card, index) => {
            const matchesFilter = activeFilter === 'all' || card.getAttribute('data-category') === activeFilter;
            const shouldShow = activeFilter === 'all'
                ? index < visibleCount
                : matchesFilter;

            card.classList.toggle('filtered-out', !matchesFilter);
            card.classList.toggle('is-hidden', !shouldShow);
        });

        if (loadMoreBtn) {
            loadMoreBtn.hidden = activeFilter !== 'all' || visibleCount >= cards.length;
        }
    };

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateCardVisibility();
        });
    });

    loadMoreBtn?.addEventListener('click', () => {
        visibleCount = Math.min(visibleCount + (visibleCount === 9 ? 6 : 3), cards.length);
        updateCardVisibility();
    });

    updateCardVisibility();

    // --- Portfolio Video Modal ---
    const videoModal = document.querySelector('#video-modal');
    const portfolioVideo = document.querySelector('#portfolio-video');
    const closeVideoModalBtn = document.querySelector('#video-modal-close');

    const closeVideoModal = () => {
        if (!videoModal || !portfolioVideo) return;
        portfolioVideo.src = '';
        videoModal.classList.remove('is-open');
        videoModal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');
    };

    const getYouTubeEmbedUrl = videoUrl => {
        try {
            const url = new URL(videoUrl);
            let videoId = url.searchParams.get('v');

            if (!videoId && url.hostname === 'youtu.be') {
                videoId = url.pathname.slice(1);
            }

            return videoId
                ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`
                : videoUrl;
        } catch {
            return videoUrl;
        }
    };

    cards.forEach(card => {
        const playButton = card.querySelector('.play-button');

        playButton?.addEventListener('click', event => {
            event.stopPropagation();
            const videoSource = card.getAttribute('data-video');
            if (!videoModal || !portfolioVideo || !videoSource) return;

            portfolioVideo.src = getYouTubeEmbedUrl(videoSource);
            videoModal.classList.add('is-open');
            videoModal.setAttribute('aria-hidden', 'false');
            document.body.classList.add('modal-open');
        });
    });

    closeVideoModalBtn?.addEventListener('click', closeVideoModal);
    videoModal?.addEventListener('click', event => {
        if (event.target === videoModal) closeVideoModal();
    });
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') closeVideoModal();
    });

    // --- Mobile Navigation Logic ---
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');

            if (navLinks.classList.contains('active')) {
                mobileMenuBtn.innerHTML = `
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>`;
            } else {
                mobileMenuBtn.innerHTML = `
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>`;
            }
        });

        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileMenuBtn.innerHTML = `
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>`;
            });
        });
    }
});
