// ==========================================
// FEATURE: Footer Awards
// Footer'a mobil app GIF banner + 5 ödül logosu ekler
// Hedef: .footer-currencies'in üstüne
// Kapsam: Tüm sayfalar
// ==========================================
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
        <img src="https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/kojqlwkejjoizdGJKQWf/statics/REpD3Mkx2hunSZTTFJsp8dd4tYrj0f3YSVKK6mj6.gif" alt="Betifa Mobil App">
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

  function insertElement() {
    if (isAlreadyInserted()) return;

    const currencies = document.querySelector('.footer-currencies');
    if (!currencies) return;

    const el = createElement();
    currencies.parentNode.insertBefore(el, currencies);

    console.log('✅ Betifa footer awards eklendi');
  }

  function init() {
    setTimeout(insertElement, 300);

    const observer = new MutationObserver(() => {
      if (!isAlreadyInserted() && document.querySelector('.footer-currencies')) {
        insertElement();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    let lastUrl = location.href;
    new MutationObserver(() => {
      if (location.href !== lastUrl) {
        lastUrl = location.href;
        setTimeout(insertElement, 300);
      }
    }).observe(document, { subtree: true, childList: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();




// ==========================================
// FEATURE: Sidebar Social Links
// Canlı Destek butonunun altına sosyal medya linkleri ekler
// Hedef: .sb-top-btn.supportbtn (Canlı Destek) altı
// Kapsam: Tüm sayfalar
// ==========================================
(function() {
  const FEATURE_ID = 'betifa-sidebar-social-links';

  const socialLinks = [
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/betifaeuropa',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>'
    },
    {
      name: 'X (Twitter)',
      url: 'https://x.com/betifagloball',
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
      url: 'https://wa.me/38970642325',
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

    socialLinks.forEach(link => {
      wrapper.appendChild(createSocialLinkButton(link));
    });

    const dividerBottom = document.createElement('div');
    dividerBottom.className = 'sidebar-section-title';
    dividerBottom.innerHTML = '<span class="sidebar-section-title__line"></span>';
    wrapper.appendChild(dividerBottom);

    return wrapper;
  }

  function insertElement() {
    if (isAlreadyInserted()) return;

    const supportBtn = document.querySelector('.sb-top-btn.supportbtn');
    if (!supportBtn) return;

    const el = createElement();
    supportBtn.parentNode.insertBefore(el, supportBtn.nextSibling);

    console.log('✅ Betifa sidebar social links eklendi');
  }

  function init() {
    setTimeout(insertElement, 300);

    const observer = new MutationObserver(() => {
      if (!isAlreadyInserted() && document.querySelector('.sb-top-btn.supportbtn')) {
        insertElement();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    let lastUrl = location.href;
    new MutationObserver(() => {
      if (location.href !== lastUrl) {
        lastUrl = location.href;
        setTimeout(insertElement, 300);
      }
    }).observe(document, { subtree: true, childList: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();



// ==========================================
// FEATURE: Mobile App Bar
// Anasayfada welcome-content'in altına mobil app indirme banner'ı ekler
// Hedef: .welcome-content elementinin altı (container > row > col-12 grid uyumlu)
// Kapsam: Sadece anasayfa (/, /tr, /en)
// ==========================================
(function() {
  const FEATURE_ID = 'betifa-mobile-app-bar';
  const APP_DOWNLOAD_URL = 'https://betifa.live/betifa_ios_live.html';

  function isHomePage() {
    const path = window.location.pathname;
    return path === '/' ||
           path === '/tr' || path === '/tr/' ||
           path === '/en' || path === '/en/';
  }

  function isEnglish() {
    return window.location.pathname.startsWith('/en');
  }

  function getTexts() {
    if (isEnglish()) {
      return {
        title: 'Betifa Mobile App',
        desc: 'Download our mobile app for fast and secure betting',
        button: 'Download'
      };
    }
    return {
      title: 'Betifa Mobil Uygulama',
      desc: 'Hızlı ve Güvenli Bahis için mobil uygulamamızı indirin',
      button: 'İndir'
    };
  }

  function isAlreadyInserted() {
    return document.getElementById(FEATURE_ID) !== null;
  }

  function removeElement() {
    const el = document.getElementById(FEATURE_ID);
    if (el && el.parentNode) {
      el.parentNode.removeChild(el);
    }
  }

  function createElement() {
    const texts = getTexts();

    const wrapper = document.createElement('div');
    wrapper.id = FEATURE_ID;
    wrapper.className = 'container betifa-mobile-app-bar-wrapper';
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

  function insertElement() {
    if (!isHomePage()) {
      removeElement();
      return;
    }

    if (isAlreadyInserted()) return;

    const welcomeContent = document.querySelector('.welcome-content');
    if (!welcomeContent) return;

    const el = createElement();
    welcomeContent.parentNode.insertBefore(el, welcomeContent.nextSibling);

    console.log('✅ Betifa mobile app bar eklendi');
  }

  function init() {
    setTimeout(insertElement, 300);

    const observer = new MutationObserver(() => {
      if (isHomePage()) {
        if (!isAlreadyInserted() && document.querySelector('.welcome-content')) {
          insertElement();
        }
      } else {
        if (isAlreadyInserted()) {
          removeElement();
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    let lastUrl = location.href;
    new MutationObserver(() => {
      if (location.href !== lastUrl) {
        lastUrl = location.href;
        setTimeout(() => {
          if (isHomePage()) {
            insertElement();
          } else {
            removeElement();
          }
        }, 300);
      }
    }).observe(document, { subtree: true, childList: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();



// ==========================================
// FEATURE: Custom Section - Bölüm A (Banner Section)
// Desktop: Mobile App Bar'ın altına
// Mobile: .hp-mobile-slider.d-lg-none altına
// Sol: başlık + sosyal butonlar + spor/casino product
// Sağ: 5 banner (yatırım, çekim, aviator, bonus, chatifa)
// Login durumuna göre dinamik linkler
// Kapsam: Sadece anasayfa (/, /tr, /en)
// ==========================================
(function() {
  const FEATURE_ID = 'betifa-section-banner';
  const MOBILE_BREAKPOINT = 992;

  function isHomePage() {
    const path = window.location.pathname;
    return path === '/' ||
           path === '/tr' || path === '/tr/' ||
           path === '/en' || path === '/en/';
  }

  function getCurrentLanguagePrefix() {
    const path = window.location.pathname;
    const match = path.match(/^\/([a-z]{2})(\/|$)/);
    return match ? '/' + match[1] : '/tr';
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
    const langPrefix = getCurrentLanguagePrefix();
    navigateTo(langPrefix + '?modal=auth&tab=login');
  }

  function isAlreadyInserted() {
    return document.getElementById(FEATURE_ID) !== null;
  }

  function removeElement() {
    const el = document.getElementById(FEATURE_ID);
    if (el && el.parentNode) {
      el.parentNode.removeChild(el);
    }
  }

  function getTarget() {
    const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
    if (isMobile) {
      const mobileSlider = document.querySelector('.hp-mobile-slider.d-lg-none');
      if (mobileSlider) return mobileSlider;
    }
    return document.getElementById('betifa-mobile-app-bar');
  }

  function createElement() {
    const langPrefix = getCurrentLanguagePrefix();

    const wrapper = document.createElement('div');
    wrapper.id = FEATURE_ID;
    wrapper.className = 'container betifa-section-banner-wrapper';
    wrapper.innerHTML = `
      <div class="row">
        <div class="col-12">
          <div class="betifa-banner-section">
            <div class="betifa-banner-left">
              <div class="betifa-banner-left-first">
                <div class="betifa-banner-title">
                  <h2>GLOBAL GAMING EXCELLENCE -<br>BETIFA İLE GÜVENİN GÜCÜNÜ KEŞFET</h2>
                  <p>Güvenli Erişim İçin Takip Et !</p>
                </div>
                <div class="betifa-banner-social-buttons">
                  <a class="betifa-banner-social-btn" href="https://t.me/betifaresmi" target="_blank" rel="noopener noreferrer">
                    <img src="https://raw.githubusercontent.com/allwaysapp/betifacustom/d9743ed38236d3fe43eeff17742aee81c64f18b8/img/telegram-icon.png" alt="Telegram">
                  </a>
                  <a class="betifa-banner-social-btn" href="https://www.instagram.com/betifaeuropa" target="_blank" rel="noopener noreferrer">
                    <img src="https://raw.githubusercontent.com/allwaysapp/betifacustom/d9743ed38236d3fe43eeff17742aee81c64f18b8/img/instagram-icon.png" alt="Instagram">
                  </a>
                  <a class="betifa-banner-social-btn" href="https://x.com/betifagloball" target="_blank" rel="noopener noreferrer">
                    <img src="https://raw.githubusercontent.com/allwaysapp/betifacustom/d9743ed38236d3fe43eeff17742aee81c64f18b8/img/twitter-icon.png" alt="X">
                  </a>
                  <a class="betifa-banner-social-btn" href="https://wa.me/38970642325" target="_blank" rel="noopener noreferrer">
                    <img src="https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/kojqlwkejjoizdGJKQWf/statics/ZfI3560mQtcDrZG9U8fpug53aJxCW9JFnAUw7iWA.png" alt="WhatsApp">
                  </a>
                </div>
              </div>
              <div class="betifa-banner-left-second">
                <a class="betifa-banner-product-sport" data-internal-link="${langPrefix}/sportsbook" href="${langPrefix}/sportsbook">
                  <img src="https://raw.githubusercontent.com/allwaysapp/betifacustom/d9743ed38236d3fe43eeff17742aee81c64f18b8/img/spor-bahisleri-product.png" alt="Spor Bahisleri">
                </a>
                <a class="betifa-banner-product-casino" data-internal-link="${langPrefix}/casino/lobby" href="${langPrefix}/casino/lobby">
                  <img src="https://raw.githubusercontent.com/allwaysapp/betifacustom/d9743ed38236d3fe43eeff17742aee81c64f18b8/img/casino-bahisleri-product.png" alt="Casino">
                </a>
              </div>
            </div>
            <div class="betifa-banner-right">
              <a class="betifa-banner-deposit" data-banner-action="deposit" href="#">
                <img src="https://raw.githubusercontent.com/allwaysapp/betifacustom/refs/heads/main/img/yatirim-product.jpg" alt="Yatırım">
              </a>
              <a class="betifa-banner-withdraw" data-banner-action="withdraw" href="#">
                <img src="https://raw.githubusercontent.com/allwaysapp/betifacustom/refs/heads/main/img/cekim-product.jpg" alt="Çekim">
              </a>
              <a class="betifa-banner-aviator" data-internal-link="${langPrefix}/casino/group/original-games" href="${langPrefix}/casino/group/original-games">
                <img src="https://raw.githubusercontent.com/allwaysapp/betifacustom/refs/heads/main/img/aviator-product.jpg" alt="Aviator">
              </a>
              <a class="betifa-banner-bonus" data-banner-action="bonus" href="#">
                <img src="https://raw.githubusercontent.com/allwaysapp/betifacustom/refs/heads/main/img/bonus-talep.jpg" alt="Bonus Talep">
              </a>
              <a class="betifa-banner-chatifa" data-banner-action="chatifa" href="#">
                <img src="https://raw.githubusercontent.com/allwaysapp/betifacustom/refs/heads/main/img/chatifa.jpg" alt="Chatifa">
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
        const url = this.getAttribute('data-internal-link');
        navigateTo(url);
      });
    });

    const depositBtn = root.querySelector('[data-banner-action="deposit"]');
    if (depositBtn) {
      depositBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const langPrefix = getCurrentLanguagePrefix();
        if (isUserLoggedIn()) {
          navigateTo(langPrefix + '/wallet/fiat/deposit');
        } else {
          openLoginModal();
        }
      });
    }

    const withdrawBtn = root.querySelector('[data-banner-action="withdraw"]');
    if (withdrawBtn) {
      withdrawBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const langPrefix = getCurrentLanguagePrefix();
        if (isUserLoggedIn()) {
          navigateTo(langPrefix + '/wallet/fiat/withdraw');
        } else {
          openLoginModal();
        }
      });
    }

    const bonusBtn = root.querySelector('[data-banner-action="bonus"]');
    if (bonusBtn) {
      bonusBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const langPrefix = getCurrentLanguagePrefix();
        navigateTo(langPrefix + '?modal=bonus-request');
      });
    }

    const chatifaBtn = root.querySelector('[data-banner-action="chatifa"]');
    if (chatifaBtn) {
      chatifaBtn.addEventListener('click', function(e) {
        e.preventDefault();
        if (isUserLoggedIn()) {
          const chatBtn = document.querySelector('button.chat-button[aria-label="Open chat"]')
                       || document.querySelector('button.chat-button');
          if (chatBtn) {
            chatBtn.click();
          } else {
            console.warn('Chat button bulunamadı');
          }
        } else {
          openLoginModal();
        }
      });
    }
  }

  function insertElement() {
    if (!isHomePage()) {
      removeElement();
      return;
    }

    if (isAlreadyInserted()) return;

    const target = getTarget();
    if (!target) return;

    const el = createElement();
    target.parentNode.insertBefore(el, target.nextSibling);
    attachEventHandlers(el);

    const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
    console.log('✅ Betifa banner section eklendi (' + (isMobile ? 'mobile - slider altı' : 'desktop - app bar altı') + ')');
  }

  function repositionIfNeeded() {
    if (!isHomePage()) return;

    const el = document.getElementById(FEATURE_ID);
    if (!el) return;

    const expectedTarget = getTarget();
    if (!expectedTarget) return;

    if (el.previousElementSibling !== expectedTarget) {
      el.parentNode.removeChild(el);
      expectedTarget.parentNode.insertBefore(el, expectedTarget.nextSibling);
    }
  }

  function init() {
    setTimeout(insertElement, 400);

    const observer = new MutationObserver(() => {
      if (isHomePage()) {
        if (!isAlreadyInserted() && getTarget()) {
          insertElement();
        }
      } else {
        if (isAlreadyInserted()) {
          removeElement();
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    let lastUrl = location.href;
    new MutationObserver(() => {
      if (location.href !== lastUrl) {
        lastUrl = location.href;
        setTimeout(() => {
          if (isHomePage()) {
            insertElement();
          } else {
            removeElement();
          }
        }, 400);
      }
    }).observe(document, { subtree: true, childList: true });

    let resizeTimer;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(repositionIfNeeded, 200);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();


// ==========================================
// FEATURE: Custom Section - Bölüm C (Originals Showcase)
// Anasayfada Banner Section'ın altına Originals oyun slider showcase ekler
// Sol: ORIGINALS logo (background slot game görseli)
// Sağ: 4 öne çıkan oyun (slider olarak, sağ-sol oklarla kayıyor)
// Kapsam: Sadece anasayfa (/, /tr, /en)
// ==========================================
(function() {
  const FEATURE_ID = 'betifa-section-originals';
  const VISIBLE_DESKTOP = 4;
  const VISIBLE_MOBILE = 2;
  const MOBILE_BREAKPOINT = 768;

  function isHomePage() {
    const path = window.location.pathname;
    return path === '/' ||
           path === '/tr' || path === '/tr/' ||
           path === '/en' || path === '/en/';
  }

  function getCurrentLanguagePrefix() {
    const path = window.location.pathname;
    const match = path.match(/^\/([a-z]{2})(\/|$)/);
    return match ? '/' + match[1] : '/tr';
  }

  function navigateTo(url) {
    if (window.next && window.next.router && typeof window.next.router.push === 'function') {
      window.next.router.push(url);
    } else {
      window.history.pushState({}, '', url);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  }

  function isAlreadyInserted() {
    return document.getElementById(FEATURE_ID) !== null;
  }

  function removeElement() {
    const el = document.getElementById(FEATURE_ID);
    if (el && el.parentNode) {
      el.parentNode.removeChild(el);
    }
  }

  const games = [
    {
      name: 'Aztec Blaze',
      image: 'https://vendor-provider.fra1.digitaloceanspaces.com/ebetlab/gXmqkthvbB1521K/games/8bHIPq496x6wmpIg9QSlXxqDGnZAkmO73jF8Dkpa.avif',
      slug: 'pragmaticplay-aztec-blaze'
    },
    {
      name: '40 Burning Hot VIP Bell Link',
      image: 'https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/kojqlwkejjoizdGJKQWf/games/LMRalEYBlNtg9SRhTV5edgA1e6nP97Iu2wlfQ4jY.jpg',
      slug: 'EGTInteractive-40-burning-hot-vip-bell-link'
    },
    {
      name: 'Emerald King Wheel of Wealth',
      image: 'https://d3psi4rj7mv4u4.cloudfront.net/games/pragmaticplay/emerald_king_wheel_of_wealth.jpg',
      slug: 'pragmaticplay-emerald-king-wheel-of-wealth'
    },
    {
      name: 'Bow of Artemis',
      image: 'https://vendor-provider.fra1.digitaloceanspaces.com/ebetlab/gXmqkthvbB1521K/games/DUbFurGJ9nhhTIxUnxKX8JuqH36i6fuwIuDCTAzC.avif',
      slug: 'pragmaticplay-bow-of-artemis'
    },
     {
      name: 'Bow of Artemis',
      image: 'https://vendor-provider.fra1.digitaloceanspaces.com/ebetlab/gXmqkthvbB1521K/games/DUbFurGJ9nhhTIxUnxKX8JuqH36i6fuwIuDCTAzC.avif',
      slug: 'pragmaticplay-bow-of-artemis'
    },
     {
      name: 'Bow of Artemis',
      image: 'https://vendor-provider.fra1.digitaloceanspaces.com/ebetlab/gXmqkthvbB1521K/games/DUbFurGJ9nhhTIxUnxKX8JuqH36i6fuwIuDCTAzC.avif',
      slug: 'pragmaticplay-bow-of-artemis'
    }
  ];

  function createElement() {
    const langPrefix = getCurrentLanguagePrefix();

    const wrapper = document.createElement('div');
    wrapper.id = FEATURE_ID;
    wrapper.className = 'container betifa-section-originals-wrapper';

    const gamesHTML = games.map(game => {
      const url = `${langPrefix}/casino/games/${game.slug}`;
      return `
        <a class="betifa-originals-game-item" data-internal-link="${url}" href="${url}">
          <img src="${game.image}" alt="${game.name}" loading="lazy">
        </a>
      `;
    }).join('');

    wrapper.innerHTML = `
      <div class="row">
        <div class="col-12">
          <div class="betifa-originals-showcase">
            <div class="betifa-originals-title">
              <img src="https://raw.githubusercontent.com/allwaysapp/betifacustom/refs/heads/main/img/originals-text.png" alt="Originals">
            </div>
            <div class="betifa-originals-slider">
              <button type="button" class="betifa-originals-arrow betifa-originals-arrow-prev" aria-label="Önceki">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/>
                </svg>
              </button>
              <div class="betifa-originals-viewport">
                <div class="betifa-originals-track">
                  ${gamesHTML}
                </div>
              </div>
              <button type="button" class="betifa-originals-arrow betifa-originals-arrow-next" aria-label="Sonraki">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    return wrapper;
  }

  function setupSlider(root) {
    const track = root.querySelector('.betifa-originals-track');
    const items = track.querySelectorAll('.betifa-originals-game-item');
    const prevBtn = root.querySelector('.betifa-originals-arrow-prev');
    const nextBtn = root.querySelector('.betifa-originals-arrow-next');

    if (!track || items.length === 0) return;

    let currentIndex = 0;

    function getVisibleCount() {
      return window.innerWidth < MOBILE_BREAKPOINT ? VISIBLE_MOBILE : VISIBLE_DESKTOP;
    }

    function updateSlider() {
      const visibleCount = getVisibleCount();
      const itemWidth = 100 / visibleCount;

      items.forEach(item => {
        item.style.flex = `0 0 calc(${itemWidth}% - ${(visibleCount - 1) * 16 / visibleCount}px)`;
      });

      const offset = -(currentIndex * (100 / visibleCount));
      track.style.transform = `translateX(${offset}%)`;
    }

    function next() {
      const visibleCount = getVisibleCount();
      const maxIndex = Math.max(0, items.length - visibleCount);

      if (currentIndex >= maxIndex) {
        currentIndex = 0;
      } else {
        currentIndex++;
      }
      updateSlider();
    }

    function prev() {
      const visibleCount = getVisibleCount();
      const maxIndex = Math.max(0, items.length - visibleCount);

      if (currentIndex <= 0) {
        currentIndex = maxIndex;
      } else {
        currentIndex--;
      }
      updateSlider();
    }

    prevBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      prev();
    });

    nextBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      next();
    });

    // Touch swipe (mobile)
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', function(e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', function(e) {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) next(); else prev();
      }
    }, { passive: true });

    // Resize handler
    let resizeTimer;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateSlider, 200);
    });

    // İlk render
    updateSlider();
  }

  function attachEventHandlers(root) {
    root.querySelectorAll('[data-internal-link]').forEach(el => {
      el.addEventListener('click', function(e) {
        e.preventDefault();
        const url = this.getAttribute('data-internal-link');
        navigateTo(url);
      });
    });

    setupSlider(root);
  }

  function getTarget() {
    return document.getElementById('betifa-section-banner');
  }

  function insertElement() {
    if (!isHomePage()) {
      removeElement();
      return;
    }

    if (isAlreadyInserted()) return;

    const target = getTarget();
    if (!target) return;

    const el = createElement();
    target.parentNode.insertBefore(el, target.nextSibling);
    attachEventHandlers(el);

    console.log('✅ Betifa originals showcase eklendi');
  }

  function init() {
    setTimeout(insertElement, 500);

    const observer = new MutationObserver(() => {
      if (isHomePage()) {
        if (!isAlreadyInserted() && getTarget()) {
          insertElement();
        }
      } else {
        if (isAlreadyInserted()) {
          removeElement();
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    let lastUrl = location.href;
    new MutationObserver(() => {
      if (location.href !== lastUrl) {
        lastUrl = location.href;
        setTimeout(() => {
          if (isHomePage()) {
            insertElement();
          } else {
            removeElement();
          }
        }, 500);
      }
    }).observe(document, { subtree: true, childList: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
