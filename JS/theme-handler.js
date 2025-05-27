document.addEventListener('DOMContentLoaded', () => {
    const themeSelect = document.getElementById('theme-select');
    const logoImg = document.getElementById('main-logo');

    function updateLogo(theme) {
        if (!logoImg) return;
        switch (theme) {
            case 'summer':
                logoImg.src = '../Images/bv_logo_summer.png';
                break;
            case 'midnight':
                logoImg.src = '../Images/bv_logo_midnight.png';
                break;
            case 'rain':
                logoImg.src = '../Images/bv_logo_rain.png';
                break;
            default:
                logoImg.src = '../Images/bv_logo.png';
        }
    }

    function updateTravelLogos(theme) {
        // Update all travel logos in travel widgets
        const travelLogos = document.querySelectorAll('.travel-logo');
        travelLogos.forEach(logo => {
            switch (theme) {
                case 'summer':
                    logo.src = '../Images/bv_logo_summer.png';
                    break;
                case 'midnight':
                    logo.src = '../Images/bv_logo_midnight.png';
                    break;
                case 'rain':
                    logo.src = '../Images/bv_logo_rain.png';
                    break;
                default:
                    logo.src = '../Images/bv_logo.png';
            }
        });
    }

    function updateFavicon(theme) {
        // Get the current favicon link element
        let faviconLink = document.querySelector("link[rel*='icon']");
        
        // If no favicon link exists, create one
        if (!faviconLink) {
            faviconLink = document.createElement('link');
            faviconLink.rel = 'icon';
            faviconLink.type = 'image/png';
            document.head.appendChild(faviconLink);
        }

        // Update favicon based on theme
        switch (theme) {
            case 'summer':
                faviconLink.href = '../Images/favicon-summer-32x32.png';
                break;
            case 'midnight':
                faviconLink.href = '../Images/favicon-midnight-32x32.png';
                break;
            case 'rain':
                faviconLink.href = '../Images/favicon-rain-32x32.png';
                break;
            default:
                faviconLink.href = '../Images/favicon-daylight-32x32.png';
        }

        // Force browser to reload favicon by adding timestamp
        faviconLink.href += '?v=' + new Date().getTime();
    }

    // Load saved theme
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        if (themeSelect) {
            themeSelect.value = savedTheme;
        }
        updateLogo(savedTheme);
        updateFavicon(savedTheme);
        // Update travel logos after a short delay to ensure they're loaded
        setTimeout(() => updateTravelLogos(savedTheme), 100);
    } else {
        // Set default favicon for daylight theme
        updateFavicon('daylight');
    }

    // Update theme on change
    if (themeSelect) {
        themeSelect.addEventListener('change', function () {
            const selectedTheme = this.value;
            document.documentElement.setAttribute('data-theme', selectedTheme);
            localStorage.setItem('selectedTheme', selectedTheme);
            updateLogo(selectedTheme);
            updateFavicon(selectedTheme);
            updateTravelLogos(selectedTheme);
        });
    }
});