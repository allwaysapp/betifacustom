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
