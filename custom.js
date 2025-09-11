(function () {
    // Fetch'i intercept et - EN BAŞTA
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        return originalFetch.apply(this, args).then(response => {
            if (args[0].includes('games2/welcome/popular')) {
                console.log('✅ Popular games API çağrısı yakalandı!');
                response.clone().json().then(data => {
                    console.log('📦 Popular games data:', data);
                    console.log('🎮 Oyun sayısı:', data.data ? data.data.length : 'Veri bulunamadı');
                    window.popularGamesData = data;
                    console.log('💾 Veri window.popularGamesData değişkenine kaydedildi');
                });
            }
            return response;
        });
    };

    // Geçiş sırasında özel bölümlerin görünmesini engellemek için flag
    let isNavigating = false;

    // Anasayfa olup olmadığını kontrol eden fonksiyon
    function isHomePage() {
        const url = window.location.pathname;
        return url === '/' || 
               url === '/tr/' || 
               url === '/tr' || 
               url === '/en/' || 
               url === '/en';
    }

    // Mevcut dil prefix'ini alan fonksiyon
    function getCurrentLanguagePrefix() {
        const path = window.location.pathname;
        if (path.startsWith('/tr')) return '/tr';
        if (path.startsWith('/en')) return '/en';
        return ''; // Ana domain için
    }

    // Custom section'ı ekleyen fonksiyon
    function createCustomSection() {
        // Navigasyon sırasında veya anasayfa değilse ekleme
        if (isNavigating || !isHomePage()) {
            removeCustomSection();
            return;
        }

        const mainSlider = document.getElementById('main-slider');
        if (!mainSlider) return;

        // Eğer daha önce eklenmemişse custom section ekle
        if (!document.querySelector('.betifa-custom-section')) {
            const langPrefix = getCurrentLanguagePrefix();
            
            const customSection = document.createElement('div');
            customSection.className = 'section container betifa-custom-section';
            customSection.innerHTML = `
                <div class="custom-section">
                    <div class="left-content">
                        <div class="left-first">
                            <div class="left-tittle">
                                <h2>GİRİŞ YAP HESAPLARIMIZI <br> TAKİP ET !</h2>
                                <p>kazanmaya başla !</p>
                            </div>
                            <div class="social-buttons">
                                <a class="social-btn" href="https://telegram.me/betifaresmi"> <img class="social-icon" src="https://raw.githubusercontent.com/allwaysapp/betifacustom/d9743ed38236d3fe43eeff17742aee81c64f18b8/img/telegram-icon.png" alt="Telegram"></a>
                                <a class="social-btn" href="https://www.instagram.com/betifatr"> <img class="social-icon" src="https://raw.githubusercontent.com/allwaysapp/betifacustom/d9743ed38236d3fe43eeff17742aee81c64f18b8/img/instagram-icon.png" alt="Instagram"></a>
                                <a class="social-btn" href="https://x.com/betifatr"> <img class="social-icon" src="https://raw.githubusercontent.com/allwaysapp/betifacustom/d9743ed38236d3fe43eeff17742aee81c64f18b8/img/twitter-icon.png" alt="X"></a>
                            </div>
                        </div>
                        <div class="left-second">
                            <div class="sport-product">
                                <a href="${langPrefix}/sportsbook"><img src="https://raw.githubusercontent.com/allwaysapp/betifacustom/d9743ed38236d3fe43eeff17742aee81c64f18b8/img/spor-bahisleri-product.png" alt=""></a>
                            </div>
                            <div class="casino-product">
                                <a href="${langPrefix}/casino"><img src="https://raw.githubusercontent.com/allwaysapp/betifacustom/d9743ed38236d3fe43eeff17742aee81c64f18b8/img/casino-bahisleri-product.png" alt=""></a>
                            </div>
                        </div>
                    </div>
                    <div class="right-content">
                        <div class="crash-game">
                            <a href="${langPrefix}/casino/games/ebetlab-crash-originals"><img src="https://raw.githubusercontent.com/allwaysapp/betifacustom/d9743ed38236d3fe43eeff17742aee81c64f18b8/img/crash.jpg" alt=""></a>
                        </div>
                        <div class="lucky-wheel">
                            <a href="${langPrefix}/casino/games/ebetlab-wheel-originals"><img src="https://raw.githubusercontent.com/allwaysapp/betifacustom/d9743ed38236d3fe43eeff17742aee81c64f18b8/img/lucky-wheel.jpg" alt=""></a>
                        </div>
                        <div class="dice-game">
                            <a href="${langPrefix}/casino/games/ebetlab-dice-originals"><img src="https://github.com/allwaysapp/betifacustom/blob/d9743ed38236d3fe43eeff17742aee81c64f18b8/img/dice.jpg?raw=true" alt=""></a>
                        </div>
                        <div class="plinko-game">
                            <a href="${langPrefix}/casino/games/ebetlab-plinko-originals"><img src="https://raw.githubusercontent.com/allwaysapp/betifacustom/d9743ed38236d3fe43eeff17742aee81c64f18b8/img/plinko.jpg" alt=""></a>
                        </div>
                        <div class="coinflip-game">
                            <a href="${langPrefix}/casino/games/ebetlab-coinflip-originals"><img src="https://raw.githubusercontent.com/allwaysapp/betifacustom/d9743ed38236d3fe43eeff17742aee81c64f18b8/img/coinflip.jpg" alt=""></a>
                        </div>
                    </div>
                </div>
            `;
            
            // main-slider'ın hemen altına ekle
            if (mainSlider.nextSibling) {
                mainSlider.parentNode.insertBefore(customSection, mainSlider.nextSibling);
            } else {
                mainSlider.parentNode.appendChild(customSection);
            }
            
            console.log('Betifa custom section eklendi:', customSection);
        }
    }

    // Custom section'ı kaldıran fonksiyon
    function removeCustomSection() {
        const customSection = document.querySelector('.betifa-custom-section');
        if (customSection && customSection.parentNode) {
            customSection.parentNode.removeChild(customSection);
            console.log('Betifa custom section kaldırıldı');
        }
    }

    // Sayfa içeriğini güncelleyen ana fonksiyon
    function initializePage() {
        const currentIsHomePage = isHomePage();
        
        // Custom section sadece anasayfada gösterilir
        if (currentIsHomePage) {
            createCustomSection();
        } else {
            removeCustomSection();
        }
    }

    // İç sayfa linklerine tıklandığında önleyici işlem
    function setupLinkInterceptors() {
        document.body.addEventListener('click', function(e) {
            const link = e.target.closest('a');
            if (!link) return;
            
            // Dış linkler için (sosyal medya vs) dokunma
            if (link.href && (link.href.startsWith('http') && !link.href.includes(window.location.hostname))) {
                return;
            }
            
            // İç linkler için
            if (!link.target || link.target === '_self') {
                const href = link.getAttribute('href');
                if (href && href.startsWith('/')) {
                    // Custom section içindeki linkler için özel işlem
                    const isCustomSectionLink = link.closest('.betifa-custom-section');
                    if (isCustomSectionLink) {
                        e.preventDefault();
                        
                        // Navigasyon öncesi custom section'ı anında kaldır
                        isNavigating = true;
                        removeCustomSection();
                        
                        // Manuel navigasyon yap
                        window.history.pushState({}, '', href);
                        window.dispatchEvent(new PopStateEvent('popstate'));
                        
                        // Anında initialize et
                        isNavigating = false;
                        initializePage();
                        
                        return;
                    }
                    
                    // Diğer site içi linkler için normal işlem
                    isNavigating = true;
                    removeCustomSection();
                    isNavigating = false;
                    initializePage();
                }
            }
        });
    }

    // İlk sayfa yüklenmesi
    function initialize() {
        initializePage();
        setupLinkInterceptors();
    }

    // URL değişikliklerini izle
    function handleUrlChange() {
        isNavigating = true;
        removeCustomSection();
        isNavigating = false;
        initializePage();
    }

    // popstate olayını dinle (geri/ileri butonları)
    window.addEventListener('popstate', handleUrlChange);
    
    // SPA route değişikliklerini yakalamak için history API'larını override et
    const originalPushState = history.pushState;
    history.pushState = function() {
        originalPushState.apply(this, arguments);
        handleUrlChange();
    };
    
    const originalReplaceState = history.replaceState;
    history.replaceState = function() {
        originalReplaceState.apply(this, arguments);
        handleUrlChange();
    };

    // DOM değişikliklerini izleyen observer
    const contentObserver = new MutationObserver((mutations, observer) => {
        if (isNavigating) return;
        
        const hasMainSlider = mutations.some(mutation => {
            return Array.from(mutation.addedNodes).some(node => 
                node.nodeType === 1 && 
                (node.id === 'main-slider' || 
                 (node.querySelector && node.querySelector('#main-slider')))
            );
        });

        if (hasMainSlider) {
            initializePage();
        }
    });
    
    // Observer'ı başlat
    contentObserver.observe(document.body, { childList: true, subtree: true });

    // Sayfa yüklendiğinde ilk çalıştırma
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

    // Ayrıca window load event'i için de dinle
    window.addEventListener('load', initializePage);

})();
