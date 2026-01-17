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
},
        socialLinks: {
            condition: () => true,
            create: addSocialLinksToSidebar,
            remove: removeSocialLinksFromSidebar,
            selector: '.betifa-social-links'
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
            name: "Flaming Hot Bell Link VIP",
            image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/kojqlwkejjoizdGJKQWf/games/AuvpREGg667TaTO3Uj1n8gZRywuE053k4ivHnNTu.jpg",
            url: `${langPrefix}/casino/games/EGTInteractive-flaming-hot-bell-link`
        },
        {
            name: "Shining Crown",
            image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/kojqlwkejjoizdGJKQWf/games/28WH1FojCt2N3ThBWM7E2tW0xM4KCGst8uOdrg1A.jpg",
            url: `${langPrefix}/casino/games/EGTInteractive-shining-crown`
        },
        {
            name: "Sweet Bonanza 1000",
            image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/kojqlwkejjoizdGJKQWf/games/SMmpn02RWtkQTsmqQQfQrr4p5tjg6ZobKjSgQuUH.jpg",
            url: `${langPrefix}/casino/games/pragmaticplay-sweet-bonanza-1000`
        },
        {
            name: "Aviator",
            image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/kojqlwkejjoizdGJKQWf/games/kIZYLOqf1oTay1LVUcZuVn89bl4E9oG3jAD26Zfb.avif",
            url: `${langPrefix}/casino/games/spribe-aviator`
        },
        {
            name: "Crazy Time",
            image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/kojqlwkejjoizdGJKQWf/games/CN9RJrn0WpiLtdS4ymnVz4fbsM1nTiefQpsb70ko.jpg",
            url: `${langPrefix}/casino/games/evolution-crazy-time`
        },
        {
            name: "Lightning Roulette",
            image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/kojqlwkejjoizdGJKQWf/games/ZjDE9jIRlXtdnkH4lHL3Y94VjXljIaZEzmFmIfjm.jpg",
            url: `${langPrefix}/casino/games/evolution-lightning-roulette`
        },
        {
            name: "Gates of Olympus",
            image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/kojqlwkejjoizdGJKQWf/games/OYYVoo2WtvkKnjThuaYCx32Q4HoZaMvYkSHJzlUt.jpg",
            url: `${langPrefix}/casino/games/pragmaticplay-gates-of-olympus`
        },
        {
            name: "Starburst",
            image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/kojqlwkejjoizdGJKQWf/games/2ILiuY4LIHKx0h2Dc7Ii4sqoP0bTSEGFc9YxbCzZ.jpg",
            url: `${langPrefix}/casino/games/netent-starburst`
        },
        {
            name: "40 Burnin Hot Bell Link",
            image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/kojqlwkejjoizdGJKQWf/games/TbL7jWqLOHzlwhqqxwIaipxXlTgdJqr1nEk3LOYD.jpg",
            url: `${langPrefix}/casino/games/EGTInteractive-40-burning-hot-bell-link`
        },
        {
            name: "Big Bass Bonanza",
            image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/kojqlwkejjoizdGJKQWf/games/1Rn0lMAJvhEcVsdMbZTPM8jbbarbjU7RAXT9u7op.jpg",
            url: `${langPrefix}/casino/games/pragmaticplay-big-bass-bonanza`
        },
        {
            name: "Monopoly Live",
            image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/kojqlwkejjoizdGJKQWf/games/YQQsHnJakwQefWaZCdRBMvgkXimS8k5aTFxyFQ6E.jpg",
            url: `${langPrefix}/casino/games/netent-starburst`
        },
        {
            name: "Dead or Alive 2",
            image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/kojqlwkejjoizdGJKQWf/games/81gO39t9YxXJfkr3Kt8KwJuaz3T3fukoIXMIA9BR.jpg",
            url: `${langPrefix}/casino/games/netent-dead-or-alive-2`
        },
        {
            name: "The Catfather",
            image: "https://vendor-provider.fra1.digitaloceanspaces.com/ebetlab/gXmqkthvbB1521K/games/5LybSSyTU8yJbNvNWajyA33Igg0xlBfFI4jQhuiQ.avif",
            url: `${langPrefix}/casino/games/pragmaticplay-the-catfather`
        },
        {
            name: "Million 777 Coins",
            image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/kojqlwkejjoizdGJKQWf/games/fGnHGjXmFRXNNXAnKlqyRXymVQNvkHhc0hwwAI7y.avif",
            url: `${langPrefix}/casino/games/redrake-million-777-coins`
        },
        {
            name: "Chaos Crew 3",
            image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/kojqlwkejjoizdGJKQWf/games/8bGIcag9zJA3AUtseYRlONIDPvPxXyq4nZ9vGLmw.avif",
            url: `${langPrefix}/casino/games/hacksaw-chaos-crew-3`
        },
        {
            name: "Blood Suckers",
            image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/kojqlwkejjoizdGJKQWf/games/An32yDuprbtyGlgQilo8iAcHQRWgHpaz5P2TgvIb.avif",
            url: `${langPrefix}/casino/games/netent-blood-suckers`
        },
        {
            name: "Wolf Gold",
            image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/kojqlwkejjoizdGJKQWf/games/SjO0Ln3VjqJubFD87UN9YAxVPS7ONo5wNFGPsLkR.avif",
            url: `${langPrefix}/casino/games/pragmaticplay-wolf-gold`
        },
        {
            name: "Royal Joker Hold and Spin",
            image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/kojqlwkejjoizdGJKQWf/games/3ZgPlXjhzWw6MxqMKKbfhKo9gZmQEot8qTsk49Zh.avif",
            url: `${langPrefix}/casino/games/playson-royal-joker-hold-and-win`
        },
        {
            name: "Book of Ra",
            image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/kojqlwkejjoizdGJKQWf/games/48fCpHIv1zlEkWdOSZrXYFqjfryECOAoQRRd01pl.avif",
            url: `${langPrefix}/casino/games/novomatic-book-of-ra`
        },
        {
            name: "Thunder Crown",
            image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/kojqlwkejjoizdGJKQWf/games/Kc5KkQWMVLVSaHRVYeFXxsRQzZub97lqzILDKwGY.avif",
            url: `${langPrefix}/casino/games/endorphina-thunder-crown`
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
                            <h2>GLOBAL GAMING EXCELLENCE -<br> BETIFA İLE GÜVENİN GÜCÜNÜ KEŞFET</h2>
                            <p>Güvenli Erişim İçin Takip Et !</p>
                        </div>
                        <div class="social-buttons">
                            <a class="social-btn" href="https://telegram.me/betifaresmi"><img class="social-icon-2" src="https://raw.githubusercontent.com/allwaysapp/betifacustom/d9743ed38236d3fe43eeff17742aee81c64f18b8/img/telegram-icon.png" alt="Telegram"></a>
                            <a class="social-btn" href="https://www.instagram.com/betifatr"><img class="social-icon-2" src="https://raw.githubusercontent.com/allwaysapp/betifacustom/d9743ed38236d3fe43eeff17742aee81c64f18b8/img/instagram-icon.png" alt="Instagram"></a>
                            <a class="social-btn" href="https://x.com/betifatr"><img class="social-icon-2" src="https://raw.githubusercontent.com/allwaysapp/betifacustom/d9743ed38236d3fe43eeff17742aee81c64f18b8/img/twitter-icon.png" alt="X"></a>
                            <a class="social-btn" href="https://wa.me/38971634037" target="_blank" rel="noopener"><img class="social-icon-2" src="https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/kojqlwkejjoizdGJKQWf/statics/ZfI3560mQtcDrZG9U8fpug53aJxCW9JFnAUw7iWA.png" alt="WhatsApp"></a>
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
    <a href="${langPrefix}?modal=bonus-request"><img src="https://raw.githubusercontent.com/allwaysapp/betifacustom/refs/heads/main/img/bonus-talep.jpg" alt=""></a>
</div>
                    <div class="coinflip-game">
                        <a href="#"><img src="https://raw.githubusercontent.com/allwaysapp/betifacustom/refs/heads/main/img/chatifa.jpg" alt=""></a>
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

// Sidebar'a Sosyal Medya Linklerini Ekle
function addSocialLinksToSidebar() {
    // Zaten eklenmişse tekrar ekleme
    if (document.querySelector('.betifa-social-links')) return;

    // "Ek Bilgi" menüsünü bul
    const additionalInfoMenu = Array.from(document.querySelectorAll('.sidebar__menu'))
        .find(menu => {
            const title = menu.querySelector('.sidebar__title');
            return title && title.textContent.trim() === 'Ek bilgi';
        });

    if (!additionalInfoMenu) {
        console.log('Ek bilgi menüsü bulunamadı, bekleniyor...');
        setTimeout(addSocialLinksToSidebar, 500);
        return;
    }

// Yeni "Linkler" bölümünü oluştur
    const socialLinksSection = document.createElement('div');
    socialLinksSection.className = 'sidebar__menu betifa-social-links';
    socialLinksSection.innerHTML = `
        <span class="sidebar__title">Linkler</span>
        <ul class="sidebar__nav">
            <li>
                <a href="https://www.instagram.com/betifa.trsosyal" target="_blank" rel="noopener noreferrer">
                    <i class="fa-brands fa-instagram" style="width: 20px; display: inline-block; text-align: center;"></i>
                    Instagram
                </a>
            </li>
            <li>
                <a href="https://x.com/betifatr" target="_blank" rel="noopener noreferrer">
                    <i class="fa-brands fa-x-twitter" style="width: 20px; display: inline-block; text-align: center;"></i>
                    X (Twitter)
                </a>
            </li>
            <li>
                <a href="https://t.me/betifaresmi" target="_blank" rel="noopener noreferrer">
                    <i class="fa-brands fa-telegram" style="width: 20px; display: inline-block; text-align: center;"></i>
                    Telegram Kanalı
                </a>
            </li>
            <li>
                <a href="https://t.me/betifadestek" target="_blank" rel="noopener noreferrer">
                    <i class="fa-brands fa-telegram" style="width: 20px; display: inline-block; text-align: center;"></i>
                    Telegram Support
                </a>
            </li>
            <li>
                <a href="https://wa.me/38971634037" target="_blank" rel="noopener noreferrer">
                    <i class="fa-brands fa-whatsapp" style="width: 20px; display: inline-block; text-align: center;"></i>
                    Whatsapp Destek
                </a>
            </li>
        </ul>
    `;

    // "Ek Bilgi" menüsünden sonra ekle
    additionalInfoMenu.insertAdjacentElement('afterend', socialLinksSection);
    console.log('Betifa sosyal medya linkleri sidebar\'a eklendi');
}

function removeSocialLinksFromSidebar() {
    const element = document.querySelector('.betifa-social-links');
    if (element && element.parentNode) {
        element.parentNode.removeChild(element);
        console.log('Betifa sosyal medya linkleri kaldırıldı');
    }
}


function setupDynamicBannerLinks() {
    
    function updateBannerLinks() {
        const depositBanner = document.querySelector('.crash-game a');
        const withdrawBanner = document.querySelector('.lucky-wheel a');
        const chatifaBanner = document.querySelector('.coinflip-game a');
        
        const isLoggedIn = isUserLoggedIn();
        
        // Yatırım Butonu
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
        
        // Çekim Butonu
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
        
        // Chatifa Butonu (Günün Fırsatları)
        if (chatifaBanner) {
            chatifaBanner.href = '#';
            if (isLoggedIn) {
                // Giriş yapılmışsa - Chatifa sidebar'ını aç
                chatifaBanner.onclick = function(e) {
                    e.preventDefault();
                    const chatSidebarBtn = document.getElementById('chatSidebar');
                    if (chatSidebarBtn) {
                        chatSidebarBtn.click();
                        console.log('Chatifa sidebar açıldı');
                    } else {
                        console.log('chatSidebar butonu bulunamadı');
                    }
                };
            } else {
                // Giriş yapılmamışsa - Login modal aç
                chatifaBanner.onclick = function(e) {
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
