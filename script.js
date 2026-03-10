const nav = document.querySelector('nav');
const logo = document.querySelector('.logo a');
const links = document.querySelector('.links');
const menu = document.querySelector('.hamburger-menu');
const main = document.querySelector('main');

menu.addEventListener('click', toggleHamburgerMenu);

// toggles the hamburger menu, along with disabling scroll when menu is open
function toggleHamburgerMenu() {
    nav.classList.toggle('active');
    const active = nav.classList.contains('active');
    document.body.classList.toggle('no-scroll');
    main.inert = active;
    logo.inert = active;

    // only listens for a key press when the hamburger menu is open
    if (active) {
        document.addEventListener('keydown', escapeKeyPress);
    } else {
        document.removeEventListener('keydown', escapeKeyPress);
    };
};

// closes the hamburger menu with escape key
function escapeKeyPress(e) {
    if (e.key === 'Escape') {
        toggleHamburgerMenu();
    };
};