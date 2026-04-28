document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. NAVBAR SCROLL EFFECT ---
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });


    // --- 2. MOBILE MENU TOGGLE ---
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-link, .mobile-menu .nav-cta');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('open');
            mobileMenu.classList.toggle('open');
            document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('open');
                mobileMenu.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }


    // --- 3. SCROLL REVEAL ANIMATIONS ---
    const fadeElements = document.querySelectorAll('.fade-in');

    if (fadeElements.length > 0) {
        const fadeOptions = {
            threshold: 0.15,
            rootMargin: "0px 0px -50px 0px" 
        };

        const fadeOnScroll = new IntersectionObserver(function(entries, observer) {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    return;
                } else {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, fadeOptions);

        fadeElements.forEach(el => {
            fadeOnScroll.observe(el);
        });
    }


    // --- 4. STATS COUNTER ANIMATION ---
    const statNumbers = document.querySelectorAll('.hero-stat-num');
    
    if (statNumbers.length > 0) {
        const animateStats = () => {
            statNumbers.forEach(stat => {
                const count = parseInt(stat.dataset.count);
                const prefix = stat.dataset.prefix || '';
                const suffix = stat.dataset.suffix || '';
                let current = 0;
                const increment = count / 50;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= count) {
                        current = count;
                        clearInterval(timer);
                    }
                    stat.textContent = prefix + Math.floor(current) + suffix;
                }, 30);
            });
        };

        // Trigger stats animation when hero is visible
        const heroSection = document.getElementById('hero');
        const heroObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStats();
                    heroObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        heroObserver.observe(heroSection);
    }


    // --- 5. GOOGLE SHEETS FORM INTEGRATION & SPAM PROTECTION ---
    const form = document.getElementById('contact-form');
    const submitBtn = form ? form.querySelector('button[type="submit"]') : null;
    
    // PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL HERE:
    const scriptURL = 'YOUR_WEB_APP_URL_HERE';

    if (form && submitBtn) {
        form.addEventListener('submit', e => {
            e.preventDefault(); 
            
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = 'Sending...';
            submitBtn.style.opacity = '0.7';
            submitBtn.style.cursor = 'not-allowed';

            // Gather form data
            const formData = new FormData(form);

            // HONEYPOT CHECK: If the hidden field has text, it's a bot!
            if (formData.get('_honeypot')) {
                console.log("Bot detected. Submission blocked.");
                submitBtn.innerHTML = 'Message Sent!';
                submitBtn.style.backgroundColor = '#7B9E87'; 
                
                setTimeout(() => { 
                    form.reset(); 
                    submitBtn.innerHTML = originalText; 
                    submitBtn.style.backgroundColor = ''; 
                    submitBtn.style.opacity = '1';
                    submitBtn.style.cursor = 'pointer';
                }, 3000);
                
                return;
            }

            // Send data to Google Sheets
            fetch(scriptURL, { method: 'POST', body: formData})
                .then(response => {
                    submitBtn.innerHTML = 'Message Sent!';
                    submitBtn.style.backgroundColor = '#7B9E87'; 
                    submitBtn.style.opacity = '1';
                    form.reset();

                    setTimeout(() => {
                        submitBtn.innerHTML = originalText;
                        submitBtn.style.backgroundColor = '';
                        submitBtn.style.cursor = 'pointer';
                    }, 3000);
                })
                .catch(error => {
                    console.error('Error!', error.message);
                    submitBtn.innerHTML = 'Error. Try Again.';
                    submitBtn.style.backgroundColor = '#D9534F'; 
                    
                    setTimeout(() => {
                        submitBtn.innerHTML = originalText;
                        submitBtn.style.backgroundColor = '';
                        submitBtn.style.opacity = '1';
                        submitBtn.style.cursor = 'pointer';
                    }, 3000);
                });
        });
    }


    // --- 6. SMOOTH SCROLL FOR ANCHOR LINKS ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });


    // --- 7. SANITY HEADLESS CMS INTEGRATION (Optional - for dynamic content) ---
    const blogContainer = document.getElementById('cms-blog-container');
    const testimonialContainer = document.getElementById('cms-testimonial-container');

    // IMPORTANT: Replace these with your actual Sanity details later
    const SANITY_PROJECT_ID = 'YOUR_PROJECT_ID'; 
    const SANITY_DATASET = 'production'; 

    // --- BLOG LOGIC ---
    if (blogContainer) {
        const blogQuery = encodeURIComponent('*[_type == "post"] | order(publishedAt desc)[0...3] {title, "tag": category, excerpt, "slug": slug.current}');
        const sanityBlogUrl = `https://${SANITY_PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${SANITY_DATASET}?query=${blogQuery}`;

        async function fetchSanityPosts() {
            if (SANITY_PROJECT_ID === 'YOUR_PROJECT_ID') {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve([
                            { tag: "SEO Strategy", title: "The Future of Organic Search in 2026", excerpt: "Learn how AI overviews are changing the way users interact with search engine results pages...", slug: "#" },
                            { tag: "Paid Media", title: "Optimizing Ad Spend for B2B SaaS", excerpt: "A minimalist approach to structuring your campaigns for maximum ROI without burning cash...", slug: "#" },
                            { tag: "Analytics", title: "Tracking What Actually Matters", excerpt: "Stop looking at vanity metrics. Here are the 5 KPIs every modern brand should monitor...", slug: "#" }
                        ]);
                    }, 800);
                });
            }
            const response = await fetch(sanityBlogUrl);
            const data = await response.json();
            return data.result; 
        }

        async function renderBlogPosts() {
            blogContainer.innerHTML = '<p style="color: var(--text-muted); grid-column: 1 / -1; text-align: center;">Loading latest insights...</p>';

            try {
                const posts = await fetchSanityPosts();
                blogContainer.innerHTML = ''; 

                if (posts.length === 0) {
                    blogContainer.innerHTML = '<p style="grid-column: 1 / -1; text-align: center;">No insights published yet.</p>';
                    return;
                }

                posts.forEach(post => {
                    const article = document.createElement('article');
                    article.className = 'blog-card fade-in visible'; 
                    article.innerHTML = `
                        <span class="blog-tag">${post.tag || 'Insight'}</span>
                        <h3>${post.title}</h3>
                        <p>${post.excerpt}</p>
                        <a href="/blog/${post.slug}" class="read-more">Read Article &rarr;</a>
                    `;
                    blogContainer.appendChild(article);
                });
            } catch (error) {
                console.error("Error fetching Sanity Blog data:", error);
                blogContainer.innerHTML = '<p style="grid-column: 1 / -1; text-align: center;">Failed to load insights. Please try again later.</p>';
            }
        }

        renderBlogPosts();
    }

    // --- TESTIMONIAL LOGIC ---
    if (testimonialContainer) {
        const testimonialQuery = encodeURIComponent('*[_type == "testimonial"] | order(_createdAt desc)[0...2] {quote, author, role}');
        const sanityTestimonialUrl = `https://${SANITY_PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${SANITY_DATASET}?query=${testimonialQuery}`;

        async function fetchSanityTestimonials() {
            if (SANITY_PROJECT_ID === 'YOUR_PROJECT_ID') {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve([
                            { quote: "Agency transformed our digital presence. Our inbound leads doubled in just six months of working together.", author: "Jane Doe", role: "CEO of TechCorp" },
                            { quote: "The most transparent and results-driven marketing team we've ever partnered with. Pure excellence.", author: "John Smith", role: "Founder of RetailX" }
                        ]);
                    }, 800);
                });
            }
            const response = await fetch(sanityTestimonialUrl);
            const data = await response.json();
            return data.result; 
        }

        async function renderTestimonials() {
            testimonialContainer.innerHTML = '<p style="color: var(--text-muted); grid-column: 1 / -1; text-align: center;">Loading client success stories...</p>';

            try {
                const testimonials = await fetchSanityTestimonials();
                testimonialContainer.innerHTML = ''; 

                if (testimonials.length === 0) {
                    testimonialContainer.innerHTML = '<p style="grid-column: 1 / -1; text-align: center;">No testimonials published yet.</p>';
                    return;
                }

                testimonials.forEach(testimonial => {
                    const card = document.createElement('div');
                    card.className = 'test-card fade-in visible'; 
                    card.innerHTML = `
                        <blockquote>"${testimonial.quote}"</blockquote>
                        <div class="test-author">${testimonial.author}, ${testimonial.role}</div>
                    `;
                    testimonialContainer.appendChild(card);
                });
            } catch (error) {
                console.error("Error fetching Sanity Testimonial data:", error);
                testimonialContainer.innerHTML = '<p style="grid-column: 1 / -1; text-align: center;">Failed to load testimonials. Please try again later.</p>';
            }
        }

        renderTestimonials();
    }

});