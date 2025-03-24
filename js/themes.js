// Theme Switcher JavaScript

// Initialize theme when DOM loads
document.addEventListener('DOMContentLoaded', function () {
    // Get saved theme or use default
    const savedTheme = localStorage.getItem('bookstore-theme') || 'default';

    // Apply the theme
    applyTheme(savedTheme);

    // Set up theme selector
    const themeSelector = document.getElementById('theme-selector');
    if (themeSelector) {
        // Set selector to current theme
        themeSelector.value = savedTheme;

        // Add change event listener
        themeSelector.addEventListener('change', function () {
            const selectedTheme = this.value;
            applyTheme(selectedTheme);
            localStorage.setItem('bookstore-theme', selectedTheme);
        });
    }
});

/**
 * Apply a theme to the website
 * @param {string} theme - Theme to apply ('default', 'dark', 'seasonal')
 */
function applyTheme(theme) {
    // Remove any existing theme classes
    document.body.classList.remove('default-theme', 'dark-theme', 'spring-theme', 'summer-theme', 'fall-theme', 'winter-theme');

    // Apply selected theme
    if (theme === 'default') {
        document.body.classList.add('default-theme');
    } else if (theme === 'dark') {
        document.body.classList.add('dark-theme');
    } else if (theme === 'seasonal') {
        // Get current season
        const season = getCurrentSeason();
        document.body.classList.add(season + '-theme');
    }
}

/**
 * Get the current season based on the month
 * @returns {string} Season name ('spring', 'summer', 'fall', 'winter')
 */
function getCurrentSeason() {
    const month = new Date().getMonth();

    // Spring: March-May (2-4)
    if (month >= 2 && month <= 4) {
        return 'spring';
    }
    // Summer: June-August (5-7)
    else if (month >= 5 && month <= 7) {
        return 'summer';
    }
    // Fall: September-November (8-10)
    else if (month >= 8 && month <= 10) {
        return 'fall';
    }
    // Winter: December-February (11, 0-1)
    else {
        return 'winter';
    }
}