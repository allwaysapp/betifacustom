(function () {
  var DATA_URL = 'https://raw.githubusercontent.com/allwaysapp/betifacustom/main/betifa-home.json';
  var CSS_URL = 'https://raw.githubusercontent.com/allwaysapp/betifacustom/main/custom.css';
  var CDN = 'https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/kojqlwkejjoizdGJKQWf/statics/';

  var LOCALES = ['tr', 'en'];
  var FALLBACK = 'tr';

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
    { key: 'deposit', url: '/wallet/fiat/deposit' },
    { key: 'withdraw', url: '/wallet/fiat/withdraw' },
    { key: 'bonus', url: '?modal=bonus-request' },
    { key: 'tv', url: '' },
    { key: 'wheel', url: '/wheel' },
    { key: 'chat', url: '' }
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
        apple: 'Apple İçin<br>İndir', google: 'Android İçin<br>İndir',
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
        apple: 'Download<br>For Apple', google: 'Download<br>For Android',
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
    youtube: '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22.5 7.2a2.8 2.8 0 0 0-2-2C18.9 4.8 12 4.8 12 4.8s-6.9 0-8.5.4a2.8 2.8 0 0 0-2 2A29.6 29.6 0 0 0 1.1 12a29.6 29.6 0 0 0 .4 4.8 2.8 2.8 0 0 0 2 2c1.6.4 8.5.4 8.5.4s6.9 0 8.5-.4a2.8 2.8 0 0 0 2-2 29.6 29.6 0 0 0 .4-4.8 29.6 29.6 0 0 0-.4-4.8zM9.8 15.1V8.9L15.4 12z"/></svg>'
  };

  var LABEL = {
    telegram: 'Telegram', whatsapp: 'Whatsapp', instagram: 'Instagram',
    facebook: 'Facebook', pinterest: 'Pinterest', threads: 'Threads',
    discord: 'Discord', x: 'X', youtube: 'YouTube'
  };

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function q(sel, root) { return (root || document).querySelector(sel); }

  function lang() {
    var l = (document.documentElement.getAttribute('lang') || '').trim().toLowerCase();
    if (LOCALES.indexOf(l) !== -1) return l;
    var b = l.split('-')[0];
    if (LOCALES.indexOf(b) !== -1) return b;
    return FALLBACK;
  }

  function t() { return T[lang()] || T[FALLBACK]; }

  function pfx() {
    var seg = window.location.pathname.split('/')[1];
    return LOCALES.indexOf(seg) !== -1 ? '/' + seg : '';
  }

  function isHome() {
    var p = window.location.pathname.replace(/\/+$/, '') || '/';
    if (p === '/') return true;
    for (var i = 0; i < LOCALES.length; i++) if (p === '/' + LOCALES[i]) return true;
    return false;
  }

  function href(u) {
    if (!u) return '';
    if (/^https?:\/\//.test(u)) return u;
    if (u.charAt(0) === '?') return window.location.pathname + u;
    return pfx() + u;
  }

  var DATA = null;
  var SKEW = 0;
  var fetching = false;

  function loadData() {
    if (DATA || fetching) return;
    fetching = true;
    fetch(DATA_URL + '?v=' + Math.floor(Date.now() / 60000), { cache: 'no-cache' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) {
        if (!j) return;
        DATA = j;
        if (j.serverNow) {
          var s = Date.parse(j.serverNow);
          if (!isNaN(s)) SKEW = s - Date.now();
        }
        runAll();
      })
      .catch(function () {})
      .then(function () { fetching = false; });
  }

  function now() { return Date.now() + SKEW; }

  function growValue(c) {
    if (!c) return 0;
    var st = Date.parse(c.startAt);
    if (isNaN(st)) st = now();
    var steps = Math.floor((now() - st) / (Math.max(1, c.stepSeconds) * 1000));
    if (steps < 0) steps = 0;
    var v = c.base + steps * c.stepAmount;
    if (typeof c.cap === 'number' && v > c.cap) v = c.cap;
    return Math.round(v);
  }

  function waveValue(c) {
    if (!c) return 0;
    var d = new Date(now());
    var h = d.getUTCHours() + d.getUTCMinutes() / 60 + d.getUTCSeconds() / 3600;
    var mid = (c.min + c.max) / 2;
    var amp = (c.max - c.min) / 2;
    var base = mid + amp * Math.cos(2 * Math.PI * (h - (c.peakHour || 21)) / 24);
    var seed = Math.floor(now() / 45000);
    var n = Math.sin(seed * 12.9898) * 43758.5453;
    var noise = (n - Math.floor(n) - 0.5) * 2 * (c.jitter || 0);
    var v = Math.round(base + noise);
    if (v < c.min) v = c.min;
    if (v > c.max) v = c.max;
    return v;
  }

  function counterValue(c) {
    if (!c) return 0;
    return c.mode === 'wave' ? waveValue(c) : growValue(c);
  }

  function fmtInt(n) {
    try { return Number(n).toLocaleString(lang() === 'en' ? 'en-US' : 'tr-TR'); }
    catch (e) { return String(n); }
  }

  function fmtCompact(n) {
    if (n >= 1e9) return (n / 1e9).toFixed(1) + 'B';
    if (n >= 1e6) return (n / 1e6 >= 100 ? Math.round(n / 1e6) : (n / 1e6).toFixed(1)) + 'M';
    if (n >= 1e3) return Math.round(n / 1e3) + 'K';
    return fmtInt(n);
  }

  var STAT_FMT = {
    players: { fn: fmtInt, pre: '', suf: '+' },
    registered: { fn: fmtCompact, pre: '', suf: '+' },
    paid: { fn: fmtCompact, pre: '$', suf: '+' }
  };

  var STAT_KEY = { players: 'activePlayers', registered: 'registeredPlayers', paid: 'totalPaid' };

  function tickCounters() {
    if (document.hidden || !DATA) return;
    var els = document.querySelectorAll('[data-bf-count]');
    for (var i = 0; i < els.length; i++) {
      var k = els[i].getAttribute('data-bf-count');
      var txt = '';
      if (k === 'jackpot') {
        var j = DATA.jackpot && DATA.jackpot.amount;
        if (!j) continue;
        txt = '$' + fmtInt(counterValue(j));
      } else {
        var cfg = DATA.stats && DATA.stats[STAT_KEY[k]];
        if (!cfg) continue;
        var f = STAT_FMT[k];
        txt = f.pre + f.fn(counterValue(cfg)) + f.suf;
      }
      if (els[i].textContent !== txt) els[i].textContent = txt;
    }
  }

  var renderers = [];
  var booted = false;

  function register(fn) { renderers.push(fn); }

  function runAll() {
    for (var i = 0; i < renderers.length; i++) {
      try { renderers[i](); } catch (e) {}
    }
  }

  function isOurs(node) {
    while (node) {
      if (node.nodeType === 1) {
        var id = node.id || '';
        if (id.indexOf('bf-') === 0) return true;
        if (node.classList && node.classList.contains('bf-mod')) return true;
      }
      node = node.parentNode;
    }
    return false;
  }

  function boot() {
    if (booted) return;
    booted = true;

    var timer = null;
    var schedule = function () {
      if (timer) return;
      timer = setTimeout(function () { timer = null; runAll(); }, 150);
    };

    if (typeof MutationObserver !== 'undefined') {
      var mo = new MutationObserver(function (records) {
        for (var i = 0; i < records.length; i++) {
          if (!isOurs(records[i].target)) { schedule(); return; }
        }
      });
      mo.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['lang']
      });
    } else {
      setInterval(runAll, 1000);
    }

    var path = window.location.pathname;
    var onNav = function () {
      if (window.location.pathname !== path) { path = window.location.pathname; runAll(); }
    };
    window.addEventListener('popstate', onNav);
    var ps = history.pushState, rs = history.replaceState;
    history.pushState = function () { ps.apply(this, arguments); onNav(); };
    history.replaceState = function () { rs.apply(this, arguments); onNav(); };

    window.addEventListener('resize', schedule, { passive: true });
    window.addEventListener('orientationchange', schedule, { passive: true });

    setInterval(tickCounters, 1000);
    document.addEventListener('visibilitychange', tickCounters);
  }

  function injectCss() {
    if (!CSS_URL || document.getElementById('bf-styles')) return;
    var l = document.createElement('link');
    l.id = 'bf-styles';
    l.rel = 'stylesheet';
    l.href = CSS_URL;
    (document.head || document.documentElement).appendChild(l);
  }

  var ORDER = ['bf-subnav', 'bf-products', 'bf-stats', 'bf-appbar', 'bf-slots', 'bf-jackpot', 'bf-partners'];

  var ANCHORS = {
    'bf-subnav': [{ sel: '#header', at: 'after' }],
    'bf-products': [
      { sel: '.enterence-box', at: 'after' },
      { sel: '.hp-mobile-slider', at: 'after' }
    ],
    'bf-stats': [
      { sel: '#bf-products', at: 'after' },
      { sel: '.enterence-box', at: 'after' },
      { sel: '.hp-mobile-slider', at: 'after' }
    ],
    'bf-appbar': [
      { sel: '#bf-stats', at: 'after' },
      { sel: '#bf-products', at: 'after' },
      { sel: '.enterence-box', at: 'after' },
      { sel: '.hp-mobile-slider', at: 'after' }
    ],
    'bf-slots': [{ sel: '.top-picks-widget', at: 'after' }],
    'bf-jackpot': [{ sel: '#bf-slots', at: 'after' }, { sel: '.top-picks-widget', at: 'after' }],
    'bf-partners': [{ sel: '#footer', at: 'before' }]
  };

  function visible(el) {
    if (!el) return false;
    return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
  }

  function resolveAnchor(id) {
    var list = ANCHORS[id] || [], i, a;
    for (i = 0; i < list.length; i++) {
      a = q(list[i].sel);
      if (a && a.parentNode && visible(a)) return { node: a, at: list[i].at, sel: list[i].sel };
    }
    for (i = 0; i < list.length; i++) {
      a = q(list[i].sel);
      if (a && a.parentNode) return { node: a, at: list[i].at, sel: list[i].sel };
    }
    return null;
  }

  function place(el, id) {
    var target = resolveAnchor(id);
    if (!target) return false;
    if (target.at === 'before') {
      if (target.node.previousElementSibling !== el) {
        target.node.parentNode.insertBefore(el, target.node);
      }
    } else {
      if (target.node.nextElementSibling !== el) {
        target.node.parentNode.insertBefore(el, target.node.nextSibling);
      }
    }
    if (el.getAttribute('data-bf-anchor') !== target.sel) {
      el.setAttribute('data-bf-anchor', target.sel);
    }
    return true;
  }

  function shell(id, inner, wrap) {
    var el = document.createElement('div');
    el.id = id;
    el.className = 'bf-mod';
    el.innerHTML = wrap === false ? inner : '<div class="container">' + inner + '</div>';
    return el;
  }

  function mount(id, build) {
    var ex = document.getElementById(id);
    if (!isHome()) { if (ex) ex.remove(); return null; }
    var sig = lang();
    if (ex) {
      if (ex.getAttribute('data-bf-lang') !== sig) {
        var fresh = build();
        if (!fresh) return null;
        fresh.setAttribute('data-bf-lang', sig);
        ex.parentNode.replaceChild(fresh, ex);
        fresh.setAttribute('data-bf-anchor', ex.getAttribute('data-bf-anchor') || '');
        return fresh;
      }
      var target = resolveAnchor(id);
      if (target && ex.getAttribute('data-bf-anchor') !== target.sel) place(ex, id);
      return null;
    }
    var el = build();
    if (!el) return null;
    el.setAttribute('data-bf-lang', sig);
    if (!place(el, id)) return null;
    return el;
  }

  function rowHead(icoSvg, name, ctrlHtml) {
    return '<div class="bf-rowhead">' +
      '<div class="bf-rowtitle">' +
        '<span class="bf-rowico">' + icoSvg + '</span>' +
        '<p class="bf-rowname">' + esc(name) + '</p>' +
      '</div>' +
      (ctrlHtml ? '<div class="bf-rowctrl">' + ctrlHtml + '</div>' : '') +
    '</div>';
  }

  function navBtns() {
    return '<button type="button" class="bf-navbtn" data-bf-prev aria-label="prev">' + SVG.chevL + '</button>' +
           '<button type="button" class="bf-navbtn" data-bf-next aria-label="next">' + SVG.chevR + '</button>';
  }

  function wireRail(root) {
    var track = q('.bf-rail', root);
    if (!track || track.dataset.bfRail) return;
    track.dataset.bfRail = '1';
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
    if (prev) prev.addEventListener('click', function () { track.scrollBy({ left: -step(), behavior: 'smooth' }); });
    if (next) next.addEventListener('click', function () { track.scrollBy({ left: step(), behavior: 'smooth' }); });

    var raf = null;
    track.addEventListener('scroll', function () {
      if (raf) return;
      raf = requestAnimationFrame(function () { raf = null; sync(); });
    }, { passive: true });
    if (window.ResizeObserver) new ResizeObserver(sync).observe(track);
    sync();
  }

  function blockNav(root) {
    var els = root.querySelectorAll('[data-bf-noop]');
    for (var i = 0; i < els.length; i++) {
      els[i].addEventListener('click', function (e) { e.preventDefault(); });
    }
  }

  register(function () {
    mount('bf-subnav', function () {
      var L = t().nav, h = '<nav class="bf-subnav">';
      for (var i = 0; i < NAV.length; i++) {
        var n = NAV[i];
        h += '<a class="bf-subnav__item" href="' + esc(href(n.url)) + '">' +
             '<img src="' + esc(n.icon) + '" alt="" loading="lazy" decoding="async">' +
             esc(L[n.key]) + '</a>';
      }
      h += '</nav>';
      return shell('bf-subnav', h);
    });
  });

  register(function () {
    mount('bf-products', function () {
      var L = t().prod, h = '<div class="bf-products">';
      for (var i = 0; i < PRODUCTS.length; i++) {
        var p = PRODUCTS[i], c = L[p.key];
        var noop = p.url ? '' : ' data-bf-noop';
        h += '<a class="bf-product bf-product--' + p.key + '" href="' + esc(p.url ? href(p.url) : '#') + '"' + noop + '>' +
             '<img class="bf-product__bg" src="' + esc(A.prodBox[p.key]) + '" alt="" loading="lazy" decoding="async">' +
             '<img class="bf-product__icon" src="' + esc(A.prodIcon[p.key]) + '" alt="" loading="lazy" decoding="async">' +
             '<div><p class="bf-product__title">' + esc(c.t) + '</p>' +
             '<p class="bf-product__desc">' + c.d + '</p></div></a>';
      }
      h += '</div>';
      var el = shell('bf-products', h);
      blockNav(el);
      return el;
    });
  });

  register(function () {
    var el = mount('bf-stats', function () {
      if (!DATA || !DATA.stats || DATA.stats.enabled === false) return null;
      var L = t().stat, keys = ['players', 'registered', 'paid'];
      var h = '<div class="bf-stats">';
      for (var i = 0; i < keys.length; i++) {
        var k = keys[i], l = L[k];
        h += '<div class="bf-stat bf-stat--' + k + '">' +
             '<img class="bf-stat__bg" src="' + esc(A.statBox[k]) + '" alt="" loading="lazy" decoding="async">' +
             '<img class="bf-stat__icon" src="' + esc(A.statIcon[k]) + '" alt="" loading="lazy" decoding="async">' +
             '<div class="bf-stat__text">' +
             '<p class="bf-stat__value" data-bf-count="' + k + '">&nbsp;</p>' +
             '<p class="bf-stat__label">' + esc(l.pre) + ' <b>' + esc(l.hi) + '</b> ' + esc(l.post) + '</p>' +
             '</div></div>';
      }
      h += '</div>';
      return shell('bf-stats', h);
    });
    if (el) tickCounters();
  });

  register(function () {
    mount('bf-appbar', function () {
      var L = t().app;
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
              '<img src="' + esc(A.app.apple) + '" alt="" decoding="async"><span>' + L.apple + '</span></a>' +
            '<a class="bf-store" href="' + esc(url) + '" target="_blank" rel="noopener noreferrer">' +
              '<img src="' + esc(A.app.google) + '" alt="" decoding="async"><span>' + L.google + '</span></a>' +
          '</div>' +
        '</div>' +
        '<img class="bf-appbar__qr" src="' + esc(A.app.qr) + '" alt="QR" loading="lazy" decoding="async">' +
      '</section>';
      return shell('bf-appbar', h);
    });
  });

  function slotRows(list, kind) {
    var arrow = kind === 'hot' ? A.slot.hotArrow : A.slot.coldArrow;
    var h = '';
    for (var i = 0; i < list.length; i++) {
      var s = list[i];
      h += '<a class="bf-slotrow" href="' + esc(href(s.url)) + '">' +
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

  register(function () {
    mount('bf-slots', function () {
      if (!DATA || !DATA.slots || DATA.slots.enabled === false) return null;
      var hot = DATA.slots.hot || [], cold = DATA.slots.cold || [];
      if (!hot.length && !cold.length) return null;
      var L = t().slots;
      var h = '<div class="bf-slots">' +
        (hot.length ? slotPanel('hot', L.hot, hot) : '') +
        (cold.length ? slotPanel('cold', L.cold, cold) : '') +
      '</div>';
      return shell('bf-slots', h, false);
    });
  });

  register(function () {
    var el = mount('bf-jackpot', function () {
      if (!DATA || !DATA.jackpot || DATA.jackpot.enabled === false) return null;
      var jp = DATA.jackpot, games = jp.games || [];
      if (!games.length) return null;
      var L = t().jackpot, cards = '';
      for (var i = 0; i < games.length; i++) {
        var g = games[i];
        cards += '<a class="bf-card" href="' + esc(href(g.url || jp.ctaUrl)) + '" aria-label="' + esc(g.title) + '">' +
                 '<img src="' + esc(g.image) + '" alt="' + esc(g.title) + '" loading="lazy" decoding="async"></a>';
      }
      var h = '<section class="bf-jackpot" data-bf-rail>' +
        '<div class="bf-jackpot__info">' +
          '<div>' +
            '<p class="bf-jackpot__label"><span class="bf-jackpot__dot"></span>' + esc(L.label) + '</p>' +
            '<p class="bf-jackpot__amount" data-bf-count="jackpot">&nbsp;</p>' +
          '</div>' +
          '<a class="bf-jackpot__btn" href="' + esc(href(jp.ctaUrl)) + '">' + esc(L.cta) + '</a>' +
        '</div>' +
        '<div class="bf-jackpot__strip">' +
          '<button type="button" class="bf-navbtn bf-jackpot__nav bf-jackpot__nav--prev" data-bf-prev aria-label="prev">' + SVG.chevL + '</button>' +
          '<div class="bf-rail">' + cards + '</div>' +
          '<button type="button" class="bf-navbtn bf-jackpot__nav bf-jackpot__nav--next" data-bf-next aria-label="next">' + SVG.chevR + '</button>' +
        '</div>' +
      '</section>';
      return shell('bf-jackpot', h, false);
    });
    if (el) { wireRail(el); tickCounters(); }
  });

  register(function () {
    mount('bf-partners', function () {
      var L = t().partners, cards = '';
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
        rowHead(SVG.handshake, L.title, '') +
        '<div class="bf-partners__grid">' + cards + '</div>' +
      '</section>';
      return shell('bf-partners', h);
    });
  });

  function socialAnchor() {
    var m = q('#responsive-menu');
    if (!m) return null;
    var lf = q('.sidebar-lang-footer', m);
    if (lf && lf.parentNode) return { node: lf, at: 'after' };
    var host = q('.sidebar-content', m) || q('.sidebar-wrapper', m) || m;
    return host ? { node: host, at: 'append' } : null;
  }

  function placeSocial(el, a) {
    if (a.at === 'append') {
      if (el.parentNode !== a.node) a.node.appendChild(el);
    } else if (a.node.nextElementSibling !== el) {
      a.node.parentNode.insertBefore(el, a.node.nextSibling);
    }
  }

  register(function () {
    var ex = document.getElementById('bf-sb-social');
    if (!DATA || !DATA.social || DATA.social.enabled === false) {
      if (ex) ex.remove();
      var dead = document.getElementById('bf-social-modal');
      if (dead) dead.remove();
      return;
    }

    var a = socialAnchor();
    if (!a) return;

    if (ex) {
      if (ex.getAttribute('data-bf-lang') === lang()) { placeSocial(ex, a); return; }
      ex.remove();
    }

    var L = t().social;
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
    el.setAttribute('data-bf-lang', lang());
    el.innerHTML =
      '<a class="bf-sbapp" href="' + esc(appUrl) + '" target="_blank" rel="noopener noreferrer">' +
        '<span class="bf-sbapp__ico">' + SVG.appIco + '</span>' +
        '<span class="bf-sbapp__txt"><b>' + esc(L.appTitle) + '</b><em>' + esc(L.appDesc) + '</em></span>' +
      '</a>' +
      '<div class="bf-sbsoc">' + btns + '</div>';

    placeSocial(el, a);
    buildModal();
  });

  function buildModal() {
    var trigger = document.getElementById('bf-social-more');
    if (!trigger || !DATA || !DATA.social) return;

    var old = document.getElementById('bf-social-modal');
    if (old) {
      if (old.getAttribute('data-bf-lang') === lang() && old.dataset.bfTrigger === trigger.dataset.bfId) return;
      old.remove();
    }

    var tid = 'bf-t' + Date.now();
    trigger.dataset.bfId = tid;

    var L = t().social;
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
    wrap.setAttribute('data-bf-lang', lang());
    wrap.dataset.bfTrigger = tid;
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
      var c = q('.bf-smodal__close', wrap);
      if (c) c.focus();
    }
    function close() {
      if (wrap.hidden) return;
      wrap.hidden = true;
      trigger.setAttribute('aria-expanded', 'false');
    }

    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      wrap.hidden ? open() : close();
    });
    var closers = wrap.querySelectorAll('[data-bf-close]');
    for (var j = 0; j < closers.length; j++) closers[j].addEventListener('click', close);
    window.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    window.addEventListener('resize', function () { if (!wrap.hidden) position(); }, { passive: true });
    window.addEventListener('scroll', function () { if (!wrap.hidden) position(); }, { passive: true, capture: true });
  }

  function start() {
    injectCss();
    loadData();
    runAll();
    boot();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
