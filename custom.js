// ============================================================
// BETIFA CUSTOM.JS — REFACTORED CORE
// Tüm feature'lar tek bir paylaşımlı observer + history hook +
// resize hub altyapısı üzerinden çalışır. Davranış aynıdır.
// ============================================================
(function() {
  if (window.__BetifaCore) return; // çift yükleme koruması

  const FEATURES = [];
  const URL_LISTENERS = [];
  const RESIZE_LISTENERS = [];
  const MOBILE_BREAKPOINT_DEFAULT = 992;

  // --- Helpers ---------------------------------------------------
  function getLangPrefix() {
    const m = window.location.pathname.match(/^\/([a-z]{2})(\/|$)/);
    return m ? '/' + m[1] : '/tr';
  }

  function getLangCode() {
    return getLangPrefix().slice(1); // "tr" | "en" | ...
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
      clearTimeout(t);
      t = setTimeout(function() {
        for (let i = 0; i < RESIZE_LISTENERS.length; i++) {
          try { RESIZE_LISTENERS[i](); } catch (e) {}
        }
      }, 200);
    });
  }

  // --- Boot ------------------------------------------------------
  function boot() {
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
// FEATURE: Footer Awards
// ============================================================
(function() {
  const FEATURE_ID = 'betifa-footer-awards';

  function isAlreadyInserted() {
    return document.getElementById(FEATURE_ID) !== null;
  }

  function createElement() {
    const wrapper = document.createElement('div');
    wrapper.id = FEATURE_ID;
    wrapper.className = 'betifa-footer-awards';
    wrapper.innerHTML = `
      <a class="betifa-footer-app-banner" href="https://betifa.live/betifa_ios_live.html" target="_blank" rel="noopener noreferrer">
        <img src="https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/kojqlwkejjoizdGJKQWf/statics/IBDG36JUrLDgpw2dRqVEMmVVgiNh5s3OvSy3gsJo.jpg" alt="Betifa Mobil App">
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
    if (isAlreadyInserted()) return;
    const currencies = document.querySelector('.footer-currencies');
    if (!currencies) return;
    currencies.parentNode.insertBefore(createElement(), currencies);
  }

  window.__BetifaCore.register({ id: FEATURE_ID, run: run });
})();


// ============================================================
// FEATURE: Sidebar Social Links
// ============================================================
(function() {
  const FEATURE_ID = 'betifa-sidebar-social-links';

  const socialLinks = [
    {
      name: 'Instagram Sosyal',
      url: 'https://www.instagram.com/betifa.sosyal?igsh=MTZqc3g4dmRiODluYg%3D%3D&utm_source=qr',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>'
    },
    {
      name: 'Instagram Spor',
      url: 'https://www.instagram.com/betifaspor?igsh=MWZ0c24xdXkyNDZlYQ%3D%3D&utm_source=qr',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>'
    },
    {
      name: 'X (Twitter)',
      url: 'https://x.com/betifaglobalof',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></svg>'
    },
    {
      name: 'Telegram Kanalı',
      url: 'https://t.me/betifaresmi',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>'
    },
    {
      name: 'Telegram Support',
      url: 'https://t.me/betifa_resmi_bot',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>'
    },
    {
      name: 'WhatsApp Destek',
      url: 'https://wa.me/38977695639',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>'
    }
  ];

  function isAlreadyInserted() {
    return document.getElementById(FEATURE_ID) !== null;
  }

  function createSocialLinkButton(link) {
    const a = document.createElement('a');
    a.className = 'sb-top-btn betifa-social-link-item';
    a.href = link.url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.setAttribute('data-sb-tooltip', link.name);
    a.setAttribute('aria-label', link.name);
    a.innerHTML = `
      <span class="icon" aria-hidden="true">
        <span style="display: inline-flex; width: 20px; height: 20px; line-height: 0;">
          ${link.icon}
        </span>
      </span>
      <span class="sb-top-title">${link.name}</span>
      <span class="sb-top-arrow" aria-hidden="true">›</span>
    `;
    return a;
  }

  function createElement() {
    const wrapper = document.createElement('div');
    wrapper.id = FEATURE_ID;
    wrapper.className = 'betifa-sidebar-social-section';

    const dividerTop = document.createElement('div');
    dividerTop.className = 'sidebar-section-title';
    dividerTop.innerHTML = '<span class="sidebar-section-title__line"></span>';
    wrapper.appendChild(dividerTop);

    socialLinks.forEach(link => wrapper.appendChild(createSocialLinkButton(link)));

    const dividerBottom = document.createElement('div');
    dividerBottom.className = 'sidebar-section-title';
    dividerBottom.innerHTML = '<span class="sidebar-section-title__line"></span>';
    wrapper.appendChild(dividerBottom);

    return wrapper;
  }

  function run() {
    if (isAlreadyInserted()) return;
    const supportBtn = document.querySelector('.sb-top-btn.supportbtn');
    if (!supportBtn) return;
    supportBtn.parentNode.insertBefore(createElement(), supportBtn.nextSibling);
  }

  window.__BetifaCore.register({ id: FEATURE_ID, run: run });
})();


// ============================================================
// FEATURE: Header Chat Button
// ============================================================
(function() {
  const FEATURE_ID = 'betifa-header-chat-btn';
  const H = window.__BetifaCore.helpers;

  function isAlreadyInserted() { return document.getElementById(FEATURE_ID) !== null; }

  function createElement() {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.id = FEATURE_ID;
    btn.className = 'betifa-header-chat-btn';
    btn.setAttribute('aria-label', 'Canlı Destek');
    btn.setAttribute('data-sb-tooltip', 'Canlı Destek');
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
    if (isAlreadyInserted()) return;
    const minifiedButtons = document.querySelector('.header-minified-buttons');
    if (!minifiedButtons) return;
    const notificationsBox = minifiedButtons.querySelector('.notifications-box');
    const el = createElement();
    if (notificationsBox) {
      notificationsBox.parentNode.insertBefore(el, notificationsBox.nextSibling);
    } else {
      minifiedButtons.appendChild(el);
    }
  }

  window.__BetifaCore.register({ id: FEATURE_ID, run: run });
})();


// ============================================================
// FEATURE: Hero Box Title Override
// "Hemen Oynamaya Başla ve topluluğa katıl." metnini değiştirir.
// SPA re-render'da geri gelirse paylaşımlı observer tekrar uygular.
// ============================================================
(function() {
  const FEATURE_ID = 'betifa-hero-title-override';

  // Hedef metin (loop kontrolü textContent üzerinden yapılır)
  const TARGET_TEXT = 'Betifa Global En İyi Premium Casino & Bahis Deneyimi';
  // Vurgulu "Betifa Global" kısmı <span> içinde — mevcut accent stili korunur.
  const NEW_TITLE_HTML = '<span>Betifa Global</span> En İyi Premium Casino &amp; Bahis Deneyimi';
  // Sadece eski hero CTA metnini taşıyan box-title'lar güncellenir;
  // sayfadaki başka .box-title'lara dokunulmaz.
  const OLD_MATCH = 'Hemen Oynamaya Başla';

  function run() {
    // Sayfada birden fazla .box-title olabilir (ör. desktop + mobil kopya).
    // Tekil querySelector sadece ilkini bulur; o yüzden hepsini geziyoruz.
    const titles = document.querySelectorAll('.box-title');
    for (let i = 0; i < titles.length; i++) {
      const title = titles[i];
      const txt = title.textContent.trim();
      if (txt === TARGET_TEXT) continue;        // zaten güncel — atla (loop önlenir)
      if (txt.indexOf(OLD_MATCH) === -1) continue; // bizim hedefimiz değil — dokunma
      title.innerHTML = NEW_TITLE_HTML;
    }
  }

  window.__BetifaCore.register({ id: FEATURE_ID, run: run });
})();
