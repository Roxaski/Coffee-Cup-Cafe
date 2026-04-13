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
    // prevents these elements from being focused, clicked, or read by screen readers
    main.inert = active;
    logo.inert = active;

    // adds or removes the esc key event listener when the hamburger menu is open or closed
    if (active) {
        document.addEventListener('keydown', escapeKeyPress);
    } else {
        document.removeEventListener('keydown', escapeKeyPress);
    };
};

function escapeKeyPress(e) {
    if (e.key === 'Escape') {
        toggleHamburgerMenu();
    };
};