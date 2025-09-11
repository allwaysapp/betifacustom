(function () {
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

    // 20 Popüler Oyun Listesi
    function getPopularGames(langPrefix) {
        const games = [
            {
                name: "Fury and Fortune",
                image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/kojqlwkejjoizdGJKQWf/games/QaZs1lzHE94a4Zm6yai9AguiBfthudpTuzWUXZBc.png",
                url: `${langPrefix}/casino/games/hacksaw-fury-and-fortune`
            },
            {
                name: "Burning Hot",
                image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/kojqlwkejjoizdGJKQWf/games/C7hr8yQqA2aYG5cQ0SaRRrnLACABWT2cQr1E5Qdd.png",
                url: `${langPrefix}/casino/games/EGTInteractive-burning-hot`
            },
            {
                name: "Gates of Olympus",
                image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/kojqlwkejjoizdGJKQWf/games/u4I5cMm6zbu1qESyB92CirlVuCLc2OJXwgkQw5ao.png",
                url: `${langPrefix}/casino/games/pragmaticplay-gates-of-olympus`
            },
            {
                name: "Sugar Rush 1000",
                image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/kojqlwkejjoizdGJKQWf/games/E1T0nBXudYAn2gL2NnVb5xRCW4CrjoBEaOdoLyhY.png",
                url: `${langPrefix}/casino/games/pragmaticplay-sugar-rush-1000`
            },
            {
                name: "Sweet Bonanza 1000",
                image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/kojqlwkejjoizdGJKQWf/games/a3rF588ISUTN7mxmyG7dX7wa6DbdsiDtN2wBs933.png",
                url: `${langPrefix}/casino/games/pragmaticplay-sweet-bonanza-1000`
            },
            {
                name: "Big Bass Splash",
                image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/kojqlwkejjoizdGJKQWf/games/ou4WgdAPJ31lxYFRTXSNGcQuCGGQhv90Ms3w5zfI.png",
                url: `${langPrefix}/casino/games/pragmaticplay-big-bass-splash`
            },
            {
                name: "Flaming Hot",
                image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/kojqlwkejjoizdGJKQWf/games/GmSrDBXPGCM13RMQwHkjWHNMddVb1mbf39xlDdKM.png",
                url: `${langPrefix}/casino/games/EGTInteractive-flaming-hot`
            },
            {
                name: "The Dog House Megaways",
                image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/kojqlwkejjoizdGJKQWf/games/s2hTx8LFGsbE3jLaSVkkKz8nah0Sei6JYV077HNT.png",
                url: `${langPrefix}/casino/games/pragmaticplay-the-dog-house-megaways`
            },
            {
                name: "Sweet Baklava",
                image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/kojqlwkejjoizdGJKQWf/games/j1fRB8YJzgXt0ayV1zPOd0fnQhZRK7CXFy3m8B2z.png",
                url: `${langPrefix}/casino/games/pragmaticplay-sweet-baklava`
            },
            {
                name: "Sweet Bonanza",
                image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/kojqlwkejjoizdGJKQWf/games/zrBmN6uNnX2bQzDVZvbxIvK4s66AwhqdHbPDATSq.png",
                url: `${langPrefix}/casino/games/pragmaticplay-sweet-bonanza`
            },
            {
                name: "Sugar Rush",
                image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/kojqlwkejjoizdGJKQWf/games/DOQjMOaeW7lxtnx71236s3pi837rxicjU4S7FUp5.png",
                url: `${langPrefix}/casino/games/pragmaticplay-sugar-rush`
            },
            {
                name: "Gates of Olympus 1000",
                image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/kojqlwkejjoizdGJKQWf/games/VtCqWeoBzoUWS80XOX1yfdHGUC7DJuKfrsaUjDRJ.png",
                url: `${langPrefix}/casino/games/pragmaticplay-gates-of-olympus-1000`
            },
            {
                name: "Big Bass Mission Fishin'",
                image: "https://vendor-provider.fra1.digitaloceanspaces.com/ebetlab/gXmqkthvbB1521K/games/NtQeNzDe8uyunG15rT5k3H6TKHG6hmTAkqJpwRM9.jpg",
                url: `${langPrefix}/casino/games/pragmaticplay-big-bass-mission-fishin`
            },
            {
                name: "Buffalo King Megaways",
                image: "https://vendor-provider.fra1.digitaloceanspaces.com/ebetlab/gXmqkthvbB1521K/games/FFfRWIF1Liwb9gCUcMCqXBpUPu1wRoESgEbo5DB3.avif",
                url: `${langPrefix}/casino/games/pragmaticplay-buffalo-king-megaways`
            },
            {
                name: "Bigger Bass Bonanza",
                image: "https://vendor-provider.fra1.digitaloceanspaces.com/ebetlab/gXmqkthvbB1521K/games/KayYal8Y5gtJ1HM6FDeLyFtCUniZQI9ALUDpwSyH.avif",
                url: `${langPrefix}/casino/games/pragmaticplay-bigger-bass-bonanza`
            },
            {
                name: "Power of Thor Megaways",
                image: "https://vendor-provider.fra1.digitaloceanspaces.com/ebetlab/gXmqkthvbB1521K/games/1JriPTQ04m3nsbTakirKBBeXnq4y5tFwQtxS63r4.avif",
                url: `${langPrefix}/casino/games/pragmaticplay-power-of-thor-megaways`
            },
            {
                name: "Big Bass Bonanza Megaways",
                image: "https://vendor-provider.fra1.digitaloceanspaces.com/ebetlab/gXmqkthvbB1521K/games/m6wr8HLhZIna3aJnA3zrslEDWQST31EKDCx55kCO.avif",
                url: `${langPrefix}/casino/games/pragmaticplay-big-bass-bonanza-megaways`
            },
            {
                name: "5 Lions Megaways",
                image: "https://vendor-provider.fra1.digitaloceanspaces.com/ebetlab/gXmqkthvbB1521K/games/2Izea5fJK3uevSlURmRv67Cn7zphram7cytGvjGq.avif",
                url: `${langPrefix}/casino/games/pragmaticplay-5-lions-megaways`
            },
            {
                name: "Cash Bonanza",
                image: "https://vendor-provider.fra1.digitaloceanspaces.com/ebetlab/gXmqkthvbB1521K/games/omoxnXh4d85vBFwsY9RDqqw2yAxcz0TK4DvAczul.avif",
                url: `${langPrefix}/casino/games/pragmaticplay-cash-bonanza`
            },
            {
                name: "Mustang Gold Megaways",
                image: "https://vendor-provider.fra1.digitaloceanspaces.com/ebetlab/gXmqkthvbB1521K/games/EqigmGLZZ6SJRkbMa4vz0JbL4dWPRm9fP8CbTXuV.avif",
                url: `${langPrefix}/casino/games/pragmaticplay-mustang-gold-megaways`
            }
        ];

        return games;
    }

    // Oyunları HTML'e dönüştüren fonksiyon
    function createGamesHTML(games) {
        return games.map(game => `
            <div class="game-item">
                <a href="${game.url}">
                    <img src="${game.image}" alt="${game.name}" loading="lazy">
                </a>
            </div>
        `).join('');
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
            const games = getPopularGames(langPrefix);
            
            // İlk 10 ve ikinci 10 oyunu ayır
            const firstTenGames = games.slice(0, 10);
            const secondTenGames = games.slice(10, 20);
            
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
                
                <div class="custom-section1">
                    <div class="game-header">
                        <h2>EN POPÜLER OYUNLAR</h2>
                        <a class="game-link" href="${langPrefix}/casino">tüm oyunlar</a>
                    </div>
                    <div class="games-grid">
                        ${createGamesHTML(firstTenGames)}
                    </div>
                    <div class="games-grid">
                        ${createGamesHTML(secondTenGames)}
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
