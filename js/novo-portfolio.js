/* =========================================================
   QUANTUMVERSE v5 — CINEMATIC CUT
   Motor de movimento: GSAP + ScrollTrigger + Lenis (js/vendor)
   ========================================================= */
(() => {
    const root = document.documentElement;
    const $ = (s, c = document) => c.querySelector(s);
    const $$ = (s, c = document) => [...c.querySelectorAll(s)];
    const track = (name, params) => { if (typeof gtag === 'function') gtag('event', name, params); };

    // Se as libs não carregarem, o site fica estático e visível
    if (root.classList.contains('motion') && !(window.gsap && window.ScrollTrigger)) root.classList.remove('motion');
    const motion = root.classList.contains('motion');
    const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

    $('#year').textContent = new Date().getFullYear();

    /* ---------- utilidades ---------- */
    const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*<>/_';
    function scramble(el, text = el.dataset.scramble || el.textContent, duration = 0.9) {
        if (!motion) { el.textContent = text; return; }
        const obj = { p: 0 };
        return gsap.to(obj, {
            p: 1, duration, ease: 'none',
            onUpdate() {
                const reveal = Math.floor(obj.p * text.length);
                el.textContent = text.split('').map((ch, i) => {
                    if (i < reveal || ch === ' ') return ch;
                    return GLYPHS[(Math.random() * GLYPHS.length) | 0];
                }).join('');
            },
            onComplete() { el.textContent = text; }
        });
    }
    function countUp(el) {
        const end = parseFloat(el.dataset.count);
        if (isNaN(end)) return;
        const pre = el.dataset.prefix || '', suf = el.dataset.suffix || '';
        if (!motion) { el.textContent = pre + end + suf; return; }
        const o = { v: 0 };
        gsap.to(o, { v: end, duration: 1.8, ease: 'power3.out', onUpdate: () => { el.textContent = pre + Math.round(o.v) + suf; } });
    }

    /* ---------- scroll suave ---------- */
    let lenis = null;
    if (motion) {
        gsap.registerPlugin(ScrollTrigger);
        if (window.Lenis) {
            lenis = new Lenis({ lerp: 0.085, smoothWheel: true });
            lenis.on('scroll', ScrollTrigger.update);
            gsap.ticker.add((t) => lenis.raf(t * 1000));
            gsap.ticker.lagSmoothing(0);
        }
    }

    /* ---------- navegação ---------- */
    const hamburger = $('.hamburger-menu');
    const navLinks = $('.nav-links');
    const closeMenu = () => {
        hamburger.classList.remove('active'); navLinks.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        if (lenis) lenis.start();
    };
    hamburger.addEventListener('click', () => {
        const open = !navLinks.classList.contains('active');
        hamburger.classList.toggle('active', open); navLinks.classList.toggle('active', open);
        hamburger.setAttribute('aria-expanded', String(open));
        if (lenis) open ? lenis.stop() : lenis.start();
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

    $$('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        const target = id.length > 1 && $(id);
        if (!target) return;
        e.preventDefault();
        closeMenu();
        if (lenis) lenis.scrollTo(target, { duration: 1.8, easing: (t) => 1 - Math.pow(1 - t, 4) });
        else target.scrollIntoView({ behavior: motion ? 'smooth' : 'auto' });
        history.replaceState(null, '', id);
    }));

    /* ---------- progresso + HUD de cena + link ativo ---------- */
    const progress = $('#scrollProgress');
    const onScroll = () => {
        const max = document.documentElement.scrollHeight - innerHeight;
        progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    };
    addEventListener('scroll', onScroll, { passive: true }); onScroll();

    const hudNum = $('#hudNum'), hudName = $('#hudName');
    const links = $$('.nav-link');
    const sceneIO = new IntersectionObserver((entries) => entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const s = en.target;
        links.forEach((l) => l.classList.toggle('active', l.getAttribute('href') === `#${s.id}`));
        if (hudNum.textContent !== s.dataset.scene) {
            hudNum.textContent = s.dataset.scene;
            scramble(hudName, s.dataset.sceneName, 0.5);
        }
        track('section_view', { section_name: s.id });
    }), { rootMargin: '-50% 0px -50% 0px' });
    $$('section[data-scene]').forEach((s) => sceneIO.observe(s));

    /* ---------- skills (abas) ---------- */
    const fillBars = (grid) => $$('.skill-progress', grid).forEach((b) => { b.style.width = b.dataset.width + '%'; });
    $$('.tab-btn').forEach((tab) => tab.addEventListener('click', () => {
        $$('.tab-btn').forEach((t) => { t.classList.toggle('active', t === tab); t.setAttribute('aria-selected', String(t === tab)); });
        $$('.skills-grid').forEach((g) => g.classList.remove('active'));
        const grid = $(`.skills-grid[data-category="${tab.dataset.category}"]`);
        grid.classList.add('active');
        $$('.skill-progress', grid).forEach((b) => { b.style.width = '0'; });
        if (motion) {
            gsap.fromTo($$('.skill-item', grid), { y: 40, opacity: 0, rotateX: -40 },
                { y: 0, opacity: 1, rotateX: 0, duration: 0.7, stagger: 0.07, ease: 'expo.out', onStart: () => requestAnimationFrame(() => fillBars(grid)) });
        } else fillBars(grid);
        track('skill_category_view', { category: tab.dataset.category });
    }));

    /* ---------- formulário ---------- */
    initForm();

    /* ---------- palavras do texto "sobre" ---------- */
    const words = $('[data-words]');
    if (words) words.innerHTML = words.textContent.trim().split(/\s+/).map((w) => `<span class="w">${w}</span>`).join(' ');

    /* ---------- tracking dos projetos e CTAs ---------- */
    $$('.holo-card a').forEach((a) => a.addEventListener('click', () => track('project_click', {
        project_name: a.closest('.holo-card').querySelector('.holo-title').textContent,
        link_type: a.classList.contains('secondary') ? 'GitHub' : a.textContent.trim()
    })));
    $$('.hero-actions .cyber-btn').forEach((b) => b.addEventListener('click', () => track('cta_click', { button_text: b.textContent.trim(), location: 'hero' })));

    if (!motion) {
        $('#pageLoader')?.remove();
        $$('.skills-grid.active').forEach(fillBars);
        return;
    }

    /* =========================================================
       DAQUI PRA BAIXO: CAMADA CINEMATOGRÁFICA
       ========================================================= */

    /* ---------- cursor ---------- */
    if (finePointer) {
        const dot = $('.cursor-dot'), ring = $('.cursor-outline');
        const dx = gsap.quickTo(dot, 'x', { duration: 0.05 }), dy = gsap.quickTo(dot, 'y', { duration: 0.05 });
        const rx = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3' }), ry = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3' });
        gsap.set([dot, ring], { xPercent: -50, yPercent: -50, left: 0, top: 0 });
        addEventListener('mousemove', (e) => { dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY); });
        $$('a, button, .holo-card, .brand-tile, input, textarea').forEach((el) => {
            el.addEventListener('mouseenter', () => ring.classList.add('is-hover'));
            el.addEventListener('mouseleave', () => ring.classList.remove('is-hover'));
        });

        /* tilt holográfico */
        $$('.holo-card').forEach((card) => {
            const rX = gsap.quickTo(card, 'rotationX', { duration: 0.5, ease: 'power3' });
            const rY = gsap.quickTo(card, 'rotationY', { duration: 0.5, ease: 'power3' });
            gsap.set(card, { transformPerspective: 1000 });
            card.addEventListener('mousemove', (e) => {
                const r = card.getBoundingClientRect();
                rX(((e.clientY - r.top) / r.height - 0.5) * -14);
                rY(((e.clientX - r.left) / r.width - 0.5) * 14);
            });
            card.addEventListener('mouseleave', () => { rX(0); rY(0); });
        });
    }

    /* ---------- glitch do título ---------- */
    const title = $('.cyber-glitch-text');
    const titleText = $('.glitch-main', title);
    const glitch = () => {
        title.classList.remove('is-glitching'); void title.offsetWidth; title.classList.add('is-glitching');
        scramble(titleText, title.dataset.text, 0.8);
    };
    title.addEventListener('mouseenter', glitch);
    setInterval(() => { if (!document.hidden && scrollY < innerHeight) glitch(); }, 7000);

    /* ---------- BOOT SEQUENCE ---------- */
    const loader = $('#pageLoader');
    const firstVisit = !sessionStorage.getItem('jf-boot');
    sessionStorage.setItem('jf-boot', '1');
    if (lenis) lenis.stop();
    scrollTo(0, 0);

    const lines = ['CARREGANDO MÓDULOS DE INTERFACE', 'COMPILANDO PROJETOS [05]', 'RENDERIZANDO IDENTIDADES [09]', 'CONEXÃO SEGURA ESTABELECIDA'];
    const term = $('#loaderTerminal'), pct = $('#loaderPct');
    const pctObj = { v: 0 };
    const bootDur = firstVisit ? 2.1 : 0.9;

    const pageLoaded = new Promise((r) => (document.readyState === 'complete' ? r() : addEventListener('load', r, { once: true })));
    const boot = gsap.timeline({ paused: true });
    boot.add(scramble($('.loader-logo'), 'JF_LAB', 0.7), 0)
        .to('#loaderProgress', { scaleX: 1, duration: bootDur, ease: 'power2.inOut' }, 0)
        .to(pctObj, { v: 100, duration: bootDur, ease: 'power2.inOut', onUpdate: () => { pct.textContent = String(Math.round(pctObj.v)).padStart(3, '0'); } }, 0);
    if (firstVisit) lines.forEach((l, i) => boot.call(() => { const d = document.createElement('div'); d.textContent = l; term.appendChild(d); }, null, (bootDur / lines.length) * i));
    boot.play();

    Promise.all([pageLoaded, new Promise((r) => boot.eventCallback('onComplete', r))]).then(() => {
        const open = gsap.timeline({
            onComplete: () => { loader.remove(); if (lenis) lenis.start(); ScrollTrigger.refresh(); }
        });
        open.to('.loader-content', { opacity: 0, scale: 1.08, filter: 'blur(6px)', duration: 0.4, ease: 'power2.in' })
            .to('.loader-panel--top', { yPercent: -100, duration: 1.1, ease: 'expo.inOut' }, '+=0.05')
            .to('.loader-panel--bottom', { yPercent: 100, duration: 1.1, ease: 'expo.inOut' }, '<')
            .add(heroIntro(), '-=0.55');
    });

    function heroIntro() {
        const tl = gsap.timeline();
        tl.set(['.hero-context', '.cyber-glitch-text', '.cyber-desc', '.hero-actions', '.hero-stats', '.scroll-indicator'], { visibility: 'visible' })
          .fromTo('.quantum-grid-container', { scale: 1.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 2.2, ease: 'expo.out' }, 0)
          .add(scramble($('.hero-context'), undefined, 0.9), 0.1)
          .fromTo('.cyber-glitch-text', { clipPath: 'inset(50% 0 50% 0)', scale: 1.15, filter: 'blur(12px)' },
              { clipPath: 'inset(0% 0 0% 0)', scale: 1, filter: 'blur(0px)', duration: 1.3, ease: 'expo.out', onStart: glitch }, 0.25)
          .from('.desc-line', { yPercent: 110, opacity: 0, duration: 1, stagger: 0.12, ease: 'expo.out' }, 0.7)
          .from('.hero-actions .cyber-btn', { y: 30, opacity: 0, duration: 0.9, stagger: 0.1, ease: 'expo.out' }, 0.9)
          .from('.hero-stats .stat', { y: 30, opacity: 0, duration: 0.9, stagger: 0.1, ease: 'expo.out', onStart: () => $$('.hero-stats [data-count]').forEach(countUp) }, 1.05)
          .from('.scroll-indicator', { opacity: 0, duration: 1 }, 1.4);
        return tl;
    }

    /* ---------- HERO → câmera atravessa o grid ---------- */
    const heroOut = gsap.timeline({ scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true } });
    heroOut.to('.hero-inner', { scale: 0.82, yPercent: -12, opacity: 0, filter: 'blur(10px)', ease: 'none' }, 0)
           .to('.quantum-grid', { rotationX: 78, scale: 1.4, ease: 'none' }, 0)
           .to('.grid-horizon', { opacity: 0.9, scaleX: 1.3, ease: 'none' }, 0)
           .to('.scroll-indicator', { opacity: 0, ease: 'none', duration: 0.2 }, 0);

    /* Letterbox: barras de cinema entram entre a abertura e a primeira cena */
    gsap.timeline({ scrollTrigger: { trigger: '#about', start: 'top bottom', end: 'top top', scrub: true } })
        .to('.letterbox', { height: '9vh', ease: 'power1.inOut' })
        .to('.letterbox', { height: 0, ease: 'power1.inOut' });

    /* Aurora com parallax */
    gsap.to('.blob-1', { yPercent: 60, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: true } });
    gsap.to('.blob-2', { yPercent: -80, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: true } });
    gsap.to('.blob-3', { yPercent: -40, xPercent: 30, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: true } });

    /* ---------- títulos de seção: decode + barra ---------- */
    $$('.section-title').forEach((t) => {
        const txt = $('.title-text', t);
        gsap.timeline({ scrollTrigger: { trigger: t, start: 'top 85%', once: true } })
            .from(t, { borderLeftColor: 'transparent', duration: 0.01 })
            .from($('.title-number', t), { x: -30, opacity: 0, duration: 0.6, ease: 'expo.out' })
            .from(txt, { opacity: 0, duration: 0.2 }, '<')
            .add(scramble(txt, undefined, 0.9), '<');
    });
    $$('.section-sub').forEach((s) => gsap.from(s, { y: 20, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: s, start: 'top 90%', once: true } }));

    /* ---------- SOBRE ---------- */
    gsap.from('.about-card', {
        y: 120, z: -300, rotationX: -55, opacity: 0, transformOrigin: '50% 100%',
        duration: 1.3, stagger: 0.12, ease: 'expo.out',
        scrollTrigger: { trigger: '.about-grid', start: 'top 80%', once: true }
    });
    gsap.from('.metric-card', {
        scale: 0.6, opacity: 0, duration: 1, stagger: 0.08, ease: 'back.out(1.6)',
        scrollTrigger: { trigger: '.about-metrics', start: 'top 85%', once: true, onEnter: () => $$('.about-metrics [data-count]').forEach(countUp) }
    });
    gsap.to('.about-text-full .w', {
        opacity: 1, stagger: 0.1, ease: 'none',
        scrollTrigger: { trigger: '.about-text-full', start: 'top 85%', end: 'bottom 50%', scrub: true }
    });

    /* ---------- FORMAÇÃO ---------- */
    gsap.to('.edu-line-fill', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: '.edu-timeline', start: 'top 80%', end: 'bottom 60%', scrub: true } });
    gsap.from('.edu-card', {
        x: -80, opacity: 0, clipPath: 'inset(0 100% 0 0)', duration: 1.2, stagger: 0.15, ease: 'expo.out',
        scrollTrigger: { trigger: '.edu-grid', start: 'top 80%', once: true }
    });

    /* ---------- MARQUEE reage à velocidade do scroll ---------- */
    const marquee = gsap.to('.marquee-content', { xPercent: -50, duration: 22, ease: 'none', repeat: -1 });
    const skewTo = gsap.quickTo('.marquee-content', 'skewX', { duration: 0.4, ease: 'power3' });
    ScrollTrigger.create({
        trigger: '.logo-marquee-section', start: 'top bottom', end: 'bottom top',
        onUpdate(self) {
            const v = self.getVelocity();
            marquee.timeScale(gsap.utils.clamp(-6, 6, 1 + v / 300) || 1);
            skewTo(gsap.utils.clamp(-12, 12, -v / 150));
            gsap.delayedCall(0.15, () => { gsap.to(marquee, { timeScale: self.direction, duration: 0.6 }); skewTo(0); });
        }
    });

    /* ---------- PROJETOS ---------- */
    const cards = $$('.holo-card');
    const workIndex = $('#workIndex');
    const setCurrent = (i) => {
        cards.forEach((c, k) => c.classList.toggle('is-current', k === i));
        const n = String(i + 1).padStart(2, '0');
        if (workIndex.textContent !== n) { workIndex.textContent = n; gsap.fromTo(workIndex, { y: -12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 }); }
    };

    const mm = gsap.matchMedia();
    mm.add('(min-width: 901px)', () => {
        const trackEl = $('.work-track');
        const dist = () => trackEl.scrollWidth - innerWidth;
        const reel = gsap.to(trackEl, {
            x: () => -dist(), ease: 'none',
            scrollTrigger: {
                trigger: '#projects', pin: '.work-pin', start: 'top top', end: () => '+=' + dist(),
                scrub: 0.7, invalidateOnRefresh: true, anticipatePin: 1,
                onUpdate: (self) => setCurrent(Math.min(cards.length - 1, Math.round(self.progress * (cards.length - 1))))
            }
        });
        cards.forEach((card) => {
            gsap.fromTo(card, { z: -320, opacity: 0.2, filter: 'brightness(0.35)' }, {
                z: 0, opacity: 1, filter: 'brightness(1)', ease: 'none', transformPerspective: 1200,
                scrollTrigger: { trigger: card, containerAnimation: reel, start: 'left 105%', end: 'left 45%', scrub: true }
            });
            gsap.fromTo($('.holo-img', card), { scale: 1.35 }, {
                scale: 1, ease: 'none',
                scrollTrigger: { trigger: card, containerAnimation: reel, start: 'left right', end: 'right left', scrub: true }
            });
        });
        setCurrent(0);
    });
    mm.add('(max-width: 900px)', () => {
        cards.forEach((card, i) => gsap.from(card, {
            y: 80, opacity: 0, rotationX: -25, duration: 1, ease: 'expo.out', transformPerspective: 1000,
            scrollTrigger: { trigger: card, start: 'top 88%', once: true, onEnter: () => setCurrent(i) }
        }));
    });

    /* ---------- MARCAS: revelação com linha de scan ---------- */
    ScrollTrigger.batch('.brand-tile', {
        start: 'top 88%', once: true,
        onEnter: (batch) => gsap.fromTo(batch, { clipPath: 'inset(0 0 100% 0)', y: 40 }, {
            clipPath: 'inset(0 0 0% 0)', y: 0, duration: 1.1, stagger: 0.12, ease: 'expo.out',
            onStart() { batch.forEach((b, i) => setTimeout(() => b.classList.add('is-scanning'), i * 120)); }
        })
    });

    /* ---------- SKILLS ---------- */
    gsap.from('.tab-btn', { y: 20, opacity: 0, stagger: 0.06, duration: 0.6, ease: 'expo.out', scrollTrigger: { trigger: '.category-tabs', start: 'top 88%', once: true } });
    ScrollTrigger.create({
        trigger: '.category-content', start: 'top 80%', once: true,
        onEnter: () => {
            const grid = $('.skills-grid.active');
            gsap.from($$('.skill-item', grid), { y: 50, opacity: 0, rotationX: -40, stagger: 0.08, duration: 0.9, ease: 'expo.out' });
            fillBars(grid);
        }
    });

    /* ---------- CONTATO ---------- */
    gsap.from('.contact-info > *', { x: -60, opacity: 0, stagger: 0.1, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.contact-content', start: 'top 80%', once: true } });
    gsap.from('.contact-form', {
        clipPath: 'inset(0 0 100% 0)', duration: 1.2, ease: 'expo.inOut',
        scrollTrigger: { trigger: '.contact-content', start: 'top 80%', once: true }
    });

    /* ---------- FOOTER ---------- */
    ScrollTrigger.create({ trigger: '.footer', start: 'top 90%', once: true, onEnter: () => scramble($('.footer-tagline'), undefined, 1.2) });

    addEventListener('load', () => ScrollTrigger.refresh());

    /* ---------- helpers ---------- */
    function initForm() {
        const form = $('#contact-form');
        if (!form) return;
        const status = $('.form-status', form);
        const msgs = {
            name: 'Digite seu nome (mínimo 2 letras).',
            email: 'Digite um e-mail válido, ex: nome@dominio.com',
            message: 'Escreva sua mensagem (mínimo 10 caracteres).'
        };
        const inputs = $$('input, textarea', form);
        const check = (i) => {
            const ok = i.checkValidity();
            i.closest('.form-group').classList.toggle('is-invalid', !ok);
            i.setAttribute('aria-invalid', String(!ok));
            $('.error-message', i.closest('.form-group')).textContent = ok ? '' : msgs[i.name];
            return ok;
        };
        inputs.forEach((i) => {
            i.addEventListener('blur', () => check(i));
            i.addEventListener('input', () => { if (i.getAttribute('aria-invalid') === 'true') check(i); });
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!inputs.map(check).every(Boolean)) { inputs.find((i) => i.getAttribute('aria-invalid') === 'true').focus(); return; }
            const data = new FormData(form);
            const btn = $('.submit-btn', form), label = $('span', btn);

            if (form.action.includes('SEU_ID_FORMSPREE')) {
                const subject = encodeURIComponent(`Projeto - ${data.get('name')}`);
                const body = encodeURIComponent(`${data.get('message')}\n\n${data.get('name')} | ${data.get('email')}`);
                location.href = `mailto:jfcreativelab@proton.me?subject=${subject}&body=${body}`;
                status.textContent = '> Seu app de e-mail foi aberto com a mensagem pronta. É só enviar.';
                track('form_submit', { form_name: 'contact', method: 'mailto' });
                return;
            }

            label.textContent = 'ENVIANDO...'; btn.disabled = true;
            try {
                const res = await fetch(form.action, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
                if (!res.ok) throw new Error(res.status);
                form.reset();
                status.textContent = '> MENSAGEM ENVIADA ✓ Respondo em até 24h.';
                track('form_submit', { form_name: 'contact', method: 'formspree' });
            } catch {
                status.textContent = '> Falha no envio. Tente de novo ou escreva para jfcreativelab@proton.me';
            } finally {
                label.textContent = 'Enviar Mensagem'; btn.disabled = false;
            }
        });
    }
})();
