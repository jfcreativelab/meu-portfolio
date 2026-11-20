/* =========================================================
   JF Creative Lab — motor das cenas
   GSAP + ScrollTrigger + Lenis (em js/vendor)
   ========================================================= */
(() => {
    const root = document.documentElement;
    const motion = root.classList.contains('motion') && window.gsap && window.ScrollTrigger;
    const desktop = window.matchMedia('(min-width: 901px)');
    const $ = (s, c = document) => c.querySelector(s);
    const $$ = (s, c = document) => [...c.querySelectorAll(s)];

    const track = (name, params) => { if (typeof gtag === 'function') gtag('event', name, params); };

    $('#year').textContent = new Date().getFullYear();

    /* ---------- Scroll suave ---------- */
    let lenis = null;
    if (motion) {
        gsap.registerPlugin(ScrollTrigger);
        if (window.Lenis) {
            lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
            lenis.on('scroll', ScrollTrigger.update);
            gsap.ticker.add((t) => lenis.raf(t * 1000));
            gsap.ticker.lagSmoothing(0);
        }
    }

    const scrollToTarget = (target) => {
        const el = typeof target === 'string' ? $(target) : target;
        if (!el) return;
        if (lenis) lenis.scrollTo(el, { duration: 1.6 });
        else el.scrollIntoView({ behavior: motion ? 'smooth' : 'auto' });
    };

    $$('a[href^="#"]').forEach((a) => {
        a.addEventListener('click', (e) => {
            const id = a.getAttribute('href');
            if (id.length < 2 || !$(id)) return;
            e.preventDefault();
            closeMenu();
            scrollToTarget(id);
            history.replaceState(null, '', id);
        });
    });

    /* ---------- Menu mobile ---------- */
    const toggle = $('.menu-toggle');
    const nav = $('#nav');
    function closeMenu() {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.textContent = 'Menu';
    }
    toggle.addEventListener('click', () => {
        const open = nav.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', String(open));
        toggle.textContent = open ? 'Fechar' : 'Menu';
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

    /* ---------- Timecode + cena atual ---------- */
    const tcEl = $('#timecode');
    const tcBar = $('#tcProgress');
    const pad = (n) => String(n).padStart(2, '0');
    const updateTimecode = () => {
        const y = window.scrollY;
        const max = document.documentElement.scrollHeight - innerHeight;
        const frames = Math.floor(y / 3);           // 24 quadros por segundo
        const ff = frames % 24, s = Math.floor(frames / 24);
        tcEl.textContent = `00:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}:${pad(ff)}`;
        tcBar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    };
    window.addEventListener('scroll', updateTimecode, { passive: true });
    updateTimecode();

    const sceneName = $('#sceneName');
    const navLinks = $$('.nav a');
    const sceneObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            sceneName.textContent = entry.target.dataset.scene;
            const id = entry.target.id;
            navLinks.forEach((l) => l.classList.toggle('is-active', id && l.getAttribute('href') === `#${id}`));
            if (id) track('section_view', { section_name: id });
        });
    }, { rootMargin: '-50% 0px -50% 0px' });
    $$('[data-scene]').forEach((s) => sceneObserver.observe(s));

    /* ---------- Palavras do "Quem" ---------- */
    const words = $('[data-words]');
    if (words) {
        words.innerHTML = words.textContent.trim().split(/\s+/)
            .map((w) => `<span class="w">${w}</span>`).join(' ');
    }

    /* ---------- Formulário ---------- */
    initForm();

    if (!motion) { $("#leader")?.remove(); return; }

    /* =========================================================
       A partir daqui, só com movimento habilitado
       ========================================================= */

    /* ---------- Abertura do filme ---------- */
    const heroIntro = () => {
        const tl = gsap.timeline({ defaults: { ease: 'expo.out', duration: 1.4 } });
        tl.to('.hero__kicker > span', { y: 0 })
          .to('.hero__title .line > span', { y: 0, stagger: 0.12, duration: 1.6 }, '<0.1')
          .to('.hero .reveal-line:not(.hero__kicker) > span', { y: 0, stagger: 0.08 }, '<0.5');
        return tl;
    };

    const leader = $('#leader');
    const seen = sessionStorage.getItem('jf-leader');
    if (seen || !leader) {
        leader && leader.remove();
        heroIntro();
    } else {
        sessionStorage.setItem('jf-leader', '1');
        if (lenis) lenis.stop();
        const num = $('.leader__num', leader);
        const sweep = $('.leader__sweep', leader);
        const tl = gsap.timeline({
            onComplete: () => { leader.remove(); if (lenis) lenis.start(); }
        });
        [3, 2, 1].forEach((n) => {
            tl.call(() => { num.textContent = n; })
              .fromTo(sweep, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.42, ease: 'none' })
              .fromTo(num, { opacity: 1, scale: 1 }, { opacity: 0.6, scale: 0.94, duration: 0.42, ease: 'none' }, '<');
        });
        tl.to(leader, { clipPath: 'inset(50% 0 50% 0)', duration: 0.9, ease: 'expo.inOut' })
          .add(heroIntro(), '-=0.35');

        const skip = () => { tl.progress(1); removeEventListener('keydown', skip); leader.removeEventListener('click', skip); };
        leader.style.cursor = 'pointer';
        leader.addEventListener('click', skip);
        addEventListener('keydown', skip, { once: true });
    }

    /* Saída da abertura: o título cresce e escurece ao rolar */
    gsap.to('.hero__frame', {
        scale: 1.12, opacity: 0, yPercent: -8, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });
    gsap.to('.hero__scroll', {
        opacity: 0, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: '20% top', scrub: true }
    });

    /* ---------- Quem: palavras acendem com o scroll ---------- */
    gsap.to('.about__text .w', {
        opacity: 1, stagger: 0.1, ease: 'none',
        scrollTrigger: { trigger: '.about__text', start: 'top 80%', end: 'bottom 45%', scrub: true }
    });

    /* ---------- Contato: título sobe ---------- */
    gsap.to('.contact__title .line > span', {
        y: 0, stagger: 0.12, duration: 1.4, ease: 'expo.out',
        scrollTrigger: { trigger: '.contact__title', start: 'top 80%' }
    });

    /* ---------- Somente desktop: rolo horizontal e parallax ---------- */
    const mm = gsap.matchMedia();
    mm.add('(min-width: 901px)', () => {
        const reelTrack = $('.reel__track');
        const distance = () => reelTrack.scrollWidth - innerWidth;

        const reelTween = gsap.to(reelTrack, {
            x: () => -distance(), ease: 'none',
            scrollTrigger: {
                trigger: '.reel', pin: '.reel__pin', start: 'top top',
                end: () => `+=${distance()}`, scrub: 0.6, invalidateOnRefresh: true, anticipatePin: 1
            }
        });

        /* cada quadro "foca" enquanto atravessa a tela */
        $$('.frame__media img').forEach((img) => {
            gsap.fromTo(img, { scale: 1.25 }, {
                scale: 1, ease: 'none',
                scrollTrigger: {
                    trigger: img.closest('.frame'), containerAnimation: reelTween,
                    start: 'left right', end: 'center center', scrub: true
                }
            });
        });

        $$('.brands__col').forEach((col) => {
            const speed = parseFloat(col.dataset.speed) || 0;
            gsap.to(col, {
                yPercent: speed * 100, ease: 'none',
                scrollTrigger: { trigger: '.brands__wall', start: 'top bottom', end: 'bottom top', scrub: true }
            });
        });
    });

    /* logos entram por máscara, um de cada vez */
    $$('.brands figure').forEach((fig) => {
        gsap.from(fig, {
            clipPath: 'inset(100% 0 0 0)', duration: 1.2, ease: 'expo.out',
            scrollTrigger: { trigger: fig, start: 'top 90%' }
        });
    });

    addEventListener('load', () => ScrollTrigger.refresh());

    /* ---------- helpers ---------- */
    function initForm() {
        const form = $('#contactForm');
        if (!form) return;
        const status = $('.form__status', form);
        const msgs = {
            name: 'Escreva seu nome (mínimo 2 letras).',
            email: 'Digite um e-mail válido, como nome@dominio.com.',
            message: 'Conte um pouco mais sobre o projeto (mínimo 10 caracteres).'
        };
        const check = (input) => {
            const field = input.closest('.field');
            const ok = input.checkValidity();
            field.classList.toggle('is-invalid', !ok);
            input.setAttribute('aria-invalid', String(!ok));
            $('.field__error', field).textContent = ok ? '' : msgs[input.name];
            return ok;
        };
        const inputs = $$('input, textarea', form);
        inputs.forEach((i) => {
            i.addEventListener('blur', () => check(i));
            i.addEventListener('input', () => { if (i.closest('.field').classList.contains('is-invalid')) check(i); });
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const valid = inputs.map(check).every(Boolean);
            if (!valid) { inputs.find((i) => i.getAttribute('aria-invalid') === 'true').focus(); return; }

            const data = new FormData(form);
            const btn = $('button', form);

            // Sem Formspree configurado: abre o e-mail já preenchido
            if (form.action.includes('SEU_ID_FORMSPREE')) {
                const subject = encodeURIComponent(`Projeto: ${data.get('name')}`);
                const body = encodeURIComponent(`${data.get('message')}\n\n${data.get('name')} · ${data.get('email')}`);
                location.href = `mailto:jfcreativelab@proton.me?subject=${subject}&body=${body}`;
                status.textContent = 'Abrimos seu app de e-mail com a mensagem pronta. É só enviar.';
                track('form_submit', { form_name: 'contact', method: 'mailto' });
                return;
            }

            btn.disabled = true;
            btn.textContent = 'Enviando…';
            try {
                const res = await fetch(form.action, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
                if (!res.ok) throw new Error(res.status);
                form.reset();
                status.textContent = 'Mensagem enviada. Respondo em até 24h.';
                track('form_submit', { form_name: 'contact', method: 'formspree' });
            } catch {
                status.textContent = 'A mensagem não foi enviada. Tente de novo ou escreva para jfcreativelab@proton.me.';
            } finally {
                btn.disabled = false;
                btn.textContent = 'Enviar mensagem';
            }
        });

        $$('.frame__links a').forEach((a) => a.addEventListener('click', () => {
            track('project_click', { project_name: a.closest('.frame').querySelector('h3').textContent, link_type: a.textContent });
        }));
    }
})();
