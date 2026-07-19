const pageMeta = {
            'home': {
                title: 'Adam Olendzki – Fotograf im Landkreis Landshut | Portrait-, Fashion-, Familien- und Businessfotografie',
                description: 'Portfolio von Adam Olendzki, Fotograf im Landkreis Landshut. Natürliche Portrait-, Fashion-, Familien- und Businessfotografie in Rottenburg an der Laaber, Landshut, Regensburg, Mainburg, Kelheim und Abensberg.'
            },
            'proj-immobilien': {
                title: 'Immobilienfotografie | Adam Olendzki – Fotograf im Landkreis Landshut',
                description: 'Portfolio von Adam Olendzki. Hochwertige Immobilienfotografie im Landkreis Landshut sowie in Rottenburg an der Laaber, Regensburg, Mainburg, Kelheim und Abensberg.'
            },
            'proj-product': {
                title: 'Produktfotografie | Adam Olendzki – Fotograf in Rottenburg an der Laaber',
                description: 'Portfolio von Adam Olendzki. Professionelle Produktfotografie in Rottenburg an der Laaber sowie im Landkreis Landshut, in Regensburg, Mainburg, Kelheim und Abensberg.'
            },
            'proj-tfp': {
                title: 'TFP-Projekte | Adam Olendzki – Fotograf im Landkreis Landshut',
                description: 'Portfolio von Adam Olendzki. Kreative TFP-Projekte im Landkreis Landshut sowie in Rottenburg an der Laaber, Regensburg, Mainburg, Kelheim und Abensberg.'
            }
        };

        function updateMetaForPage(pageId) {
            const meta = pageMeta[pageId] || pageMeta['home'];
            document.title = meta.title;
            const metaDescTag = document.querySelector('meta[name="description"]');
            if (metaDescTag) metaDescTag.setAttribute('content', meta.description);
        }

        function toggleFaq(btn) {
            const answer = btn.nextElementSibling;
            const isOpen = btn.classList.contains('open');
            btn.classList.toggle('open', !isOpen);
            answer.classList.toggle('visible', !isOpen);
        }

        function showPage(pageId) {
            const sections = document.querySelectorAll('.page-section');
            sections.forEach(section => section.classList.remove('active'));
            
            const activeSection = document.getElementById(pageId);
            if(activeSection) {
                activeSection.classList.add('active');
                activeSection.querySelectorAll('.scroll-reveal').forEach(function(item) {
                    item.classList.remove('in-view');
                });
            }
            updateMetaForPage(pageId);
            window.scrollTo(0, 0);
            requestAnimationFrame(function() {
                if (typeof updateActiveHeroFade === 'function') updateActiveHeroFade();
                if (typeof refreshTextReveals === 'function') refreshTextReveals();
            });
        }

        function setupBackButtons() {
            document.querySelectorAll('.page-section .back-btn').forEach(function(btn) {
                const label = (btn.dataset.fullLabel || btn.textContent || 'zuruck').replace(/\s+/g, ' ').trim();
                btn.dataset.fullLabel = label;
                btn.setAttribute('aria-label', label);
                btn.setAttribute('title', label);

                const section = btn.closest('.page-section');
                if (!section) return;

                let nav = btn.closest('.back-navigation');
                if (!nav) {
                    nav = document.createElement('div');
                    nav.className = 'back-navigation';
                    btn.parentNode.insertBefore(nav, btn);
                    nav.appendChild(btn);
                    const nextNode = nav.nextSibling;
                    if (nextNode && nextNode.nodeName === 'BR') {
                        nextNode.remove();
                    }
                }

                const quote = section.querySelector('.quote-block');
                const seo = section.querySelector('.seo-footprint-container');
                if (quote) {
                    quote.insertAdjacentElement('afterend', nav);
                } else if (seo) {
                    seo.insertAdjacentElement('beforebegin', nav);
                } else {
                    section.appendChild(nav);
                }
            });
        }

        function updateActiveHeroFade() {
            const activeSection = document.querySelector('.page-section.active');
            const activeHero = activeSection ? activeSection.querySelector('.hero, .portfolio-hero') : null;

            document.querySelectorAll('.hero, .portfolio-hero').forEach(function(hero) {
                if (hero !== activeHero) {
                    hero.style.setProperty('--hero-bg-opacity', '1');
                }
            });

            if (!activeHero) return;

            const rect = activeHero.getBoundingClientRect();
            const fadeDistance = Math.max(activeHero.offsetHeight * 0.85, 240);
            const progress = Math.min(Math.max(-rect.top / fadeDistance, 0), 1);
            activeHero.style.setProperty('--hero-bg-opacity', (1 - progress).toFixed(3));
        }


        let revealObserver;
        function setupTextReveals() {
            const revealItems = document.querySelectorAll('.mid-text-bar-content, .project-intro-text, .blog-intro, .article-container');
            revealItems.forEach(function(item) {
                item.classList.add('scroll-reveal');
            });

            if ('IntersectionObserver' in window) {
                revealObserver = new IntersectionObserver(function(entries) {
                    entries.forEach(function(entry) {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('in-view');
                        }
                    });
                }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });

                revealItems.forEach(function(item) {
                    revealObserver.observe(item);
                });
            } else {
                revealItems.forEach(function(item) {
                    item.classList.add('in-view');
                });
            }
            refreshTextReveals();
        }

        function refreshTextReveals() {
            const activeSection = document.querySelector('.page-section.active');
            if (!activeSection) return;
            activeSection.querySelectorAll('.scroll-reveal').forEach(function(item) {
                const rect = item.getBoundingClientRect();
                if (rect.top < window.innerHeight * 0.88 && rect.bottom > 0) {
                    item.classList.add('in-view');
                }
            });
        }
        let lastScrollTop = 0;
        const header = document.getElementById('floating-header');

        function updateScrollDarken() {
            const targets = [document.getElementById('p-pregnancy'), document.getElementById('p-business'), document.getElementById('p-couples'), document.getElementById('p-family'), document.getElementById('women-zone')].filter(Boolean);
            if (targets.length === 0) return;
            const maxShade = 0.35;
            const fadeDistance = 280;
            const progress = Math.min(Math.max(window.scrollY / fadeDistance, 0), 1);
            targets.forEach(target => target.style.setProperty('--top-shade', (progress * maxShade).toFixed(3)));
        }

        window.addEventListener('scroll', function() {
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (header) {
                if (scrollTop > lastScrollTop && scrollTop > 150) {
                    header.classList.add('hide');
                } else {
                    header.classList.remove('hide');
                }
            }
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
            updateActiveHeroFade();
            refreshTextReveals();
            updateScrollDarken();
        }, false);

        window.addEventListener('resize', updateActiveHeroFade);
        window.addEventListener('resize', updateScrollDarken);
        updateScrollDarken();
        setupBackButtons();
        setupTextReveals();
        updateActiveHeroFade();

        // BANER COOKIES
        function acceptCookies() {
            localStorage.setItem('cookiesAccepted', 'true');
            document.getElementById('cookie-banner').classList.remove('show');
        }
        if (!localStorage.getItem('cookiesAccepted')) {
            window.addEventListener('load', function() {
                document.getElementById('cookie-banner').classList.add('show');
            });
        }

function updateMidTextBarDarkening(){
    document.querySelectorAll('.page-section.active .mid-text-bar').forEach(bar=>{
        const section = bar.closest('.page-section');
        if (section && section.id === 'home') return;
        const rect=bar.getBoundingClientRect();
        const vh=window.innerHeight || 1;
        let progress=(vh-rect.top)/(vh+rect.height);
        progress=Math.max(0,Math.min(1,progress));
        const darkness=Math.min(progress*0.18,0.18);
        bar.style.setProperty('--scroll-darkness', darkness);
    });
}
window.addEventListener('scroll', updateMidTextBarDarkening, {passive:true});
window.addEventListener('resize', updateMidTextBarDarkening);
document.addEventListener('DOMContentLoaded', updateMidTextBarDarkening);

// GŁĘBOKIE LINKOWANIE: index.html#about, index.html#projects itd.
(function () {
    var sections = document.querySelectorAll('.page-section');
    if (sections.length <= 1) return; // osobna strona (family.html itp.) – nic nie rób
    var hash = window.location.hash.replace('#', '');
    if (hash) {
        var target = document.getElementById(hash);
        if (target && target.classList.contains('page-section')) {
            showPage(hash);
        } else {
            showPage('home');
        }
    } else {
        showPage('home');
    }
})();
