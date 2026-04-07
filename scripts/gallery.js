const navElements = document.querySelectorAll('nav a');
const gallery = document.querySelector('.gallery');
const galleryImgs = document.querySelectorAll('.gallery img');
const overlay = document.querySelector('.overlay');
const lightbox = document.querySelector('.lightbox img');
const previousBtn = document.querySelector('.previous');
const nextBtn = document.querySelector('.next');

// keeps track of which image was clicked
let currentImg = 0;

// creates new image variables in order to preload them when the lightbox is active
let preloadPreviousImg = new Image();
let preloadNextImg = new Image();

// creates an array of the images within the gallery
const galleryImgArray = Array.from(galleryImgs);

/*
    waits for the image to be fully decoded before displaying it,
    this is done to prevent firefox from briefly flashing the previous image if one was clicked on
*/
async function setLightboxImg() {
    const img = galleryImgArray[currentImg];
    
    lightbox.src = img.src;
    lightbox.srcset = img.srcset;
    
    await lightbox.decode();
};

/*
    displays the lightbox along with disabling the scroll while it's open,
    along with disabling the respective buttons from the first and last lightbox image,
    and setting the tab index to -1 in order to prevent the gallery images from being tabbed
*/
function openLightBox(e) {
    // checks if the target is an image within the gallery
    if(e.target.tagName === 'IMG') {
        document.body.classList.add('lightbox-no-scroll');

        // stores the value of the current image that was clicked on from the array
        currentImg = galleryImgArray.indexOf(e.target);

        setLightboxImg();
        
        overlay.style.transition = 'opacity 150ms ease';

        overlay.classList.add('active');
        lightbox.classList.add('active');

        // loops through each element and sets the tab index accordingly
        navElements.forEach(link => {
            link.setAttribute('tabIndex', '-1');
        });

        galleryImgArray.forEach(img => {
            img.setAttribute('tabIndex', '-1');
        });

        lightboxBtns();
    };
};

// hides one of the lightbox buttons depending on the position of the image within the array
function lightboxBtns() {
    if(currentImg === 0) {
        previousBtn.classList.remove('active');
    } else {
        previousBtn.classList.add('active');
    };

    if(currentImg === galleryImgArray.length - 1) {
        nextBtn.classList.remove('active');
    } else {
        nextBtn.classList.add('active');
    };
};

// preloads the adjacent photos within the lightbox
function preloadAdjacentImgs() {
    if (currentImg > 0) {
        preloadPreviousImg.src = galleryImgArray[currentImg - 1].src;
    };

    if (currentImg < galleryImgArray.length - 1) {
        preloadNextImg.src = galleryImgArray[currentImg + 1].src;
    };
};

/*
    closes the lightbox by removing the active classes and re-enabling scroll,
    while also setting the tab index back to 0 to allow the images in the gallery to be tabbed to
*/
function closeLightbox () {
    document.body.classList.remove('lightbox-no-scroll');
    overlay.style.transition = 'none';
    overlay.classList.remove('active');
    lightbox.classList.remove('active');
    lightbox.src = '';
    lightbox.srcset = '';
    previousBtn.classList.remove('active');
    nextBtn.classList.remove('active');

    // loops through each element and sets the tab index accordingly
    navElements.forEach(link => {
        link.setAttribute('tabIndex', 0);
    });

    galleryImgArray.forEach(img => {
        img.setAttribute('tabIndex', 0);
    });
};

// lightbox click event listeners for mouse
gallery.addEventListener('click', (e) => {
    openLightBox(e);
    preloadAdjacentImgs();
});

overlay.addEventListener('click', () => {
    closeLightbox();
});

previousBtn.addEventListener('click', () => {
    currentImg--;

    setLightboxImg();
    lightboxBtns();
    preloadAdjacentImgs();
});

nextBtn.addEventListener('click', () => {
    currentImg++;

    setLightboxImg();
    lightboxBtns();
    preloadAdjacentImgs();
});

// lightbox click event listeners for keyboard
window.addEventListener('keydown', (e) => {
    if(e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
    };

    if(e.key === 'ArrowLeft' && lightbox.classList.contains('active')) {
        if(currentImg === 0) {
            return;
        };

        currentImg--;

        setLightboxImg();
        lightboxBtns();
        preloadAdjacentImgs();

    } else if (e.key === 'ArrowRight' && lightbox.classList.contains('active')) {
        if(currentImg === galleryImgArray.length - 1) {
            return;
        };

        currentImg++;

        setLightboxImg();
        lightboxBtns();
        preloadAdjacentImgs();
    };
});

gallery.addEventListener('keydown', (e) => {
    if(e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightBox(e);
        preloadAdjacentImgs();
    };
});

// keeps track of where the screen tapping starts and ends, along with setting img zoom to false
let screenTapStart;
let screenTapEnd;
let imgZoom = false;

lightbox.addEventListener('touchstart', (e) => {
    // keeps track of whether more than one finger is on the screen
    if(e.touches.length > 1) {
        imgZoom = true;
        return;
    } else {
        imgZoom = false;
    };

    // the position of the initial tap on the screen
    screenTapStart = e.touches[0].clientX;
});

lightbox.addEventListener('touchend', (e) => {
    if(e.touches.length > 0 || imgZoom) {
        return;
    };

    // the position of where the finger lifted off the screen
    screenTapEnd = e.changedTouches[0].clientX;

    // checks if the swipe moved at least 100px to the left
    if(screenTapEnd - screenTapStart <= -100 && lightbox.classList.contains('active')) {
        
        if(currentImg === galleryImgArray.length - 1) {
            return;
        };

        currentImg++;

        setLightboxImg();
        preloadAdjacentImgs();

    // checks if the swipe moved at least 100px to the right
    } else if(screenTapEnd - screenTapStart >= 100 && lightbox.classList.contains('active')) {
        
        if(currentImg === 0) {
            return;
        };

        currentImg--;

        setLightboxImg();
        preloadAdjacentImgs();
    };

    // reseting this back to false after the swipe is finished to prevent swipe issues
    imgZoom = false;
});