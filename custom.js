(function () {
    // Geçiş sırasında özel bölümlerin görünmesini engellemek için flag
    let isNavigating = false;

    // MERKEZI COMPONENT YÖNETİMİ - Yeni bölümler buraya eklenir
    const COMPONENTS = {
        customSection: {
            condition: () => isHomePage(),
            create: createCustomSection,
            remove: removeCustomSection,
            selector: '.betifa-custom-section'
        },
        providerCarousel: {
            condition: () => isCasinoSlotsPage(),
            create: createProviderCarouselForSlots, 
            remove: removeProviderCarouselFromSlots,
            selector: '.custom-section4'
        },
        footerAwards: {
            condition: () => true, // Her sayfada göster
            create: createFooterAwards,
            remove: removeFooterAwards,
            selector: '.betifa-footer-awards'
        },
        jackpotImages: {
            condition: () => isHomePage(),
            create: updateJackpotImages,
            remove: () => {},
            selector: '.jackpot__logo'
    }
    };

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

    // /casino/slots sayfası kontrolü
    function isCasinoSlotsPage() {
        const url = window.location.pathname;
        return url.includes('/casino/slots') || url === '/casino/slots' || url === '/tr/casino/slots' || url === '/en/casino/slots';
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

    // 20 Canlı Casino Oyunu Listesi
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

    // 92 Game Provider Listesi
    function getGameProviders(langPrefix) {
        const providers = [
            { name: "Pragmatic Play", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/pragmaticplay.svg", slug: "pragmaticplay" },
            { name: "Evolution", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/Evolution%20Gaming.svg", slug: "evolution" },
            { name: "Pragmatic Live", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/pragmatic-live-light.svg", slug: "pragmaticlive" },
            { name: "HackSaw Gaming", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/hacksaw.svg", slug: "hacksaw" },
            { name: "EGT", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/egt.svg", slug: "EGTInteractive" },
            { name: "No Limit City", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/NoLimitCity.svg", slug: "nolimitcity" },
            { name: "Netent", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/netent.svg", slug: "netent" },
            { name: "Ezugi", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/ezugi.svg", slug: "ezugi" },
            { name: "Amusnet", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/amusnet.svg", slug: "egt-interactive" },
            { name: "1x2 Gaming", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/1x2gaming.svg", slug: "1x2gaming" },
            { name: "5men", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/5men.svg", slug: "5men" },
            { name: "Endorphina", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/endorphina.svg", slug: "endorphina" },
            { name: "MrSlotty", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/mrslotty.svg", slug: "mrslotty" },
            { name: "Amatic", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/amatic.svg", slug: "amatic" },
            { name: "Red Tiger", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/Red%20Tiger%20Gaming.svg", slug: "redtiger" },
            { name: "BGAMING", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/softswiss.svg", slug: "bgaming" },
            { name: "Booming Games", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/booming.svg", slug: "booming" },
            { name: "1spin4win", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/1spin4win.svg", slug: "1spin4win" },
            { name: "AvatarUX", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/avatarux.svg", slug: "avatarux" },
            { name: "Belatra", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/belatra.svg", slug: "belatra" },
            { name: "Beter.Live", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/beterlive.svg", slug: "beterlive" },
            { name: "Evoplay Entertainment", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/evoplay.svg", slug: "evoplay" },
            { name: "Gamebeat", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/gamebeat.svg", slug: "gamebeat" },
            { name: "Gamzix", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/gamezix.svg", slug: "gamzix" },
            { name: "iGTech", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/igtech.svg", slug: "igtech" },
            { name: "Playson", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/playson.svg", slug: "playson" },
            { name: "Mascot Gaming", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/mascot.svg", slug: "mascotgaming" },
            { name: "Mancala Gaming", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/mancala.svg", slug: "mancala" },
            { name: "NetGame", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/netgame.svg", slug: "netgame" },
            { name: "Novomatic", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/novomatic.svg", slug: "novomatic" },
            { name: "Nucleus", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/nucleus.svg", slug: "nucleus" },
            { name: "OnlyPlay", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/onlyplay.svg", slug: "onlyplay" },
            { name: "ORYX", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/oryx.svg", slug: "oryx" },
            { name: "Platipus", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/platipus.svg", slug: "platipus" },
            { name: "Popiplay", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/popiplay.svg", slug: "popiplay" },
            { name: "Quickspin", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/quickspin.svg", slug: "quickspin" },
            { name: "Slotmill", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/slotmill.svg", slug: "slotmill" },
            { name: "SmartSoft", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/smartsoft.svg", slug: "smartsoft" },
            { name: "Spadegaming", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/spadegaming.svg", slug: "spadegaming" },
            { name: "Spribe", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/spribe.svg", slug: "spribe" },
            { name: "Thunderkick", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/thunderkick.svg", slug: "thunderkick" },
            { name: "Tom Horn", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/tomhorn.svg", slug: "tomhornnative" },
            { name: "Truelab", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/truelab.svg", slug: "truelab" },
            { name: "Turbo Games", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/turbogames.svg", slug: "turbogames" },
            { name: "AsiaGaming", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/Asia%20Gaming.svg", slug: "asiagaming" },
            { name: "BeeFee", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/BeeFee%20Games.svg", slug: "beefee" },
            { name: "BetRadar VS", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/Betradar%20Virtual%20sports.svg", slug: "betradarvs" },
            { name: "BetSoft", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/betsoft.svg", slug: "betsoft" },
            { name: "CQ9", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/CQ9.svg", slug: "cq9" },
            { name: "CT Gaming", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/CT%20Gaming.svg", slug: "ctgaming" },
            { name: "Genii", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/Genii.svg", slug: "genii" },
            { name: "Habanero", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/habanero.svg", slug: "habanero" },
            { name: "IgroSoft", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/Igrosoft.svg", slug: "igrosoft" },
            { name: "Leap", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/Leap.svg", slug: "leap" },
            { name: "Live Games", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/Live%20Games.svg", slug: "livegames" },
            { name: "Lucky Streak", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/luckystreak.svg", slug: "luckystreak" },
            { name: "PlayTech", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/Playtech%20slots.svg", slug: "playtech" },
            { name: "RedRake Gaming", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/Red%20Rake%20Gaming.svg", slug: "redrake" },
            { name: "SA Gaming", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/SA%20Gaming.svg", slug: "sagaming" },
            { name: "Salsa Tech", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/Salsa%20technology.svg", slug: "salsa" },
            { name: "Vivo Gaming", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/Vivo%20Gaming.svg", slug: "vivogaming" },
            { name: "Wizard Games", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/wazdan.svg", slug: "wizard" },
            { name: "WorldMatch", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/World%20Match.svg", slug: "worldmatch" },
            { name: "YGG Drasil", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/yggdrasil.svg", slug: "yggdrasil" },
            { name: "PGSoft", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/Pocket%20Games%20Soft.svg", slug: "pgsoft" },
            { name: "JDB", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/JDB.svg", slug: "jdb" },
            { name: "Gaming7777", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/Gaming%207777.svg", slug: "gaming7777" },
            { name: "IronDog", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/irondog.svg", slug: "irondog" },
            { name: "Gamomat", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/gamomat.svg", slug: "gamomat" },
            { name: "Golden Hero", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/golden%20hero.svg", slug: "goldenhero" },
            { name: "Fugaso", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/fugaso.svg", slug: "fugaso" },
            { name: "Ebetlab", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/originals.svg", slug: "ebetlab" },
            { name: "Galaxys", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/galaxy%20gaming.svg", slug: "galaxys" },
            { name: "Imagine Live", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/imageinelive.svg", slug: "imagine-live" },
            { name: "Imoon", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/imoon.svg", slug: "imoon" },
            { name: "InOut", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/InOut.svg", slug: "inout" },
            { name: "Jiliasia", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/Jiliasia.svg", slug: "jiliasia" },
            { name: "Zeus Play", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/Zeus%20Play.svg", slug: "zeus-play" },
            { name: "Peter And Sons", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/Peter%20And%20Sons.svg", slug: "peter-and-sons" },
            { name: "TopSpin", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/topspin.svg", slug: "topspin" },
            { name: "Popok", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/Popok.svg", slug: "popok" },
            { name: "Bet Games", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/booming.svg", slug: "betgames" },
            { name: "Raw Games", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/Raw%20Gaming.svg", slug: "rawgames" },
            { name: "YGR Games", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/YGR.svg", slug: "ygrgames" },
            { name: "EurasianGaming", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/eurasian-gaming.svg", slug: "eurasian-gaming" },
            { name: "Gaming Corps", image: "https://cdn.ebetlab.com/ebetlab/game-providers/light/Gaming%20Corps%20Dark%20Logo%20SVG.svg", slug: "gaming-corps" },
            { name: "F*Bastards", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/F_Bastards.svg", slug: "fbastards" },
            { name: "Victory Ark", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/Victory%20Ark.svg", slug: "victoryark" },
            { name: "Urgent Games", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/Urgent%20games.svg", slug: "urgentgames" },
            { name: "Ruby Play", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/ruby%20play.svg", slug: "rubyplay" },
            { name: "Push Gaming", image: "https://cdn.ebetlab.com/ebetlab/game-providers/light/push_gaming.svg", slug: "pushgaming" },
            { name: "Relax Gaming", image: "https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/game-providers/light/relax%20gaming.svg", slug: "relaxgaming" }
        ];

        return providers.map(provider => ({
            ...provider,
            url: `${langPrefix}/providers/${provider.slug}`
        }));
    }

    // Provider carousel state yönetimi
    let providerCarouselState = {
        currentIndex: 0,
        itemsPerPage: window.innerWidth <= 768 ? 3 : 8
    };

    // Provider carousel HTML oluşturan fonksiyon
    function createProviderCarouselHTML(providers) {
        const { currentIndex, itemsPerPage } = providerCarouselState;
        const totalItems = providers.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const currentPage = Math.floor(currentIndex / itemsPerPage);
        
        // Mevcut sayfadaki provider'ları al
        const startIndex = currentPage * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
        const currentProviders = providers.slice(startIndex, endIndex);
        
        // Sol/sağ ok butonlarının aktif durumları
        const isFirstPage = currentPage === 0;
        const isLastPage = currentPage === totalPages - 1;
        
        const providersHTML = currentProviders.map(provider => `
            <div class="provider-item">
                <a href="${provider.url}" class="provider-link">
                    <div class="provider-container">
                        <img src="${provider.image}" alt="${provider.name}" loading="lazy">
                    </div>
                </a>
            </div>
        `).join('');
        
        return `
            <div class="provider-carousel-wrapper">
                <div class="provider-carousel-header">
                    <h3>Oyun Sağlayıcıları</h3>
                    <div class="provider-carousel-controls">
                        <button class="provider-nav-btn provider-nav-prev ${isFirstPage ? 'disabled' : ''}" 
                                onclick="navigateProviders('prev')" 
                                ${isFirstPage ? 'disabled' : ''}>
                            ←
                        </button>
                        <button class="provider-nav-btn provider-nav-next ${isLastPage ? 'disabled' : ''}" 
                                onclick="navigateProviders('next')" 
                                ${isLastPage ? 'disabled' : ''}>
                            →
                        </button>
                    </div>
                </div>
                <div class="provider-carousel-container">
                    <div class="provider-carousel">
                        ${providersHTML}
                    </div>
                </div>
            </div>
        `;
    }

    // Provider navigasyon fonksiyonu
    function navigateProviders(direction) {
        const { itemsPerPage } = providerCarouselState;
        const providers = getGameProviders(getCurrentLanguagePrefix());
        const totalPages = Math.ceil(providers.length / itemsPerPage);
        const currentPage = Math.floor(providerCarouselState.currentIndex / itemsPerPage);
        
        let newPage = currentPage;
        
        if (direction === 'prev' && currentPage > 0) {
            newPage = currentPage - 1;
        } else if (direction === 'next' && currentPage < totalPages - 1) {
            newPage = currentPage + 1;
        }
        
        providerCarouselState.currentIndex = newPage * itemsPerPage;
        
        // Provider carousel'i güncelle
        updateProviderCarousel();
    }

    // Provider carousel güncelleme fonksiyonu
    function updateProviderCarousel() {
        const carousel = document.querySelector('.provider-carousel-wrapper');
        if (!carousel) return;
        
        const langPrefix = getCurrentLanguagePrefix();
        const providers = getGameProviders(langPrefix);
        
        carousel.innerHTML = createProviderCarouselHTML(providers);
        
        console.log('Provider carousel güncellendi:', providerCarouselState);
    }

    // Responsive güncellemeleri için window resize listener
    function setupProviderCarouselResize() {
        let resizeTimeout;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function() {
                const newItemsPerPage = window.innerWidth <= 768 ? 3 : 8;
                if (newItemsPerPage !== providerCarouselState.itemsPerPage) {
                    providerCarouselState.itemsPerPage = newItemsPerPage;
                    providerCarouselState.currentIndex = 0; // Reset to first page
                    updateProviderCarousel();
                }
            }, 250);
        });
    }

    // Global navigasyon fonksiyonunu window'a ekle
    window.navigateProviders = navigateProviders;

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

    // MERKEZI COMPONENT YÖNETİM FONKSİYONLARI
    function initializeComponents() {
        Object.entries(COMPONENTS).forEach(([name, component]) => {
            if (component.condition() && !isNavigating) {
                // Component yoksa oluştur
                if (!document.querySelector(component.selector)) {
                    component.create();
                }
            } else {
                // Component varsa kaldır
                component.remove();
            }
        });
    }

    function removeAllComponents() {
        Object.values(COMPONENTS).forEach(component => {
            component.remove();
        });
    }

    // COMPONENT FONKSİYONLARI
    function createCustomSection() {
        if (isNavigating || !isHomePage()) return;

        const mainSlider = document.getElementById('main-slider');
        if (!mainSlider || document.querySelector('.betifa-custom-section')) return;

        const langPrefix = getCurrentLanguagePrefix();
        const games = getPopularGames(langPrefix);
        const liveCasinoGames = getLiveCasinoGames(langPrefix);
        
        // İlk 10 ve ikinci 10 oyunu ayır
        const firstTenGames = games.slice(0, 10);
        const secondTenGames = games.slice(10, 20);
        
        // Canlı casino oyunları için de aynı şekilde ayır
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
                            <a class="social-btn" href="https://wa.me/38977516531" target="_blank" rel="noopener"><img class="social-icon-2" src="https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/kojqlwkejjoizdGJKQWf/statics/ZfI3560mQtcDrZG9U8fpug53aJxCW9JFnAUw7iWA.png" alt="WhatsApp"></a>
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
                        <a href="${langPrefix}/payments/deposit"><img src="https://raw.githubusercontent.com/allwaysapp/betifacustom/refs/heads/main/img/yatirim-product.jpg" alt=""></a>
                    </div>
                    <div class="lucky-wheel">
                        <a href="${langPrefix}/payments/withdrawal"><img src="https://raw.githubusercontent.com/allwaysapp/betifacustom/refs/heads/main/img/cekim-product.jpg" alt=""></a>
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
                            <a href="${langPrefix}/casino/games/EGTInteractive-flaming-hot-bell-link"><img src="https://vendor-provider.fra1.digitaloceanspaces.com/ebetlab/gXmqkthvbB1521K/games/ef0pKVRuRxOOI7JpBu5KcwIEkOxPQTZSsjZbwrzW.png" alt=""></a>
                        </div>
                        <div class="game-item">
                            <a href="${langPrefix}/casino/games/EGTInteractive-shining-crown-bell-link"><img src="https://vendor-provider.fra1.digitaloceanspaces.com/ebetlab/gXmqkthvbB1521K/games/Dx3g2ara2ofhfSo8XawtCOGEshzyXZ1KYWKOx275.png" alt=""></a>
                        </div>
                        <div class="game-item">
                            <a href="${langPrefix}/casino/games/EGTInteractive-40-burning-hot-bell-link"><img src="https://vendor-provider.fra1.digitaloceanspaces.com/ebetlab/gXmqkthvbB1521K/games/bHW8HLS6L9zHubXtAAldQEGsqfaiyjuHX4yB9Ibb.png" alt=""></a>
                        </div>
                        <div class="game-item">
                            <a href="${langPrefix}/casino/games/EGTInteractive-20-super-hot-bell-link"><img src="https://vendor-provider.fra1.digitaloceanspaces.com/ebetlab/gXmqkthvbB1521K/games/P6qP3RrfVbsBlp2R63eoVZVuJu40q8kAmv5F1hTa.png" alt=""></a>
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
    }

    function removeCustomSection() {
        const element = document.querySelector('.betifa-custom-section');
        if (element && element.parentNode) {
            element.parentNode.removeChild(element);
            console.log('Betifa custom section kaldırıldı');
        }
    }

    function createProviderCarouselForSlots() {
        if (!isCasinoSlotsPage() || isNavigating) {
            removeProviderCarouselFromSlots();
            return;
        }
        
        const targetContainer = document.querySelector('.container.section');
        if (!targetContainer) return;

        if (!document.querySelector('.custom-section4')) {
            const langPrefix = getCurrentLanguagePrefix();
            const providers = getGameProviders(langPrefix);

            const providerSection = document.createElement('div');
            providerSection.className = 'container custom-section4';
            providerSection.innerHTML = createProviderCarouselHTML(providers);

            if (targetContainer.nextSibling) {
                targetContainer.parentNode.insertBefore(providerSection, targetContainer.nextSibling);
            } else {
                targetContainer.parentNode.appendChild(providerSection);
            }

            // İlk render sonrası tek sefer güncelle
            updateProviderCarousel();

            console.log('Provider carousel slots sayfasına eklendi');
        }
    }

    function removeProviderCarouselFromSlots() {
        const element = document.querySelector('.custom-section4');
        if (element && element.parentNode) {
            element.parentNode.removeChild(element);
            console.log('Provider carousel slots sayfasından kaldırıldı');
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
    // TRY/TL görselini güncelle
    const tryImg = document.querySelector('.jackpot__logo.try');
    if (tryImg) {
        tryImg.src = 'https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/kojqlwkejjoizdGJKQWf/statics/vl4k5b75jyTx5jREitJf1ACDTMdRJD0lx3dftYAo.png';
    }

    // USD görselini güncelle  
    const usdImg = document.querySelector('.jackpot__logo.usd');
    if (usdImg) {
        usdImg.src = 'https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/kojqlwkejjoizdGJKQWf/statics/FMhxFRKcmA9F6uj64aTBNMj01Fkthz3GAQ0qrlYK.png';
    }

    // BTC görselini güncelle
    const btcImg = document.querySelector('.jackpot__logo.btc');
    if (btcImg) {
        btcImg.src = 'https://vendor-provider.fra1.cdn.digitaloceanspaces.com/ebetlab/kojqlwkejjoizdGJKQWf/statics/d7vPkTXRsNo5fFefMdKHrAWW0BkgeZEDZ8TTasSm.png';
    }

    console.log('Jackpot görselleri güncellendi');
}

    

    // LINK YÖNETİMİ
    function setupLinkInterceptors() {
        document.body.addEventListener('click', function(e) {
            const link = e.target.closest('a');
            if (!link) return;

            // Dış linkler (sosyal medya vb.) → dokunma
            if (link.href && (link.href.startsWith('http') && !link.href.includes(window.location.hostname))) {
                return;
            }

            // İç linkler
            if (!link.target || link.target === '_self') {
                const href = link.getAttribute('href');
                if (href && href.startsWith('/')) {

                    // 1) Custom section içindeki linkler (mevcut davranış)
                    const isCustomSectionLink = link.closest('.betifa-custom-section');
                    if (isCustomSectionLink) {
                        e.preventDefault();

                        // Geçiş öncesi özel alanı kaldır
                        isNavigating = true;
                        removeCustomSection();

                        // SPA navigasyon
                        window.history.pushState({}, '', href);
                        window.dispatchEvent(new PopStateEvent('popstate'));

                        // Anında initialize
                        isNavigating = false;
                        initializeComponents();
                        return;
                    }

                    // 2) Provider carousel içindeki linkler → AYNI YAKLAŞIM
                    const isProviderCarouselLink = link.closest('.custom-section4') || link.closest('.provider-carousel-wrapper');
                    if (isProviderCarouselLink) {
                        e.preventDefault();

                        // Geçiş öncesi provider alanını ve custom section'ı kaldır
                        isNavigating = true;
                        removeProviderCarouselFromSlots();
                        removeCustomSection();

                        // SPA navigasyon
                        window.history.pushState({}, '', href);
                        window.dispatchEvent(new PopStateEvent('popstate'));

                        // Anında initialize
                        isNavigating = false;
                        initializeComponents();
                        return;
                    }

                    // 3) Diğer iç linkler: mevcut davranışı koru
                    isNavigating = true;
                    removeAllComponents();
                    isNavigating = false;
                    initializeComponents();
                }
            }
        });
    }

    // URL YÖNETİMİ
    function handleUrlChange() {
        isNavigating = true;
        removeAllComponents();
        isNavigating = false;
        initializeComponents();
    }

    // İNİTİALİZE FONKSİYONLARI
    function initialize() {
        initializeComponents();
        setupLinkInterceptors();
        setupProviderCarouselResize();
    }

    // EVENT LİSTENER'LAR
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
            initializeComponents();
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

    window.addEventListener('load', function() {
        initializeComponents();
    });

})();
