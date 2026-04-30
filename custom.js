(function() {
  const loadTime = new Date().toLocaleString('tr-TR', {
    timeZone: 'Europe/Istanbul',
    hour12: false
  });

  console.log(
    '%c✅ Betifa Custom JS Loaded',
    'background: #00d26a; color: #fff; padding: 4px 10px; border-radius: 4px; font-weight: bold; font-size: 13px;',
    `\n⏰ Yüklenme zamanı: ${loadTime}`,
    `\n🔗 Kaynak: https://allwaysapp.github.io/betifacustom/custom.js`
  );
})();
