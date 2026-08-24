const nav = document.querySelector('nav');
const logo = document.querySelector('.logo a');
const links = document.querySelector('.links');
const menu = document.querySelector('.hamburger-menu');
const main = document.querySelector('main');

menu.addEventListener('click', toggleHamburgerMenu);

// toggles the hamburger menu, along with disabling scroll when menu is open
function toggleHamburgerMenu() {
    nav.classList.toggle('menu-open');
    document.body.classList.toggle('no-scroll');

    // holds the value of whether the menu is open or not in order for the relevant code to run
    const menuOpen = nav.classList.contains('menu-open');

    // disables the contents of main along with the logo if the hamburger menu is open
    main.inert = menuOpen;
    logo.inert = menuOpen;

    // adds or removes the event listener depending on wether the hamburger is open or not
    if (menuOpen) {
        document.addEventListener('keydown', escapeKeyPress);
    } else {
        document.removeEventListener('keydown', escapeKeyPress);
    };
};

// listens for escape key while the hamburger menu is open
function escapeKeyPress(e) {
    if (e.key === 'Escape') {
        toggleHamburgerMenu();
    };
};