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
