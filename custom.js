(function () {
  if (window.__BetifaHome) return;

  // Yönetim panelinin adresi. Panel taşınırsa değişecek tek satır burasıdır.
  var PANEL_URL = 'https://panel.betifagunceladres.com';

  // Statik veri: sayfa açılışında bir kez çekilir (slot listeleri, jackpot
  // oyunları, sosyal linkler, sabit istatistikler).
  var DATA_URL = PANEL_URL + '/api/public/static';

  // Canlı veri: yalnızca aktif oyuncu sayısı ve jackpot tutarı. Periyodik çekilir.
  var LIVE_URL = PANEL_URL + '/api/public/live';

  // Canlı sayaç akışı. LIVE_INTERVAL, sunucudaki `LIVE_TICK_MS` ile aynı
  // olmalıdır — hesaplama adımları bu aralığa göre kurulur.
  var LIVE_INTERVAL = 17000;

  // Aktif oyuncu sayacı: çoğu zaman sabit durur, yeni değer geldiğinde bu
  // sürede döner. Jackpot: aralığın çoğuna yayılarak akar, kalan ~2 saniye
  // sabit kalır.
  var TICK_ANIM = 800;
  var FLOW_ANIM = 15000;

  var CSS_URL = 'https://raw.githubusercontent.com/allwaysapp/betifacustom/main/custom.css';
  var CDN = 'https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/kojqlwkejjoizdGJKQWf/statics/';

  var MOBILE_BP = 992;
  var VW = window.innerWidth;

  var FEATURES = [];
  var RESIZE_LISTENERS = [];
  var DATA = null;
  var loading = false;
  var attempts = 0;

  function isMobile(bp) { return VW < (bp || MOBILE_BP); }

  function getLangCode() {
    var l = document.documentElement.lang;
    if (l) return l.substring(0, 2).toLowerCase();
    var m = window.location.pathname.match(/^\/([a-z]{2})(\/|$)/);
    return m ? m[1] : 'tr';
  }

  function getLangPrefix() {
    var m = window.location.pathname.match(/^\/([a-z]{2})(\/|$)/);
    return m ? '/' + m[1] : '/tr';
  }

  function isHomePage() {
    var p = window.location.pathname;
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

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function q(sel, root) { return (root || document).querySelector(sel); }

  function register(feature) { FEATURES.push(feature); }

  function onResize(fn) { RESIZE_LISTENERS.push(fn); }

  var scheduled = false;
  function scheduleRun() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(function () {
      scheduled = false;
      runAll();
    });
  }

  function runAll() {
    for (var i = 0; i < FEATURES.length; i++) {
      try { FEATURES[i].run(); } catch (e) {}
    }
    // Yeni oluşturulan bölümler statik veriyle çizilir; elde daha güncel bir
    // canlı değer varsa animasyonsuz olarak hemen üzerine yazılır.
    try { paintLive(false); } catch (e) {}
  }

  function installHistoryHook() {
    var origPush = history.pushState;
    var origReplace = history.replaceState;
    function fire() { scheduleRun(); }
    history.pushState = function () { var r = origPush.apply(this, arguments); fire(); return r; };
    history.replaceState = function () { var r = origReplace.apply(this, arguments); fire(); return r; };
    window.addEventListener('popstate', fire);
    window.addEventListener('hashchange', fire);
  }

  function installResizeHub() {
    var t;
    window.addEventListener('resize', function () {
      VW = window.innerWidth;
      clearTimeout(t);
      t = setTimeout(function () {
        for (var i = 0; i < RESIZE_LISTENERS.length; i++) {
          try { RESIZE_LISTENERS[i](); } catch (e) {}
        }
        scheduleRun();
      }, 200);
    }, { passive: true });
  }

  function injectCss() {
    if (!CSS_URL || document.getElementById('bf-styles')) return;
    var l = document.createElement('link');
    l.id = 'bf-styles';
    l.rel = 'stylesheet';
    l.href = CSS_URL;
    (document.head || document.documentElement).appendChild(l);
  }

  function loadData() {
    if (DATA || loading) return;
    loading = true;
    attempts++;
    fetch(DATA_URL + '?v=' + Math.floor(Date.now() / 60000), { cache: 'no-cache' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) {
        loading = false;
        if (j) { DATA = j; scheduleRun(); return; }
        retry();
      })
      .catch(function () { loading = false; retry(); });
  }

  function retry() {
    if (DATA || attempts >= 4) return;
    setTimeout(loadData, 1200 * attempts);
  }

  var A = {
    nav: {
      slot: CDN + 'z0LgJQ5Um9m7sq981Jgma2MAxIX8hcfaEe0ZmchK.svg',
      live: CDN + 'g3Y5hWtx3lzNNTMf35B6mXQ409CgWgDEuXo5aOwu.svg',
      livebet: CDN + 'YlpKhDnQMf25oBAeHm3Hx3IJhKKOF8ZVF4lkv8dW.svg',
      prematch: CDN + 'ragORCn0vF7QUBOSmzsEYxvvTIvMZflm9R4uScEw.svg',
      originals: CDN + '7awaHp5CW73lG7OweJ4s0pFEQbA6adbyIBLF3LFE.svg',
      vip: CDN + 'cUAwdsPOHFUhECFmjTn9WsNaJZt3vju3kj3DzxL7.svg',
      challenges: CDN + 'l7HmGEhlSEkZF5LApfClxicDUfJkuF2GQBvezpid.svg'
    },
    prodBox: {
      deposit: CDN + 'WSM7YfQgatO8NcAiDfJ0MkZ6jqjVgDRf2xyfMJph.png',
      withdraw: CDN + 'LgLjnqOG8CFhGzXHKyTraDGdR1DHf2dJRnpGPJlB.png',
      bonus: CDN + 'DUF4WU4is6IjDQEs23RAmUrzB2ATbkCVLoNeVph6.png',
      tv: CDN + 'utkTnThcNu3IHzpla6tEN931mk1AjnsnlBR5h1QI.png',
      wheel: CDN + 'kFB4WCupEjnLQfHWARTFMeuC4Rp7Sthdn4Fxf3Dg.png',
      chat: CDN + 'EnBbatcyH9e99wQASPlR9O0k4JBNJG7DFEcn5eK2.png'
    },
    prodIcon: {
      deposit: CDN + 'valCVbu37gM08ZQ0mFJ9l4xrvHjSzumzt5qUmlsG.png',
      withdraw: CDN + 'r6Vgr6l5f2FOya4BxdqFtyuIT0wj5Nq8HuaCWz0v.png',
      bonus: CDN + 'oaep5BSDe2snQ1nj3W2T8ueFaDjrusWRYGB6ZlFR.png',
      tv: CDN + 'bPLSOTYkwgCPkEDuMeossnslU8T1xnoxBKsJ4z8s.png',
      wheel: CDN + 'EMb42W2v5cvQq1yfimr5kfY5qRYgC7swyhkKEfBG.png',
      chat: CDN + 'PAvnJFl6CIl1WfBw4QTZTxsdmTzpjRu5e2qpL8MK.png'
    },
    statIcon: {
      players: CDN + 'aYn6ze2AbapynxD2gSD9cPGO2tl1hcuHLQCa3tm1.png',
      registered: CDN + 'zC6BQZb2uSkTo2vu77tjIrOLEaCWv62NQ8VmXr6d.png',
      paid: CDN + 'Rw7EARcVSrFtNuDVQQUps9ZRjlVteQIxI3pSIj6N.png'
    },
    statBox: {
      players: CDN + 'WzI8q0YZl76pj8Whm9xRRsnHdexYt1XJ5fRvfL9c.png',
      registered: CDN + 'AOe6OunjdKXwXMTqqsoTGmXG2sa3ma5HKcUXX1E1.png',
      paid: CDN + 'hZ5Zhuhj5N2qGub1sT7ATHitLL010SoadIBk5azt.png'
    },
    app: {
      apple: CDN + 'VTBGmV4mAWdFcgJATAHhxrHkiXiYTGCxARswbPZh.svg',
      google: CDN + 'ZUd4Yo7BFq2q0x1RntruJ7pYD4iRXmVhglH4dyFa.svg',
      qr: CDN + 'kP2BrbbgCTaui50UQcs5hJ0uTSdggnHbkPiG3Byg.png',
      bell: CDN + 'vZMJDY2o1oxoo14rUip3BO6NRxmhhFkVmA6opjnO.svg',
      bolt: CDN + 'YlOER5GMAix1FdVnaG8eQCPyBJVl90OS6ERAo14T.svg',
      lock: CDN + 'SPt9IulxutHMazy2PNlRsZo0sFD7Ia8prwHLlyF5.svg',
      download: CDN + 'bZi1yvR8bfN4bNzwjpdjwvVgNZfr05Ex5Llx6PXn.svg'
    },
    slot: {
      hotBadge: CDN + 'kUj0JRkqgn5hztWgFzClnOPkWcF54JAE6SKnQWaX.png',
      coldBadge: CDN + 'DBBh8PDWAwOLITxAKxwlolqtVfzAv8OkQnHMHd9L.png',
      hotArrow: CDN + 'zSxRFFNc1KahxBeSIWJSii6aeyHsG2RB1569XaRI.svg',
      coldArrow: CDN + 'Zj2Qo5UlthePcnRQuc1ig53UtjtqB5xrVRRWVxNv.svg',
      hotElements: CDN + 'QTg36JOHVP2Jtb2XIte9JIl4JGZU37Wm3RUqRaE7.png',
      coldElements: CDN + 'uJJW5RwkQtISoVeLdIi6sNWO1QzhkJEREBmDId3i.png',
      hotGlow: CDN + 'GbAOpyUyHALpHyQg6E4jWrRzHyJZGudjvjfK8bqU.png',
      coldGlow: CDN + '0XMRAzRa3UdwWG978y6Mvef87pRVPXNLjvxse8m5.png'
    },
    partner: {
      shakhtar: CDN + 'XZw703L3lOG3BdfDRl8TChMAZOd9DbJ0in1eY3r5.png',
      ufc: CDN + 'GD2PlgwYDlZym0NtTtndRjlpmiYHEfwhe8WWXuBk.png',
      blockchain: CDN + 'pfj6it32UqIGa1gkylXlsCZFlzNxfa76NOWZBWCQ.webp'
    }
  };

  var NAV = [
    { key: 'slot', icon: A.nav.slot, url: '/casino/slots/lobby' },
    { key: 'live', icon: A.nav.live, url: '/casino/live-casino/live-lobby' },
    { key: 'livebet', icon: A.nav.livebet, url: '/sportsbook/live/soccer' },
    { key: 'prematch', icon: A.nav.prematch, url: '/sportsbook' },
    { key: 'originals', icon: A.nav.originals, url: '/casino/original-games' },
    { key: 'vip', icon: A.nav.vip, url: '/vip-club' },
    { key: 'challenges', icon: A.nav.challenges, url: '/casino/challenges' }
  ];

  var PRODUCTS = [
    { key: 'deposit', action: 'deposit' },
    { key: 'withdraw', action: 'withdraw' },
    { key: 'bonus', action: 'bonus' },
    { key: 'tv', action: 'noop' },
    { key: 'wheel', url: '/wheel' },
    { key: 'chat', action: 'chat' }
  ];

  var PARTNERS = [
    { key: 'shakhtar', img: A.partner.shakhtar, pc: '247,134,31' },
    { key: 'ufc', img: A.partner.ufc, pc: '226,29,44' },
    { key: 'blockchain', img: A.partner.blockchain, pc: '26,124,255' }
  ];

  var T = {
    tr: {
      nav: {
        slot: 'Slot', live: 'Canlı Casino', livebet: 'Canlı Bahis', prematch: 'Maç Önü',
        originals: 'Betifa Originals', vip: 'VIP Kulübü', challenges: 'Meydan Okumalar'
      },
      prod: {
        deposit: { t: 'Para Yatır', d: 'Hesabınıza Hızlıca<br>Para Yatırın' },
        withdraw: { t: 'Para Çek', d: 'Kazancınızı Güvenle<br>Çekin' },
        bonus: { t: 'Bonus Talep', d: 'Size Özel Bonusu<br>Hemen Alın' },
        tv: { t: 'Betifa TV', d: 'Maçları Canlı<br>İzleyin' },
        wheel: { t: 'Betifa Çark', d: 'Çevirin ve<br>Ödülü Kapın' },
        chat: { t: 'Chatifa', d: 'Oyuncularla<br>Sohbet Edin' }
      },
      stat: {
        players: { pre: 'Aktif', hi: 'Online', post: 'Oyuncu' },
        registered: { pre: 'Toplam', hi: 'Kayıtlı', post: 'Oyuncu' },
        paid: { pre: 'Oyunculara', hi: 'Ödenen', post: 'Toplam Para' }
      },
      app: {
        kicker: 'Betifa Mobil Uygulaması',
        title: 'Her ', titleHi: 'Yerde Seninle !',
        sub: 'Kayıp yaşamamak için hemen indir,<br>eğlenceyi cebine taşı !',
        cta: 'HEMEN İNDİR',
        apple: 'Apple İçin İndir', google: 'Android İçin İndir',
        f1: { t: 'Hızlı Giriş', d: 'Tek Tıkla Giriş Yap' },
        f2: { t: 'Güvenli', d: 'En Üst Seviye Güvenlik' },
        f3: { t: 'Anlık Bildirimler', d: 'Fırsatları Kaçırma !' }
      },
      slots: { hot: 'Hot Slots', cold: 'Cold Slots' },
      jackpot: { label: 'Toplam jackpot', cta: "Tüm jackpot'ları gör" },
      partners: {
        title: 'Betifa Ortakları',
        shakhtar: { n: 'Shakhtar Donetsk', c: 'Futbol' },
        ufc: { n: 'UFC', c: 'Dövüş Sporları' },
        blockchain: { n: 'Blockchain.com', c: 'Teknoloji' },
        role: 'Resmi Ortak'
      },
      social: {
        title: 'Sosyal medya',
        appTitle: 'Betifa Mobil Uygulama',
        appDesc: 'Uygulamamızla platforma anında eriş',
        close: 'Kapat', more: 'Diğer sosyal medya hesapları'
      }
    },
    en: {
      nav: {
        slot: 'Slots', live: 'Live Casino', livebet: 'Live Betting', prematch: 'Sportsbook',
        originals: 'Betifa Originals', vip: 'VIP Club', challenges: 'Challenges'
      },
      prod: {
        deposit: { t: 'Deposit', d: 'Fund Your Account<br>Instantly' },
        withdraw: { t: 'Withdraw', d: 'Cash Out Your<br>Winnings Safely' },
        bonus: { t: 'Claim Bonus', d: 'Grab Your Personal<br>Bonus Now' },
        tv: { t: 'Betifa TV', d: 'Watch Matches<br>Live' },
        wheel: { t: 'Betifa Wheel', d: 'Spin and<br>Win Rewards' },
        chat: { t: 'Chatifa', d: 'Chat With<br>Other Players' }
      },
      stat: {
        players: { pre: 'Active', hi: 'Online', post: 'Players' },
        registered: { pre: 'Total', hi: 'Registered', post: 'Players' },
        paid: { pre: 'Total', hi: 'Paid', post: 'To Players' }
      },
      app: {
        kicker: 'Betifa Mobile App',
        title: 'With You ', titleHi: 'Everywhere !',
        sub: 'Download now so you never miss out,<br>take the fun with you !',
        cta: 'DOWNLOAD NOW',
        apple: 'Download For Apple', google: 'Download For Android',
        f1: { t: 'Fast Login', d: 'Sign In With One Tap' },
        f2: { t: 'Secure', d: 'Top Level Security' },
        f3: { t: 'Instant Alerts', d: "Don't Miss A Chance !" }
      },
      slots: { hot: 'Hot Slots', cold: 'Cold Slots' },
      jackpot: { label: 'Total jackpot', cta: 'View all jackpots' },
      partners: {
        title: 'Betifa Partners',
        shakhtar: { n: 'Shakhtar Donetsk', c: 'Football' },
        ufc: { n: 'UFC', c: 'Combat Sports' },
        blockchain: { n: 'Blockchain.com', c: 'Technology' },
        role: 'Official Partner'
      },
      social: {
        title: 'Social media',
        appTitle: 'Betifa Mobile App',
        appDesc: 'Reach the platform instantly with our app',
        close: 'Close', more: 'Other social media accounts'
      }
    }
  };

  function t(lang) { return T[lang] || T.tr; }

  var SVG = {
    chevL: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>',
    chevR: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>',
    verified: '<svg class="bf-partner__verified" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2.6l2.5 1.8 3-.1 1 2.9 2.4 1.8-1 2.9 1 2.9-2.4 1.8-1 2.9-3-.1L12 21.4l-2.5-1.8-3 .1-1-2.9L3.1 15l1-2.9-1-2.9 2.4-1.8 1-2.9 3 .1z"/><path d="m8.6 12.1 2.3 2.3 4.5-4.5"/></svg>',
    handshake: '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2.5" y="7" width="19" height="13.5" rx="3"/><path d="M9 7V5.6A2.1 2.1 0 0 1 11.1 3.5h1.8A2.1 2.1 0 0 1 15 7"/><path d="M2.5 12.4h19"/><path d="M10.6 12.4h2.8"/></svg>',
    dots: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="5.5" r="1.9"/><circle cx="12" cy="12" r="1.9"/><circle cx="12" cy="18.5" r="1.9"/></svg>',
    close: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    appIco: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="6.5" y="2.5" width="11" height="19" rx="2.8"/><path d="M10.4 18.6h3.2"/><path d="M12 7v5.6"/><path d="m9.8 10.6 2.2 2.2 2.2-2.2"/></svg>'
  };

  var BRAND = {
    telegram: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.9 3.1c.2-1-.8-1.8-1.7-1.4L1.3 9.8c-1 .4-1 1.9.1 2.2l5.2 1.6 2 6.2c.3.9 1.4 1.1 2 .5l2.9-2.9 5.2 3.8c.8.6 2 .2 2.2-.9zM7.9 13l11.4-7-8.8 8.1-.1.1-.4 3.2-1.3-4z"/></svg>',
    whatsapp: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2.2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2z"/><path d="M16.6 14.5c-.3-.2-1.5-.8-1.8-.9s-.4-.1-.6.2-.7.9-.9 1-.3.2-.6 0a6.7 6.7 0 0 1-2-1.2 7.4 7.4 0 0 1-1.3-1.7c-.2-.3 0-.4.1-.6l.4-.5a1.8 1.8 0 0 0 .3-.5.5.5 0 0 0 0-.5c-.1-.2-.6-1.4-.8-1.9s-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 2.9 2.9 0 0 0-.9 2.1 5 5 0 0 0 1 2.6 11.4 11.4 0 0 0 4.3 3.8 7.4 7.4 0 0 0 3.2 1 2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .2-1.2c-.1-.2-.3-.3-.6-.4z"/></svg>',
    instagram: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5.2" stroke="currentColor" stroke-width="1.9"/><circle cx="12" cy="12" r="4.1" stroke="currentColor" stroke-width="1.9"/><circle cx="17.4" cy="6.6" r="1.3" fill="currentColor"/></svg>',
    facebook: '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.4 21.5v-7.7h2.6l.4-3h-3V8.9c0-.9.3-1.5 1.5-1.5h1.6V4.7a21 21 0 0 0-2.3-.1c-2.3 0-3.9 1.4-3.9 4v2.2H7.7v3h2.6v7.7z"/></svg>',
    pinterest: '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.7 19.3c-.1-.8-.2-1.9.1-2.8l1-4.2s-.3-.6-.3-1.4c0-1.3.8-2.3 1.8-2.3.8 0 1.2.6 1.2 1.4 0 .8-.5 2.1-.8 3.2-.2.9.5 1.7 1.4 1.7 1.7 0 3-2.2 3-5 0-2.2-1.5-3.7-3.9-3.7-2.8 0-4.6 2.1-4.6 4.5 0 .9.3 1.6.7 2.1.1.1.1.2.1.4l-.2.9c-.1.3-.3.4-.6.2-1.3-.6-2-2.1-2-3.8 0-2.8 2.3-6 6.9-6 3.7 0 6.2 2.7 6.2 5.5 0 3.8-2.1 6.6-5.2 6.6-1 0-2-.5-2.4-1.2l-.6 2.4c-.2.9-.8 1.8-1.2 2.4A10 10 0 1 0 12 2z"/></svg>',
    threads: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12.3 21.5c-3.3 0-5.8-1.1-7.4-3.3C3.4 16.3 2.6 13.5 2.6 12s.8-4.3 2.3-6.2C6.5 3.6 9 2.5 12.3 2.5c2.5 0 4.6.7 6.1 2 1.3 1.1 2.2 2.6 2.7 4.5"/><path d="M16.8 10.4c-1-.2-2.1-.3-3.2-.2-2.5.2-4 1.5-4 3.4 0 1 .5 1.9 1.3 2.5.7.5 1.7.8 2.7.7 1.4-.1 2.4-.8 2.9-1.8.4-.8.5-1.7.4-2.6-.2-1.9-.7-3.2-1.5-4.1-.8-.8-1.9-1.2-3.2-1.2-1.5 0-2.7.6-3.6 1.7"/><path d="M16.8 10.4c1.6.6 2.7 1.7 3 3.2.4 2.3-.7 5.1-3.7 6.9-1.1.7-2.4 1-3.8 1"/></svg>',
    discord: '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.3 4.9A16.2 16.2 0 0 0 16.2 3.6l-.3.6a12 12 0 0 1 3.5 1.8 11.6 11.6 0 0 0-10.8 0 12 12 0 0 1 3.5-1.8l-.3-.6A16.2 16.2 0 0 0 7.7 4.9C4.5 9.6 3.7 13.6 4 17.2a16 16 0 0 0 5 2.5l.6-1a10.5 10.5 0 0 1-1.8-.9l.4-.3a11.6 11.6 0 0 0 9.6 0l.4.3a10.5 10.5 0 0 1-1.8.9l.6 1a16 16 0 0 0 5-2.5c.4-4.1-.6-8.1-2.7-12.3zM9.3 14.7c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2zm5.4 0c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2z"/></svg>',
    x: '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.8 2.5h3.2l-7 8 8.2 10.9h-6.4l-5-6.6-5.8 6.6H1.8l7.5-8.5L1.4 2.5h6.6l4.6 6 5.2-6zm-1.1 17h1.8L7 4.3H5.1z"/></svg>',
    telegrambot: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.9 3.1c.2-1-.8-1.8-1.7-1.4L1.3 9.8c-1 .4-1 1.9.1 2.2l5.2 1.6 2 6.2c.3.9 1.4 1.1 2 .5l2.9-2.9 5.2 3.8c.8.6 2 .2 2.2-.9zM7.9 13l11.4-7-8.8 8.1-.1.1-.4 3.2-1.3-4z"/></svg>',
    youtube: '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22.5 7.2a2.8 2.8 0 0 0-2-2C18.9 4.8 12 4.8 12 4.8s-6.9 0-8.5.4a2.8 2.8 0 0 0-2 2A29.6 29.6 0 0 0 1.1 12a29.6 29.6 0 0 0 .4 4.8 2.8 2.8 0 0 0 2 2c1.6.4 8.5.4 8.5.4s6.9 0 8.5-.4a2.8 2.8 0 0 0 2-2 29.6 29.6 0 0 0 .4-4.8 29.6 29.6 0 0 0-.4-4.8zM9.8 15.1V8.9L15.4 12z"/></svg>'
  };

  var LABEL = {
    telegram: 'Telegram', whatsapp: 'Whatsapp', instagram: 'Instagram',
    facebook: 'Facebook', pinterest: 'Pinterest', threads: 'Threads',
    discord: 'Discord', x: 'X', youtube: 'YouTube', telegrambot: 'Telegram Bot'
  };

  function statText(key) {
    if (!DATA || !DATA.stats) return '';
    var s = DATA.stats[key];
    if (!s) return '';
    if (typeof s === 'string' || typeof s === 'number') return String(s);
    if (s.text) return String(s.text);
    if (s.value != null) return String(s.value);
    return '';
  }

  function jackpotText() {
    if (!DATA || !DATA.jackpot) return '';
    var a = DATA.jackpot.amount;
    if (a == null) return '';
    if (typeof a === 'string' || typeof a === 'number') return String(a);
    if (a.text) return String(a.text);
    if (a.value != null) return String(a.value);
    return '';
  }

  function attachActions(root) {
    if (root.getAttribute('data-bf-bound')) return;
    root.setAttribute('data-bf-bound', '1');
    root.addEventListener('click', function (e) {
      var el = e.target && e.target.closest ? e.target.closest('[data-bf-link],[data-bf-action]') : null;
      if (!el || !root.contains(el)) return;

      var link = el.getAttribute('data-bf-link');
      if (link) { e.preventDefault(); navigateTo(link); return; }

      var action = el.getAttribute('data-bf-action');
      if (!action) return;
      e.preventDefault();

      if (action === 'noop') return;

      if (action === 'deposit') {
        if (isUserLoggedIn()) navigateTo(getLangPrefix() + '/wallet/fiat/deposit');
        else openLoginModal();
        return;
      }
      if (action === 'withdraw') {
        if (isUserLoggedIn()) navigateTo(getLangPrefix() + '/wallet/fiat/withdraw');
        else openLoginModal();
        return;
      }
      if (action === 'bonus') {
        navigateTo(getLangPrefix() + '?modal=bonus-request');
        return;
      }
      if (action === 'chat') {
        if (isUserLoggedIn()) {
          var c = findRealChatButton();
          if (c) c.click();
        } else {
          openLoginModal();
        }
      }
    });
  }

  function linkAttrs(path) {
    var url = getLangPrefix() + path;
    return ' data-bf-link="' + esc(url) + '" href="' + esc(url) + '"';
  }

  function actionAttrs(action) {
    return ' data-bf-action="' + action + '" href="#"';
  }

  function shell(id, inner, wrap) {
    var el = document.createElement('div');
    el.id = id;
    el.className = 'bf-mod';
    el.innerHTML = wrap === false ? inner : '<div class="container">' + inner + '</div>';
    return el;
  }

  var HOME_ANCHORS = [
    '.enterence-box',
    '.welcome-content',
    '.hp-hero--desktop',
    '.hp-hero',
    '.hero-box',
    '.hero-area',
    '.hero-area-slider',
    '.hp-mobile-slider'
  ];

  function homeAnchor(mode) {
    var i, el;
    if (mode === 'm') {
      el = q('.hp-mobile-slider');
      if (el) return el;
    }
    for (i = 0; i < HOME_ANCHORS.length; i++) {
      el = q(HOME_ANCHORS[i]);
      if (el && el.parentNode) return el;
    }
    return null;
  }

  var TARGETS = {
    'bf-subnav': function () { return q('#header'); },
    'bf-products': function (mode) { return homeAnchor(mode); },
    'bf-stats': function (mode) { return document.getElementById('bf-products') || homeAnchor(mode); },
    'bf-appbar': function (mode) {
      return document.getElementById('bf-stats') || document.getElementById('bf-products') || homeAnchor(mode);
    },
    // Sıralama: .top-picks-widget → bf-jackpot → bf-slots
    // Jackpot bloğu Hot/Cold slot listelerinin üstünde durur.
    'bf-jackpot': function () { return q('.top-picks-widget'); },
    'bf-slots': function () { return document.getElementById('bf-jackpot') || q('.top-picks-widget'); },
    'bf-partners': function () { return q('#footer'); }
  };

  var PLACEMENT = { 'bf-partners': 'before' };

  function mount(id, build) {
    var existing = document.getElementById(id);

    if (!isHomePage()) {
      if (existing) existing.remove();
      return null;
    }

    var lang = getLangCode();
    var mode = isMobile(MOBILE_BP) ? 'm' : 'd';
    var pos = PLACEMENT[id] || 'after';

    if (existing) {
      if (existing.getAttribute('data-bf-lang') !== lang) {
        existing.remove();
      } else {
        var target = TARGETS[id](mode);
        if (!target || !target.parentNode) return null;
        var inPlace = pos === 'before'
          ? existing.nextElementSibling === target
          : existing.previousElementSibling === target;
        if (existing.getAttribute('data-bf-mode') === mode && inPlace) return null;
        if (pos === 'before') target.parentNode.insertBefore(existing, target);
        else target.parentNode.insertBefore(existing, target.nextSibling);
        existing.setAttribute('data-bf-mode', mode);
        return null;
      }
    }

    var anchor = TARGETS[id](mode);
    if (!anchor || !anchor.parentNode) return null;

    var el = build(lang);
    if (!el) return null;
    el.setAttribute('data-bf-lang', lang);
    el.setAttribute('data-bf-mode', mode);

    if (pos === 'before') anchor.parentNode.insertBefore(el, anchor);
    else anchor.parentNode.insertBefore(el, anchor.nextSibling);

    attachActions(el);
    return el;
  }

  register({
    id: 'bf-subnav',
    run: function () {
      mount('bf-subnav', function (lang) {
        var L = t(lang).nav, h = '<nav class="bf-subnav">';
        for (var i = 0; i < NAV.length; i++) {
          var n = NAV[i];
          h += '<a class="bf-subnav__item"' + linkAttrs(n.url) + '>' +
               '<img src="' + esc(n.icon) + '" alt="" loading="lazy" decoding="async">' +
               esc(L[n.key]) + '</a>';
        }
        h += '</nav>';
        return shell('bf-subnav', h);
      });
    }
  });

  register({
    id: 'bf-products',
    run: function () {
      mount('bf-products', function (lang) {
        var L = t(lang).prod, h = '<div class="bf-products">';
        for (var i = 0; i < PRODUCTS.length; i++) {
          var p = PRODUCTS[i], c = L[p.key];
          var attrs = p.url ? linkAttrs(p.url) : actionAttrs(p.action);
          h += '<a class="bf-product bf-product--' + p.key + '"' + attrs + '>' +
               '<img class="bf-product__bg" src="' + esc(A.prodBox[p.key]) + '" alt="" loading="lazy" decoding="async">' +
               '<img class="bf-product__icon" src="' + esc(A.prodIcon[p.key]) + '" alt="" loading="lazy" decoding="async">' +
               '<div><p class="bf-product__title">' + esc(c.t) + '</p>' +
               '<p class="bf-product__desc">' + c.d + '</p></div></a>';
        }
        h += '</div>';
        return shell('bf-products', h);
      });
    }
  });

  register({
    id: 'bf-stats',
    run: function () {
      mount('bf-stats', function (lang) {
        if (!DATA || !DATA.stats || DATA.stats.enabled === false) return null;
        var L = t(lang).stat;
        var keys = [
          { k: 'players', src: 'activePlayers' },
          { k: 'registered', src: 'registeredPlayers' },
          { k: 'paid', src: 'totalPaid' }
        ];
        var h = '<div class="bf-stats">';
        for (var i = 0; i < keys.length; i++) {
          var k = keys[i].k, l = L[k], val = statText(keys[i].src);
          if (!val) continue;
          h += '<div class="bf-stat bf-stat--' + k + '">' +
               '<img class="bf-stat__bg" src="' + esc(A.statBox[k]) + '" alt="" loading="lazy" decoding="async">' +
               '<img class="bf-stat__icon" src="' + esc(A.statIcon[k]) + '" alt="" loading="lazy" decoding="async">' +
               '<div class="bf-stat__text">' +
               '<p class="bf-stat__value">' + esc(val) + '</p>' +
               '<p class="bf-stat__label">' + esc(l.pre) + ' <b>' + esc(l.hi) + '</b> ' + esc(l.post) + '</p>' +
               '</div></div>';
        }
        h += '</div>';
        return shell('bf-stats', h);
      });
    }
  });

  register({
    id: 'bf-appbar',
    run: function () {
      mount('bf-appbar', function (lang) {
        var L = t(lang).app;
        var url = (DATA && DATA.social && DATA.social.app && DATA.social.app.url) || '#';
        var feats = [
          { ico: A.app.bolt, c: L.f1 },
          { ico: A.app.lock, c: L.f2 },
          { ico: A.app.bell, c: L.f3 }
        ];
        var f = '';
        for (var i = 0; i < feats.length; i++) {
          f += '<div class="bf-feature">' +
               '<div class="bf-feature__badge"><img src="' + esc(feats[i].ico) + '" alt="" loading="lazy" decoding="async"></div>' +
               '<div><p class="bf-feature__title">' + esc(feats[i].c.t) + '</p>' +
               '<p class="bf-feature__desc">' + esc(feats[i].c.d) + '</p></div></div>';
        }
        var h = '<section class="bf-appbar">' +
          '<div class="bf-appbar__text">' +
            '<p class="bf-appbar__kicker">' + esc(L.kicker) + '</p>' +
            '<p class="bf-appbar__title">' + esc(L.title) + '<span>' + esc(L.titleHi) + '</span></p>' +
            '<p class="bf-appbar__sub">' + L.sub + '</p>' +
          '</div>' +
          '<div class="bf-features">' + f + '</div>' +
          '<div class="bf-appcta">' +
            '<a class="bf-appcta__btn" href="' + esc(url) + '" target="_blank" rel="noopener noreferrer">' + esc(L.cta) +
              '<img src="' + esc(A.app.download) + '" alt="" decoding="async"></a>' +
            '<div class="bf-appcta__stores">' +
              '<a class="bf-store" href="' + esc(url) + '" target="_blank" rel="noopener noreferrer">' +
                '<img src="' + esc(A.app.apple) + '" alt="" decoding="async"><span>' + esc(L.apple) + '</span></a>' +
              '<a class="bf-store" href="' + esc(url) + '" target="_blank" rel="noopener noreferrer">' +
                '<img src="' + esc(A.app.google) + '" alt="" decoding="async"><span>' + esc(L.google) + '</span></a>' +
            '</div>' +
          '</div>' +
          '<img class="bf-appbar__qr" src="' + esc(A.app.qr) + '" alt="QR" loading="lazy" decoding="async">' +
        '</section>';
        return shell('bf-appbar', h);
      });
    }
  });

  function slotRows(list, kind) {
    var arrow = kind === 'hot' ? A.slot.hotArrow : A.slot.coldArrow;
    var h = '';
    for (var i = 0; i < list.length; i++) {
      var s = list[i];
      h += '<a class="bf-slotrow"' + linkAttrs(s.url || '/casino/slots/lobby') + '>' +
           '<span class="bf-slotrow__left">' +
             '<img class="bf-slotrow__thumb" src="' + esc(s.image) + '" alt="" loading="lazy" decoding="async">' +
             '<span class="bf-slotrow__meta">' +
               '<span class="bf-slotrow__pct">' + esc(s.rtp) + '%</span>' +
               '<span class="bf-slotrow__name">' + esc(s.name) + '</span>' +
             '</span>' +
           '</span>' +
           '<span class="bf-slotrow__arrow"><img src="' + esc(arrow) + '" alt="" decoding="async"></span>' +
           '</a>';
    }
    return h;
  }

  function slotPanel(kind, title, list) {
    var glow = kind === 'hot' ? A.slot.hotGlow : A.slot.coldGlow;
    var elems = kind === 'hot' ? A.slot.hotElements : A.slot.coldElements;
    var badge = kind === 'hot' ? A.slot.hotBadge : A.slot.coldBadge;
    return '<div class="bf-slotpanel bf-slotpanel--' + kind + '">' +
      '<span class="bf-slotpanel__fx">' +
        '<img class="bf-slotpanel__glow" src="' + esc(glow) + '" alt="" loading="lazy" decoding="async">' +
        '<img class="bf-slotpanel__elements" src="' + esc(elems) + '" alt="" loading="lazy" decoding="async">' +
      '</span>' +
      '<img class="bf-slotpanel__badge" src="' + esc(badge) + '" alt="" loading="lazy" decoding="async">' +
      '<p class="bf-slotpanel__title">' + esc(title) + '</p>' +
      '<div class="bf-slotgrid bf-slotgrid--split">' + slotRows(list, kind) + '</div>' +
    '</div>';
  }

  register({
    id: 'bf-slots',
    run: function () {
      mount('bf-slots', function (lang) {
        if (!DATA || !DATA.slots || DATA.slots.enabled === false) return null;
        var hot = DATA.slots.hot || [], cold = DATA.slots.cold || [];
        if (!hot.length && !cold.length) return null;
        var L = t(lang).slots;
        var h = '<div class="bf-slots">' +
          (hot.length ? slotPanel('hot', L.hot, hot) : '') +
          (cold.length ? slotPanel('cold', L.cold, cold) : '') +
        '</div>';
        return shell('bf-slots', h, false);
      });
    }
  });

  function wireRail(root) {
    var track = q('.bf-rail', root);
    if (!track || track.getAttribute('data-bf-rail')) return;
    track.setAttribute('data-bf-rail', '1');
    var prev = q('[data-bf-prev]', root), next = q('[data-bf-next]', root);

    function step() {
      var card = q('.bf-card', track);
      var gap = parseFloat(getComputedStyle(track).columnGap) || 12;
      var w = card ? card.getBoundingClientRect().width + gap : 200;
      var vis = Math.max(1, Math.floor(track.clientWidth / w));
      return w * vis;
    }
    function sync() {
      var max = track.scrollWidth - track.clientWidth - 1;
      if (prev) prev.disabled = track.scrollLeft <= 0;
      if (next) next.disabled = track.scrollLeft >= max;
    }
    if (prev) prev.addEventListener('click', function (e) { e.preventDefault(); track.scrollBy({ left: -step(), behavior: 'smooth' }); });
    if (next) next.addEventListener('click', function (e) { e.preventDefault(); track.scrollBy({ left: step(), behavior: 'smooth' }); });

    var raf = null;
    track.addEventListener('scroll', function () {
      if (raf) return;
      raf = requestAnimationFrame(function () { raf = null; sync(); });
    }, { passive: true });
    sync();
    onResize(function () { if (track.isConnected) sync(); });
  }

  register({
    id: 'bf-jackpot',
    run: function () {
      var el = mount('bf-jackpot', function (lang) {
        if (!DATA || !DATA.jackpot || DATA.jackpot.enabled === false) return null;
        var jp = DATA.jackpot, games = jp.games || [];
        if (!games.length) return null;
        var L = t(lang).jackpot, cards = '';
        for (var i = 0; i < games.length; i++) {
          var g = games[i];
          cards += '<a class="bf-card"' + linkAttrs(g.url || jp.ctaUrl) + ' aria-label="' + esc(g.title) + '">' +
                   '<img src="' + esc(g.image) + '" alt="' + esc(g.title) + '" loading="lazy" decoding="async"></a>';
        }
        var h = '<section class="bf-jackpot">' +
          '<div class="bf-jackpot__info">' +
            '<div>' +
              '<p class="bf-jackpot__label"><span class="bf-jackpot__dot"></span>' + esc(L.label) + '</p>' +
              '<p class="bf-jackpot__amount">' + esc(jackpotText()) + '</p>' +
            '</div>' +
            '<a class="bf-jackpot__btn"' + linkAttrs(jp.ctaUrl) + '>' + esc(L.cta) + '</a>' +
          '</div>' +
          '<div class="bf-jackpot__strip">' +
            '<button type="button" class="bf-navbtn bf-jackpot__nav bf-jackpot__nav--prev" data-bf-prev aria-label="prev">' + SVG.chevL + '</button>' +
            '<div class="bf-rail">' + cards + '</div>' +
            '<button type="button" class="bf-navbtn bf-jackpot__nav bf-jackpot__nav--next" data-bf-next aria-label="next">' + SVG.chevR + '</button>' +
          '</div>' +
        '</section>';
        return shell('bf-jackpot', h, false);
      });
      if (el) wireRail(el);
    }
  });

  register({
    id: 'bf-partners',
    run: function () {
      mount('bf-partners', function (lang) {
        var L = t(lang).partners, cards = '';
        for (var i = 0; i < PARTNERS.length; i++) {
          var p = PARTNERS[i], c = L[p.key];
          cards += '<div class="bf-partner" style="--bf-pc:' + p.pc + '">' +
            '<img class="bf-partner__photo" src="' + esc(p.img) + '" alt="" loading="lazy" decoding="async">' +
            '<span class="bf-partner__wordmark">' + esc(c.n) + '</span>' +
            '<div class="bf-partner__meta">' +
              '<p class="bf-partner__name">' + esc(c.c) + '</p>' +
              '<p class="bf-partner__role">' + SVG.verified + esc(L.role) + '</p>' +
            '</div>' +
          '</div>';
        }
        var h = '<section class="bf-partners">' +
          '<div class="bf-rowhead"><div class="bf-rowtitle">' +
            '<span class="bf-rowico">' + SVG.handshake + '</span>' +
            '<p class="bf-rowname">' + esc(L.title) + '</p>' +
          '</div></div>' +
          '<div class="bf-partners__grid">' + cards + '</div>' +
        '</section>';
        return shell('bf-partners', h);
      });
    }
  });

  var SB_ICONS = {
    home: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"><path d="M3 11.5L12 4L21 11.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 10.5V20H10V15H14V20H19V10.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    casino: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M6.6 3h10.8l3.1 5.6-8.5 12.1L3 8.6z"/><path d="M3 8.6h18"/><path d="M9.5 3 12 8.6 14.5 3"/></svg>',
    live: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="5" width="19" height="14" rx="4"/><circle cx="9" cy="10.6" r="1.8"/><circle cx="15.4" cy="10.6" r="1.8"/><path d="M5.9 16.2a3.5 3.5 0 0 1 6.2 0"/><path d="M12.4 16.2a3.5 3.5 0 0 1 6.1 0"/></svg>',
    sports: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.6 2.6 4 5.6 4 9s-1.4 6.4-4 9c-2.6-2.6-4-5.6-4-9s1.4-6.4 4-9z"/></svg>',
    livebet: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><circle cx="12" cy="12" r="2.1"/><path d="M8 8.2a5.6 5.6 0 0 0 0 7.6"/><path d="M16 8.2a5.6 5.6 0 0 1 0 7.6"/><path d="M5.2 5.2a9.8 9.8 0 0 0 0 13.6"/><path d="M18.8 5.2a9.8 9.8 0 0 1 0 13.6"/></svg>',
    deposit: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.4v9.4"/><path d="m8.2 9.1 3.8 3.7 3.8-3.7"/><path d="M4.2 14.6v3.1a2.6 2.6 0 0 0 2.6 2.6h10.4a2.6 2.6 0 0 0 2.6-2.6v-3.1"/></svg>',
    withdraw: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 12.8V3.4"/><path d="m8.2 7.1 3.8-3.7 3.8 3.7"/><path d="M4.2 14.6v3.1a2.6 2.6 0 0 0 2.6 2.6h10.4a2.6 2.6 0 0 0 2.6-2.6v-3.1"/></svg>'
  };

  var SB_LABELS = {
    tr: {
      home: 'Anasayfa', casino: 'Casino', live: 'Canlı Casino',
      sports: 'Spor Bahisleri', livebet: 'Canlı Bahis',
      deposit: 'Para Yatırma', withdraw: 'Para Çekme',
      special: 'Özel', help: 'Yardım & Destek'
    },
    en: {
      home: 'Home', casino: 'Casino', live: 'Live Casino',
      sports: 'Sportsbook', livebet: 'Live Betting',
      deposit: 'Deposit', withdraw: 'Withdraw',
      special: 'Special', help: 'Help & Support'
    }
  };

  var SB_NEW = [
    { key: 'casino', url: '/casino/slots/lobby' },
    { key: 'live', url: '/casino/live-casino/live-lobby' },
    { key: 'sports', url: '/sportsbook' },
    { key: 'livebet', url: '/sportsbook/live/soccer' },
    { key: 'deposit', action: 'deposit' },
    { key: 'withdraw', action: 'withdraw' }
  ];

  var SB_ORDER = {
    main: ['Anasayfa', 'Casino', 'Canlı Casino', 'Spor Bahisleri', 'Canlı Bahis'],
    special: ['Promosyonlar', 'VIP Kulübü', 'Çark Çevir', 'Meydan Okumalar', 'Turnuvalar'],
    help: ['Para Yatırma', 'Para Çekme', 'Blog']
  };

  function sbLabels(lang) { return SB_LABELS[lang] || SB_LABELS.tr; }

  function sbTitleOf(el) {
    var t = q('.sb-top-title', el);
    return t ? t.textContent.trim() : (el.getAttribute('aria-label') || '').trim();
  }

  function sbBuildItem(item, lang) {
    var L = sbLabels(lang);
    var label = L[item.key];
    var a = document.createElement('a');
    a.className = 'sb-top-btn';
    a.setAttribute('data-sb-tooltip', label);
    a.setAttribute('aria-label', label);
    a.setAttribute('data-bf-sb', item.key);

    if (item.action) {
      a.href = '#';
      a.setAttribute('data-bf-action', item.action);
    } else {
      a.href = getLangPrefix() + item.url;
      a.setAttribute('data-bf-link', getLangPrefix() + item.url);
    }

    a.innerHTML =
      '<span class="icon" aria-hidden="true">' +
        '<span role="presentation" style="display:inline-flex;width:20px;height:20px;line-height:0;">' +
          SB_ICONS[item.key] +
        '</span>' +
      '</span>' +
      '<span class="sb-top-title">' + esc(label) + '</span>' +
      '<span class="sb-top-arrow" aria-hidden="true">\u203a</span>';
    return a;
  }

  function sbBuildHeading(text) {
    var d = document.createElement('div');
    d.className = 'bf-sb-heading';
    d.setAttribute('data-bf-sb-heading', '1');
    d.textContent = text;
    return d;
  }

  function sbCleanup(host) {
    var junk = host.querySelectorAll('[data-bf-sb],[data-bf-sb-heading]');
    for (var i = 0; i < junk.length; i++) junk[i].remove();
    host.removeAttribute('data-bf-sb-lang');
  }

  register({
    id: 'bf-sb-menu',
    run: function () {
      var menu = q('#responsive-menu');
      if (!menu) return;
      var host = q('.categories .sb-top', menu) || q('.categories', menu);
      if (!host) return;

      if (!isHomePage()) { sbCleanup(host); return; }

      var lang = getLangCode();
      if (host.getAttribute('data-bf-sb-lang') === lang && q('[data-bf-sb]', host)) {
        var first = host.firstElementChild;
        if (first && sbTitleOf(first) === sbLabels(lang).home) return;
      }

      sbCleanup(host);

      var L = sbLabels(lang);
      var i, j;

      for (i = 0; i < SB_NEW.length; i++) {
        host.appendChild(sbBuildItem(SB_NEW[i], lang));
      }

      var items = host.querySelectorAll('.sb-top-btn');
      var byTitle = {};
      for (i = 0; i < items.length; i++) {
        if (items[i].classList.contains('supportbtn')) continue;
        byTitle[sbTitleOf(items[i])] = items[i];
      }

      var groups = [
        { list: SB_ORDER.main, heading: null },
        { list: SB_ORDER.special, heading: L.special },
        { list: SB_ORDER.help, heading: L.help }
      ];

      var frag = document.createDocumentFragment();
      for (i = 0; i < groups.length; i++) {
        var placed = 0;
        var pending = [];
        for (j = 0; j < groups[i].list.length; j++) {
          var el = byTitle[groups[i].list[j]];
          if (el) { pending.push(el); placed++; }
        }
        if (!placed) continue;
        if (groups[i].heading) frag.appendChild(sbBuildHeading(groups[i].heading));
        for (j = 0; j < pending.length; j++) frag.appendChild(pending[j]);
      }

      host.insertBefore(frag, host.firstChild);
      host.setAttribute('data-bf-sb-lang', lang);
      attachActions(host);
    }
  });

  var TRUST_ICONS = {
    age: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2.6 4.2 5.9v6.2c0 4.4 3.2 8.1 7.8 9.3 4.6-1.2 7.8-4.9 7.8-9.3V5.9z"/><path d="M9 9.4h1.4v5.2"/><path d="M13.4 11.9h2.2"/><path d="M14.5 9.4a1.2 1.2 0 0 1 0 2.5 1.2 1.2 0 0 1 0 2.5"/></svg>',
    license: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2.6 4.2 5.9v6.2c0 4.4 3.2 8.1 7.8 9.3 4.6-1.2 7.8-4.9 7.8-9.3V5.9z"/><path d="m8.6 11.9 2.4 2.4 4.4-4.4"/></svg>',
    secure: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="10.2" width="16" height="10.4" rx="2.6"/><path d="M7.8 10.2V7.6a4.2 4.2 0 0 1 8.4 0v2.6"/><circle cx="12" cy="15.4" r="1.5"/></svg>',
    fast: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12.8 2.6 5.2 13.4h5.4l-.8 8 7.6-10.8h-5.4z"/></svg>',
    support: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4.2 13.4v-1.2a7.8 7.8 0 0 1 15.6 0v1.2"/><rect x="2.4" y="13.1" width="4.2" height="6.2" rx="2.1"/><rect x="17.4" y="13.1" width="4.2" height="6.2" rx="2.1"/><path d="M19.5 19.3v.4a2.8 2.8 0 0 1-2.8 2.8h-3.2"/></svg>',
    fair: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3.4v17.2"/><path d="M7.6 20.6h8.8"/><path d="M4.4 7.4h15.2"/><path d="M4.4 7.4 2 13.2a2.9 2.9 0 0 0 4.8 0z"/><path d="M19.6 7.4 17.2 13.2a2.9 2.9 0 0 0 4.8 0z"/><circle cx="12" cy="5.4" r="1.6"/></svg>'
  };

  var TRUST = [
    { key: 'age', tc: '243, 31, 81' },
    { key: 'license', tc: '19, 227, 152' },
    { key: 'secure', tc: '68, 167, 255' },
    { key: 'fast', tc: '239, 176, 37' },
    { key: 'support', tc: '186, 122, 255' }
  ];

  var TRUST_TEXT = {
    tr: {
      age: { t: '18+ Yaş Sınırı', d: 'Yalnızca 18 yaş ve üzeri kullanıcılar için uygundur.' },
      license: { t: 'Lisans & Denetimli', d: 'Anjouan eGaming tarafından lisanslanmış ve düzenlenmektedir.' },
      secure: { t: 'Güvenli Ödeme', d: '256-bit SSL şifreleme ile verileriniz güvende.' },
      fast: { t: 'Hızlı Çekim', d: 'Çekim talepleriniz en kısa sürede işleme alınır.' },
      support: { t: '7/24 Canlı Destek', d: 'Destek ekibimize her an ulaşabilirsiniz.' },
      fair: { t: 'Adil Oyun', d: 'Tüm oyunlar sertifikalı RNG ile çalışır.' }
    },
    en: {
      age: { t: '18+ Age Limit', d: 'Suitable only for users aged 18 and over.' },
      license: { t: 'Licensed & Regulated', d: 'Licensed and regulated by Anjouan eGaming.' },
      secure: { t: 'Secure Payments', d: 'Your data is protected with 256-bit SSL encryption.' },
      fast: { t: 'Fast Withdrawals', d: 'Your withdrawal requests are processed quickly.' },
      support: { t: '24/7 Live Support', d: 'Our support team is always available.' },
      fair: { t: 'Fair Play', d: 'All games run on certified RNG systems.' }
    }
  };

  register({
    id: 'bf-trust',
    run: function () {
      var footer = q('#footer') || q('footer#footer');
      if (!footer) return;
      var notices = q('.footer-contents', footer);
      if (!notices || !notices.parentNode) return;

      var lang = getLangCode();
      var existing = document.getElementById('bf-trust');

      if (existing) {
        if (existing.getAttribute('data-bf-lang') === lang) {
          if (notices.nextElementSibling !== existing) {
            notices.parentNode.insertBefore(existing, notices.nextSibling);
          }
          return;
        }
        existing.remove();
      }

      var L = TRUST_TEXT[lang] || TRUST_TEXT.tr;
      var items = '';
      for (var i = 0; i < TRUST.length; i++) {
        var it = TRUST[i], c = L[it.key];
        if (!c) continue;
        items +=
          '<div class="bf-trust__item" style="--tc:' + it.tc + '">' +
            '<span class="bf-trust__ico">' + TRUST_ICONS[it.key] + '</span>' +
            '<span class="bf-trust__txt">' +
              '<span class="bf-trust__title">' + esc(c.t) + '</span>' +
              '<span class="bf-trust__desc">' + esc(c.d) + '</span>' +
            '</span>' +
          '</div>';
      }
      if (!items) return;

      var el = document.createElement('div');
      el.id = 'bf-trust';
      el.className = 'bf-trust';
      el.setAttribute('data-bf-lang', lang);
      el.innerHTML = '<div class="bf-trust__grid">' + items + '</div>';

      notices.parentNode.insertBefore(el, notices.nextSibling);
    }
  });

  function socialAnchor() {
    var m = q('#responsive-menu');
    if (!m) return null;
    var lf = q('.sidebar-lang-footer', m);
    if (lf && lf.parentNode) return { node: lf, at: 'after' };
    var host = q('.sidebar-content', m) || q('.sidebar-wrapper', m) || m;
    return host ? { node: host, at: 'append' } : null;
  }

  register({
    id: 'bf-sb-social',
    run: function () {
      var existing = document.getElementById('bf-sb-social');

      if (!DATA || !DATA.social || DATA.social.enabled === false) {
        if (existing) existing.remove();
        var dead = document.getElementById('bf-social-modal');
        if (dead) dead.remove();
        return;
      }

      var a = socialAnchor();
      if (!a || !a.node.parentNode) return;
      var lang = getLangCode();

      if (existing) {
        if (existing.getAttribute('data-bf-lang') === lang) {
          if (a.at === 'append') {
            if (existing.parentNode !== a.node) a.node.appendChild(existing);
          } else if (a.node.nextElementSibling !== existing) {
            a.node.parentNode.insertBefore(existing, a.node.nextSibling);
          }
          return;
        }
        existing.remove();
      }

      var L = t(lang).social;
      var pri = DATA.social.primary || [];
      var appUrl = (DATA.social.app && DATA.social.app.url) || '#';
      var btns = '';
      for (var i = 0; i < pri.length && i < 3; i++) {
        var k = pri[i].key;
        if (!BRAND[k]) continue;
        btns += '<a class="bf-sbsoc__btn" href="' + esc(pri[i].url) + '" target="_blank" rel="noopener noreferrer" ' +
                'aria-label="' + esc(LABEL[k]) + '" title="' + esc(LABEL[k]) + '">' + BRAND[k] + '</a>';
      }
      btns += '<button type="button" class="bf-sbsoc__btn" id="bf-social-more" aria-haspopup="dialog" ' +
              'aria-expanded="false" aria-label="' + esc(L.more) + '" title="' + esc(L.more) + '">' + SVG.dots + '</button>';

      var el = document.createElement('div');
      el.id = 'bf-sb-social';
      el.setAttribute('data-bf-lang', lang);
      el.innerHTML =
        '<a class="bf-sbapp" href="' + esc(appUrl) + '" target="_blank" rel="noopener noreferrer">' +
          '<span class="bf-sbapp__ico">' + SVG.appIco + '</span>' +
          '<span class="bf-sbapp__txt"><b>' + esc(L.appTitle) + '</b><em>' + esc(L.appDesc) + '</em></span>' +
        '</a>' +
        '<div class="bf-sbsoc">' + btns + '</div>';

      if (a.at === 'append') a.node.appendChild(el);
      else a.node.parentNode.insertBefore(el, a.node.nextSibling);

      buildModal(lang);
    }
  });

  function buildModal(lang) {
    var trigger = document.getElementById('bf-social-more');
    if (!trigger || !DATA || !DATA.social) return;

    var old = document.getElementById('bf-social-modal');
    if (old) old.remove();

    var L = t(lang).social;
    var all = (DATA.social.primary || []).concat(DATA.social.more || []);
    var items = '';
    for (var i = 0; i < all.length; i++) {
      var k = all[i].key;
      if (!BRAND[k]) continue;
      items += '<li><a class="bf-smodal__item" href="' + esc(all[i].url) + '" target="_blank" rel="noopener noreferrer">' +
               BRAND[k] + esc(LABEL[k]) + '</a></li>';
    }
    if (!items) return;

    var wrap = document.createElement('div');
    wrap.className = 'bf-smodal';
    wrap.id = 'bf-social-modal';
    wrap.hidden = true;
    wrap.innerHTML =
      '<div class="bf-smodal__backdrop" data-bf-close></div>' +
      '<div class="bf-smodal__panel" role="dialog" aria-modal="true" aria-label="' + esc(L.title) + '">' +
        '<div class="bf-smodal__head">' +
          '<h3 class="bf-smodal__title">' + esc(L.title) + '</h3>' +
          '<button type="button" class="bf-smodal__close" data-bf-close aria-label="' + esc(L.close) + '">' + SVG.close + '</button>' +
        '</div>' +
        '<ul class="bf-smodal__list">' + items + '</ul>' +
      '</div>';
    document.body.appendChild(wrap);

    var panel = q('.bf-smodal__panel', wrap);
    var GAP = 10, EDGE = 8;

    function position() {
      var r = trigger.getBoundingClientRect();
      var pw = panel.offsetWidth, ph = panel.offsetHeight;
      var vw = window.innerWidth, vh = window.innerHeight;
      var left = r.right + GAP;
      if (left + pw > vw - EDGE) {
        left = r.left - pw - GAP;
        if (left < EDGE) left = Math.max(EDGE, (vw - pw) / 2);
      }
      var top = r.bottom - ph + 18;
      if (top < EDGE) top = EDGE;
      if (top + ph > vh - EDGE) top = Math.max(EDGE, vh - ph - EDGE);
      panel.style.left = Math.round(left) + 'px';
      panel.style.top = Math.round(top) + 'px';
    }
    function open() {
      wrap.hidden = false;
      trigger.setAttribute('aria-expanded', 'true');
      position();
    }
    function close() {
      if (wrap.hidden) return;
      wrap.hidden = true;
      trigger.setAttribute('aria-expanded', 'false');
    }

    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      if (wrap.hidden) open(); else close();
    });
    var closers = wrap.querySelectorAll('[data-bf-close]');
    for (var j = 0; j < closers.length; j++) closers[j].addEventListener('click', close);
    window.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    onResize(function () { if (!wrap.hidden) position(); });
  }

  /* ==================================================================== */
  /* Canlı sayaçlar                                                        */
  /*                                                                       */
  /* Panelin canlı ucu 15–20 saniyede bir çekilir ve gelen değer yalnızca  */
  /* ilgili DOM elemanının içeriğine yazılır. Sayfa yenilenmez, başka      */
  /* hiçbir alan etkilenmez. API'ye ulaşılamazsa son bilinen değer ekranda */
  /* kalır; bölüm gizlenmez, hata gösterilmez.                             */
  /* ==================================================================== */

  var LIVE = { players: null, jackpot: null };
  var liveTimer = null;
  var liveBusy = false;
  var odoStyled = false;
  var flowFrames = {};

  var LIVE_TARGETS = [
    { key: 'players', mode: 'tick', sel: '#bf-stats .bf-stat--players .bf-stat__value' },
    { key: 'jackpot', mode: 'flow', sel: '#bf-jackpot .bf-jackpot__amount' }
  ];

  var REDUCED_MOTION = !!(window.matchMedia
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  // Şerit hücresinin yüksekliği (em). Yazı boyutundan bağımsız çalışsın diye
  // em cinsinden; dönüş mesafeleri de aynı birimle hesaplanır.
  var CELL_EM = 1.15;

  /* ------------------------------------------------------------------ */
  /* Odometre stilleri                                                   */
  /* ------------------------------------------------------------------ */

  function injectOdometerStyles() {
    if (odoStyled || document.getElementById('bf-odo-styles')) return;
    odoStyled = true;

    var css =
      '.bf-odo{display:inline-flex;align-items:flex-start;vertical-align:baseline;font-variant-numeric:tabular-nums}' +
      '.bf-odo__s{display:block;height:' + CELL_EM + 'em;line-height:' + CELL_EM + 'em}' +
      '.bf-odo__d{display:block;height:' + CELL_EM + 'em;overflow:hidden}' +
      '.bf-odo__r{display:block;will-change:transform}' +
      '.bf-odo__r>span{display:block;height:' + CELL_EM + 'em;line-height:' + CELL_EM + 'em}' +
      // Tik modu geçişi CSS ile; akış modu her karede elle konumlandığı için
      // geçişi olmamalı, yoksa iki animasyon birbiriyle yarışır.
      '.bf-odo__r--tick{transition:transform ' + TICK_ANIM + 'ms cubic-bezier(.22,1,.36,1)}' +
      '@media (prefers-reduced-motion:reduce){.bf-odo__r--tick{transition:none}}';

    var style = document.createElement('style');
    style.id = 'bf-odo-styles';
    style.appendChild(document.createTextNode(css));
    (document.head || document.documentElement).appendChild(style);
  }

  function makeCell() {
    var cell = document.createElement('span');
    cell.className = 'bf-odo__d';
    return cell;
  }

  function makeFlat(ch) {
    var flat = document.createElement('span');
    flat.className = 'bf-odo__s';
    flat.textContent = ch;
    return flat;
  }

  /* ------------------------------------------------------------------ */
  /* TİK MODU — aktif oyuncu sayacı                                      */
  /*                                                                     */
  /* Sayı çoğu zaman sabit durur. Yeni değer geldiğinde her hane, eski   */
  /* rakamdan yenisine aradaki tüm rakamların üzerinden geçerek döner:   */
  /* 1'den 9'a çıkarken 2,3,4,5,6,7,8 görünür. Üst hane devrettiğinde    */
  /* 9'dan 0'a geçilir, gerçek bir kilometre sayacı gibi.                */
  /* ------------------------------------------------------------------ */

  /** Eski rakamdan yenisine, seçilen yönde uğranacak rakamların listesi. */
  function digitPath(from, to, direction) {
    var a = from.charCodeAt(0) - 48;
    var b = to.charCodeAt(0) - 48;

    var path = [a];
    var current = a;

    // En fazla 10 adım — devretme dahil tüm rakamlar bir turda biter.
    for (var guard = 0; current !== b && guard < 10; guard++) {
      current = direction > 0 ? (current + 1) % 10 : (current + 9) % 10;
      path.push(current);
    }

    return path;
  }

  function paintTick(el, text, direction) {
    injectOdometerStyles();

    var previous = el.getAttribute('data-bf-value');
    var animate = direction !== 0
      && previous !== null
      && previous.length === text.length
      && !REDUCED_MOTION;

    var wrap = document.createElement('span');
    wrap.className = 'bf-odo';

    var reels = [];

    for (var i = 0; i < text.length; i++) {
      var ch = text.charAt(i);
      var old = animate ? previous.charAt(i) : ch;

      if (!animate || ch === old || ch < '0' || ch > '9') {
        wrap.appendChild(makeFlat(ch));
        continue;
      }

      var path = digitPath(old, ch, direction);
      var cell = makeCell();

      var reel = document.createElement('span');
      reel.className = 'bf-odo__r bf-odo__r--tick';

      // Artışta şerit yukarı kayar: eski rakam üstte, yeni en altta.
      // Azalışta şerit aşağı kayar: sıra ters dizilir, baştaki konumdan 0'a gelinir.
      var ordered = direction > 0 ? path : path.slice().reverse();
      var span = (ordered.length - 1) * CELL_EM;

      for (var d = 0; d < ordered.length; d++) {
        var digit = document.createElement('span');
        digit.textContent = String(ordered[d]);
        reel.appendChild(digit);
      }

      reel.style.transform = direction > 0
        ? 'translateY(0)'
        : 'translateY(-' + span + 'em)';

      reels.push({ reel: reel, to: direction > 0 ? 'translateY(-' + span + 'em)' : 'translateY(0)' });

      cell.appendChild(reel);
      wrap.appendChild(cell);
    }

    el.innerHTML = '';
    el.appendChild(wrap);
    el.setAttribute('data-bf-value', text);

    if (!reels.length) return;

    // Başlangıç konumu çizildikten sonra hedefe kaydır ki geçiş tetiklensin.
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        for (var k = 0; k < reels.length; k++) {
          reels[k].reel.style.transform = reels[k].to;
        }
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* AKIŞ MODU — jackpot tutarı                                          */
  /*                                                                     */
  /* Jackpot sürekli ve tek yönlü arttığı için hiç durmaz: iki istek     */
  /* arasındaki sürenin çoğuna yayılarak akar, son birkaç saniye sabit   */
  /* kalır. Her hane kendi hızında döner — birler hanesi hızlı, onlar    */
  /* on kat yavaş, yüzler yüz kat yavaş. Gerçek bir kilometre sayacının  */
  /* dişli mantığı.                                                      */
  /* ------------------------------------------------------------------ */

  /**
   * Bir hanenin o andaki makara konumu.
   *
   * Gerçek bir kilometre sayacının dişli mantığı: birler hanesi değerle
   * birlikte sürekli döner, üst haneler yalnızca altlarındaki hanelerin
   * tamamı 9 iken hareket eder. Böylece sayı tam bir değerdeyken bütün
   * haneler net durur; makaralar sadece devretme anında araya girer.
   */
  function wheelPosition(value, place) {
    var whole = Math.floor(value);
    var fraction = value - whole;
    var unit = Math.pow(10, place);

    var digit = Math.floor(whole / unit) % 10;

    // Bir hane yalnızca altındaki hanelerin tamamı 9 iken devreder.
    // Birler hanesi ise değerle birlikte sürekli döner.
    var carrying = place === 0 || (whole % unit) === unit - 1;

    return digit + (carrying ? fraction : 0);
  }

  /** Metnin rakam olmayan iskeleti — yapı değişmediyse DOM yeniden kurulmaz. */
  function signature(text) {
    return text.replace(/\d/g, '#');
  }

  function buildFlow(el, text, decimals) {
    var wrap = document.createElement('span');
    wrap.className = 'bf-odo';

    var digitCount = (text.match(/\d/g) || []).length;
    var wheels = [];
    var seen = 0;

    for (var i = 0; i < text.length; i++) {
      var ch = text.charAt(i);

      if (ch < '0' || ch > '9') {
        wrap.appendChild(makeFlat(ch));
        continue;
      }

      var place = (digitCount - 1 - seen) - decimals;
      seen++;

      var cell = makeCell();
      var reel = document.createElement('span');
      reel.className = 'bf-odo__r bf-odo__r--flow';

      // 0-9 ve devretme için bir tane daha 0.
      for (var d = 0; d <= 10; d++) {
        var digit = document.createElement('span');
        digit.textContent = String(d % 10);
        reel.appendChild(digit);
      }

      cell.appendChild(reel);
      wrap.appendChild(cell);
      wheels.push({ reel: reel, place: place });
    }

    el.innerHTML = '';
    el.appendChild(wrap);

    return { signature: signature(text), decimals: decimals, wheels: wheels };
  }

  function renderFlow(structure, value) {
    for (var i = 0; i < structure.wheels.length; i++) {
      var wheel = structure.wheels[i];
      var position = wheelPosition(value, wheel.place);

      // Konum değişmediyse dokunma: üst haneler zamanın çoğunda sabit durur,
      // gereksiz stil yazımı her karede yeniden hesaplamaya yol açar.
      if (wheel.last !== undefined && Math.abs(position - wheel.last) < 0.0005) continue;

      wheel.last = position;
      wheel.reel.style.transform = 'translateY(-' + (position * CELL_EM) + 'em)';
    }
  }

  function paintFlow(el, key, state) {
    injectOdometerStyles();

    // Ondalık basamak sayısı: metindeki rakam adedi ile tam kısmın uzunluğu farkı.
    var digitCount = (state.text.match(/\d/g) || []).length;
    var decimals = Math.max(0, digitCount - String(Math.floor(Math.abs(state.value))).length);

    var structure = el.__bfFlow;
    if (!structure || structure.signature !== signature(state.text)) {
      structure = buildFlow(el, state.text, decimals);
      el.__bfFlow = structure;
    }

    el.setAttribute('data-bf-value', state.text);

    if (flowFrames[key]) {
      cancelAnimationFrame(flowFrames[key]);
      flowFrames[key] = null;
    }

    var from = state.from;
    var to = state.value;

    if (from == null || from === to || REDUCED_MOTION) {
      renderFlow(structure, to);
      return;
    }

    var started = 0;

    function step(now) {
      if (!started) started = now;

      // `isConnected` eski WebView sürümlerinde yok; `document.contains`
      // her yerde var ve aynı sorunun cevabını verir.
      if (!document.contains(el)) {
        flowFrames[key] = null;
        return;
      }

      // Doğrusal ilerleme — akış yavaşlamadan devam etsin.
      var t = Math.min(1, (now - started) / FLOW_ANIM);
      renderFlow(structure, from + (to - from) * t);

      if (t < 1) {
        flowFrames[key] = requestAnimationFrame(step);
      } else {
        // Kalan süre boyunca sabit kalır, sonraki veri akışı yeniden başlatır.
        flowFrames[key] = null;
      }
    }

    flowFrames[key] = requestAnimationFrame(step);
  }

  /* ------------------------------------------------------------------ */

  function paintLive(animate) {
    for (var i = 0; i < LIVE_TARGETS.length; i++) {
      var target = LIVE_TARGETS[i];
      var state = LIVE[target.key];
      if (!state) continue;

      var el = q(target.sel);
      if (!el) continue;

      var known = el.getAttribute('data-bf-value');

      // Animasyonsuz çağrı yalnızca yeni oluşturulmuş elemanı doldurur;
      // aksi halde her DOM değişikliğinde akışı baştan başlatırdı.
      if (!animate) {
        if (known !== null) continue;

        if (target.mode === 'flow') {
          paintFlow(el, target.key, { from: null, value: state.value, text: state.text });
        } else {
          paintTick(el, state.text, 0);
        }
        continue;
      }

      if (target.mode === 'flow') {
        paintFlow(el, target.key, state);
        continue;
      }

      var direction = 0;
      if (known !== null && state.from != null) {
        if (state.value > state.from) direction = 1;
        else if (state.value < state.from) direction = -1;
      }

      paintTick(el, state.text, direction);
    }
  }

  function fetchLive() {
    // Sekme arka plandayken istek atılmaz.
    if (liveBusy || document.hidden) return;
    liveBusy = true;

    fetch(LIVE_URL, { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) {
        liveBusy = false;
        if (!j) return;

        applyLiveValue('players', j.activePlayers);
        applyLiveValue('jackpot', j.jackpot);
        paintLive(true);
      })
      .catch(function () {
        // Hata yutulur: son bilinen değer ekranda kalır.
        liveBusy = false;
      });
  }

  function applyLiveValue(key, incoming) {
    if (!incoming || incoming.value == null) return;

    var previous = LIVE[key];
    LIVE[key] = {
      from: previous ? previous.value : seedValue(key),
      value: Number(incoming.value),
      text: String(incoming.text)
    };
  }

  /** İlk animasyonun başlangıç noktası: statik yüklemedeki değer. */
  function seedValue(key) {
    if (!DATA) return null;

    if (key === 'players') {
      return DATA.stats && DATA.stats.activePlayers ? DATA.stats.activePlayers.value : null;
    }

    return DATA.jackpot && DATA.jackpot.amount ? DATA.jackpot.amount.value : null;
  }

  function startLive() {
    if (liveTimer) return;

    fetchLive();
    liveTimer = setInterval(fetchLive, LIVE_INTERVAL);

    // Sekmeye geri dönüldüğünde beklemeden tazele.
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden) fetchLive();
    });
  }

  function boot() {
    VW = window.innerWidth;
    injectCss();
    loadData();
    installHistoryHook();
    installResizeHub();
    startLive();

    scheduleRun();
    setTimeout(scheduleRun, 300);
    setTimeout(scheduleRun, 800);
    setTimeout(scheduleRun, 1600);

    var mo = new MutationObserver(scheduleRun);
    mo.observe(document.body, { childList: true, subtree: true });
  }

  window.__BetifaHome = true;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
