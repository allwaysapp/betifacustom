(function () {
    
    let isNavigating = false;

    const COMPONENTS = {
        mobileAppBar: {
            condition: () => isHomePage(),
            create: createMobileAppBar,
            remove: removeMobileAppBar,
            selector: '.betifa-mobile-app-bar'
        },
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
        },
        footerSocialLinks: {
            condition: () => true,
            create: updateFooterSocialLinks,
            remove: restoreFooterSocialLinks,
            selector: '.betifa-footer-social-updated'
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
        return '';
    }


    function isUserLoggedIn() {
        return document.querySelector('.header__wallet') !== null;
    }

    function isCasinoGamePage() {
        const url = window.location.pathname;
        return url.includes('/casino/games/');
    }

    // ========== MOBİL UYGULAMA TANITIM BARI ==========
    function createMobileAppBar() {
        if (isNavigating || !isHomePage()) return;

        const mainSlider = document.getElementById('main-slider');
        if (!mainSlider || document.querySelector('.betifa-mobile-app-bar')) return;

        const isEnglish = window.location.href.includes('/en');
        
        const appBar = document.createElement('a');
        appBar.className = 'betifa-mobile-app-bar';
        appBar.href = 'https://betifa.live/betifa_ios_live.html';
        appBar.target = '_blank';
        appBar.rel = 'noopener noreferrer';
        
        appBar.innerHTML = `
            <div class="app-bar-content">
                <div class="app-bar-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                        <path d="M17.523 2.047a.5.5 0 0 0-.382-.047l-9 2.5a.5.5 0 0 0-.141.053V4.5c0 .067.013.13.037.187L3.053 6.053A.5.5 0 0 0 3 6.5v14a.5.5 0 0 0 .5.5h6a.5.5 0 0 0 .5-.5v-6h4v6a.5.5 0 0 0 .5.5h6a.5.5 0 0 0 .5-.5v-14a.5.5 0 0 0-.053-.447l-3.424-4.006zM16 4.5v2.25l-3.5.972V5.5L16 4.5zM8 7.75l3.5-.972v2.472L8 10.222V7.75zm-4 0L7 6.778v3.444l-3 .833V7.75zM4 20v-8.028l3-.833V14.5a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5v-3.361l3-.833V20h-5v-6a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0-.5.5v6H4zm16-8.028V20h-5v-5h5v-.028-.001z"/>
                        <path d="M7 17h2v3H7zM15 17h2v3h-2z"/>
                    </svg>
                </div>
                <div class="app-bar-text">
                    <span class="app-bar-title">${isEnglish ? 'Betifa Mobile App' : 'Betifa Mobil Uygulama'}</span>
                    <span class="app-bar-desc">${isEnglish ? 'Download our mobile app for fast and secure betting' : 'Hızlı ve Güvenli Bahis için mobil uygulamamızı indirin'}</span>
                </div>
                <div class="app-bar-button">
                    <span class="app-bar-btn-text">${isEnglish ? 'Download' : 'İndir'}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                        <path d="M12 16l-6-6h4V4h4v6h4l-6 6z"/>
                        <path d="M20 18H4v2h16v-2z"/>
                    </svg>
                </div>
            </div>
            <div class="app-bar-glow app-bar-glow-left"></div>
            <div class="app-bar-glow app-bar-glow-right"></div>
        `;

        mainSlider.parentNode.insertBefore(appBar, mainSlider);
        console.log('Betifa mobile app bar eklendi');
    }

    function removeMobileAppBar() {
        const element = document.querySelector('.betifa-mobile-app-bar');
        if (element && element.parentNode) {
            element.parentNode.removeChild(element);
            console.log('Betifa mobile app bar kaldırıldı');
        }
    }

    function getPopularGames(langPrefix) {
        const games = [
            {
                name: "Fortune Of Olympus",
                image: "https://d3psi4rj7mv4u4.cloudfront.net/games/pragmaticplay/fortune_of_olympus.jpg",
                url: `${langPrefix}/casino/games/pragmaticplay-fortune-of-olympus`
            },
            {
                name: "Gates of Olympus Super Scatter",
                image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/kojqlwkejjoizdGJKQWf/games/YnYVAT8WgWyQ6r84P1xWnKf7RwJcGHe9uRGd2oXp.jpg",
                url: `${langPrefix}/casino/games/pragmaticplay-gates-of-olympus-super-scatter`
            },
            {
                name: "Sweet Bonanza Super Scatter",
                image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/kojqlwkejjoizdGJKQWf/games/LyYJpCJU3KLML2fYzGsai1PtuMTfOXp8ocBjfeZR.jpg",
                url: `${langPrefix}/casino/games/pragmaticplay-sweet-bonanza-super-scatter`
            },
            {
                name: "Saray Rüyası",
                image: "https://vendor-provider.fra1.digitaloceanspaces.com/ebetlab/gXmqkthvbB1521K/games/I2o7RoEAiwuFGaUTV9kKyODYXTjblIq3ASBDD7Ag.png",
                url: `${langPrefix}/casino/games/pragmaticplay-saray-ruyasi`
            },
            {
                name: "Chicken Route",
                image: "https://d3psi4rj7mv4u4.cloudfront.net/games/turbogames/chicken_route.jpg",
                url: `${langPrefix}/casino/games/turbogames-chicken-route`
            },
            {
                name: "Big Bass Bonanza 3 Reeler",
                image: "https://vendor-provider.fra1.digitaloceanspaces.com/ebetlab/gXmqkthvbB1521K/games/zw8E57RR27vfJH1yoYtco7yRYBZ1WvFHtKM1tyZH.avif",
                url: `${langPrefix}/casino/games/pragmaticplay-big-bass-bonanza-3-reeler`
            },
            {
                name: "Wolf Gold 4 Pack",
                image: "https://d3psi4rj7mv4u4.cloudfront.net/games/pragmaticplay/wolf_gold_4_pack.jpg",
                url: `${langPrefix}/casino/games/pragmaticplay-wolf-gold-4-pack`
            },
            {
                name: "Joker's Jewels Hold & Spin",
                image: "https://d3psi4rj7mv4u4.cloudfront.net/games/pragmaticplay/jokers_jewels_hold_and_spin.jpg",
                url: `${langPrefix}/casino/games/pragmaticplay-jokers-jewels-hold-spin`
            },
            {
                name: "Hermes Fortunes 2000",
                image: "https://vendor-provider.fra1.digitaloceanspaces.com/ebetlab/gXmqkthvbB1521K/games/NuZtRkDdoUdOQ2UKgoRPLM94RYo9dsaBenYCTocd.png",
                url: `${langPrefix}/casino/games/EGTInteractive-hermes-fortunes`
            },
            {
                name: "The Dog House – Royal Hunt",
                image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/game-images/the_dog_house_royal_hunt.jpg",
                url: `${langPrefix}/casino/games/pragmaticplay-the-dog-house-royal-hunt`
            },
            {
                name: "Mighty Heracle",
                image: "https://d3psi4rj7mv4u4.cloudfront.net/games/egtdigital/mighty_heracle.jpg",
                url: `${langPrefix}/casino/games/EGTInteractive-mighty-heracle`
            },
            {
                name: "Starburst Galaxy",
                image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/kojqlwkejjoizdGJKQWf/games/JLewAM0skJOUnLUj0Ae90rK3QN7JfLpttepR8Dbh.jpg",
                url: `${langPrefix}/casino/games/netent-starburst-galaxy`
            },
            {
                name: "Fire Stampede Ultimate",
                image: "https://d3psi4rj7mv4u4.cloudfront.net/games/pragmaticplay/fire_stampede_ultimate.jpg",
                url: `${langPrefix}/casino/games/pragmaticplay-fire-stampede-ultimate`
            },
            {
                name: "Gonzo's Quest II: Return to El Dorado",
                image: "https://d3psi4rj7mv4u4.cloudfront.net/games/evooss/gonzos_quest_ii_return_to_el_dorado.jpg",
                url: `${langPrefix}/casino/games/netent-gonzos-quest-ii-return-to-el-dorado`
            },
            {
                name: "Duck Hunters: Happy Hour",
                image: "https://d3psi4rj7mv4u4.cloudfront.net/games/nolimitcity/duck_hunters_happy_hour.jpg",
                url: `${langPrefix}/casino/games/nolimitcity-duck-hunters-happy-hour`
            },
            {
                name: "MONOPOLY Cash Is King",
                image: "https://d3psi4rj7mv4u4.cloudfront.net/games/evooss/monopoly_cash_is_king.jpg",
                url: `${langPrefix}/casino/games/netent-monopoly-cash-is-king`
            },
            {
                name: "Dragon Boyz",
                image: "https://d3psi4rj7mv4u4.cloudfront.net/games/evooss/dragon_boyz.jpg",
                url: `${langPrefix}/casino/games/netent-dragon-boyz`
            },
            {
                name: "Tut's Treasure Tower",
                image: "https://d3psi4rj7mv4u4.cloudfront.net/games/pragmaticplay/tuts_treasure_tower.jpg",
                url: `${langPrefix}/casino/games/pragmaticplay-tuts-treasure-tower`
            },
            {
                name: "Wild Wild Riches Returns",
                image: "https://d3psi4rj7mv4u4.cloudfront.net/games/pragmaticplay/wild_wild_riches_returns.jpg",
                url: `${langPrefix}/casino/games/pragmaticplay-wild-wild-riches-returns`
            },
            {
                name: "Captain Kraken Megaways",
                image: "https://d3psi4rj7mv4u4.cloudfront.net/games/pragmaticplay/captain_kraken_megaways.jpg",
                url: `${langPrefix}/casino/games/pragmaticplay-captain-kraken-megaways`
            }
        ];

        return games;
    }

    function getLiveCasinoGames(langPrefix) {
        const games = [
            {
                name: "Mega Ball",
                image: "https://d3psi4rj7mv4u4.cloudfront.net/games/evosw/mega_ball.jpg",
                url: `${langPrefix}/casino/games/evolution-mega-ball`
            },
            {
                name: "First Person Dream Catcher",
                image: "https://d3psi4rj7mv4u4.cloudfront.net/games/evosw/rng_dream_catcher.jpg",
                url: `${langPrefix}/casino/games/evolution-first-person-dream-catcher`
            },
            {
                name: "Funky Time",
                image: "https://d3psi4rj7mv4u4.cloudfront.net/games/evosw/funky_time.jpg",
                url: `${langPrefix}/casino/games/evolution-funky-time`
            },
            {
                name: "Crazy Time A",
                image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/kojqlwkejjoizdGJKQWf/games/PKEd4FQpdnMHa9K2NDsN8CvMngUoDCekIdNFtitm.jpg",
                url: `${langPrefix}/casino/games/evolution-crazy-time-a`
            },
            {
                name: "Red Door Roulette",
                image: "https://d3psi4rj7mv4u4.cloudfront.net/games/evosw/red_door_roulette.jpg",
                url: `${langPrefix}/casino/games/evolution-red-door-roulette`
            },
            {
                name: "Fireball Roulette",
                image: "https://d3psi4rj7mv4u4.cloudfront.net/games/evosw/fireball_roulette.jpg",
                url: `${langPrefix}/casino/games/evolution-fireball-roulette`
            },
            {
                name: "Infinite Bet Stacker Blackjack",
                image: "https://d3psi4rj7mv4u4.cloudfront.net/games/evosw/infinite_bet_stacker_blackjack.jpg",
                url: `${langPrefix}/casino/games/evolution-infinite-bet-stacker-blackjack`
            },
            {
                name: "First Person American Roulette",
                image: "https://d3psi4rj7mv4u4.cloudfront.net/games/evosw/first_person_american_roulette.jpg",
                url: `${langPrefix}/casino/games/evolution-first-person-american-roulette`
            },
            {
                name: "Free Bet VIP Blackjack A",
                image: "https://d3psi4rj7mv4u4.cloudfront.net/games/evosw/classic_free_bet_blackjack.jpg",
                url: `${langPrefix}/casino/games/evolution-free-bet-vip-blackjack-a`
            },
            {
                name: "VIP Bet Stacker Blackjack 8",
                image: "https://d3psi4rj7mv4u4.cloudfront.net/games/evosw/classic_bet_stacker_blackjack.jpg",
                url: `${langPrefix}/casino/games/evolution-vip-bet-stacker-blackjack-8`
            },
            {
                name: "Virtual Monaco Roulette",
                image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/gXmqkthvbB1521K/games/wfnY8E4G0l0BVrRCjz8Hu28KcwajYDOBHdkHzDKQ.png",
                url: `${langPrefix}/casino/games/egt-interactive-virtual-monaco-roulette`
            },
            {
                name: "American Roulette 3D",
                image: "https://vendor-provider.fra1.digitaloceanspaces.com/ebetlab/gXmqkthvbB1521K/games/EsIaNiEFwh1wIkkjpwCrFyaRH9F9yC4AEokumiBv.png",
                url: `${langPrefix}/casino/games/evoplay-american-roulette-3d`
            },
            {
                name: "Roulette Macao",
                image: "https://vendor-provider.fra1.digitaloceanspaces.com/ebetlab/gXmqkthvbB1521K/games/PRoR0ucOwea5CsrMYJHOihNdY0K77NiaZGdoqz1Y.png",
                url: `${langPrefix}/casino/games/pragmaticlive-roulette-macao`
            },
            {
                name: "Blackjack 120",
                image: "https://d3psi4rj7mv4u4.cloudfront.net/games/pragmaticplaylive/blackjack_120.jpg",
                url: `${langPrefix}/casino/games/pragmaticlive-blackjack-120`
            },
            {
                name: "Mega Roulette 3000",
                image: "https://d3psi4rj7mv4u4.cloudfront.net/games/pragmaticplaylive/mega_roulette_3000.jpg",
                url: `${langPrefix}/casino/games/pragmaticlive-mega-roulette-3000`
            },
            {
                name: "Turkish Roulette",
                image: "https://vendor-provider.fra1.digitaloceanspaces.com/ebetlab/gXmqkthvbB1521K/games/JHpsg9Yz2D0H9w2vBReI76rVxpsMluQJHllZrSkg.png",
                url: `${langPrefix}/casino/games/livegames-turkish-roulette`
            },
            {
                name: "Vegas Roulette 500x",
                image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/gXmqkthvbB1521K/games/6uQdTaDaeM4P3dlEuijYtHeI9vRF8RURfSlSr76c.png",
                url: `${langPrefix}/casino/games/egt-interactive-vegas-roulette-500x`
            },
            {
                name: "Crazy Balls",
                image: "https://d3psi4rj7mv4u4.cloudfront.net/games/evosw/crazy_balls.jpg",
                url: `${langPrefix}/casino/games/evolution-crazy-balls`
            },
            {
                name: "Monopoly Big Baller",
                image: "https://d3psi4rj7mv4u4.cloudfront.net/games/evosw/monopoly_big_baller.jpg",
                url: `${langPrefix}/casino/games/evolution-monopoly-big-baller`
            },
            {
                name: "Live Altın Rulet",
                image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/gXmqkthvbB1521K/games/LZ804HDmPYKUpRSTj9OCosZx0HXonWyeRO04Ucrt.png",
                url: `${langPrefix}/casino/games/egt-interactive-live-altin-rulet`
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
                            <a class="social-btn" href="https://t.me/betifaresmi"><img class="social-icon-2" src="https://raw.githubusercontent.com/allwaysapp/betifacustom/d9743ed38236d3fe43eeff17742aee81c64f18b8/img/telegram-icon.png" alt="Telegram"></a>
                            <a class="social-btn" href="https://www.instagram.com/betifaeuropa"><img class="social-icon-2" src="https://raw.githubusercontent.com/allwaysapp/betifacustom/d9743ed38236d3fe43eeff17742aee81c64f18b8/img/instagram-icon.png" alt="Instagram"></a>
                            <a class="social-btn" href="https://x.com/betifatr"><img class="social-icon-2" src="https://raw.githubusercontent.com/allwaysapp/betifacustom/d9743ed38236d3fe43eeff17742aee81c64f18b8/img/twitter-icon.png" alt="X"></a>
                            <a class="social-btn" href="https://wa.me/38976318158" target="_blank" rel="noopener"><img class="social-icon-2" src="https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/kojqlwkejjoizdGJKQWf/statics/ZfI3560mQtcDrZG9U8fpug53aJxCW9JFnAUw7iWA.png" alt="WhatsApp"></a>
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
                            <a href="${langPrefix}/casino/games/pragmaticplay-aztec-blaze"><img src="https://vendor-provider.fra1.digitaloceanspaces.com/ebetlab/gXmqkthvbB1521K/games/8bHIPq496x6wmpIg9QSlXxqDGnZAkmO73jF8Dkpa.avif" alt=""></a>
                        </div>
                        <div class="game-item">
                            <a href="${langPrefix}/casino/games/EGTInteractive-40-burning-hot-vip-bell-link"><img src="https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/kojqlwkejjoizdGJKQWf/games/LMRalEYBlNtg9SRhTV5edgA1e6nP97Iu2wlfQ4jY.jpg" alt=""></a>
                        </div>
                        <div class="game-item">
                            <a href="${langPrefix}/casino/games/pragmaticplay-emerald-king-wheel-of-wealth"><img src="https://d3psi4rj7mv4u4.cloudfront.net/games/pragmaticplay/emerald_king_wheel_of_wealth.jpg" alt=""></a>
                        </div>
                        <div class="game-item">
                            <a href="${langPrefix}/casino/games/pragmaticplay-bow-of-artemis"><img src="https://vendor-provider.fra1.digitaloceanspaces.com/ebetlab/gXmqkthvbB1521K/games/DUbFurGJ9nhhTIxUnxKX8JuqH36i6fuwIuDCTAzC.avif" alt=""></a>
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
                <div class="footer-app-banner" style="margin-bottom: 15px;">
                    <a href="https://betifa.live/betifa_ios_live.html" target="_blank" rel="noopener noreferrer">
                        <img src="https://raw.githubusercontent.com/allwaysapp/betifacustom/refs/heads/main/img/mobil-app.gif" alt="Betifa Mobil App" style="width: 100%; height: auto; display: block;">
                    </a>
                </div>
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
        const tryImg = document.querySelector('img.jackpot__logo.try');
        const usdImg = document.querySelector('img.jackpot__logo.usd');
        const btcImg = document.querySelector('img.jackpot__logo.btc');

        if (tryImg && usdImg && btcImg) {
            tryImg.src = 'https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/kojqlwkejjoizdGJKQWf/statics/vl4k5b75jyTx5jREitJf1ACDTMdRJD0lx3dftYAo.png';
            usdImg.src = 'https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/kojqlwkejjoizdGJKQWf/statics/FMhxFRKcmA9F6uj64aTBNMj01Fkthz3GAQ0qrlYK.png';
            btcImg.src = 'https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/kojqlwkejjoizdGJKQWf/statics/d7vPkTXRsNo5fFefMdKHrAWW0BkgeZEDZ8TTasSm.png';
            console.log('Jackpot görselleri güncellendi');
        } else {
            console.log('Jackpot elementleri henüz yüklenmemiş, bekleniyor...');
            setTimeout(updateJackpotImages, 500);
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
        if (document.querySelector('.betifa-social-links')) return;

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

        const socialLinksSection = document.createElement('div');
        socialLinksSection.className = 'sidebar__menu betifa-social-links';
        socialLinksSection.innerHTML = `
            <span class="sidebar__title">Linkler</span>
            <ul class="sidebar__nav">
                <li>
                    <a href="https://www.instagram.com/betifaeuropa" target="_blank" rel="noopener noreferrer">
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
                    <a href="https://t.me/betifa_resmi_bot" target="_blank" rel="noopener noreferrer">
                        <i class="fa-brands fa-telegram" style="width: 20px; display: inline-block; text-align: center;"></i>
                        Telegram Support
                    </a>
                </li>
                <li>
                    <a href="https://wa.me/38976318158" target="_blank" rel="noopener noreferrer">
                        <i class="fa-brands fa-whatsapp" style="width: 20px; display: inline-block; text-align: center;"></i>
                        Whatsapp Destek
                    </a>
                </li>
            </ul>
        `;

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

    // Footer Sosyal Medya Linklerini Güncelle
    function updateFooterSocialLinks() {
        const footerSocial = document.querySelector('ul.footer__social');
        if (!footerSocial) {
            console.log('Footer social bulunamadı, bekleniyor...');
            setTimeout(updateFooterSocialLinks, 500);
            return;
        }

        // Zaten güncellenmiş mi kontrol et
        if (footerSocial.classList.contains('betifa-footer-social-updated')) return;

        // Mevcut ikonların SVG sprite yolunu al
        const existingSvg = footerSocial.querySelector('svg use');
        const spriteUrl = existingSvg ? existingSvg.getAttribute('href')?.split('#')[0] : '/static/media/sprite.416275c004a2977bb04b6579ccb104a4.svg';

        // Yeni sosyal medya linkleri
        footerSocial.innerHTML = `
            <li>
                <a href=" https://www.instagram.com/betifaeuropa" target="_blank">
                    <svg class="svg-icon">
                        <use href="${spriteUrl}#instagram" xlink:href="${spriteUrl}#instagram"></use>
                    </svg>
                </a>
            </li>
            <li>
                <a href="https://x.com/betifatr" target="_blank">
                    <svg class="svg-icon">
                        <use href="${spriteUrl}#twitter" xlink:href="${spriteUrl}#twitter"></use>
                    </svg>
                </a>
            </li>
            <li>
                <a href="https://t.me/betifaresmi" target="_blank">
                    <svg viewBox="0 0 240 240" class="svg-icon" style="width: 24px; height: 24px;">
                        <defs>
                            <linearGradient id="tg-gradient-1" x1="120" y1="240" x2="120" gradientUnits="userSpaceOnUse">
                                <stop offset="0" stop-color="#1d93d2"></stop>
                                <stop offset="1" stop-color="#38b0e3"></stop>
                            </linearGradient>
                        </defs>
                        <circle cx="120" cy="120" r="120" fill="url(#tg-gradient-1)"></circle>
                        <path d="M81.229,128.772l14.237,39.406s1.78,3.687,3.686,3.687,30.255-29.492,30.255-29.492l31.525-60.89L81.737,118.6Z" fill="#c8daea"></path>
                        <path d="M100.106,138.878l-2.733,29.046s-1.144,8.9,7.754,0,17.415-15.763,17.415-15.763" fill="#a9c6d8"></path>
                        <path d="M81.486,130.178,52.2,120.636s-3.5-1.42-2.373-4.64c.232-.664.7-1.229,2.1-2.2,6.489-4.523,120.106-45.36,120.106-45.36s3.208-1.081,5.1-.362a2.766,2.766,0,0,1,1.885,2.055,9.357,9.357,0,0,1,.254,2.585c-.009.752-.1,1.449-.169,2.542-.692,11.165-21.4,94.493-21.4,94.493s-1.239,4.876-5.678,5.043A8.13,8.13,0,0,1,146.1,172.5c-8.711-7.493-38.819-27.727-45.472-32.177a1.27,1.27,0,0,1-.546-.9c-.093-.469.417-1.05.417-1.05s52.426-46.6,53.821-51.492c.108-.379-.3-.566-.848-.4-3.482,1.281-63.844,39.4-70.506,43.607A3.21,3.21,0,0,1,81.486,130.178Z" fill="#fff"></path>
                    </svg>
                </a>
            </li>
            <li>
                <a href="https://t.me/betifa_resmi_bot" target="_blank">
                    <svg viewBox="0 0 240 240" class="svg-icon" style="width: 24px; height: 24px;">
                        <defs>
                            <linearGradient id="tg-gradient-2" x1="120" y1="240" x2="120" gradientUnits="userSpaceOnUse">
                                <stop offset="0" stop-color="#1d93d2"></stop>
                                <stop offset="1" stop-color="#38b0e3"></stop>
                            </linearGradient>
                        </defs>
                        <circle cx="120" cy="120" r="120" fill="url(#tg-gradient-2)"></circle>
                        <path d="M81.229,128.772l14.237,39.406s1.78,3.687,3.686,3.687,30.255-29.492,30.255-29.492l31.525-60.89L81.737,118.6Z" fill="#c8daea"></path>
                        <path d="M100.106,138.878l-2.733,29.046s-1.144,8.9,7.754,0,17.415-15.763,17.415-15.763" fill="#a9c6d8"></path>
                        <path d="M81.486,130.178,52.2,120.636s-3.5-1.42-2.373-4.64c.232-.664.7-1.229,2.1-2.2,6.489-4.523,120.106-45.36,120.106-45.36s3.208-1.081,5.1-.362a2.766,2.766,0,0,1,1.885,2.055,9.357,9.357,0,0,1,.254,2.585c-.009.752-.1,1.449-.169,2.542-.692,11.165-21.4,94.493-21.4,94.493s-1.239,4.876-5.678,5.043A8.13,8.13,0,0,1,146.1,172.5c-8.711-7.493-38.819-27.727-45.472-32.177a1.27,1.27,0,0,1-.546-.9c-.093-.469.417-1.05.417-1.05s52.426-46.6,53.821-51.492c.108-.379-.3-.566-.848-.4-3.482,1.281-63.844,39.4-70.506,43.607A3.21,3.21,0,0,1,81.486,130.178Z" fill="#fff"></path>
                    </svg>
                </a>
            </li>
            <li>
                <a href="https://wa.me/38976318158" target="_blank">
                    <svg viewBox="0 0 24 24" class="svg-icon" style="width: 24px; height: 24px;" fill="#25D366">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                </a>
            </li>
        `;

        // Güncellendiğini işaretle
        footerSocial.classList.add('betifa-footer-social-updated');
        console.log('Footer sosyal medya linkleri güncellendi');
    }

    function restoreFooterSocialLinks() {
        const footerSocial = document.querySelector('ul.footer__social.betifa-footer-social-updated');
        if (footerSocial) {
            footerSocial.classList.remove('betifa-footer-social-updated');
            console.log('Footer sosyal medya linkleri restore edilebilir');
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
