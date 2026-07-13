
(function() {
  if (window.__BetifaCore) return; // çift yükleme koruması

  const FEATURES = [];
  const URL_LISTENERS = [];
  const RESIZE_LISTENERS = [];
  const MOBILE_BREAKPOINT_DEFAULT = 992;

  // Viewport genişliği CACHE'i. Sadece resize event'inde güncellenir.
  // Feature'lar run() içinde bunu okur → mutation başına reflow YOK.
  let VW = window.innerWidth;

  // --- Helpers ---------------------------------------------------
  function getViewportWidth() { return VW; }
  function isMobile(bp) { return VW < (bp || MOBILE_BREAKPOINT_DEFAULT); }

  function getLangPrefix() {
    const m = window.location.pathname.match(/^\/([a-z]{2})(\/|$)/);
    return m ? '/' + m[1] : '/tr';
  }

  function getLangCode() {
    // ÖNEMLİ: Bu platformda görünen dil <html lang> üzerinden belli olur
    // (EN sayfada URL'de /en prefix'i oluşmayabiliyor). Çalışan deposit
    // butonuyla aynı yöntem: önce documentElement.lang, sonra URL fallback.
    const htmlLang = document.documentElement.lang;
    if (htmlLang) return htmlLang.substring(0, 2).toLowerCase(); // "tr" | "en" | ...
    return getLangPrefix().slice(1); // fallback: URL prefix
  }

  function isHomePage() {
    const p = window.location.pathname;
    return p === '/' || p === '/tr' || p === '/tr/' || p === '/en' || p === '/en/';
  }

  function isUserLoggedIn() {
    return document.querySelector('.login-buttons') === null;
  }

  function navigateTo(url) {
    if (window.next && window.next.router && typeof window.next.router.push === 'function') {
      window.next.router.push(url);
    } else {
      window.history.pushState({}, '', url);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  }

  function openLoginModal() {
    navigateTo(getLangPrefix() + '?modal=auth&tab=login');
  }

  function findRealChatButton() {
    return document.querySelector('button.chat-button[aria-label="Open chat"]')
        || document.querySelector('button.chat-button');
  }

  // --- Feature registration --------------------------------------
  function register(feature) {
    // feature: { id, run(): void }
    FEATURES.push(feature);
  }

  function onUrlChange(fn) { URL_LISTENERS.push(fn); }
  function onResize(fn)    { RESIZE_LISTENERS.push(fn); }

  // --- Single body observer (debounced) --------------------------
  let scheduled = false;
  function scheduleRun() {
    if (scheduled) return;
    scheduled = true;
    // rAF ile bir frame'e topla; mutation fırtınasında tek çalıştırma
    requestAnimationFrame(() => {
      scheduled = false;
      runAll();
    });
  }

  function runAll() {
    for (let i = 0; i < FEATURES.length; i++) {
      const f = FEATURES[i];
      try {
        f.run();
      } catch (e) {
        // Bir feature patlasa diğerleri devam etsin
        // Üretimde sessiz; debug istenirse buraya log eklenebilir
      }
    }
  }

  // --- Single history hook (URL change) --------------------------
  function installHistoryHook() {
    const origPush = history.pushState;
    const origReplace = history.replaceState;

    function fire() {
      // Önce feature'ları tekrar koştur
      scheduleRun();
      // Sonra URL dinleyicilerini bilgilendir
      for (let i = 0; i < URL_LISTENERS.length; i++) {
        try { URL_LISTENERS[i](); } catch (e) {}
      }
    }

    history.pushState = function() {
      const r = origPush.apply(this, arguments);
      fire();
      return r;
    };
    history.replaceState = function() {
      const r = origReplace.apply(this, arguments);
      fire();
      return r;
    };
    window.addEventListener('popstate', fire);
    window.addEventListener('hashchange', fire);
  }

  // --- Single resize hub (debounced) -----------------------------
  function installResizeHub() {
    let t;
    window.addEventListener('resize', function() {
      // VW'yi HEMEN güncelle (resize event'i zaten layout ile senkron).
      // Listener'lar debounce'lu koşar; run()'lar cache'i okur.
      VW = window.innerWidth;
      clearTimeout(t);
      t = setTimeout(function() {
        for (let i = 0; i < RESIZE_LISTENERS.length; i++) {
          try { RESIZE_LISTENERS[i](); } catch (e) {}
        }
        // Breakpoint değişmiş olabilir → feature'ları da tekrar koştur
        scheduleRun();
      }, 200);
    }, { passive: true });
  }

  // --- Boot ------------------------------------------------------
  function boot() {
    VW = window.innerWidth;
    installHistoryHook();
    installResizeHub();

    // İlk çalıştırma — bazı feature'lar geç render olan elementlere bağlı
    setTimeout(scheduleRun, 300);
    setTimeout(scheduleRun, 800);

    // Tek body observer — tüm feature'lar bunu paylaşır
    const mo = new MutationObserver(scheduleRun);
    mo.observe(document.body, { childList: true, subtree: true });
  }

  window.__BetifaCore = {
    register: register,
    onUrlChange: onUrlChange,
    onResize: onResize,
    helpers: {
      getLangPrefix: getLangPrefix,
      getLangCode: getLangCode,
      isHomePage: isHomePage,
      isUserLoggedIn: isUserLoggedIn,
      navigateTo: navigateTo,
      openLoginModal: openLoginModal,
      findRealChatButton: findRealChatButton,
      getViewportWidth: getViewportWidth,
      isMobile: isMobile,
      MOBILE_BREAKPOINT_DEFAULT: MOBILE_BREAKPOINT_DEFAULT
    },
    boot: boot
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();


// ============================================================
// FEATURE: Footer Awards (app banner dile duyarlı)
// TR: mevcut görsel · EN: download-app.jpg
// Dil SPA içinde değişirse data-rendered-lang ile yeniden kurulur.
// ============================================================
(function() {
  const FEATURE_ID = 'betifa-footer-awards';
  const H = window.__BetifaCore.helpers;

  // App banner görseli dile göre değişir.
  const APP_BANNER = {
    tr: {
      img: 'https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/kojqlwkejjoizdGJKQWf/statics/IBDG36JUrLDgpw2dRqVEMmVVgiNh5s3OvSy3gsJo.jpg',
      alt: 'Betifa Mobil App'
    },
    en: {
      img: 'https://i.ibb.co/fz5c2fNM/download-app.jpg',
      alt: 'Betifa Mobile App'
    }
  };

  function createElement(lang) {
    const banner = APP_BANNER[lang] || APP_BANNER.tr;
    const wrapper = document.createElement('div');
    wrapper.id = FEATURE_ID;
    wrapper.className = 'betifa-footer-awards';
    wrapper.setAttribute('data-rendered-lang', lang); // dil değişimi tespiti için
    wrapper.innerHTML = `
      <a class="betifa-footer-app-banner" href="https://betifa.live/betifa_ios_live.html" target="_blank" rel="noopener noreferrer">
        <img src="${banner.img}" alt="${banner.alt}">
      </a>
      <div class="betifa-footer-awards-container">
        <img src="https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/kojqlwkejjoizdGJKQWf/statics/qADFxttxrDUm1nvMsr1JTkBiWw4pXptrkfwjkjOy.png" alt="Award 1">
        <img src="https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/kojqlwkejjoizdGJKQWf/statics/Vybopxz1lksdu65Pjg7lbSQsWDYkQJd392IyVD88.png" alt="Award 2">
        <img src="https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/kojqlwkejjoizdGJKQWf/statics/ax9rmrivANIojaeX3J44vR2MZUgT2WvjnvE5LElQ.webp" alt="Award 3">
        <img src="https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/kojqlwkejjoizdGJKQWf/statics/H8a5CU9ITIFcnfnQjsIRcLSECSkNJQMW5GYHGTxT.png" alt="Award 4">
        <img src="https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/kojqlwkejjoizdGJKQWf/statics/ocRpG5ik0qXBWh4UGXz3hlBswLgsxr9JfTbUSlYc.png" alt="Award 5">
      </div>
    `;
    return wrapper;
  }

  function run() {
    const existing = document.getElementById(FEATURE_ID); // en ucuz çıkış önce
    const lang = H.getLangCode();

    if (existing) {
      // Aynı dilde zaten kuruluysa dokunma (paylaşımlı observer döngüsü önlenir).
      if (existing.getAttribute('data-rendered-lang') === lang) return;
      // Dil değişmiş — eski bölümü kaldır, doğru görselle yeniden kur.
      existing.remove();
    }

    const currencies = document.querySelector('.footer-currencies');
    if (!currencies) return;
    currencies.parentNode.insertBefore(createElement(lang), currencies);
  }

  window.__BetifaCore.register({ id: FEATURE_ID, run: run });
})();


// ============================================================
// FEATURE: Sidebar Social Links (dil duyarlı)
// Etiketler (tooltip / aria-label / görünen başlık) TR ve EN için
// ayrı tutulur. Dil SPA içinde değişirse bölüm yeniden kurulur.
// ============================================================
(function() {
  const FEATURE_ID = 'betifa-sidebar-social-links';
  const H = window.__BetifaCore.helpers;

  // name: { tr, en } — görünen başlık + tooltip + aria-label için.
  const socialLinks = [
    {
      name: { tr: 'Instagram Sosyal', en: 'Instagram Social' },
      url: 'https://www.instagram.com/betifa.sosyall',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>'
    },
    {
      name: { tr: 'Instagram Spor', en: 'Instagram Sports' },
      url: 'https://www.instagram.com/betifa.spor',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>'
    },
    {
      name: { tr: 'X (Twitter)', en: 'X (Twitter)' },
      url: 'https://x.com/betifaglobalof',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>'
    },
    {
      name: { tr: 'Telegram Kanalı', en: 'Telegram Channel' },
      url: 'https://t.me/betifaresmi',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>'
    },
    {
      name: { tr: 'Telegram Support', en: 'Telegram Support' },
      url: 'https://t.me/betifa_resmi_bot',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>'
    },
    {
      name: { tr: 'WhatsApp Destek', en: 'WhatsApp Support' },
      url: 'https://wa.me/38977695639',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>'
    }
  ];

  function labelFor(link, lang) {
    return (link.name && (link.name[lang] || link.name.tr)) || '';
  }

  function createSocialLinkButton(link, lang) {
    const label = labelFor(link, lang);
    const a = document.createElement('a');
    a.className = 'sb-top-btn betifa-social-link-item';
    a.href = link.url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.setAttribute('data-sb-tooltip', label);
    a.setAttribute('aria-label', label);
    a.innerHTML = `
      <span class="icon" aria-hidden="true">
        <span style="display: inline-flex; width: 20px; height: 20px; line-height: 0;">
          ${link.icon}
        </span>
      </span>
      <span class="sb-top-title">${label}</span>
      <span class="sb-top-arrow" aria-hidden="true">›</span>
    `;
    return a;
  }

  function createElement(lang) {
    const wrapper = document.createElement('div');
    wrapper.id = FEATURE_ID;
    wrapper.className = 'betifa-sidebar-social-section';
    wrapper.setAttribute('data-rendered-lang', lang); // dil değişimi tespiti için

    const dividerTop = document.createElement('div');
    dividerTop.className = 'sidebar-section-title';
    dividerTop.innerHTML = '<span class="sidebar-section-title__line"></span>';
    wrapper.appendChild(dividerTop);

    socialLinks.forEach(link => wrapper.appendChild(createSocialLinkButton(link, lang)));

    const dividerBottom = document.createElement('div');
    dividerBottom.className = 'sidebar-section-title';
    dividerBottom.innerHTML = '<span class="sidebar-section-title__line"></span>';
    wrapper.appendChild(dividerBottom);

    return wrapper;
  }

  function run() {
    const existing = document.getElementById(FEATURE_ID);
    const lang = H.getLangCode();

    if (existing) {
      if (existing.getAttribute('data-rendered-lang') === lang) return;
      existing.remove();
    }

    const supportBtn = document.querySelector('.sb-top-btn.supportbtn');
    if (!supportBtn) return;
    supportBtn.parentNode.insertBefore(createElement(lang), supportBtn.nextSibling);
  }

  window.__BetifaCore.register({ id: FEATURE_ID, run: run });
})();


// ============================================================
// FEATURE: Header Chat Button (dil duyarlı etiket)
// ============================================================
(function() {
  const FEATURE_ID = 'betifa-header-chat-btn';
  const H = window.__BetifaCore.helpers;

  const LABELS = { tr: 'Canlı Destek', en: 'Live Support' };
  function labelFor(lang) { return LABELS[lang] || LABELS.tr; }

  function createElement(lang) {
    const label = labelFor(lang);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.id = FEATURE_ID;
    btn.className = 'betifa-header-chat-btn';
    btn.setAttribute('aria-label', label);
    btn.setAttribute('data-sb-tooltip', label);
    btn.setAttribute('data-rendered-lang', lang);
    btn.innerHTML = `
      <span class="icon" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 17" fill="none" width="20" height="20">
          <path d="M12.9791 0.835327H4.25184C2.24675 0.835327 0.615479 2.4666 0.615479 4.47169V10.2899C0.615479 12.0455 1.86711 13.5146 3.52457 13.8528V16.1081C3.52457 16.3764 3.67221 16.623 3.90857 16.7495C4.01621 16.807 4.13402 16.8353 4.25184 16.8353C4.39293 16.8353 4.5333 16.7939 4.65548 16.7131L8.83584 13.9262H12.9791C14.9842 13.9262 16.6155 12.295 16.6155 10.2899V4.47169C16.6155 2.4666 14.9842 0.835327 12.9791 0.835327ZM8.21184 12.5939L4.97912 14.7488V13.199C4.97912 12.7975 4.6533 12.4717 4.25184 12.4717C3.04893 12.4717 2.07002 11.4928 2.07002 10.2899V4.47169C2.07002 3.26878 3.04893 2.28987 4.25184 2.28987H12.9791C14.182 2.28987 15.1609 3.26878 15.1609 4.47169V10.2899C15.1609 11.4928 14.182 12.4717 12.9791 12.4717H8.61548C8.56457 12.471 8.49184 12.4761 8.40893 12.5008C8.32166 12.5262 8.25548 12.5641 8.21184 12.5939Z" fill="currentColor"/>
          <path d="M12.9792 5.19885H4.25193C3.85048 5.19885 3.52466 5.52467 3.52466 5.92613C3.52466 6.32758 3.85048 6.6534 4.25193 6.6534H12.9792C13.3807 6.6534 13.7065 6.32758 13.7065 5.92613C13.7065 5.52467 13.3807 5.19885 12.9792 5.19885Z" fill="currentColor"/>
          <path d="M11.5247 8.10791H5.70652C5.30507 8.10791 4.97925 8.43373 4.97925 8.83518C4.97925 9.23664 5.30507 9.56246 5.70652 9.56246H11.5247C11.9262 9.56246 12.252 9.23664 12.252 8.83518C12.252 8.43373 11.9262 8.10791 11.5247 8.10791Z" fill="currentColor"/>
        </svg>
      </span>
    `;
    btn.addEventListener('click', function(e) {
      e.preventDefault(); e.stopPropagation();
      const realChat = H.findRealChatButton();
      if (realChat) realChat.click();
    });
    return btn;
  }

  function run() {
    const existing = document.getElementById(FEATURE_ID);
    const lang = H.getLangCode();

    if (existing) {
      // Buton duruyor: dil değiştiyse SADECE etiketi güncelle (DOM'u yeniden
      // kurma → gereksiz mutation + observer döngüsü yok).
      if (existing.getAttribute('data-rendered-lang') !== lang) {
        const label = labelFor(lang);
        existing.setAttribute('aria-label', label);
        existing.setAttribute('data-sb-tooltip', label);
        existing.setAttribute('data-rendered-lang', lang);
      }
      return;
    }

    const minifiedButtons = document.querySelector('.header-minified-buttons');
    if (!minifiedButtons) return;
    const notificationsBox = minifiedButtons.querySelector('.notifications-box');
    const el = createElement(lang);
    if (notificationsBox) {
      notificationsBox.parentNode.insertBefore(el, notificationsBox.nextSibling);
    } else {
      minifiedButtons.appendChild(el);
    }
  }

  window.__BetifaCore.register({ id: FEATURE_ID, run: run });
})();


// ============================================================
// FEATURE: Hero Box Title Override (dil duyarlı)
// TR ve EN sayfalarda hero başlığını ilgili dilde günceller.
// SPA re-render'da geri gelirse paylaşımlı observer tekrar uygular.
// ============================================================
(function() {
  const FEATURE_ID = 'betifa-hero-title-override';
  const H = window.__BetifaCore.helpers;

  // Dil bazlı yapılandırma:
  //   target : son hedef metin (loop guard — textContent zaten buysa atlanır)
  //   html   : enjekte edilecek innerHTML ("Betifa Global" span ile vurgulu)
  //   match  : platformun ORİJİNAL hero CTA metninden ayırt edici parça.
  const CONFIG = {
    tr: {
      target: 'Betifa Global En İyi Premium Casino & Bahis Deneyimi',
      html: '<span>Betifa Global</span> En İyi Premium Casino &amp; Bahis Deneyimi',
      match: 'Hemen Oynamaya Başla'
    },
    en: {
      target: 'Betifa Global The Best Premium Casino & Betting Experience',
      html: '<span>Betifa Global</span> The Best Premium Casino &amp; Betting Experience',
      // ⚠️ DOĞRULA: EN anasayfadaki orijinal hero CTA metninden ayırt edici parça.
      match: 'Start Playing Now'
    }
  };

  function run() {
    // PERF: hero yalnızca anasayfada. Diğer sayfalarda her mutation'da
    // querySelectorAll('.box-title') koşturmanın anlamı yok.
    // ⚠️ Hero başka sayfalarda da görünüyorsa bu satırı sil.
    if (!H.isHomePage()) return;

    const cfg = CONFIG[H.getLangCode()] || CONFIG.tr;

    // Sayfada birden fazla .box-title olabilir (ör. desktop + mobil kopya).
    const titles = document.querySelectorAll('.box-title');
    for (let i = 0; i < titles.length; i++) {
      const title = titles[i];
      const txt = title.textContent.trim();
      if (txt === cfg.target) continue;            // zaten güncel — atla (loop önlenir)
      if (txt.indexOf(cfg.match) === -1) continue;  // bizim hedefimiz değil — dokunma
      title.innerHTML = cfg.html;
    }
  }

  window.__BetifaCore.register({ id: FEATURE_ID, run: run });
})();


// ============================================================
// FEATURE: Provider Carousel'ı "Oyun Ara" (main-search) üstüne taşı
// Sadece homepage. Sıralama: hero → provider → search → devamı.
// ÖNEMLİ: .container WRAPPER KULLANILMAZ. main-search / latestWins /
// game-carousel zaten genişliği veren üst sarmalayıcının altında
// çıplak kardeşler; ekstra bir .container daralma + yan padding yaratır.
// ============================================================
(function() {
  const FEATURE_ID = 'betifa-provider-reorder';
  const H = window.__BetifaCore.helpers;

  function run() {
    if (!H.isHomePage()) return;

    const mainSearch = document.querySelector('.main-search');
    if (!mainSearch) return; // search henüz render olmadı

    const provider = document.querySelector('.provider-carousel');
    if (!provider) return; // provider henüz render olmadı

    // Zaten search'ün hemen öncesindeyse çık (paylaşımlı observer döngüsü önlenir).
    if (provider.nextElementSibling === mainSearch) return;

    // Provider'ı WRAPPER'SIZ, doğrudan search'ün önüne taşı.
    mainSearch.parentNode.insertBefore(provider, mainSearch);

    // Next.js anasayfayı yeniden render edip eski konumda ikinci bir
    // .provider-carousel üretirse, taşıdığımız dışındaki kopyaları temizle.
    document.querySelectorAll('.provider-carousel').forEach(function(el) {
      if (el !== provider) el.remove();
    });
  }

  window.__BetifaCore.register({ id: FEATURE_ID, run: run });
})();


// ============================================================
// FEATURE: Mobile App Bar (sadece homepage) — GERİ YÜKLENDİ + i18n
// Anchor: .welcome-content'in hemen ardı.
// Not: Banner (Bölüm A) desktop'ta BU elementi anchor alır → sıralama önemli.
// ============================================================
(function() {
  const FEATURE_ID = 'betifa-mobile-app-bar';
  const APP_DOWNLOAD_URL = 'https://betifa.live/betifa_ios_live.html';
  const H = window.__BetifaCore.helpers;

  const TEXTS = {
    tr: { title: 'Betifa Mobil Uygulama', desc: 'Hızlı ve Güvenli Bahis için mobil uygulamamızı indirin', button: 'İndir' },
    en: { title: 'Betifa Mobile App',      desc: 'Download our mobile app for fast and secure betting',     button: 'Download' }
  };
  function textsFor(lang) { return TEXTS[lang] || TEXTS.tr; }

  function createElement(lang) {
    const texts = textsFor(lang);
    const wrapper = document.createElement('div');
    wrapper.id = FEATURE_ID;
    wrapper.className = 'container betifa-mobile-app-bar-wrapper';
    wrapper.setAttribute('data-rendered-lang', lang);
    wrapper.innerHTML = `
      <div class="row">
        <div class="col-12">
          <a class="betifa-mobile-app-bar" href="${APP_DOWNLOAD_URL}" target="_blank" rel="noopener noreferrer">
            <div class="betifa-app-bar-content">
              <div class="betifa-app-bar-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                  <path d="M17.523 2.047a.5.5 0 0 0-.382-.047l-9 2.5a.5.5 0 0 0-.141.053V4.5c0 .067.013.13.037.187L3.053 6.053A.5.5 0 0 0 3 6.5v14a.5.5 0 0 0 .5.5h6a.5.5 0 0 0 .5-.5v-6h4v6a.5.5 0 0 0 .5.5h6a.5.5 0 0 0 .5-.5v-14a.5.5 0 0 0-.053-.447l-3.424-4.006zM16 4.5v2.25l-3.5.972V5.5L16 4.5zM8 7.75l3.5-.972v2.472L8 10.222V7.75zm-4 0L7 6.778v3.444l-3 .833V7.75zM4 20v-8.028l3-.833V14.5a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-3.361l3-.833V20h-5v-6a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0-.5.5v6H4zm16-8.028V20h-5v-5h5v-.028-.001z"/>
                  <path d="M7 17h2v3H7zM15 17h2v3h-2z"/>
                </svg>
              </div>
              <div class="betifa-app-bar-text">
                <span class="betifa-app-bar-title">${texts.title}</span>
                <span class="betifa-app-bar-desc">${texts.desc}</span>
              </div>
              <div class="betifa-app-bar-button">
                <span class="betifa-app-bar-btn-text">${texts.button}</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M12 16l-6-6h4V4h4v6h4l-6 6z"/>
                  <path d="M20 18H4v2h16v-2z"/>
                </svg>
              </div>
            </div>
            <div class="betifa-app-bar-glow betifa-app-bar-glow-left"></div>
            <div class="betifa-app-bar-glow betifa-app-bar-glow-right"></div>
          </a>
        </div>
      </div>
    `;
    return wrapper;
  }

  function run() {
    const existing = document.getElementById(FEATURE_ID); // O(1) — ilk kontrol

    if (!H.isHomePage()) {
      if (existing) existing.remove();
      return;
    }

    const lang = H.getLangCode();
    if (existing) {
      if (existing.getAttribute('data-rendered-lang') === lang) return; // hot path
      existing.remove(); // dil değişti → doğru metinlerle yeniden kur
    }

    const welcome = document.querySelector('.welcome-content');
    if (!welcome) return;
    welcome.parentNode.insertBefore(createElement(lang), welcome.nextSibling);
  }

  window.__BetifaCore.register({ id: FEATURE_ID, run: run });
})();


// ============================================================
// FEATURE: Banner Section (Bölüm A) — sadece homepage — GERİ YÜKLENDİ
// PERF: Anchor mobil/desktop'ta farklı. Eski sürüm her mutation'da
// window.innerWidth okuyordu (forced reflow). Artık Core'un cache'lediği
// H.isMobile() kullanılıyor + konum kontrolü data-anchor-mode ile yapılıyor.
// i18n: metinler data-rendered-lang guard'ı ile TR/EN.
// ⚠️ Ürün görselleri (yatirim/cekim/aviator/bonus/chatifa) TR metin BASILI
//    JPG'ler. Tam EN deneyimi için deposit-eng.jpg gibi EN varyantları gerekir.
// ============================================================
(function() {
  const FEATURE_ID = 'betifa-section-banner';
  const MOBILE_BREAKPOINT = 992;
  const H = window.__BetifaCore.helpers;

  const TEXTS = {
    tr: {
      h2: 'GLOBAL GAMING EXCELLENCE -<br>BETIFA İLE GÜVENİN GÜCÜNÜ KEŞFET',
      p: 'Güvenli Erişim İçin Takip Et !',
      altSport: 'Spor Bahisleri', altCasino: 'Casino',
      altDeposit: 'Yatırım', altWithdraw: 'Çekim', altBonus: 'Bonus Talep'
    },
    en: {
      h2: 'GLOBAL GAMING EXCELLENCE -<br>DISCOVER THE POWER OF TRUST WITH BETIFA',
      p: 'Follow Us For Secure Access !',
      altSport: 'Sports Betting', altCasino: 'Casino',
      altDeposit: 'Deposit', altWithdraw: 'Withdraw', altBonus: 'Bonus Request'
    }
  };
  function textsFor(lang) { return TEXTS[lang] || TEXTS.tr; }

  // Anchor: mobilde .hp-mobile-slider, desktop'ta mobile-app-bar.
  // PERF: layout okuması yok — Core cache'li H.isMobile().
  function currentMode() { return H.isMobile(MOBILE_BREAKPOINT) ? 'mobile' : 'desktop'; }

  function getTarget(mode) {
    if (mode === 'mobile') {
      const mobileSlider = document.querySelector('.hp-mobile-slider.d-lg-none');
      if (mobileSlider) return mobileSlider;
    }
    return document.getElementById('betifa-mobile-app-bar');
  }

  function createElement(lang) {
    const t = textsFor(lang);
    const langPrefix = H.getLangPrefix();
    const wrapper = document.createElement('div');
    wrapper.id = FEATURE_ID;
    wrapper.className = 'container betifa-section-banner-wrapper';
    wrapper.setAttribute('data-rendered-lang', lang);
    wrapper.innerHTML = `
      <div class="row">
        <div class="col-12">
          <div class="betifa-banner-section">
            <div class="betifa-banner-left">
              <div class="betifa-banner-left-first">
                <div class="betifa-banner-title">
                  <h2>${t.h2}</h2>
                  <p>${t.p}</p>
                </div>
                <div class="betifa-banner-social-buttons">
                  <a class="betifa-banner-social-btn" href="https://t.me/betifaresmi" target="_blank" rel="noopener noreferrer">
                    <img src="https://raw.githubusercontent.com/allwaysapp/betifacustom/d9743ed38236d3fe43eeff17742aee81c64f18b8/img/telegram-icon.png" alt="Telegram" loading="lazy">
                  </a>
                  <a class="betifa-banner-social-btn" href="https://www.instagram.com/betifa.sosyal?igsh=MTZqc3g4dmRiODluYg%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer">
                    <img src="https://raw.githubusercontent.com/allwaysapp/betifacustom/d9743ed38236d3fe43eeff17742aee81c64f18b8/img/instagram-icon.png" alt="Instagram" loading="lazy">
                  </a>
                  <a class="betifa-banner-social-btn" href="https://www.instagram.com/betifaspor?igsh=MWZ0c24xdXkyNDZlYQ%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer">
                    <img src="https://raw.githubusercontent.com/allwaysapp/betifacustom/d9743ed38236d3fe43eeff17742aee81c64f18b8/img/instagram-icon.png" alt="Instagram" loading="lazy">
                  </a>
                  <a class="betifa-banner-social-btn" href="https://x.com/betifaglobalof" target="_blank" rel="noopener noreferrer">
                    <img src="https://raw.githubusercontent.com/allwaysapp/betifacustom/d9743ed38236d3fe43eeff17742aee81c64f18b8/img/twitter-icon.png" alt="X" loading="lazy">
                  </a>
                  <a class="betifa-banner-social-btn" href="https://wa.me/38977695639" target="_blank" rel="noopener noreferrer">
                    <img src="https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/kojqlwkejjoizdGJKQWf/statics/ZfI3560mQtcDrZG9U8fpug53aJxCW9JFnAUw7iWA.png" alt="WhatsApp" loading="lazy">
                  </a>
                </div>
              </div>
              <div class="betifa-banner-left-second">
                <a class="betifa-banner-product-sport" data-internal-link="${langPrefix}/sportsbook" href="${langPrefix}/sportsbook">
                  <img src="https://raw.githubusercontent.com/allwaysapp/betifacustom/d9743ed38236d3fe43eeff17742aee81c64f18b8/img/spor-bahisleri-product.png" alt="${t.altSport}" loading="lazy">
                </a>
                <a class="betifa-banner-product-casino" data-internal-link="${langPrefix}/casino/lobby" href="${langPrefix}/casino/lobby">
                  <img src="https://raw.githubusercontent.com/allwaysapp/betifacustom/d9743ed38236d3fe43eeff17742aee81c64f18b8/img/casino-bahisleri-product.png" alt="${t.altCasino}" loading="lazy">
                </a>
              </div>
            </div>
            <div class="betifa-banner-right">
              <a class="betifa-banner-deposit" data-banner-action="deposit" href="#">
                <img src="https://raw.githubusercontent.com/allwaysapp/betifacustom/refs/heads/main/img/yatirim-product.jpg" alt="${t.altDeposit}" loading="lazy">
              </a>
              <a class="betifa-banner-withdraw" data-banner-action="withdraw" href="#">
                <img src="https://raw.githubusercontent.com/allwaysapp/betifacustom/refs/heads/main/img/cekim-product.jpg" alt="${t.altWithdraw}" loading="lazy">
              </a>
              <a class="betifa-banner-aviator" data-internal-link="${langPrefix}/casino/group/original-games" href="${langPrefix}/casino/group/original-games">
                <img src="https://raw.githubusercontent.com/allwaysapp/betifacustom/refs/heads/main/img/aviator-product.jpg" alt="Aviator" loading="lazy">
              </a>
              <a class="betifa-banner-bonus" data-banner-action="bonus" href="#">
                <img src="https://i.ibb.co/rKSS1hsT/bonus-talep.jpg" alt="${t.altBonus}" loading="lazy">
              </a>
              <a class="betifa-banner-chatifa" data-banner-action="chatifa" href="#">
                <img src="https://raw.githubusercontent.com/allwaysapp/betifacustom/refs/heads/main/img/chatifa.jpg" alt="Chatifa" loading="lazy">
              </a>
            </div>
          </div>
        </div>
      </div>
    `;
    return wrapper;
  }

  function attachEventHandlers(root) {
    root.querySelectorAll('[data-internal-link]').forEach(el => {
      el.addEventListener('click', function(e) {
        e.preventDefault();
        H.navigateTo(this.getAttribute('data-internal-link'));
      });
    });

    const dep = root.querySelector('[data-banner-action="deposit"]');
    if (dep) dep.addEventListener('click', function(e) {
      e.preventDefault();
      if (H.isUserLoggedIn()) H.navigateTo(H.getLangPrefix() + '/wallet/fiat/deposit');
      else H.openLoginModal();
    });

    const wd = root.querySelector('[data-banner-action="withdraw"]');
    if (wd) wd.addEventListener('click', function(e) {
      e.preventDefault();
      if (H.isUserLoggedIn()) H.navigateTo(H.getLangPrefix() + '/wallet/fiat/withdraw');
      else H.openLoginModal();
    });

    const bn = root.querySelector('[data-banner-action="bonus"]');
    if (bn) bn.addEventListener('click', function(e) {
      e.preventDefault();
      H.navigateTo(H.getLangPrefix() + '?modal=bonus-request');
    });

    const ch = root.querySelector('[data-banner-action="chatifa"]');
    if (ch) ch.addEventListener('click', function(e) {
      e.preventDefault();
      if (H.isUserLoggedIn()) {
        const realChat = H.findRealChatButton();
        if (realChat) realChat.click();
      } else {
        H.openLoginModal();
      }
    });
  }

  function run() {
    const existing = document.getElementById(FEATURE_ID); // O(1)

    if (!H.isHomePage()) {
      if (existing) existing.remove();
      return;
    }

    const lang = H.getLangCode();
    const mode = currentMode(); // cache'li — reflow yok

    if (existing) {
      // 1) Dil değiştiyse yeniden kur
      if (existing.getAttribute('data-rendered-lang') !== lang) {
        existing.remove();
      } else {
        // 2) HOT PATH: mod aynı ve element hâlâ doğru anchor'ın ardındaysa çık.
        //    Anchor'ı yalnızca mod değiştiyse veya konum bozulduysa sorgula.
        const sameMode = existing.getAttribute('data-anchor-mode') === mode;
        const prev = existing.previousElementSibling;
        const target = getTarget(mode);
        if (!target) return;                       // anchor yok → dokunma
        if (sameMode && prev === target) return;   // ✅ her şey yerinde — çık
        // Mod değişti veya SPA re-render konumu bozdu → yeniden konumlandır
        target.parentNode.insertBefore(existing, target.nextSibling);
        existing.setAttribute('data-anchor-mode', mode);
        return;
      }
    }

    const target = getTarget(mode);
    if (!target) return;
    const el = createElement(lang);
    el.setAttribute('data-anchor-mode', mode);
    target.parentNode.insertBefore(el, target.nextSibling);
    attachEventHandlers(el);
  }

  window.__BetifaCore.register({ id: FEATURE_ID, run: run });
  // Resize'da Core zaten scheduleRun() çağırıyor → run() modu yeniden değerlendirir.
})();


// ============================================================
// FEATURE: Originals Showcase (Bölüm C) — sadece homepage — GERİ YÜKLENDİ
// PERF: getVisibleCount() artık cache'li H.isMobile() kullanıyor.
//       Resize listener'ı, bölüm DOM'da değilse hiçbir şey yapmaz.
// Anchor: #betifa-section-banner'ın hemen ardı.
// ============================================================
(function() {
  const FEATURE_ID = 'betifa-section-originals';
  const VISIBLE_DESKTOP = 4;
  const VISIBLE_MOBILE = 4;
  const MOBILE_BREAKPOINT = 768;
  const H = window.__BetifaCore.helpers;

  const TEXTS = {
    tr: { prev: 'Önceki', next: 'Sonraki' },
    en: { prev: 'Previous', next: 'Next' }
  };
  function textsFor(lang) { return TEXTS[lang] || TEXTS.tr; }

  // Slider state — feature scope'unda; her insert sonrası sıfırlanır
  let sliderState = null;

  function removeElement() {
    const el = document.getElementById(FEATURE_ID);
    if (el && el.parentNode) el.parentNode.removeChild(el);
    sliderState = null;
  }

  const games = [
    { name: 'Aztec Blaze', image: 'https://vendor-provider.fra1.digitaloceanspaces.com/ebetlab/gXmqkthvbB1521K/games/8bHIPq496x6wmpIg9QSlXxqDGnZAkmO73jF8Dkpa.avif', slug: 'pragmaticplay-aztec-blaze' },
    { name: '40 Burning Hot VIP Bell Link', image: 'https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/kojqlwkejjoizdGJKQWf/games/LMRalEYBlNtg9SRhTV5edgA1e6nP97Iu2wlfQ4jY.jpg', slug: 'EGTInteractive-40-burning-hot-vip-bell-link' },
    { name: 'Emerald King Wheel of Wealth', image: 'https://d3psi4rj7mv4u4.cloudfront.net/games/pragmaticplay/emerald_king_wheel_of_wealth.jpg', slug: 'pragmaticplay-emerald-king-wheel-of-wealth' },
    { name: 'Bow of Artemis', image: 'https://vendor-provider.fra1.digitaloceanspaces.com/ebetlab/gXmqkthvbB1521K/games/DUbFurGJ9nhhTIxUnxKX8JuqH36i6fuwIuDCTAzC.avif', slug: 'pragmaticplay-bow-of-artemis' }
  ];

  function createElement(lang) {
    const t = textsFor(lang);
    const langPrefix = H.getLangPrefix();
    const wrapper = document.createElement('div');
    wrapper.id = FEATURE_ID;
    wrapper.className = 'container betifa-section-originals-wrapper';
    wrapper.setAttribute('data-rendered-lang', lang);

    const gamesHTML = games.map(game => {
      const url = `${langPrefix}/games/${game.slug}`;
      return `
        <a class="betifa-originals-game-item" data-internal-link="${url}" href="${url}">
          <img src="${game.image}" alt="${game.name}" loading="lazy">
        </a>
      `;
    }).join('');

    const arrowPrevSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/></svg>`;
    const arrowNextSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>`;

    wrapper.innerHTML = `
      <div class="row">
        <div class="col-12">
          <div class="betifa-originals-showcase">
            <div class="betifa-originals-title">
              <img src="https://raw.githubusercontent.com/allwaysapp/betifacustom/refs/heads/main/img/originals-text.png" alt="Originals" loading="lazy">
              <button type="button" class="betifa-originals-arrow betifa-originals-arrow-prev" aria-label="${t.prev}" data-mobile-only>${arrowPrevSvg}</button>
              <button type="button" class="betifa-originals-arrow betifa-originals-arrow-next" aria-label="${t.next}" data-mobile-only>${arrowNextSvg}</button>
            </div>
            <div class="betifa-originals-slider">
              <button type="button" class="betifa-originals-arrow betifa-originals-arrow-prev" aria-label="${t.prev}" data-desktop-only>${arrowPrevSvg}</button>
              <div class="betifa-originals-viewport">
                <div class="betifa-originals-track">${gamesHTML}</div>
              </div>
              <button type="button" class="betifa-originals-arrow betifa-originals-arrow-next" aria-label="${t.next}" data-desktop-only>${arrowNextSvg}</button>
            </div>
          </div>
        </div>
      </div>
    `;
    return wrapper;
  }

  function setupSlider(root) {
    const track = root.querySelector('.betifa-originals-track');
    if (!track) return;
    const items = track.querySelectorAll('.betifa-originals-game-item');
    const prevBtns = root.querySelectorAll('.betifa-originals-arrow-prev');
    const nextBtns = root.querySelectorAll('.betifa-originals-arrow-next');
    if (items.length === 0) return;

    let currentIndex = 0;

    // PERF: layout okuması yok — Core'un cache'li viewport genişliği.
    function getVisibleCount() {
      return H.isMobile(MOBILE_BREAKPOINT) ? VISIBLE_MOBILE : VISIBLE_DESKTOP;
    }

    function updateSlider() {
      const visibleCount = getVisibleCount();
      const itemWidth = 100 / visibleCount;
      const flexValue = `0 0 calc(${itemWidth}% - ${(visibleCount - 1) * 16 / visibleCount}px)`;
      items.forEach(item => {
        if (item.style.flex !== flexValue) item.style.flex = flexValue; // gereksiz style write yok
      });
      const maxIndex = Math.max(0, items.length - visibleCount);
      if (currentIndex > maxIndex) currentIndex = maxIndex;
      track.style.transform = `translateX(${-(currentIndex * (100 / visibleCount))}%)`;
    }

    function next() {
      const maxIndex = Math.max(0, items.length - getVisibleCount());
      currentIndex = currentIndex >= maxIndex ? 0 : currentIndex + 1;
      updateSlider();
    }

    function prev() {
      const maxIndex = Math.max(0, items.length - getVisibleCount());
      currentIndex = currentIndex <= 0 ? maxIndex : currentIndex - 1;
      updateSlider();
    }

    prevBtns.forEach(btn => btn.addEventListener('click', function(e) { e.preventDefault(); e.stopPropagation(); prev(); }));
    nextBtns.forEach(btn => btn.addEventListener('click', function(e) { e.preventDefault(); e.stopPropagation(); next(); }));

    let touchStartX = 0;
    track.addEventListener('touchstart', function(e) { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
    track.addEventListener('touchend', function(e) {
      const diff = touchStartX - e.changedTouches[0].screenX;
      if (Math.abs(diff) > 50) { if (diff > 0) next(); else prev(); }
    }, { passive: true });

    updateSlider();

    sliderState = { root: root, update: updateSlider };
  }

  function attachEventHandlers(root) {
    root.querySelectorAll('[data-internal-link]').forEach(el => {
      el.addEventListener('click', function(e) {
        e.preventDefault();
        H.navigateTo(this.getAttribute('data-internal-link'));
      });
    });
    setupSlider(root);
  }

  function getTarget() {
    return document.getElementById('betifa-section-banner');
  }

  function run() {
    const existing = document.getElementById(FEATURE_ID); // O(1)

    if (!H.isHomePage()) {
      if (existing) removeElement();
      return;
    }

    const lang = H.getLangCode();

    if (existing) {
      if (existing.getAttribute('data-rendered-lang') !== lang) {
        removeElement(); // dil değişti → yeniden kur
      } else {
        // HOT PATH: banner'ın hemen ardındaysa çık.
        const target = getTarget();
        if (!target) return;
        if (existing.previousElementSibling === target) return; // ✅ yerinde
        target.parentNode.insertBefore(existing, target.nextSibling); // banner taşındıysa takip et
        return;
      }
    }

    const target = getTarget();
    if (!target) return;
    const el = createElement(lang);
    target.parentNode.insertBefore(el, target.nextSibling);
    attachEventHandlers(el);
  }

  window.__BetifaCore.register({ id: FEATURE_ID, run: run });
  window.__BetifaCore.onResize(function() {
    // Bölüm DOM'da değilse hiçbir şey yapma (stale state guard)
    if (!sliderState) return;
    if (!sliderState.root.isConnected) { sliderState = null; return; }
    sliderState.update();
  });
})();


// ============================================================
// FEATURE: Sidebar Promotions Button — GERİ YÜKLENDİ
// Anchor: provider panel'deki #betifa-sidebar-deposit-btn
// PERF: buton varsa tek getElementById ile çıkılır; dil değişiminde
//       DOM yeniden kurulmaz, sadece aria-label + href güncellenir
//       (wheel row grouper bonus butonunu taşıdığı için re-create RİSKLİ).
// ============================================================
(function() {
  const FEATURE_ID = 'betifa-sidebar-promotions-btn';
  const H = window.__BetifaCore.helpers;

  const TEXTS = {
    tr: 'Promosyonlar', en: 'Promotions', fr: 'Promotions',
    de: 'Aktionen', es: 'Promociones', ru: 'Акции',
    jp: 'プロモーション', it: 'Promozioni', pt: 'Promoções', nl: 'Promoties'
  };
  function textFor(lang) { return TEXTS[lang] || TEXTS.tr; }
  function urlFor() { return H.getLangPrefix() + '/promotions/active'; }

  function syncLang(a, lang) {
    if (a.getAttribute('data-rendered-lang') === lang) return; // hot path
    a.setAttribute('aria-label', textFor(lang));
    a.setAttribute('href', urlFor());
    a.setAttribute('data-rendered-lang', lang);
  }

  function createElement(lang) {
    const a = document.createElement('a');
    a.className = 'betifa-sidebar-promotions-btn';
    a.id = FEATURE_ID;
    a.setAttribute('aria-label', textFor(lang));
    a.setAttribute('data-rendered-lang', lang);
    a.href = urlFor();
    // href'i çalışma anında oku → dil değişince otomatik doğru URL
    a.addEventListener('click', function(e) { e.preventDefault(); H.navigateTo(this.getAttribute('href')); });
    return a;
  }

  function run() {
    const existing = document.getElementById(FEATURE_ID);
    if (existing) { syncLang(existing, H.getLangCode()); return; }

    const depositBtn = document.getElementById('betifa-sidebar-deposit-btn');
    if (!depositBtn) return;
    depositBtn.parentNode.insertBefore(createElement(H.getLangCode()), depositBtn.nextSibling);
  }

  window.__BetifaCore.register({ id: FEATURE_ID, run: run });
})();


// ============================================================
// FEATURE: Sidebar Bonus Request Button — GERİ YÜKLENDİ
// Anchor: #betifa-sidebar-promotions-btn
// NOT: Wheel feature'ı bu butonu row wrapper'a TAŞIR → asla re-create etme.
// ============================================================
(function() {
  const FEATURE_ID = 'betifa-sidebar-bonus-btn';
  const H = window.__BetifaCore.helpers;

  const TEXTS = {
    tr: 'Bonus Talep', en: 'Request Bonus', fr: 'Demande Bonus',
    de: 'Bonus Anfordern', es: 'Solicitar Bono', ru: 'Запрос Бонуса',
    jp: 'ボーナス申請', it: 'Richiedi Bonus', pt: 'Pedir Bônus', nl: 'Bonus Aanvragen'
  };
  function textFor(lang) { return TEXTS[lang] || TEXTS.tr; }
  function urlFor() { return H.getLangPrefix() + '?modal=bonus-request'; }

  function syncLang(a, lang) {
    if (a.getAttribute('data-rendered-lang') === lang) return;
    a.setAttribute('aria-label', textFor(lang));
    a.setAttribute('href', urlFor());
    a.setAttribute('data-rendered-lang', lang);
  }

  function createElement(lang) {
    const a = document.createElement('a');
    a.className = 'betifa-sidebar-bonus-btn';
    a.id = FEATURE_ID;
    a.setAttribute('aria-label', textFor(lang));
    a.setAttribute('data-rendered-lang', lang);
    a.href = urlFor();
    a.addEventListener('click', function(e) { e.preventDefault(); H.navigateTo(this.getAttribute('href')); });
    return a;
  }

  function run() {
    const existing = document.getElementById(FEATURE_ID);
    if (existing) { syncLang(existing, H.getLangCode()); return; }

    const promotionsBtn = document.getElementById('betifa-sidebar-promotions-btn');
    if (!promotionsBtn) return;
    promotionsBtn.parentNode.insertBefore(createElement(H.getLangCode()), promotionsBtn.nextSibling);
  }

  window.__BetifaCore.register({ id: FEATURE_ID, run: run });
})();


// ============================================================
// FEATURE: Sidebar Wheel Button + Row Grouper — GERİ YÜKLENDİ
// Bonus butonunu bir row wrapper'a alır, yanına wheel butonunu koyar.
// PERF: her ikisi de kuruluysa TEK getElementById ile çıkar.
// ============================================================
(function() {
  const FEATURE_ID = 'betifa-sidebar-wheel-btn';
  const ROW_ID = 'betifa-sidebar-bonus-wheel-row';
  const H = window.__BetifaCore.helpers;

  const TEXTS = {
    tr: 'Çark Çevir', en: 'Spin Wheel', fr: 'Tourner Roue',
    de: 'Rad Drehen', es: 'Girar Ruleta', ru: 'Крутить Колесо',
    jp: 'ホイールを回す', it: 'Gira Ruota', pt: 'Girar Roda', nl: 'Wiel Draaien'
  };
  function textFor(lang) { return TEXTS[lang] || TEXTS.tr; }
  function urlFor() { return H.getLangPrefix() + '/wheel'; }

  function syncLang(a, lang) {
    if (a.getAttribute('data-rendered-lang') === lang) return;
    a.setAttribute('aria-label', textFor(lang));
    a.setAttribute('href', urlFor());
    a.setAttribute('data-rendered-lang', lang);
  }

  function createWheelButton(lang) {
    const a = document.createElement('a');
    a.className = 'betifa-sidebar-wheel-btn';
    a.id = FEATURE_ID;
    a.setAttribute('aria-label', textFor(lang));
    a.setAttribute('data-rendered-lang', lang);
    a.href = urlFor();
    a.addEventListener('click', function(e) { e.preventDefault(); H.navigateTo(this.getAttribute('href')); });
    return a;
  }

  function run() {
    const wheel = document.getElementById(FEATURE_ID);

    // HOT PATH: wheel kuruluysa ve hâlâ row içindeyse tek kontrolle çık.
    if (wheel && wheel.parentNode && wheel.parentNode.id === ROW_ID) {
      syncLang(wheel, H.getLangCode());
      return;
    }

    const bonusBtn = document.getElementById('betifa-sidebar-bonus-btn');
    if (!bonusBtn) return;

    let row = document.getElementById(ROW_ID);
    if (!row) {
      row = document.createElement('div');
      row.id = ROW_ID;
      row.className = 'betifa-sidebar-row';
      bonusBtn.parentNode.insertBefore(row, bonusBtn);
    }
    // Bonus butonu row dışına düştüyse (SPA re-render) geri al
    if (bonusBtn.parentNode !== row) row.appendChild(bonusBtn);

    if (!wheel) {
      row.appendChild(createWheelButton(H.getLangCode()));
    } else if (wheel.parentNode !== row) {
      row.appendChild(wheel);
    }
  }

  window.__BetifaCore.register({ id: FEATURE_ID, run: run });
})();
