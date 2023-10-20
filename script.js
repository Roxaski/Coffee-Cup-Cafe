let nav = document.querySelector('nav');
let menu = document.querySelector('.hamburger-menu');
//Hamburger Menu
menu.addEventListener('click', () => {
    nav.classList.toggle('active')
});
//Disables scrolling when hamburger menu is open
menu.addEventListener('click', () => {
    document.body.classList.toggle('no-scroll');
});