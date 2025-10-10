(function () {
    let isNavigating = false;

    const COMPONENTS = {
        customSection: {
            condition: () => isHomePage(),
            create: createCustomSection,
            remove: removeCustomSection,
            selector: '.betifa-custom-section'
        },
        footerAwards: {
            condition: () => true, 
            create: createFooterAwards,
            remove: removeFooterAwards,
            selector: '.betifa-footer-awards'
        },
        jackpotImages: {
            condition: () => isHomePage(),
            create: updateJackpotImages,
            remove: () => {},
            selector: '.jackpot__logo'
    },
    hideSectionLast: {
    condition: () => isHomePage() || isCasinoGamePage(),
    create: hideSectionLastOnHomePage,
    remove: showSectionLast,
    selector: '.betifa-section-last-hidden'
}
    };


    function isHomePage() {
        const url = window.location.pathname;
        return url === '/' || 
               url === '/tr/' || 
               url === '/tr' || 
               url === '/en/' || 
               url === '/en';
    }


    function getCurrentLanguagePrefix() {
        const path = window.location.pathname;
        if (path.startsWith('/tr')) return '/tr';
        if (path.startsWith('/en')) return '/en';
        return ''; // Ana domain için
    }


    function isUserLoggedIn() {
    return document.querySelector('.header__wallet') !== null;
}

function isCasinoGamePage() {
    const url = window.location.pathname;
    return url.includes('/casino/games/');
}

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


    function getLiveCasinoGames(langPrefix) {
        const games = [
            {
                name: "Blackjack 94",
                image: "https://vendor-provider.fra1.digitaloceanspaces.com/ebetlab/gXmqkthvbB1521K/games/amn1QOpFHNXZa6vcc6NksiE5c92R67SIkxYU1dGj.png",
                url: `${langPrefix}/casino/games/pragmaticlive-blackjack-94`
            },
            {
                name: "Blackjack 7",
                image: "https://vendor-provider.fra1.digitaloceanspaces.com/ebetlab/gXmqkthvbB1521K/games/Iv9O3jeGFBWNOuadqoM8kpNtbY8YzjC9D5S2aN7f.png",
                url: `${langPrefix}/casino/games/pragmaticlive-blackjack-7`
            },
            {
                name: "Blackjack 6",
                image: "https://vendor-provider.fra1.digitaloceanspaces.com/ebetlab/gXmqkthvbB1521K/games/JrlyLfowLdHVfxszhMcKKYiWTTO8WlIXm7Fut8Or.png",
                url: `${langPrefix}/casino/games/pragmaticlive-blackjack-6`
            },
            {
                name: "Blackjack 3",
                image: "https://vendor-provider.fra1.digitaloceanspaces.com/ebetlab/gXmqkthvbB1521K/games/FG5Irtzoy5DvBAUgBhiZURiCUWU6bUzfn3GIMJrX.png",
                url: `${langPrefix}/casino/games/pragmaticlive-blackjack-3`
            },
            {
                name: "Blackjack 33",
                image: "https://vendor-provider.fra1.digitaloceanspaces.com/ebetlab/gXmqkthvbB1521K/games/YwYAZeD6mjC1yv6vawUjvapTcgGlGHT5pF4P2FsL.png",
                url: `${langPrefix}/casino/games/pragmaticlive-blackjack-33`
            },
            {
                name: "Blackjack D",
                image: "https://vendor-provider.fra1.digitaloceanspaces.com/ebetlab/gXmqkthvbB1521K/games/iCryXakTB2YWDBjt9bbF0qha6p2rEjmBxrxiFLvS.png",
                url: `${langPrefix}/casino/games/sagaming-blackjack-d`
            },
            {
                name: "Multihand Blackjack",
                image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/game-images/multihand_blackjack.jpg",
                url: `${langPrefix}/casino/games/pragmaticplay-multihand-blackjack`
            },
            {
                name: "Blackjack",
                image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/game-images/blackjack.jpg",
                url: `${langPrefix}/casino/games/evolution-blackjack`
            },
            {
                name: "American Blackjack",
                image: "https://vendor-provider.fra1.digitaloceanspaces.com/ebetlab/gXmqkthvbB1521K/games/UD7LIvF7JFrXcXSFT4lZnLGPwivYVLRe2zZ8007r.avif",
                url: `${langPrefix}/casino/games/betsoft-american-blackjack`
            },
            {
                name: "Unlimited Blackjack",
                image: "https://vendor-provider.fra1.digitaloceanspaces.com/ebetlab/gXmqkthvbB1521K/games/Afo1oDXTPlc0O9fUf2ffP8fp7x9U2j1PNGPcSfmp.png",
                url: `${langPrefix}/casino/games/ezugi-unlimited-blackjack`
            },
            {
                name: "Mega Roulette",
                image: "https://vendor-provider.fra1.digitaloceanspaces.com/ebetlab/gXmqkthvbB1521K/games/hOdx7dHhYXCTSAaXBZvKV9ooqhF5q8bcfI7NowQn.png",
                url: `${langPrefix}/casino/games/pragmaticlive-mega-roulette`
            },
            {
                name: "Auto Mega Roulette",
                image: "https://vendor-provider.fra1.digitaloceanspaces.com/ebetlab/gXmqkthvbB1521K/games/ruMnftBIG1GhmdheZgXIh3o4LvxOrTpCEnawWC75.png",
                url: `${langPrefix}/casino/games/pragmaticlive-auto-mega-roulette`
            },
            {
                name: "Speed Roulette 1",
                image: "https://vendor-provider.fra1.digitaloceanspaces.com/ebetlab/gXmqkthvbB1521K/games/s7Z7cPEWMVR73epTGlvLwAP0Ta6imtgC3eCgN3z0.png",
                url: `${langPrefix}/casino/games/pragmaticlive-speed-roulette-1`
            },
            {
                name: "VIP Auto Roulette",
                image: "https://vendor-provider.fra1.digitaloceanspaces.com/ebetlab/gXmqkthvbB1521K/games/mbiPBwKFqAVibhEWvuLT5nTiiccpiO58Y6p4WxnI.png",
                url: `${langPrefix}/casino/games/pragmaticlive-vip-auto-roulette`
            },
            {
                name: "Roulette 1",
                image: "https://vendor-provider.fra1.digitaloceanspaces.com/ebetlab/gXmqkthvbB1521K/games/TngoMrnAhG5Zb0y8rAaVJexrfVgixB7VPDpN9L20.png",
                url: `${langPrefix}/casino/games/pragmaticlive-roulette-1`
            },
            {
                name: "Virtual Roulette",
                image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/gXmqkthvbB1521K/games/mFBwCglhuWfTMUBsM3tuKrYThEaWe6JwXztfw2V0.png",
                url: `${langPrefix}/casino/games/egt-interactive-virtual-roulette`
            },
            {
                name: "Virtual Monaco Roulette",
                image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/gXmqkthvbB1521K/games/wfnY8E4G0l0BVrRCjz8Hu28KcwajYDOBHdkHzDKQ.png",
                url: `${langPrefix}/casino/games/egt-interactive-virtual-monaco-roulette`
            },
            {
                name: "Live Speed Roulette",
                image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/gXmqkthvbB1521K/games/Jx93pMUM4p20l1aNnO4USoXPzmXxvx52lFxBezKh.png",
                url: `${langPrefix}/casino/games/egt-interactive-live-speed-roulette`
            },
            {
                name: "Vegas Roulette 500x",
                image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/gXmqkthvbB1521K/games/6uQdTaDaeM4P3dlEuijYtHeI9vRF8RURfSlSr76c.png",
                url: `${langPrefix}/casino/games/egt-interactive-vegas-roulette-500x`
            },
            {
                name: "Live European Roulette",
                image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/gXmqkthvbB1521K/games/fCJL6ZWLyvoDzj3sb6JqMDxBY6lujNDs9NrYVWKx.png",
                url: `${langPrefix}/casino/games/egt-interactive-live-european-roulette`
            }
        ];

        return games;
    }


 
    function createGamesHTML(games) {
        return games.map(game => `
            <div class="game-item">
                <a href="${game.url}">
                    <img src="${game.image}" alt="${game.name}" loading="lazy">
                </a>
            </div>
        `).join('');
    }


    function initializeComponents() {
        Object.entries(COMPONENTS).forEach(([name, component]) => {
            if (component.condition() && !isNavigating) {
            
                if (!document.querySelector(component.selector)) {
                    component.create();
                }
            } else {
               
                component.remove();
            }
        });
    }

    function removeAllComponents() {
        Object.values(COMPONENTS).forEach(component => {
            component.remove();
        });
    }


    function createCustomSection() {
        if (isNavigating || !isHomePage()) return;

        const mainSlider = document.getElementById('main-slider');
        if (!mainSlider || document.querySelector('.betifa-custom-section')) return;

        const langPrefix = getCurrentLanguagePrefix();
        const games = getPopularGames(langPrefix);
        const liveCasinoGames = getLiveCasinoGames(langPrefix);
        

        const firstTenGames = games.slice(0, 10);
        const secondTenGames = games.slice(10, 20);
        

        const firstTenLiveGames = liveCasinoGames.slice(0, 10);
        const secondTenLiveGames = liveCasinoGames.slice(10, 20);
        
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
                            <a class="social-btn" href="https://telegram.me/betifaresmi"><img class="social-icon-2" src="https://raw.githubusercontent.com/allwaysapp/betifacustom/d9743ed38236d3fe43eeff17742aee81c64f18b8/img/telegram-icon.png" alt="Telegram"></a>
                            <a class="social-btn" href="https://www.instagram.com/betifatr"><img class="social-icon-2" src="https://raw.githubusercontent.com/allwaysapp/betifacustom/d9743ed38236d3fe43eeff17742aee81c64f18b8/img/instagram-icon.png" alt="Instagram"></a>
                            <a class="social-btn" href="https://x.com/betifatr"><img class="social-icon-2" src="https://raw.githubusercontent.com/allwaysapp/betifacustom/d9743ed38236d3fe43eeff17742aee81c64f18b8/img/twitter-icon.png" alt="X"></a>
                            <a class="social-btn" href="https://wa.me/447512821201" target="_blank" rel="noopener"><img class="social-icon-2" src="https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/kojqlwkejjoizdGJKQWf/statics/ZfI3560mQtcDrZG9U8fpug53aJxCW9JFnAUw7iWA.png" alt="WhatsApp"></a>
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
                        <a href="#"><img src="https://raw.githubusercontent.com/allwaysapp/betifacustom/refs/heads/main/img/yatirim-product.jpg" alt=""></a>
                    </div>
                    <div class="lucky-wheel">
                        <a href="#"><img src="https://raw.githubusercontent.com/allwaysapp/betifacustom/refs/heads/main/img/cekim-product.jpg" alt=""></a>
                    </div>
                    <div class="dice-game">
                        <a href="${langPrefix}/casino/games/spribe-aviator"><img src="https://raw.githubusercontent.com/allwaysapp/betifacustom/refs/heads/main/img/aviator-product.jpg" alt=""></a>
                    </div>
                    <div class="plinko-game">
                        <a href="${langPrefix}#"><img src="https://raw.githubusercontent.com/allwaysapp/betifacustom/refs/heads/main/img/canli-tv-product.jpg" alt=""></a>
                    </div>
                    <div class="coinflip-game">
                        <a href="${langPrefix}/promotions"><img src="https://raw.githubusercontent.com/allwaysapp/betifacustom/refs/heads/main/img/gunun-firsatlari.jpg" alt=""></a>
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
            
           <div class="custom-section2">
    <div class="game-showcase">
        <div class="game-showcase-tittle">
            <img src="https://raw.githubusercontent.com/allwaysapp/betifacustom/refs/heads/main/img/originals-text.png" alt="">
        </div>
        <div class="game-showcase-content">
            <div class="game-item">
                <a href="${langPrefix}/casino/games/amatic-book-of-aztec"><img src="https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/kojqlwkejjoizdGJKQWf/games/NcfKK4W5Q883lMpcQ0buVTOch5IAynibVGkKG0RA.jpg" alt=""></a>
            </div>
            <div class="game-item">
                <a href="${langPrefix}/casino/games/egt-interactive-clover-islands"><img src="https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/kojqlwkejjoizdGJKQWf/games/Je1FwYPpVn3xv1X3BrKhSgon2ysfoxTYNV9a87q4.jpg" alt=""></a>
            </div>
            <div class="game-item">
                <a href="${langPrefix}/casino/games/EGTInteractive-flaming-hot-vip-bell-link"><img src="https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/kojqlwkejjoizdGJKQWf/games/mzj4Ewrkn3SyKOguBIjAE4lqPieU7rwB5OpR0Fgd.jpg" alt=""></a>
            </div>
            <div class="game-item">
                <a href="${langPrefix}/casino/games/onlyplay-lady-lemon-fruits"><img src="https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/kojqlwkejjoizdGJKQWf/games/lWtqQt0z9JzNn9fnLGptZqc9FRKwD5OHZ7XUXa61.jpg" alt=""></a>
            </div>
        </div>
    </div>
</div>

            <div class="custom-section3">
                <div class="game-header">
                    <h2>CANLI CASINO OYUNLARI</h2>
                    <a class="game-link" href="${langPrefix}/live-casino">tüm oyunlar</a>
                </div>
                <div class="games-grid">
                    ${createGamesHTML(firstTenLiveGames)}
                </div>
                <div class="games-grid">
                    ${createGamesHTML(secondTenLiveGames)}
                </div>
            </div>
        `;
        
        if (mainSlider.nextSibling) {
    mainSlider.parentNode.insertBefore(customSection, mainSlider.nextSibling);
} else {
    mainSlider.parentNode.appendChild(customSection);
}

console.log('Betifa custom section eklendi');

setTimeout(() => {
    if (typeof setupDynamicBannerLinks === 'function') {
        setupDynamicBannerLinks();
    }
}, 100);
    }

    function removeCustomSection() {
        const element = document.querySelector('.betifa-custom-section');
        if (element && element.parentNode) {
            element.parentNode.removeChild(element);
            console.log('Betifa custom section kaldırıldı');
        }
    }

    function createFooterAwards() {
        if (document.querySelector('.betifa-footer-awards')) return;

        const targetRow = document.querySelector('.footer__description')?.closest('.row');
        if (!targetRow) return;

        const awardsSection = document.createElement('div');
        awardsSection.className = 'row betifa-footer-awards';
        awardsSection.innerHTML = `
            <div class="col-12">
                <div class="footer-awards-container" style="display: flex; justify-content: center; align-items: center; gap: 20px; padding: 20px 0;">
                    <img src="https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/kojqlwkejjoizdGJKQWf/statics/qADFxttxrDUm1nvMsr1JTkBiWw4pXptrkfwjkjOy.png" alt="Award 1" style="height: 60px; width: auto;">
                    <img src="https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/kojqlwkejjoizdGJKQWf/statics/Vybopxz1lksdu65Pjg7lbSQsWDYkQJd392IyVD88.png" alt="Award 3" style="height: 60px; width: auto;">
                    <img src="https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/kojqlwkejjoizdGJKQWf/statics/ax9rmrivANIojaeX3J44vR2MZUgT2WvjnvE5LElQ.webp" alt="Award 2" style="height: 60px; width: auto;">
                    <img src="https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/kojqlwkejjoizdGJKQWf/statics/H8a5CU9ITIFcnfnQjsIRcLSECSkNJQMW5GYHGTxT.png" alt="Award 4" style="height: 60px; width: auto;">
                    <img src="https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/kojqlwkejjoizdGJKQWf/statics/ocRpG5ik0qXBWh4UGXz3hlBswLgsxr9JfTbUSlYc.png" alt="Award 5" style="height: 60px; width: auto;">
                </div>
            </div>
        `;

        targetRow.insertAdjacentElement('afterend', awardsSection);
        console.log('Footer awards section eklendi');
    }

    function removeFooterAwards() {
        const element = document.querySelector('.betifa-footer-awards');
        if (element && element.parentNode) {
            element.parentNode.removeChild(element);
            console.log('Footer awards kaldırıldı');
        }
    }

function updateJackpotImages() {
    // Önce mevcut elementleri kontrol et
    const tryImg = document.querySelector('img.jackpot__logo.try');
    const usdImg = document.querySelector('img.jackpot__logo.usd');
    const btcImg = document.querySelector('img.jackpot__logo.btc');

    if (tryImg && usdImg && btcImg) {
        // Hepsi mevcut, güncelle
        tryImg.src = 'https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/kojqlwkejjoizdGJKQWf/statics/vl4k5b75jyTx5jREitJf1ACDTMdRJD0lx3dftYAo.png';
        usdImg.src = 'https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/kojqlwkejjoizdGJKQWf/statics/FMhxFRKcmA9F6uj64aTBNMj01Fkthz3GAQ0qrlYK.png';
        btcImg.src = 'https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/kojqlwkejjoizdGJKQWf/statics/d7vPkTXRsNo5fFefMdKHrAWW0BkgeZEDZ8TTasSm.png';
        console.log('Jackpot görselleri güncellendi');
    } else {
        // Henüz yüklenmemiş, bekle ve tekrar dene
        console.log('Jackpot elementleri henüz yüklenmemiş, bekleniyor...');
        setTimeout(updateJackpotImages, 500); // 500ms sonra tekrar dene
    }
}

function hideSectionLastOnHomePage() {
    const sectionLast = document.querySelector('.section.section--last');
    if (sectionLast) {
        sectionLast.style.display = 'none';
        sectionLast.classList.add('betifa-section-last-hidden');
        console.log('section--last anasayfada gizlendi');
    } else {
        console.log('section--last henüz yüklenmemiş, bekleniyor...');
        setTimeout(hideSectionLastOnHomePage, 500);
    }
}

function showSectionLast() {
    const sectionLast = document.querySelector('.section.section--last');
    if (sectionLast) {
        sectionLast.style.display = '';
        sectionLast.classList.remove('betifa-section-last-hidden');
        console.log('section--last gösterildi');
    }
}


function setupDynamicBannerLinks() {
    
    function updateBannerLinks() {
        const depositBanner = document.querySelector('.crash-game a');
        const withdrawBanner = document.querySelector('.lucky-wheel a');
        
        const isLoggedIn = isUserLoggedIn();
        
        if (depositBanner) {
            if (isLoggedIn) {
                depositBanner.href = getCurrentLanguagePrefix() + '/payments/deposit';
                depositBanner.onclick = null;
            } else {
                depositBanner.href = '#';
                depositBanner.onclick = function(e) {
                    e.preventDefault();
                    window.history.pushState({}, '', '?modal=login');
                    window.dispatchEvent(new PopStateEvent('popstate'));
                };
            }
        }
        
        if (withdrawBanner) {
            if (isLoggedIn) {
                withdrawBanner.href = getCurrentLanguagePrefix() + '/payments/withdrawal';
                withdrawBanner.onclick = null;
            } else {
                withdrawBanner.href = '#';
                withdrawBanner.onclick = function(e) {
                    e.preventDefault();
                    window.history.pushState({}, '', '?modal=login');
                    window.dispatchEvent(new PopStateEvent('popstate'));
                };
            }
        }
        
        console.log('Banner linkleri güncellendi. Login:', isLoggedIn);
    }
    

    updateBannerLinks();
    

    const header = document.querySelector('header') || document.querySelector('.header');
    
    if (header) {
        const observer = new MutationObserver(updateBannerLinks);
        
        observer.observe(header, {
            childList: true,
            subtree: true
        });
        
        console.log('Header izleme başlatıldı');
    }
}
    


    function setupLinkInterceptors() {
        document.body.addEventListener('click', function(e) {
            const link = e.target.closest('a');
            if (!link) return;

           
            if (link.href && (link.href.startsWith('http') && !link.href.includes(window.location.hostname))) {
                return;
            }

            // İç linkler
            if (!link.target || link.target === '_self') {
                const href = link.getAttribute('href');
                if (href && href.startsWith('/')) {

               
                    const isCustomSectionLink = link.closest('.betifa-custom-section');
                    if (isCustomSectionLink) {
                        e.preventDefault();

                       
                        isNavigating = true;
                        removeCustomSection();

                    
                        window.history.pushState({}, '', href);
                        window.dispatchEvent(new PopStateEvent('popstate'));

                       
                        isNavigating = false;
                        initializeComponents();
                        return;
                    }

                  
                    isNavigating = true;
                    removeAllComponents();
                    isNavigating = false;
                    initializeComponents();
                }
            }
        });
    }


    function handleUrlChange() {
        isNavigating = true;
        removeAllComponents();
        isNavigating = false;
        initializeComponents();
    }


    function initialize() {
        initializeComponents();
        setupLinkInterceptors();
        setupDynamicBannerLinks();
    }

    window.addEventListener('popstate', handleUrlChange);
    
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
            initializeComponents();
        }
    });
    

    contentObserver.observe(document.body, { childList: true, subtree: true });


    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

    window.addEventListener('load', function() {
        initializeComponents();
    });

})();
