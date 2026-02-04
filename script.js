const nav = document.querySelector('nav');
const logo = document.querySelector('.logo a');
const links = document.querySelector('.links');
const menu = document.querySelector('.hamburger-menu');

menu.addEventListener('click', toggleHamburgerMenu);
document.addEventListener('keydown', handleEscape);
logo.addEventListener('focusin', removeLogoFocus);

// toggles the hamburger menu, along with disabling scroll when menu is open
function toggleHamburgerMenu() {
    nav.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
};

// closes the hamburger menu
function handleEscape(e) {
    if (e.key !== 'Escape') return;

    if (nav.classList.contains('active')) {
        e.preventDefault();
        nav.classList.remove('active');
        document.body.classList.remove('no-scroll');
    };
};

function removeLogoFocus(e) {
    // checks if the nav contains the active class
    if (nav.classList.contains('active')) {
        // removes the focus from the logo
        e.currentTarget.blur();
        // makes the hamburger menu be the focus when nav is active
        menu.focus();
    };
};