/**
 * Calista Candradinatan - Portfolio Interactive Scripts
 * Tabs Navigation, Spiral Notebook Carousel, Folder Tabs Organizer & Modals
 */

document.addEventListener('DOMContentLoaded', () => {
    // =========================================================================
    // 1. NAVIGATION BAR & TABS BAR
    // =========================================================================
    const header = document.querySelector('.site-header');
    const tabAbout = document.getElementById('tab-about');
    const tabExperiences = document.getElementById('tab-experiences');
    const tabSkills = document.getElementById('tab-skills');
    const tabWorks = document.getElementById('tab-works');
    const tabPetCat = document.getElementById('tab-pet-cat');
    const mobileTabAbout = document.getElementById('mobile-tab-about');
    const mobileTabExperiences = document.getElementById('mobile-tab-experiences');
    const mobileTabSkills = document.getElementById('mobile-tab-skills');
    const mobileTabWorks = document.getElementById('mobile-tab-works');
    const mobileTabPetCat = document.getElementById('mobile-tab-pet-cat');

    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const drawerCloseBtn = document.getElementById('drawer-close-btn');
    const drawerBackdrop = document.getElementById('drawer-backdrop');

    // Sticky header shadow
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, { passive: true });

    // Mobile Drawer Actions
    function openDrawer() {
        if (!mobileDrawer) return;
        mobileDrawer.classList.add('open');
        drawerBackdrop.classList.add('active');
        mobileToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
        if (!mobileDrawer) return;
        mobileDrawer.classList.remove('open');
        drawerBackdrop.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    if (mobileToggle) mobileToggle.addEventListener('click', openDrawer);
    if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
    if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);

    const headerHireBtn = document.getElementById('header-hire-btn');
    const mobileHireBtn = document.getElementById('mobile-hire-btn');

    // Active tab switching
    function setActiveTab(tabName) {
        const tabs = [
            { id: 'about', desktop: tabAbout, mobile: mobileTabAbout },
            { id: 'experiences', desktop: tabExperiences, mobile: mobileTabExperiences },
            { id: 'skills', desktop: tabSkills, mobile: mobileTabSkills },
            { id: 'works', desktop: tabWorks, mobile: mobileTabWorks },
            { id: 'pet-cat', desktop: tabPetCat, mobile: mobileTabPetCat }
        ];

        tabs.forEach(t => {
            const isActive = t.id === tabName;
            if (t.desktop) t.desktop.classList.toggle('active', isActive);
            if (t.mobile) t.mobile.classList.toggle('active', isActive);
        });

        const isHire = tabName === 'hire';
        if (headerHireBtn) headerHireBtn.classList.toggle('active', isHire);
        if (mobileHireBtn) mobileHireBtn.classList.toggle('active', isHire);
    }

    // ScrollSpy: Update active tab underline or hire button as user scrolls
    const coverSection = document.getElementById('cover');
    const aboutSection = document.getElementById('about');
    const experiencesSection = document.getElementById('experiences');
    const skillsSection = document.getElementById('skills');
    const worksSection = document.getElementById('my-works');
    const petCatSection = document.getElementById('pet-my-cat');
    const hireSection = document.getElementById('hire-me');

    function updateActiveTabOnScroll() {
        const scrollPosition = window.scrollY + 220;
        const aboutTop = aboutSection ? aboutSection.offsetTop : Infinity;
        const experiencesTop = experiencesSection ? experiencesSection.offsetTop : Infinity;
        const skillsTop = skillsSection ? skillsSection.offsetTop : Infinity;
        const worksTop = worksSection ? worksSection.offsetTop : Infinity;
        const petCatTop = petCatSection ? petCatSection.offsetTop : Infinity;
        const hireTop = hireSection ? hireSection.offsetTop : Infinity;

        if (scrollPosition >= hireTop) {
            setActiveTab('hire');
        } else if (scrollPosition >= petCatTop) {
            setActiveTab('pet-cat');
        } else if (scrollPosition >= worksTop) {
            setActiveTab('works');
        } else if (scrollPosition >= skillsTop) {
            setActiveTab('skills');
        } else if (scrollPosition >= experiencesTop) {
            setActiveTab('experiences');
        } else if (scrollPosition >= aboutTop) {
            setActiveTab('about');
        } else {
            // When in the cover section (above About Me), no nav tab should be underlined
            setActiveTab('none');
        }
    }

    window.addEventListener('scroll', updateActiveTabOnScroll, { passive: true });
    // Run once on load to ensure correct tab state
    updateActiveTabOnScroll();

    // Smooth scroll and tab click handling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                closeDrawer();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                if (targetId === '#cover') setActiveTab('none');
                if (targetId === '#about') setActiveTab('about');
                if (targetId === '#experiences') setActiveTab('experiences');
                if (targetId === '#skills') setActiveTab('skills');
                if (targetId === '#my-works') setActiveTab('works');
                if (targetId === '#pet-my-cat') setActiveTab('pet-cat');
                if (targetId === '#hire-me') setActiveTab('hire');
            }
        });
    });

    // =========================================================================
    // 2. MY WORKS! SPIRAL NOTEBOOK CAROUSEL
    // =========================================================================
    const viewport = document.getElementById('notebook-viewport');
    const track = document.getElementById('notebook-track');
    const cards = document.querySelectorAll('.notebook-card');
    const prevBtn = document.getElementById('carousel-prev-btn');
    const nextBtn = document.getElementById('carousel-next-btn');
    const dots = document.querySelectorAll('.notebook-dot');

    // Default active index: 1 (Graphic Design, centered as in attachment)
    let currentIndex = 1;

    function updateCarousel(targetIndex, smooth = true) {
        if (!track || cards.length === 0) return;

        // Clamp index
        currentIndex = Math.max(0, Math.min(targetIndex, cards.length - 1));

        // Update active class on cards
        cards.forEach((card, idx) => {
            const isActive = idx === currentIndex;
            card.classList.toggle('active', isActive);
            card.setAttribute('aria-current', isActive ? 'true' : 'false');
        });

        // Update pagination dots (active dot expands into pill)
        dots.forEach((dot, idx) => {
            const isActive = idx === currentIndex;
            dot.classList.toggle('active', isActive);
            dot.setAttribute('aria-current', isActive ? 'true' : 'false');
        });

        // Calculate translation to center the active card perfectly in the viewport
        const activeCard = cards[currentIndex];
        const cardCenter = activeCard.offsetLeft + (activeCard.offsetWidth / 2);
        const viewportCenter = viewport.clientWidth / 2;
        const targetOffset = viewportCenter - cardCenter;

        track.style.transition = smooth ? 'transform 0.45s cubic-bezier(0.25, 1, 0.5, 1)' : 'none';
        track.style.transform = `translateX(${targetOffset}px)`;

        // In infinite loop carousel mode, arrows are always enabled
        if (prevBtn) {
            prevBtn.disabled = false;
            prevBtn.removeAttribute('aria-disabled');
        }
        if (nextBtn) {
            nextBtn.disabled = false;
            nextBtn.removeAttribute('aria-disabled');
        }
    }

    // Infinite Carousel Navigation: seamless loop without stopping at edges
    function goToNextCard() {
        const nextIndex = (currentIndex + 1) % cards.length;
        updateCarousel(nextIndex);
    }

    function goToPrevCard() {
        const prevIndex = (currentIndex - 1 + cards.length) % cards.length;
        updateCarousel(prevIndex);
    }

    // Previous & Next Arrow Buttons (Infinite wrap-around)
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            goToPrevCard();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            goToNextCard();
        });
    }

    // Dot navigation
    dots.forEach((dot) => {
        dot.addEventListener('click', () => {
            const targetIndex = parseInt(dot.getAttribute('data-index'), 10);
            updateCarousel(targetIndex);
        });
    });

    // Keyboard navigation (ArrowLeft & ArrowRight with infinite loop)
    if (viewport) {
        viewport.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                goToPrevCard();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                goToNextCard();
            }
        });
    }

    // Touch & Pointer Drag / Swipe for Carousel (with infinite loop)
    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    if (viewport) {
        viewport.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            currentX = startX;
            isDragging = true;
        }, { passive: true });

        viewport.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
        }, { passive: true });

        viewport.addEventListener('touchend', () => {
            if (!isDragging) return;
            isDragging = false;
            const deltaX = currentX - startX;
            const swipeThreshold = 50;

            if (deltaX < -swipeThreshold) {
                goToNextCard();
            } else if (deltaX > swipeThreshold) {
                goToPrevCard();
            }
        });
    }

    // Window resize handler: recalculate alignment
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            updateCarousel(currentIndex, false);
        }, 80);
    }, { passive: true });

    // Initial position on DOM ready
    setTimeout(() => {
        updateCarousel(currentIndex, false);
    }, 50);

    // =========================================================================
    // 3. FOLDER TABS SYSTEM (Directly matching user's new attachments!)
    // Tabs per category: Photography, Graphic Design, Illustration
    // =========================================================================
    const folderStage = document.getElementById('folder-section-stage');
    const carouselStage = document.getElementById('notebook-carousel-stage');
    const carouselDots = document.getElementById('notebook-pagination');
    const toggleCarouselBtn = document.getElementById('toggle-carousel-view');
    const toggleFolderBtn = document.getElementById('toggle-folder-view');
    const btnReturnOverview = document.getElementById('btn-return-overview');

    const folderTabsBar = document.getElementById('folder-tabs-bar');
    const folderCatPills = document.querySelectorAll('.folder-cat-pill');
    const folderImg = document.getElementById('folder-project-img');
    const folderTitle = document.getElementById('folder-title');
    const folderDesc = document.getElementById('folder-desc');
    const folderDots = document.querySelectorAll('.folder-dot');
    const folderPrevBtn = document.getElementById('folder-prev-btn');
    const folderNextBtn = document.getElementById('folder-next-btn');

    // Rich portfolio data for each category tab
    const folderProjectsData = {
        'photography': [
            {
                tabName: 'Food Photography',
                title: 'Food Photography',
                desc: 'Eksplorasi fotografi makanan dengan menonjolkan tampilan visual, tekstur, warna, dan komposisi objek untuk membangun daya tarik serta menggambarkan karakteristik makanan melalui visual.',
                image: 'asssets/image/food-photography-1.jpg',
                images: [
                    'asssets/image/food-photography-1.jpg',
                    'asssets/image/food-photography-2.jpg',
                    'asssets/image/food-photography-3.jpg'
                ]
            },
            {
                tabName: 'Animal Photography',
                title: 'Animal Photography',
                desc: 'Eksplorasi fotografi hewan yang berfokus pada karakter, ekspresi, dan perilaku subjek. Melalui pengamatan dan pengambilan momen, karya ini berusaha menangkap keunikan serta sisi natural hewan dalam sebuah visual.',
                image: 'asssets/image/animal-photography-1.jpg',
                images: [
                    'asssets/image/animal-photography-1.jpg',
                    'asssets/image/animal-photography-2.jpg',
                    'asssets/image/animal-photography-3.jpg',
                    'asssets/image/animal-photography-4.jpg'
                ]
            }
        ],
        'graphic-design': [
            {
                tabName: 'Ye Lai Xiang',
                title: '"Ye Lai Xiang" – Teresa Teng',
                desc: 'Poster ini merupakan interpretasi visual dari lagu Ye Lai Xiang (夜来香) karya Teresa Teng. Melalui eksplorasi elemen visual, warna, dan tipografi, karya ini berusaha menerjemahkan suasana romantis, nostalgia, serta keindahan malam yang tergambar dalam lagu ke dalam bentuk komunikasi visual.',
                image: 'asssets/image/dg-music-1.jpg',
                images: [
                    'asssets/image/dg-music-1.jpg'
                ]
            },
            {
                tabName: 'Personal Branding',
                title: 'Personal Branding',
                desc: 'Karya personal branding ini mengeksplorasi identitas diri melalui karakteristik fun dan friendly. Visual kucing "dou" digunakan untuk merepresentasikan sisi ekstrovert yang ceria dan ekspresif, sementara dumpling merepresentasikan sisi introvert yang lebih tenang dan tertutup. Identitas visual dikembangkan melalui penerapan elemen semiotika, yaitu icon, symbol, dan index, untuk membangun representasi diri yang unik dan personal.',
                image: 'asssets/image/dg-personalbranding-1.jpg',
                images: [
                    'asssets/image/dg-personalbranding-1.jpg',
                    'asssets/image/dg-personalbranding-2.jpg'
                ]
            },
            {
                tabName: 'Xiamen',
                title: 'Xiamen – Cultural Tourism Promotion',
                desc: 'Karya ini merupakan proyek promosi wisata yang bertujuan memperkenalkan kota Xiamen, Tiongkok, melalui kekayaan budaya lokalnya. Mengangkat karakter aktor Minnan Opera dengan visualisasi yang lembut dan anggun sebagai representasi identitas budaya setempat. Selain poster utama, proyek ini juga mencakup pengembangan media pendukung berupa bookmark, sticker, dan brosur interaktif untuk memberikan pengalaman promosi yang lebih menarik dan informatif.',
                image: 'asssets/image/dg-xiamen-1.jpg',
                images: [
                    'asssets/image/dg-xiamen-1.jpg',
                    'asssets/image/dg-xiamen-2.jpg',
                    'asssets/image/dg-xiamen-3.jpg'
                ]
            },
            {
                tabName: 'Rebranding PRJ',
                title: 'Rebranding PRJ',
                desc: 'Proyek ini merupakan perancangan ulang identitas visual Pekan Raya Jakarta (PRJ) dengan mengangkat karakter fun, dinamis, dan lively. Eksplorasi visual dilakukan untuk menciptakan identitas yang lebih ekspresif, energik, dan relevan dengan suasana festival, sekaligus memperkuat citra PRJ sebagai ajang hiburan dan perayaan yang meriah bagi masyarakat.',
                image: 'asssets/image/dg-prj-1.jpg',
                images: [
                    'asssets/image/dg-prj-1.jpg',
                    'asssets/image/dg-prj-2.jpg',
                    'asssets/image/dg-prj-3.jpg'
                ]
            },
            {
                tabName: 'Kaya Tempe',
                title: 'Kaya Tempe – Food & Beverage Branding',
                desc: 'Proyek kolaborasi bersama program studi Teknologi Pangan dalam mengembangkan produk olahan tempe dengan pendekatan branding yang fun, unik, dan bernuansa Nusantara. Menghadirkan Tompel sebagai maskot utama, identitas visual dirancang untuk membangun citra produk yang menarik, approachable, dan modern. Eksplorasi branding diaplikasikan pada logo, karakter maskot, serta desain kemasan untuk memperkenalkan tempe melalui perspektif yang lebih kreatif.',
                image: 'asssets/image/dg-kayatempe-1.jpg',
                images: [
                    'asssets/image/dg-kayatempe-1.jpg',
                    'asssets/image/dg-kayatempe-2.jpg',
                    'asssets/image/dg-kayatempe-3.jpg',
                    'asssets/image/dg-kayatempe-4.jpg'
                ]
            }
        ],
        'digital-art': [
            {
                tabName: 'Charcoal',
                title: 'Charcoal (2024)',
                desc: 'Eksplorasi teknik menggambar menggunakan media charcoal dengan memanfaatkan variasi gelap-terang, tekstur, arsiran, dan kontras untuk membangun dimensi serta kedalaman visual. Karya ini menjadi eksplorasi terhadap karakteristik charcoal dalam menghasilkan bentuk dan ekspresi visual.',
                image: 'asssets/image/charcoal-1.jpg',
                images: [
                    'asssets/image/charcoal-1.jpg',
                    'asssets/image/charcoal-2.jpg'
                ]
            },
            {
                tabName: 'Mural',
                title: 'Mural (2025)',
                desc: 'Proyek mural berdasarkan komisi untuk sebuah pet shop, dengan mengangkat ilustrasi doodle berbagai jenis anjing sebagai elemen visual utama. Menggunakan pendekatan ilustrasi yang playful dan ekspresif untuk menciptakan suasana yang fun, ramah, serta memperkuat karakter visual pada area depan toko.',
                image: 'asssets/image/mural-1.jpg',
                images: [
                    'asssets/image/mural-1.jpg',
                    'asssets/image/mural-2.jpg',
                    'asssets/image/mural-3.jpg',
                    'asssets/image/mural-4.jpg',
                    'asssets/image/mural-5.jpg'
                ]
            },
            {
                tabName: 'Sticker',
                title: 'Sticker Illustration Collection',
                desc: 'Kumpulan karya ilustrasi digital yang dikembangkan menjadi desain stiker. Eksplorasi berfokus pada karakter, bentuk, warna, dan gaya ilustrasi yang ekspresif untuk menghasilkan karya visual yang menarik dan aplikatif dalam bentuk media cetak.',
                image: 'asssets/image/dou-sticker-1.jpg',
                images: [
                    'asssets/image/dou-sticker-1.jpg',
                    'asssets/image/kayatempe-sticker-2.jpg',
                    'asssets/image/ceqing-sticker-3.jpg',
                    'asssets/image/setsheet-sticker-4.jpg'
                ]
            }
        ]
    };

    let activeCategory = 'graphic-design';
    let activeProjectIndex = 0;
    let activeSubImageIndex = 0;
    const folderPagePills = document.getElementById('folder-page-pills');

    function renderFolderProject(category, index, subIndex = 0, animate = true) {
        const list = folderProjectsData[category] || folderProjectsData['photography'];
        activeProjectIndex = (index + list.length) % list.length;
        const item = list[activeProjectIndex];
        const images = item.images && item.images.length > 0 ? item.images : [item.image];

        activeSubImageIndex = (subIndex + images.length) % images.length;
        const currentSrc = images[activeSubImageIndex];

        if (folderImg) {
            if (animate) {
                folderImg.style.opacity = '0';
                folderImg.style.transform = 'scale(0.96)';
                setTimeout(() => {
                    folderImg.src = currentSrc;
                    folderImg.alt = `${item.title} (Page ${activeSubImageIndex + 1})`;
                    folderImg.style.opacity = '1';
                    folderImg.style.transform = 'scale(1)';
                }, 160);
            } else {
                folderImg.src = currentSrc;
                folderImg.alt = `${item.title} (Page ${activeSubImageIndex + 1})`;
            }
        }

        if (folderTitle) folderTitle.textContent = item.title;
        if (folderDesc) folderDesc.textContent = item.desc;

        // Render page indicator pills if multiple pages exist
        if (folderPagePills) {
            if (images.length > 1) {
                folderPagePills.innerHTML = '';
                images.forEach((_, pIdx) => {
                    const pill = document.createElement('button');
                    pill.className = `folder-page-pill ${pIdx === activeSubImageIndex ? 'active' : ''}`;
                    pill.textContent = `Page ${pIdx + 1}`;
                    pill.type = 'button';
                    pill.setAttribute('aria-label', `View page ${pIdx + 1}`);
                    pill.addEventListener('click', (e) => {
                        e.stopPropagation();
                        renderFolderProject(category, activeProjectIndex, pIdx, true);
                    });
                    folderPagePills.appendChild(pill);
                });
                folderPagePills.classList.add('has-pages');
            } else {
                folderPagePills.innerHTML = '';
                folderPagePills.classList.remove('has-pages');
            }
        }

        // Update folder pagination dots dynamically
        const folderPaginationRow = document.getElementById('folder-pagination-row');
        if (folderPaginationRow) {
            folderPaginationRow.innerHTML = '';
            list.forEach((_, dIdx) => {
                const dot = document.createElement('button');
                dot.className = 'folder-dot' + (dIdx === activeProjectIndex ? ' active' : '');
                dot.setAttribute('data-pindex', dIdx);
                dot.setAttribute('aria-label', `Project ${dIdx + 1}`);
                dot.setAttribute('aria-current', dIdx === activeProjectIndex ? 'true' : 'false');
                dot.addEventListener('click', () => {
                    renderFolderProject(activeCategory, dIdx, 0, true);
                });
                folderPaginationRow.appendChild(dot);
            });
        }

        // Update project tabs active state
        if (folderTabsBar) {
            const tabs = folderTabsBar.querySelectorAll('.folder-tab-item');
            tabs.forEach((tab, tIdx) => {
                const isActive = tIdx === activeProjectIndex;
                tab.classList.toggle('active', isActive);
                tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
                tab.style.zIndex = isActive ? '20' : `${tabs.length - tIdx}`;
            });
        }
    }

    function renderFolderTabs(category, currentActiveIdx = 0) {
        if (!folderTabsBar) return;
        const list = folderProjectsData[category] || [];
        folderTabsBar.innerHTML = '';

        list.forEach((proj, idx) => {
            const btn = document.createElement('button');
            const isActive = idx === currentActiveIdx;
            btn.className = `folder-tab-item ${isActive ? 'active' : ''}`;
            btn.setAttribute('role', 'tab');
            btn.setAttribute('data-proj-index', idx);
            btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
            btn.style.zIndex = isActive ? '20' : `${list.length - idx}`;

            const textSpan = document.createElement('span');
            textSpan.className = 'folder-tab-text';
            textSpan.textContent = proj.tabName || proj.title;
            btn.appendChild(textSpan);

            btn.addEventListener('click', () => {
                renderFolderProject(category, idx, 0, true);
            });

            folderTabsBar.appendChild(btn);
        });

        // Also update category switch pills if present
        if (folderCatPills && folderCatPills.length > 0) {
            folderCatPills.forEach(pill => {
                const isCatActive = pill.getAttribute('data-cat') === category;
                pill.classList.toggle('active', isCatActive);
            });
        }
    }

    function switchFolderCategory(category, initialProjectIdx = 0) {
        activeCategory = category;
        renderFolderTabs(category, initialProjectIdx);
        renderFolderProject(category, initialProjectIdx, 0, true);
    }

    // Category pills click handler
    if (folderCatPills && folderCatPills.length > 0) {
        folderCatPills.forEach(pill => {
            pill.addEventListener('click', () => {
                const cat = pill.getAttribute('data-cat');
                switchFolderCategory(cat, 0);
            });
        });
    }

    // Initialize folder tabs and content for default category
    renderFolderTabs(activeCategory, 0);
    renderFolderProject(activeCategory, 0, 0, false);

    // === INNER arrows (inside image frame) → navigate PAGES only within current project ===
    if (folderPrevBtn) {
        folderPrevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const list = folderProjectsData[activeCategory] || [];
            const item = list[activeProjectIndex];
            const images = item && item.images && item.images.length > 0 ? item.images : [item.image];
            if (images.length > 1) {
                const prevSubIdx = (activeSubImageIndex - 1 + images.length) % images.length;
                renderFolderProject(activeCategory, activeProjectIndex, prevSubIdx, true);
            }
        });
    }

    if (folderNextBtn) {
        folderNextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const list = folderProjectsData[activeCategory] || [];
            const item = list[activeProjectIndex];
            const images = item && item.images && item.images.length > 0 ? item.images : [item.image];
            if (images.length > 1) {
                const nextSubIdx = (activeSubImageIndex + 1) % images.length;
                renderFolderProject(activeCategory, activeProjectIndex, nextSubIdx, true);
            }
        });
    }

    // === OUTER arrows (inside red card, outside image frame) → navigate PROJECTS ===
    const folderProjPrevBtn = document.getElementById('folder-proj-prev-btn');
    const folderProjNextBtn = document.getElementById('folder-proj-next-btn');

    if (folderProjPrevBtn) {
        folderProjPrevBtn.addEventListener('click', () => {
            const list = folderProjectsData[activeCategory] || [];
            const prevIdx = (activeProjectIndex - 1 + list.length) % list.length;
            renderFolderProject(activeCategory, prevIdx, 0, true);
        });
    }

    if (folderProjNextBtn) {
        folderProjNextBtn.addEventListener('click', () => {
            const list = folderProjectsData[activeCategory] || [];
            const nextIdx = (activeProjectIndex + 1) % list.length;
            renderFolderProject(activeCategory, nextIdx, 0, true);
        });
    }

    // View Switching: Carousel vs Folder Tabs
    function showCarouselView() {
        if (carouselStage) carouselStage.classList.add('active-view');
        if (carouselDots) carouselDots.classList.add('active-view');
        if (folderStage) folderStage.classList.remove('active-view');

        if (toggleCarouselBtn) {
            toggleCarouselBtn.classList.add('active');
            toggleCarouselBtn.setAttribute('aria-selected', 'true');
        }
        if (toggleFolderBtn) {
            toggleFolderBtn.classList.remove('active');
            toggleFolderBtn.setAttribute('aria-selected', 'false');
        }

        setTimeout(() => updateCarousel(currentIndex, false), 50);
    }

    function showFolderView(category = 'photography', projectIdx = 0) {
        if (carouselStage) carouselStage.classList.remove('active-view');
        if (carouselDots) carouselDots.classList.remove('active-view');
        if (folderStage) folderStage.classList.add('active-view');

        if (toggleCarouselBtn) {
            toggleCarouselBtn.classList.remove('active');
            toggleCarouselBtn.setAttribute('aria-selected', 'false');
        }
        if (toggleFolderBtn) {
            toggleFolderBtn.classList.add('active');
            toggleFolderBtn.setAttribute('aria-selected', 'true');
        }

        switchFolderCategory(category, projectIdx);

        // Smooth scroll to keep the folder beautifully in view
        const worksSection = document.getElementById('my-works');
        if (worksSection) {
            worksSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    if (toggleCarouselBtn) toggleCarouselBtn.addEventListener('click', showCarouselView);
    if (toggleFolderBtn) toggleFolderBtn.addEventListener('click', () => showFolderView(activeCategory, 0));
    if (btnReturnOverview) btnReturnOverview.addEventListener('click', showCarouselView);

    // =========================================================================
    // Click on Notebook Carousel Card -> Opens Folder Tabs View!
    // As requested: "tabs hanya muncul saat section 'my works' di pencet"
    // =========================================================================
    cards.forEach((card) => {
        card.addEventListener('click', (e) => {
            const cardIndex = parseInt(card.getAttribute('data-index'), 10);
            const category = card.getAttribute('data-category');
            currentIndex = cardIndex;
            showFolderView(category, 0);
        });
    });

    // =========================================================================
    // PORTFOLIO IMAGE LIGHTBOX POPUP
    // Opens full-size image on clicking portfolio images, with backdrop & Esc key
    // =========================================================================
    const portfolioLightbox = document.getElementById('portfolio-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxCloseBtn = document.getElementById('lightbox-close-btn');
    const lightboxBackdrop = document.getElementById('lightbox-backdrop');

    function openPortfolioLightbox(imgSrc, captionText) {
        if (!portfolioLightbox || !lightboxImg) return;
        lightboxImg.src = imgSrc;
        lightboxImg.alt = captionText || 'Portfolio preview';
        if (lightboxCaption) {
            lightboxCaption.textContent = captionText || '';
        }
        portfolioLightbox.classList.add('is-open');
        portfolioLightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closePortfolioLightbox() {
        if (!portfolioLightbox) return;
        portfolioLightbox.classList.remove('is-open');
        portfolioLightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (lightboxImg) lightboxImg.src = '';
    }

    if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closePortfolioLightbox);
    if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closePortfolioLightbox);

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && portfolioLightbox && portfolioLightbox.classList.contains('is-open')) {
            closePortfolioLightbox();
        }
    });

    // Wire up clicking on folder project image frame or image:
    if (folderImg) {
        folderImg.addEventListener('click', (e) => {
            e.stopPropagation();
            const caption = folderTitle ? folderTitle.textContent : folderImg.alt;
            openPortfolioLightbox(folderImg.src, caption);
        });
    }

    const folderImgFrame = document.getElementById('folder-img-frame');
    if (folderImgFrame) {
        folderImgFrame.addEventListener('click', (e) => {
            if (e.target.closest('.folder-chevron-btn')) return;
            if (folderImg) {
                const caption = folderTitle ? folderTitle.textContent : folderImg.alt;
                openPortfolioLightbox(folderImg.src, caption);
            }
        });
    }

    // Wire up clicking on thumbnail images in notebook cards:
    document.querySelectorAll('.artwork-thumb-img, .artwork-thumb-container').forEach(thumbEl => {
        thumbEl.addEventListener('click', (e) => {
            e.stopPropagation();
            const img = thumbEl.tagName === 'IMG' ? thumbEl : thumbEl.querySelector('img');
            if (img) {
                const card = thumbEl.closest('.notebook-card');
                const catTitle = card ? card.querySelector('.notebook-category-title') : null;
                const caption = catTitle ? catTitle.textContent : img.alt;
                openPortfolioLightbox(img.src, caption);
            }
        });
    });

    // =========================================================================
    // 4. HIRE ME MODAL
    // =========================================================================
    const hireModal = document.getElementById('hire-modal');
    const hireBackdrop = document.getElementById('hire-backdrop');
    const hireCloseBtn = document.getElementById('hire-close-btn');

    function openHireModal() {
        if (!hireModal) return;
        hireModal.classList.add('active');
        hireModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeHireModal() {
        if (!hireModal) return;
        hireModal.classList.remove('active');
        hireModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    if (hireCloseBtn) hireCloseBtn.addEventListener('click', closeHireModal);
    if (hireBackdrop) hireBackdrop.addEventListener('click', closeHireModal);

    // Global Escape key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeHireModal();
            closeDrawer();
        }
    });

    // =========================================================================
    // 5. INTERACTIVE ANIMATED CHARACTER DOODLES (Hero & Hire Me Sections)
    // =========================================================================
    const characterDoodle = document.getElementById('character-doodle');
    const hireCharacterDoodle = document.getElementById('hire-character-doodle');

    let doodleAudioCtx = null;
    function getDoodleAudioContext() {
        if (!doodleAudioCtx) {
            const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
            if (AudioCtxClass) {
                doodleAudioCtx = new AudioCtxClass();
            }
        }
        if (doodleAudioCtx && doodleAudioCtx.state === 'suspended') {
            doodleAudioCtx.resume();
        }
        return doodleAudioCtx;
    }

    // Playful squeaky rubber toy sound effect synthesized via Web Audio API
    function playSqueakyToySound(isAngry = false) {
        try {
            const ctx = getDoodleAudioContext();
            if (!ctx) return;
            const now = ctx.currentTime;

            if (isAngry) {
                // High-pitched frantic triple squeak when annoyed
                [0, 0.08, 0.16].forEach((delay, idx) => {
                    const startF = 1200 + idx * 250;
                    const peakF = 2800 + idx * 300;
                    renderSqueakTone(ctx, now + delay, startF, peakF, 0.09, 0.35);
                });
            } else {
                // Classic cute children's rubber toy squeak: chirp up & release
                renderSqueakTone(ctx, now, 850, 2200, 0.13, 0.32);
                renderSqueakTone(ctx, now + 0.08, 1900, 2600, 0.09, 0.22);
            }
        } catch (e) {
            // Audio context restricted or unavailable
        }
    }

    function renderSqueakTone(ctx, startTime, startFreq, peakFreq, duration, maxVolume) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle'; // triangle wave has warm rubber harmonics

        // Rapid frequency slide up then slight release down
        osc.frequency.setValueAtTime(startFreq, startTime);
        osc.frequency.exponentialRampToValueAtTime(peakFreq, startTime + duration * 0.55);
        osc.frequency.exponentialRampToValueAtTime(startFreq * 1.15, startTime + duration);

        // Quick attack and smooth decay
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(maxVolume, startTime + duration * 0.18);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration * 0.88);
        gain.gain.linearRampToValueAtTime(0, startTime + duration);

        // High reed harmonic for squeaker air-valve whistle
        const whistle = ctx.createOscillator();
        const whistleGain = ctx.createGain();
        whistle.type = 'sine';
        whistle.frequency.setValueAtTime(startFreq * 2.1, startTime);
        whistle.frequency.exponentialRampToValueAtTime(peakFreq * 1.8, startTime + duration * 0.55);

        whistleGain.gain.setValueAtTime(0, startTime);
        whistleGain.gain.linearRampToValueAtTime(maxVolume * 0.35, startTime + duration * 0.15);
        whistleGain.gain.exponentialRampToValueAtTime(0.01, startTime + duration * 0.85);
        whistleGain.gain.linearRampToValueAtTime(0, startTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        whistle.connect(whistleGain);
        whistleGain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration);

        whistle.start(startTime);
        whistle.stop(startTime + duration);
    }

    function attachDoodleInteraction(el) {
        if (!el) return;

        let clickCount = 0;
        let clickResetTimer = null;
        let angryTimeout = null;
        let isAngry = false;
        let lastSoundTime = 0;

        el.addEventListener('pointerdown', () => {
            el.classList.add('squishy-pressed');
            const now = Date.now();
            if (now - lastSoundTime > 80) {
                lastSoundTime = now;
                playSqueakyToySound(isAngry);
            }
        });

        window.addEventListener('pointerup', () => {
            el.classList.remove('squishy-pressed');
        });

        el.addEventListener('click', (e) => {
            el.classList.remove('bounce-active');
            void el.offsetWidth;
            el.classList.add('bounce-active');

            if (isAngry) {
                createAngryPop(e.clientX, e.clientY, el);
                playSqueakyToySound(true);
                return;
            }

            clickCount++;
            if (clickResetTimer) clearTimeout(clickResetTimer);

            if (clickCount >= 5) {
                // 5x clicks triggered! Turn angry for 3 seconds
                clickCount = 0;
                isAngry = true;
                el.classList.add('is-angry');
                playSqueakyToySound(true);
                createAngryPop(e.clientX, e.clientY, el);

                if (angryTimeout) clearTimeout(angryTimeout);
                angryTimeout = setTimeout(() => {
                    el.classList.remove('is-angry');
                    isAngry = false;
                }, 3000);
            } else {
                createSparklePop(e.clientX, e.clientY, el);
                clickResetTimer = setTimeout(() => {
                    clickCount = 0;
                }, 2500);
            }
        });

        el.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                el.classList.remove('bounce-active');
                void el.offsetWidth;
                el.classList.add('bounce-active');
                playSqueakyToySound(isAngry);
                if (isAngry) {
                    createAngryPop(null, null, el);
                } else {
                    clickCount++;
                    if (clickCount >= 5) {
                        clickCount = 0;
                        isAngry = true;
                        el.classList.add('is-angry');
                        createAngryPop(null, null, el);
                        if (angryTimeout) clearTimeout(angryTimeout);
                        angryTimeout = setTimeout(() => {
                            el.classList.remove('is-angry');
                            isAngry = false;
                        }, 3000);
                    } else {
                        createSparklePop(null, null, el);
                    }
                }
            }
        });

        el.addEventListener('animationend', (e) => {
            if (e.animationName === 'squishyJellyBounce' || e.animationName === 'characterClickBounce') {
                el.classList.remove('bounce-active');
            }
        });
    }

    attachDoodleInteraction(characterDoodle);
    attachDoodleInteraction(hireCharacterDoodle);

    function createAngryPop(x, y, targetEl = characterDoodle) {
        const symbols = ['💢', '⚡', '💥', '💨'];
        const burstCount = 6;
        let originX = x;
        let originY = y;

        if ((!originX || !originY) && targetEl) {
            const rect = targetEl.getBoundingClientRect();
            originX = rect.left + rect.width / 2;
            originY = rect.top + rect.height / 2;
        }

        for (let i = 0; i < burstCount; i++) {
            const angryParticle = document.createElement('span');
            angryParticle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            angryParticle.style.position = 'fixed';
            angryParticle.style.left = `${originX}px`;
            angryParticle.style.top = `${originY}px`;
            angryParticle.style.fontSize = `${Math.floor(Math.random() * 14 + 18)}px`;
            angryParticle.style.pointerEvents = 'none';
            angryParticle.style.zIndex = '9999';
            angryParticle.style.userSelect = 'none';
            angryParticle.style.transition = 'all 0.65s cubic-bezier(0.25, 1, 0.5, 1)';
            angryParticle.style.transform = 'translate(-50%, -50%) scale(0.6)';
            angryParticle.style.opacity = '1';

            document.body.appendChild(angryParticle);

            const angle = (Math.PI * 2 * i) / burstCount + (Math.random() - 0.5);
            const distance = Math.random() * 75 + 45;
            const destX = Math.cos(angle) * distance;
            const destY = Math.sin(angle) * distance - 25;

            requestAnimationFrame(() => {
                angryParticle.style.transform = `translate(calc(-50% + ${destX}px), calc(-50% + ${destY}px)) scale(1.35) rotate(${Math.random() * 60 - 30}deg)`;
                angryParticle.style.opacity = '0';
            });

            setTimeout(() => {
                angryParticle.remove();
            }, 700);
        }
    }

    function createSparklePop(x, y, targetEl = characterDoodle) {
        const symbols = ['⭐', '✨', '✏️', '💖', '🌟', '🌸'];
        const burstCount = 6;
        let originX = x;
        let originY = y;

        if ((!originX || !originY) && targetEl) {
            const rect = targetEl.getBoundingClientRect();
            originX = rect.left + rect.width / 2;
            originY = rect.top + rect.height / 2;
        }

        for (let i = 0; i < burstCount; i++) {
            const sparkle = document.createElement('span');
            sparkle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            sparkle.style.position = 'fixed';
            sparkle.style.left = `${originX}px`;
            sparkle.style.top = `${originY}px`;
            sparkle.style.fontSize = `${Math.floor(Math.random() * 12 + 16)}px`;
            sparkle.style.pointerEvents = 'none';
            sparkle.style.zIndex = '9999';
            sparkle.style.userSelect = 'none';
            sparkle.style.transition = 'all 0.65s cubic-bezier(0.25, 1, 0.5, 1)';
            sparkle.style.transform = 'translate(-50%, -50%) scale(0.6)';
            sparkle.style.opacity = '1';

            document.body.appendChild(sparkle);

            const angle = (Math.PI * 2 * i) / burstCount + (Math.random() - 0.5);
            const distance = Math.random() * 65 + 40;
            const destX = Math.cos(angle) * distance;
            const destY = Math.sin(angle) * distance - 25;

            requestAnimationFrame(() => {
                sparkle.style.transform = `translate(calc(-50% + ${destX}px), calc(-50% + ${destY}px)) scale(1.25) rotate(${Math.random() * 60 - 30}deg)`;
                sparkle.style.opacity = '0';
            });

            setTimeout(() => {
                sparkle.remove();
            }, 700);
        }
    }

    // =========================================================================
    // 5.1B ABOUT ME TYPING ANIMATION
    // Typing animation for bio description, triggers when section enters viewport
    // =========================================================================
    const aboutTypingEl = document.getElementById('about-typing-text');
    if (aboutTypingEl) {
        const fullBioText = aboutTypingEl.textContent.trim().replace(/\s+/g, ' ');
        let typingStarted = false;

        function runTypingAnimation() {
            if (typingStarted) return;
            typingStarted = true;

            aboutTypingEl.textContent = '';
            const cursor = document.createElement('span');
            cursor.className = 'typing-cursor';
            cursor.setAttribute('aria-hidden', 'true');
            aboutTypingEl.appendChild(cursor);

            let charIdx = 0;
            const totalChars = fullBioText.length;
            const totalDurationMs = 3000; // completes in 3.0s total
            const startTime = performance.now();

            function typeNext() {
                const now = performance.now();
                const elapsed = now - startTime;
                const targetIdx = Math.min(totalChars, Math.floor((elapsed / totalDurationMs) * totalChars));

                if (targetIdx > charIdx) {
                    charIdx = targetIdx;
                    aboutTypingEl.textContent = fullBioText.slice(0, charIdx);
                    aboutTypingEl.appendChild(cursor);
                }

                if (charIdx < totalChars) {
                    requestAnimationFrame(typeNext);
                } else {
                    aboutTypingEl.textContent = fullBioText;
                    aboutTypingEl.appendChild(cursor);
                    // Fade out cursor after brief pause
                    setTimeout(() => {
                        cursor.style.transition = 'opacity 0.4s';
                        cursor.style.opacity = '0';
                        setTimeout(() => cursor.remove(), 400);
                    }, 1200);
                }
            }

            requestAnimationFrame(typeNext);
        }

        if ('IntersectionObserver' in window) {
            const aboutSection = document.getElementById('about');
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        runTypingAnimation();
                        observer.disconnect();
                    }
                });
            }, { threshold: 0.25 });
            if (aboutSection) observer.observe(aboutSection);
            else runTypingAnimation();
        } else {
            runTypingAnimation();
        }
    }

    // =========================================================================
    // 5.1C DOUMAGOTCHI TYPING ANIMATION
    // Typing animation for Doumagotchi subtitle (1.5 seconds)
    // =========================================================================
    const doumagotchiTypingEl = document.getElementById('doumagotchi-typing-text');
    if (doumagotchiTypingEl) {
        // Text part 1, coin image, text part 2
        const part1Text = "Meet Doumagotchi! Pet her 10 times to unlock her evolution! Show her lots of love and collect ";
        const part2Text = " Doucoin to customize her style!";
        const totalChars = part1Text.length + part2Text.length;
        const totalDurationMs = 1500; // 1.5 seconds
        let doumagotchiTypingStarted = false;

        function runDoumagotchiTyping() {
            if (doumagotchiTypingStarted) return;
            doumagotchiTypingStarted = true;

            doumagotchiTypingEl.innerHTML = '';
            const cursor = document.createElement('span');
            cursor.className = 'typing-cursor';
            cursor.setAttribute('aria-hidden', 'true');
            doumagotchiTypingEl.appendChild(cursor);

            const coinImg = document.createElement('img');
            coinImg.src = 'asssets/image/doucoin.png';
            coinImg.alt = 'Doucoin';
            coinImg.className = 'subtitle-doucoin';
            coinImg.setAttribute('aria-hidden', 'true');

            let charIdx = 0;
            const startTime = performance.now();

            function typeNext() {
                const now = performance.now();
                const elapsed = now - startTime;
                const targetIdx = Math.min(totalChars, Math.floor((elapsed / totalDurationMs) * totalChars));

                if (targetIdx > charIdx) {
                    charIdx = targetIdx;
                    doumagotchiTypingEl.innerHTML = '';

                    if (charIdx <= part1Text.length) {
                        doumagotchiTypingEl.appendChild(document.createTextNode(part1Text.slice(0, charIdx)));
                        doumagotchiTypingEl.appendChild(cursor);
                    } else {
                        doumagotchiTypingEl.appendChild(document.createTextNode(part1Text));
                        doumagotchiTypingEl.appendChild(coinImg);
                        const part2Chars = charIdx - part1Text.length;
                        doumagotchiTypingEl.appendChild(document.createTextNode(part2Text.slice(0, part2Chars)));
                        doumagotchiTypingEl.appendChild(cursor);
                    }
                }

                if (charIdx < totalChars) {
                    requestAnimationFrame(typeNext);
                } else {
                    doumagotchiTypingEl.innerHTML = '';
                    doumagotchiTypingEl.appendChild(document.createTextNode(part1Text));
                    doumagotchiTypingEl.appendChild(coinImg);
                    doumagotchiTypingEl.appendChild(document.createTextNode(part2Text));
                    doumagotchiTypingEl.appendChild(cursor);

                    setTimeout(() => {
                        cursor.style.transition = 'opacity 0.4s';
                        cursor.style.opacity = '0';
                        setTimeout(() => cursor.remove(), 400);
                    }, 1200);
                }
            }

            requestAnimationFrame(typeNext);
        }

        if ('IntersectionObserver' in window) {
            const petSection = document.getElementById('pet-my-cat');
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        runDoumagotchiTyping();
                        observer.disconnect();
                    }
                });
            }, { threshold: 0.2 });
            if (petSection) observer.observe(petSection);
            else runDoumagotchiTyping();
        } else {
            runDoumagotchiTyping();
        }
    }

    // =========================================================================
    // 5.2 INTERACTIVE "PET MY CAT" (DOUMAGOTCHI)
    // Egg → Evolution → Dou phases, 3-frame expression cycling, sound effects
    // =========================================================================
    const tamagotchiScreen = document.getElementById('tamagotchi-screen');
    const tamagotchiCat = document.getElementById('tamagotchi-cat');
    const screenParticles = document.getElementById('screen-particles');
    const petProgressFill = document.getElementById('pet-progress-fill');
    const petCounterText = document.getElementById('pet-counter-text');
    const statusIcon = document.getElementById('status-icon');
    const statusLabel = document.getElementById('status-label');

    // Phase elements
    const eggAnim = document.getElementById('egg-anim');
    const evolutionAnimEl = document.getElementById('evolution-anim');
    const douAnim = document.getElementById('dou-anim');

    // Game state
    let gamePhase = 'egg'; // 'egg' | 'evolving' | 'dou'
    let eggTapCount = 0;
    const evolutionTarget = 10;
    let patCount = 0;
    let isEvolved = false;
    let currentCatFrame = 1; // 1: calm, 2: meow, 3: happy
    let doucoinCount = 0;
    let shopUnlocked = false; // locked and blurred during egg phase; unlocks when evolved into dou
    // Track owned accessories and currently worn accessory
    const ownedAccessories = new Set();
    let currentEquippedAccId = null;

    // Web Audio Synthesizer & Sound FX Engine
    let audioCtx = null;

    function getAudioContext() {
        if (!audioCtx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
                audioCtx = new AudioContextClass();
            }
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        return audioCtx;
    }

    // Playful Squeaky Toy Sound FX
    function playSqueakSound() {
        try {
            const sound = new Audio('asssets/audio/squeak.wav');
            sound.volume = 0.85;
            sound.play().catch(() => {
                synthesizeSqueak();
            });
        } catch (e) {
            synthesizeSqueak();
        }
    }

    function synthesizeSqueak() {
        const ctx = getAudioContext();
        if (!ctx) return;
        const now = ctx.currentTime;
        
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(950, now);
        osc.frequency.exponentialRampToValueAtTime(2600, now + 0.04);
        osc.frequency.exponentialRampToValueAtTime(1700, now + 0.11);
        
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.28, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(now);
        osc.stop(now + 0.12);
    }

    // Cute Cat's Meow Sound FX
    function playMeowSound() {
        try {
            const sound = new Audio('asssets/audio/meow.wav');
            sound.volume = 0.9;
            sound.play().catch(() => {
                synthesizeMeow();
            });
        } catch (e) {
            synthesizeMeow();
        }
    }

    function synthesizeMeow() {
        const ctx = getAudioContext();
        if (!ctx) return;
        const now = ctx.currentTime;
        
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(460, now);
        osc.frequency.linearRampToValueAtTime(700, now + 0.12);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.36);
        
        filter.type = 'bandpass';
        filter.Q.value = 2.4;
        filter.frequency.setValueAtTime(800, now);
        filter.frequency.linearRampToValueAtTime(1600, now + 0.15);
        filter.frequency.exponentialRampToValueAtTime(600, now + 0.36);
        
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.30, now + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.36);
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(now);
        osc.stop(now + 0.36);
    }

    // Egg Tap Sound FX — crisp hollow eggshell knock ("tok tok")
    function playEggTapSound() {
        try {
            const sound = new Audio('asssets/audio/egg-tap.wav');
            sound.volume = 0.95;
            sound.play().catch(() => {
                synthesizeEggTap();
            });
        } catch (e) {
            synthesizeEggTap();
        }
    }

    function synthesizeEggTap() {
        const ctx = getAudioContext();
        if (!ctx) return;
        const now = ctx.currentTime;

        // 1. High-frequency brittle eggshell crackle/click
        const clickOsc = ctx.createOscillator();
        const clickGain = ctx.createGain();
        clickOsc.type = 'triangle';
        clickOsc.frequency.setValueAtTime(2800, now);
        clickOsc.frequency.exponentialRampToValueAtTime(1400, now + 0.025);
        clickGain.gain.setValueAtTime(0.55, now);
        clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
        clickOsc.connect(clickGain);
        clickGain.connect(ctx.destination);
        clickOsc.start(now);
        clickOsc.stop(now + 0.035);

        // 2. Hollow acoustic eggshell body resonance ("tok" thump)
        const bodyOsc = ctx.createOscillator();
        const bodyGain = ctx.createGain();
        bodyOsc.type = 'sine';
        bodyOsc.frequency.setValueAtTime(860, now);
        bodyOsc.frequency.exponentialRampToValueAtTime(620, now + 0.06);
        bodyGain.gain.setValueAtTime(0.75, now);
        bodyGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
        bodyOsc.connect(bodyGain);
        bodyGain.connect(ctx.destination);
        bodyOsc.start(now);
        bodyOsc.stop(now + 0.075);

        // 3. Impact transient noise
        const bufLen = Math.floor(ctx.sampleRate * 0.02);
        const buffer = ctx.createBuffer(1, bufLen, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufLen; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufLen, 4);
        }
        const noiseSrc = ctx.createBufferSource();
        noiseSrc.buffer = buffer;
        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = 'bandpass';
        noiseFilter.frequency.value = 2200;
        noiseFilter.Q.value = 1.2;
        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.35, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
        noiseSrc.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        noiseSrc.start(now);
    }

    // Set Cat Expression Frame (1, 2, or 3)
    function setCatFrame(frameIndex) {
        if (!tamagotchiCat) return;
        currentCatFrame = frameIndex;
        tamagotchiCat.setAttribute('data-frame', String(currentCatFrame));
    }

    // Cycle Cat Frame sequentially: 1 -> 2 -> 3 -> 1
    function cycleCatFrame() {
        let nextFrame = currentCatFrame + 1;
        if (nextFrame > 3) nextFrame = 1;
        setCatFrame(nextFrame);
        return nextFrame;
    }

    // Spawn cute floating particle inside screen
    function spawnScreenParticle(emoji, xPercent = null, yPercent = null) {
        if (!screenParticles) return;
        const particle = document.createElement('span');
        particle.className = 'floating-particle';
        particle.textContent = emoji;
        
        const px = xPercent !== null ? xPercent : (20 + Math.random() * 60);
        const py = yPercent !== null ? yPercent : (45 + Math.random() * 40);
        particle.style.left = `${px}%`;
        particle.style.top = `${py}%`;
        particle.style.setProperty('--dx', `${(Math.random() - 0.5) * 40}px`);
        particle.style.setProperty('--rot', `${(Math.random() - 0.5) * 50}deg`);

        screenParticles.appendChild(particle);
        setTimeout(() => {
            particle.remove();
        }, 1300);
    }

    // Update Affectionate Meter & Coin Counter
    function updateEvolutionProgress(amount = 1) {
        // Earn 1 doucoin per tap
        doucoinCount += amount;
        updateCoinDisplay();

        // Update affordability states in shop
        updateShopAffordability();

        // Once Dou is evolved, keep the progress bar full (100%) and label permanent
        if (isEvolved) {
            if (petProgressFill) {
                petProgressFill.style.width = '100%';
            }
            const progressbar = document.getElementById('pet-progressbar');
            if (progressbar) {
                progressbar.setAttribute('aria-valuenow', 100);
            }
            if (statusLabel) {
                statusLabel.textContent = 'Dou is Deeply Loved!';
            }
            return;
        }

        patCount = Math.min(evolutionTarget, patCount + amount);
        const percent = Math.min(100, Math.round((patCount / evolutionTarget) * 100));

        if (petCounterText) {
            petCounterText.textContent = `${patCount} / ${evolutionTarget} love`;
        }
        if (petProgressFill) {
            petProgressFill.style.width = `${percent}%`;
        }
        const progressbar = document.getElementById('pet-progressbar');
        if (progressbar) {
            progressbar.setAttribute('aria-valuenow', percent);
        }

        // Trigger reward at exactly 100 love!
        if (patCount >= evolutionTarget && !isEvolved) {
            triggerDouEvolution();
        }
    }

    // Update Doucoin display
    function updateCoinDisplay() {
        const coinText = document.getElementById('coin-count-text');
        if (coinText) {
            coinText.textContent = doucoinCount;
            // Only animate pop when display is visible
            if (shopUnlocked) {
                coinText.classList.remove('coin-pop');
                void coinText.offsetWidth;
                coinText.classList.add('coin-pop');
            }
        }
    }

    // Update shop button lock/unlock affordability states
    function updateShopAffordability() {
        document.querySelectorAll('.dou-acc-btn').forEach(btn => {
            const accId = btn.dataset.acc;
            const price = parseInt(btn.dataset.price, 10);
            
            // If already purchased, it's owned and never locked
            if (ownedAccessories.has(accId)) {
                btn.classList.remove('is-locked');
                return;
            }

            // If not yet owned, lock when coins are insufficient
            if (doucoinCount < price) {
                btn.classList.add('is-locked');
            } else {
                btn.classList.remove('is-locked');
            }
        });
    }

    // 100-Love Affection Milestone: Show Reward Notice
    function triggerDouEvolution() {
        isEvolved = true;
        patCount = evolutionTarget;
        if (statusIcon) statusIcon.textContent = '👑';
        if (statusLabel) statusLabel.textContent = 'Dou is Deeply Loved!';
        if (petCounterText) {
            petCounterText.textContent = `👑 10 / 10 love!`;
        }
        if (petProgressFill) {
            petProgressFill.style.width = '100%';
            petProgressFill.style.background = 'linear-gradient(90deg, #DE995B, #F2C94C, #FFD700)';
        }
        const progressbar = document.getElementById('pet-progressbar');
        if (progressbar) {
            progressbar.setAttribute('aria-valuenow', 100);
        }

        // Celebratory meows
        playMeowSound();
        setTimeout(playMeowSound, 260);

        // Mega confetti & sparkles burst
        const symbols = ['⭐', '✨', '🥖', '💖', '👑', '🎉', '🌟', '🧁', '🥐', '❤️'];
        for (let i = 0; i < 24; i++) {
            setTimeout(() => {
                const sym = symbols[Math.floor(Math.random() * symbols.length)];
                spawnScreenParticle(sym, 10 + Math.random() * 80, 20 + Math.random() * 60);
            }, i * 65);
        }
        createSparklePop(null, null, tamagotchiScreen);

        // Show the reward notice box after short delay
        setTimeout(() => {
            const rewardOverlay = document.getElementById('dou-reward-overlay');
            if (rewardOverlay) {
                rewardOverlay.removeAttribute('aria-hidden');
                rewardOverlay.classList.add('is-visible');
            }
        }, 900);
    }

    // Claim reward & unlock shop
    const rewardClaimBtn = document.getElementById('dou-reward-claim-btn');
    if (rewardClaimBtn) {
        rewardClaimBtn.addEventListener('click', () => {
            const rewardOverlay = document.getElementById('dou-reward-overlay');
            if (rewardOverlay) {
                rewardOverlay.classList.remove('is-visible');
                rewardOverlay.setAttribute('aria-hidden', 'true');
            }
            // Unlock the shop after overlay closes
            setTimeout(() => {
                unlockAccessoryShop();
            }, 500);
        });
    }

    function unlockAccessoryShop() {
        if (shopUnlocked) return;
        shopUnlocked = true;

        const shopWrapper = document.getElementById('dou-shop-wrapper');
        if (shopWrapper) {
            shopWrapper.classList.remove('is-egg-locked');
        }
        const lockOverlay = document.getElementById('dou-shop-lock-overlay');
        if (lockOverlay) {
            lockOverlay.setAttribute('aria-hidden', 'true');
        }

        // Scarf (acc-6) is free — auto-mark as owned on evolution
        markAccessoryAsOwned('6');

        // Panel is always visible; just update affordability and init buttons
        updateShopAffordability();
        initAccessoryButtons();
    }

    // Lock overlay shake interaction when clicked during egg phase
    const shopLockOverlay = document.getElementById('dou-shop-lock-overlay');
    if (shopLockOverlay) {
        shopLockOverlay.addEventListener('click', () => {
            const badge = document.getElementById('dou-lock-badge');
            if (badge) {
                badge.classList.remove('shake');
                void badge.offsetWidth;
                badge.classList.add('shake');
            }
        });
    }

    // Mark an accessory as purchased & owned
    function markAccessoryAsOwned(accId) {
        ownedAccessories.add(accId);
        const btn = document.getElementById(`acc-btn-${accId}`);
        if (btn) {
            btn.classList.add('is-owned');
            btn.classList.remove('is-locked');
            const priceEl = btn.querySelector('.acc-btn-price');
            if (priceEl) {
                priceEl.textContent = 'Owned';
                priceEl.classList.add('is-owned-text');
            }
        }
    }

    // Equip an accessory on the cat (replaces current worn accessory)
    // The accessory stays worn until the user taps another accessory
    function equipAccessory(accId, slot, imgSrc) {
        const layer = document.getElementById('cat-accessory-layer');
        if (!layer) return;

        // If this accessory is already worn, keep it worn (don't unequip)
        if (currentEquippedAccId === accId) {
            return;
        }

        // Remove previously worn accessory
        if (currentEquippedAccId) {
            const oldEl = layer.querySelector(`[data-acc-id="${currentEquippedAccId}"]`);
            if (oldEl) {
                oldEl.classList.remove('acc-visible');
                setTimeout(() => oldEl.remove(), 250);
            }
            const oldBtn = document.getElementById(`acc-btn-${currentEquippedAccId}`);
            if (oldBtn) oldBtn.classList.remove('is-equipped');
        }

        // Create and display the new accessory overlay
        const img = document.createElement('img');
        img.src = imgSrc;
        img.alt = '';
        img.className = 'cat-acc-overlay';
        img.setAttribute('data-acc-id', accId);
        img.setAttribute('data-slot', slot);
        img.draggable = false;
        layer.appendChild(img);

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                img.classList.add('acc-visible');
            });
        });

        currentEquippedAccId = accId;

        // Mark the button as currently equipped
        const btn = document.getElementById(`acc-btn-${accId}`);
        if (btn) btn.classList.add('is-equipped');
    }

    let accessoryButtonsInitialized = false;

    // Wire up accessory shop buttons
    function initAccessoryButtons() {
        if (accessoryButtonsInitialized) return;
        accessoryButtonsInitialized = true;

        document.querySelectorAll('.dou-acc-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (!shopUnlocked) return;
                const accId = btn.dataset.acc;
                const price = parseInt(btn.dataset.price, 10);
                const slot = btn.dataset.slot;
                const imgSrc = btn.querySelector('.acc-btn-img').src;
                const isOwned = ownedAccessories.has(accId);

                // If not owned yet, user must buy it with Doucoin (price=0 means free)
                if (!isOwned) {
                    if (price > 0 && doucoinCount < price) {
                        // Shake coin display if insufficient coins
                        const coinDisplay = document.getElementById('pet-coin-display');
                        if (coinDisplay) {
                            coinDisplay.style.animation = 'none';
                            void coinDisplay.offsetWidth;
                            coinDisplay.style.animation = '';
                            coinDisplay.style.setProperty('animation', 'coinShake 0.4s ease forwards', 'important');
                            setTimeout(() => coinDisplay.style.removeProperty('animation'), 500);
                        }
                        return;
                    }

                    // Deduct coins (only if price > 0), permanently mark as owned, and update price label to "Owned"
                    if (price > 0) {
                        doucoinCount -= price;
                        updateCoinDisplay();
                    }
                    markAccessoryAsOwned(accId);
                    updateShopAffordability();
                }

                // If this accessory is already currently worn, keep it
                if (currentEquippedAccId === accId) {
                    return;
                }

                // Play cheerful sound
                playMeowSound();

                // Wear the accessory on Dou until another accessory is tapped
                equipAccessory(accId, slot, imgSrc);
            });
        });
    }

    // Trigger Playful Squishy Jelly Bounce on Cat (Same as About Me)
    function triggerCatBounce() {
        if (!tamagotchiCat) return;
        tamagotchiCat.classList.remove('bounce-active');
        void tamagotchiCat.offsetWidth; // Force reflow
        tamagotchiCat.classList.add('bounce-active');
    }

    // 1. PAT CAT INTERACTION (Screen tap / pat)
    // Tapping cycles Asset 2 (calm) -> Asset 3 (meow) -> Asset 4 (happy) -> Asset 2
    // Plays cat's meow sound and squishy bounce
    function handleCatPat(e) {
        if (gamePhase !== 'dou') return;
        cycleCatFrame();
        triggerCatBounce();
        playMeowSound();
        updateEvolutionProgress(1);

        // +1 Doucoin floating pop above the tap point
        spawnDoucoinPop(e);
    }

    // Handle egg tap — count toward 100 to trigger evolution
    function handleEggTap(e) {
        if (gamePhase !== 'egg') return;
        eggTapCount = Math.min(evolutionTarget, eggTapCount + 1);

        // Update progress bar
        const percent = Math.round((eggTapCount / evolutionTarget) * 100);
        if (petProgressFill) petProgressFill.style.width = `${percent}%`;
        const progressbar = document.getElementById('pet-progressbar');
        if (progressbar) progressbar.setAttribute('aria-valuenow', percent);
        if (statusLabel) statusLabel.textContent = `${eggTapCount} / ${evolutionTarget}`;

        // Play crisp egg knock sound
        playEggTapSound();

        // Slight squish on egg container
        if (eggAnim) {
            eggAnim.style.transform = 'scale(0.93)';
            setTimeout(() => { eggAnim.style.transform = ''; }, 100);
        }

        // Trigger evolution at 100 taps
        if (eggTapCount >= evolutionTarget) {
            triggerEvolutionSequence();
        }
    }

    // Evolution sequence: egg → evolution anim (3s) → dou phase
    function triggerEvolutionSequence() {
        gamePhase = 'evolving';

        // Hide egg, show evolution animation
        if (eggAnim) eggAnim.style.display = 'none';
        if (evolutionAnimEl) {
            evolutionAnimEl.style.display = 'flex';
            evolutionAnimEl.removeAttribute('aria-hidden');
        }

        // Update progress bar to full
        if (petProgressFill) {
            petProgressFill.style.width = '100%';
            petProgressFill.style.background = 'linear-gradient(90deg, #DE995B, #F2C94C, #FFD700)';
        }
        if (statusLabel) statusLabel.textContent = 'Evolving...';

        // After 3 seconds, switch to dou phase
        setTimeout(() => {
            if (evolutionAnimEl) {
                evolutionAnimEl.style.display = 'none';
                evolutionAnimEl.setAttribute('aria-hidden', 'true');
            }
            if (douAnim) douAnim.style.display = 'flex';

            // Update screen aria-label
            if (tamagotchiScreen) {
                tamagotchiScreen.setAttribute('aria-label', 'Pet Dou! Tap or click to show affection');
            }

            gamePhase = 'dou';

            // Unlock accessories section now that egg evolved into Dou
            unlockAccessoryShop();

            // Now trigger the dou "reward" popup (renamed via HTML)
            triggerDouEvolution();
        }, 3000);
    }

    // Spawn a floating "+1 🪙" pop at the tap location
    function spawnDoucoinPop(e) {
        const pop = document.createElement('div');
        pop.className = 'doucoin-pop';
        pop.innerHTML = '<img src="asssets/image/doucoin.png" alt=""> +1';

        let x, y;
        if (e && e.clientX) {
            x = e.clientX;
            y = e.clientY;
        } else if (tamagotchiScreen) {
            const rect = tamagotchiScreen.getBoundingClientRect();
            x = rect.left + rect.width / 2;
            y = rect.top + rect.height / 3;
        } else {
            return;
        }

        pop.style.left = `${x}px`;
        pop.style.top  = `${y}px`;
        document.body.appendChild(pop);

        // Remove after animation completes
        pop.addEventListener('animationend', () => pop.remove(), { once: true });
    }

    if (tamagotchiScreen) {
        // Immediate squash down on pointerdown — sound depends on current phase
        tamagotchiScreen.addEventListener('pointerdown', () => {
            if (gamePhase === 'dou') {
                tamagotchiCat.classList.add('squishy-pressed');
                playSqueakSound();
            }
        });

        window.addEventListener('pointerup', () => {
            if (tamagotchiCat) {
                tamagotchiCat.classList.remove('squishy-pressed');
            }
        });

        // Click / tap — route to correct phase handler
        tamagotchiScreen.addEventListener('click', (e) => {
            if (gamePhase === 'egg') {
                handleEggTap(e);
            } else if (gamePhase === 'dou') {
                handleCatPat(e);
            }
        });

        // Keyboard accessibility
        tamagotchiScreen.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (gamePhase === 'egg') {
                    handleEggTap(null);
                } else if (gamePhase === 'dou') {
                    playSqueakSound();
                    handleCatPat(null);
                }
            }
        });

        tamagotchiCat.addEventListener('animationend', (e) => {
            if (e.animationName === 'squishyJellyBounce') {
                tamagotchiCat.classList.remove('bounce-active');
            }
        });
    }

    // =========================================================================
    // 5.3 CAT PAW CURSOR & RED MAROON FOOTPRINT TRAIL (Faithfully matching attachments)
    // =========================================================================

    // Initialize the customize shop immediately (panel always visible)
    updateShopAffordability();
    initAccessoryButtons();

    function initCatPawCursorAndTrail() {
        // Do not activate on touch-only devices
        if (window.matchMedia('(hover: none) or (pointer: coarse)').matches) {
            return;
        }

        const cursorEl = document.getElementById('cat-paw-cursor');
        const canvas = document.getElementById('footprint-canvas');
        if (!cursorEl || !canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Mark body as having custom cursor enabled
        document.body.classList.add('has-custom-cursor');

        // Manage canvas sizing with high-DPI scaling
        function resizeCanvas() {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = Math.round(window.innerWidth * dpr);
            canvas.height = Math.round(window.innerHeight * dpr);
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.scale(dpr, dpr);
            ctx.imageSmoothingEnabled = false;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas, { passive: true });

        // Preload custom paw trail footprints from attachment
        const pawLeftImg = new Image();
        pawLeftImg.src = 'asssets/image/footprint-custom-left.png';

        const pawRightImg = new Image();
        pawRightImg.src = 'asssets/image/footprint-custom-right.png';

        const pawPairImg = new Image();
        pawPairImg.src = 'asssets/image/footprint-custom-pair.png';

        const footprints = [];
        let lastX = null;
        let lastY = null;
        let stepCount = 0;
        let animFrame = null;

        // Add a footprint
        function addFootprint(x, y, angle, isClick = false) {
            if (isClick) {
                // Stamp paw pair on click
                footprints.push({
                    pageX: x + window.scrollX,
                    pageY: y + window.scrollY,
                    angle: angle,
                    image: pawPairImg,
                    birth: performance.now(),
                    duration: 1700,
                    baseScale: 1.05,
                    width: 36,
                    height: 20
                });
            } else {
                // Cat walking gait: alternate left and right footsteps from attachment
                const side = (stepCount % 2 === 0) ? 1 : -1;
                stepCount++;
                const lateralOffset = 7;
                const normalAngle = angle - Math.PI / 2;
                const spawnX = x + Math.cos(normalAngle) * (side * lateralOffset);
                const spawnY = y + Math.sin(normalAngle) * (side * lateralOffset);

                // Alternating left paw and right paw from attachment
                const pawImg = (side === 1) ? pawLeftImg : pawRightImg;
                const pw = (side === 1) ? 22 : 23;
                const ph = (side === 1) ? 20 : 21;

                footprints.push({
                    pageX: spawnX + window.scrollX,
                    pageY: spawnY + window.scrollY,
                    angle: angle,
                    image: pawImg,
                    birth: performance.now(),
                    duration: 1500,
                    baseScale: 0.95 + Math.random() * 0.12,
                    width: pw,
                    height: ph
                });
            }

            if (!animFrame) {
                animFrame = requestAnimationFrame(renderFootprints);
            }
        }

        // Animation render loop
        function renderFootprints(now) {
            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

            const scrollX = window.scrollX;
            const scrollY = window.scrollY;

            let i = footprints.length;
            while (i--) {
                const p = footprints[i];
                const age = now - p.birth;

                if (age >= p.duration) {
                    footprints.splice(i, 1);
                    continue;
                }

                const progress = age / p.duration;
                // Solid for initial 25% then smoothly fade
                const alpha = progress < 0.25 ? 1 : (1 - (progress - 0.25) / 0.75);
                const scale = (1 - progress * 0.18) * p.baseScale;

                const screenX = p.pageX - scrollX;
                const screenY = p.pageY - scrollY;

                // Viewport culling
                if (screenX < -50 || screenX > window.innerWidth + 50 || 
                    screenY < -50 || screenY > window.innerHeight + 50) {
                    continue;
                }

                if (p.image.complete && p.image.naturalWidth > 0) {
                    ctx.save();
                    ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
                    ctx.translate(screenX, screenY);
                    ctx.rotate(p.angle);
                    ctx.scale(scale, scale);
                    ctx.drawImage(p.image, -p.width / 2, -p.height / 2, p.width, p.height);
                    ctx.restore();
                }
            }

            if (footprints.length > 0) {
                animFrame = requestAnimationFrame(renderFootprints);
            } else {
                animFrame = null;
            }
        }

        // Pointer move event
        window.addEventListener('pointermove', (e) => {
            const x = e.clientX;
            const y = e.clientY;

            // Move the cat paw cursor instantly
            cursorEl.style.left = `${x}px`;
            cursorEl.style.top = `${y}px`;
            if (!cursorEl.classList.contains('visible')) {
                cursorEl.classList.add('visible');
            }

            if (lastX !== null && lastY !== null) {
                const dx = x - lastX;
                const dy = y - lastY;
                const dist = Math.hypot(dx, dy);

                // Spawn footprints every ~32px of travel
                if (dist >= 30) {
                    const angle = Math.atan2(dy, dx) + Math.PI / 2;
                    const steps = Math.min(Math.floor(dist / 32), 4);
                    for (let s = 1; s <= steps; s++) {
                        const interpX = lastX + (dx / steps) * s;
                        const interpY = lastY + (dy / steps) * s;
                        addFootprint(interpX, interpY, angle, false);
                    }
                    lastX = x;
                    lastY = y;
                }
            } else {
                lastX = x;
                lastY = y;
            }
        }, { passive: true });

        // Scroll listener to re-render footprints when moving
        window.addEventListener('scroll', () => {
            if (footprints.length > 0 && !animFrame) {
                animFrame = requestAnimationFrame(renderFootprints);
            }
        }, { passive: true });

        // Click / pointerdown: cute paw press & immediate stamp
        window.addEventListener('pointerdown', (e) => {
            cursorEl.classList.add('cursor-active');
            addFootprint(e.clientX, e.clientY, 0, true);
        }, { passive: true });

        window.addEventListener('pointerup', () => {
            cursorEl.classList.remove('cursor-active');
        }, { passive: true });

        // Hover detection on all interactive buttons, links, and cards
        const interactiveSelector = 'a, button, input, textarea, select, [role="button"], label, .notebook-card, .folder-tab-item, .carousel-arrow, .notebook-dot, .folder-chevron-btn, .folder-dot, .notebook-explore-btn, .modal-close-btn, .contact-hire-btn, .resume-pill-btn, .tamagotchi-screen, .tamagotchi-btn, .pet-action-btn, .folder-project-img, .artwork-thumb-img, .folder-image-frame, .lightbox-close-btn, .lightbox-backdrop, .folder-page-pill';

        document.addEventListener('mouseover', (e) => {
            if (e.target.closest(interactiveSelector)) {
                cursorEl.classList.add('cursor-hover');
            }
        }, { passive: true });

        document.addEventListener('mouseout', (e) => {
            if (e.target.closest(interactiveSelector)) {
                cursorEl.classList.remove('cursor-hover');
            }
        }, { passive: true });

        // Window boundary handling
        document.addEventListener('mouseleave', () => {
            cursorEl.classList.remove('visible');
        });

        document.addEventListener('mouseenter', () => {
            cursorEl.classList.add('visible');
        });
    }

    initCatPawCursorAndTrail();

    // =========================================================================
    // CONTACT FORM: "Leave me a message" → Open Gmail Compose
    // =========================================================================
    const hireContactForm = document.getElementById('hire-contact-form');
    if (hireContactForm) {
        hireContactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name    = document.getElementById('contact-name').value.trim();
            const email   = document.getElementById('contact-email').value.trim();
            const message = document.getElementById('contact-message').value.trim();

            const subject = encodeURIComponent(`Portfolio Message from ${name || 'Someone'}`);
            const body    = encodeURIComponent(
                `Name: ${name || '(not provided)'}\nEmail: ${email || '(not provided)'}\n\nMessage:\n${message || '(empty)'}`
            );

            window.open(
                `mailto:taozidour@gmail.com?subject=${subject}&body=${body}`,
                '_blank'
            );
        });
    }

    // =========================================================================
    // EXPERIENCES & SKILLS — Accordion Toggle
    // =========================================================================
    document.querySelectorAll('.exp-accordion-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const isExpanded = btn.getAttribute('aria-expanded') === 'true';
            const content = btn.nextElementSibling;

            // Close other accordions in the same notebook card
            const parentCard = btn.closest('.exp-notebook-card');
            if (parentCard) {
                parentCard.querySelectorAll('.exp-accordion-btn').forEach(other => {
                    if (other !== btn) {
                        other.setAttribute('aria-expanded', 'false');
                        const otherContent = other.nextElementSibling;
                        if (otherContent) otherContent.hidden = true;
                    }
                });
            }

            // Toggle this one
            btn.setAttribute('aria-expanded', String(!isExpanded));
            if (content) content.hidden = isExpanded;
        });
    });

    // =========================================================================
    // DECORATIVE TOMATO — Spin on click (sections: About Me, Exp, Works, Pet, Hire)
    // =========================================================================
    document.querySelectorAll('.deco-sticker.tomat-spin-trigger').forEach(tomat => {
        tomat.addEventListener('click', () => {
            if (tomat.classList.contains('tomat-spinning')) return; // prevent retriggering
            tomat.classList.add('tomat-spinning');
            tomat.addEventListener('animationend', () => {
                tomat.classList.remove('tomat-spinning');
            }, { once: true });
        });
    });
});
