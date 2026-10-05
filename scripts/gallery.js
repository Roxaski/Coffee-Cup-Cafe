const navElements = document.querySelectorAll('nav a');
const gallery = document.querySelector('.gallery');
const galleryImgs = document.querySelectorAll('.gallery img');
const overlay = document.querySelector('.overlay');
const lightboxImg = document.querySelector('.lightbox img');
const previousBtn = document.querySelector('.previous');
const nextBtn = document.querySelector('.next');

// keeps track of which image was clicked
let currentImg = 0;

// creates new image variables in order to preload them when the lightbox is active
let preloadPreviousImg = new Image();
let preloadNextImg = new Image();

// creates an array of the images within the gallery
const galleryImgArray = Array.from(galleryImgs);

// sets the lightbox images src and srcset in order to provide the appropriate image
function setLightboxImg() {
    const img = galleryImgArray[currentImg];
    
    lightboxImg.srcset = img.srcset;
    lightboxImg.src = img.src;
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
        
        // overlay transition is set here to stop firefox from causing a brief flash from happening
        overlay.style.transition = 'opacity 150ms ease';
        overlay.classList.add('active');
        lightboxImg.classList.add('active');

        // loops through each element and sets the tab index accordingly
        navElements.forEach(link => {
            link.setAttribute('tabIndex', '-1');
        });

        galleryImgArray.forEach(img => {
            img.setAttribute('tabIndex', '-1');
        });

        // only displays the lightbox buttons once the lightbox img is loaded
        lightboxImg.onload = lightboxBtns;
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
        preloadPreviousImg.sizes = lightboxImg.sizes;
        preloadPreviousImg.srcset = galleryImgArray[currentImg - 1].srcset;
        preloadPreviousImg.src = galleryImgArray[currentImg - 1].src;
    };

    if (currentImg < galleryImgArray.length - 1) {
        preloadNextImg.sizes = lightboxImg.sizes;
        preloadNextImg.srcset = galleryImgArray[currentImg + 1].srcset;
        preloadNextImg.src = galleryImgArray[currentImg + 1].src;
        
    };
};

// stores the button timeout when zooming out of a lightbox image to display buttons again
let btnTimer;

// closes the lightbox, also resets values and remove classes
function closeLightbox () {
    document.body.classList.remove('lightbox-no-scroll');
    overlay.style.transition = 'none';
    overlay.classList.remove('active');
    lightboxImg.classList.remove('zoom');
    lightboxImg.style.transform = '';
    imgPositionX = 0;
    imgPositionY = 0;
    lightboxImg.classList.remove('active');
    lightboxImg.srcset = '';
    lightboxImg.src = '';
    previousBtn.classList.remove('active');
    nextBtn.classList.remove('active');

    // loops through each element and sets the tab index accordingly
    navElements.forEach(link => {
        link.setAttribute('tabIndex', 0);
    });

    galleryImgArray.forEach(img => {
        img.setAttribute('tabIndex', 0);
    });

    // clears the timeout when the lightbox is closed
    clearTimeout(btnTimer);
};

// listens for a double click on the lightbox image and toggles the zoom class accordingly
lightboxImg.addEventListener('dblclick', () => {
    lightboxImg.classList.toggle('zoom');

    // clears the timer before starting a new one
    clearTimeout(btnTimer);

    // checks if the image contains the zoom class and removes the buttons accordingly
    if(lightboxImg.classList.contains('zoom')) {
        previousBtn.classList.remove('active');
        nextBtn.classList.remove('active');
    } else {
        // else it only shows appropriate ones from the function that was called after a 300ms delay
        btnTimer = setTimeout(() => {
            lightboxBtns();
        }, 300);
    };
});

// lightbox click event listeners for mouse
gallery.addEventListener('click', (e) => {
    openLightBox(e);
    preloadAdjacentImgs();
});

overlay.addEventListener('click', () => {
    closeLightbox();
});

previousBtn.addEventListener('click', () => {
    if(lightboxImg.classList.contains('zoom')) {
        return;
    };

    currentImg--;

    setLightboxImg();
    lightboxBtns();
    preloadAdjacentImgs();
});

nextBtn.addEventListener('click', () => {
    if(lightboxImg.classList.contains('zoom')) {
        return;
    };

    currentImg++;

    setLightboxImg();
    lightboxBtns();
    preloadAdjacentImgs();
});

// lightbox click event listeners for keyboard
window.addEventListener('keydown', (e) => {
    if(e.key === 'Escape' && lightboxImg.classList.contains('active')) {
        closeLightbox();
    };

    if(lightboxImg.classList.contains('zoom')) {
        return;
    };

    if(e.key === 'ArrowLeft' && lightboxImg.classList.contains('active')) {
        if(currentImg === 0) {
            return;
        };

        currentImg--;

        setLightboxImg();
        lightboxBtns();
        preloadAdjacentImgs();
    } 
    else if (e.key === 'ArrowRight' && lightboxImg.classList.contains('active')) {
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

let screenTapStartX;
let screenTapStartY;
let screenTap;
let screenTapEnd;
let imgPositionX = 0;
let imgPositionY = 0;
let currentPositionX;
let currentPositionY;
let tapMovement = false;

lightboxImg.addEventListener('touchstart', (e) => {
    // the position of the initial tap on the screen for both x and y axis
    screenTapStartX = e.touches[0].clientX;
    screenTapStartY = e.touches[0].clientY;

    // sets the initial value of tap movement to false
    tapMovement = false;

    // adds a class to stop the image from having a transition while it's zoomed
    lightboxImg.classList.add('drag');
});

lightboxImg.addEventListener('touchmove', (e) => {
    // updates this to true if there's any finger movement
    tapMovement = true;

    if(!lightboxImg.classList.contains('zoom')) {
        return;
    };

    // gets the position of where the screen was tapped for both x and y axis
    currentPositionX = e.touches[0].clientX;
    currentPositionY = e.touches[0].clientY;

    // stores the value of how much the image moved, by calculating the current position of x and y minus where the screen was initially tapped
    let imgMovementX = currentPositionX - screenTapStartX;
    let imgMovementY = currentPositionY - screenTapStartY;

    // sets transform and scale onto the lightbox image by calculating the position of the image plus how much it's moved from it's position
    lightboxImg.style.transform = `translate(${imgPositionX + imgMovementX}px, ${imgPositionY + imgMovementY}px) scale(2)`;
});

lightboxImg.addEventListener('touchend', (e) => {
    // removes the drag class to allow the image to transition while it's zoomed
    lightboxImg.classList.remove('drag');

    // calculates and stores the value of how far the image travelled from the position of 0 on the x and y axis
    imgPositionX = imgPositionX + (e.changedTouches[0].clientX - screenTapStartX);
    imgPositionY = imgPositionY + (e.changedTouches[0].clientY - screenTapStartY);

    // stores the value of the current time in order to calculate the difference in between taps
    let currentTapTime = Date.now();

    // tap movement is true the it sets the screen tap variable back to 0 in order to prevent tapping screen issues
    if(tapMovement) {
        screenTap = 0;
    // checks if the difference in screen taps was equal to or less than 300 otherwise it just sets it to the current tap time
    } else if (currentTapTime - screenTap <= 300) {
        lightboxImg.classList.toggle('zoom');
        screenTap = 0;
    } else {
        screenTap = currentTapTime;
    };

    // if the image isn't zoomed in then sets the transform to an empty string to remove scale(2), else it just returns early
    if(!lightboxImg.classList.contains('zoom')) {
        lightboxImg.style.transform = '';
        // resets the position of the image so that the next zoom starts centred
        imgPositionX = 0;
        imgPositionY = 0;
    }
    else {
        return;
    };

    // the position of where the finger lifted off the screen
    screenTapEnd = e.changedTouches[0].clientX;

    // checks if the swipe moved at least 100px to the left
    if(screenTapEnd - screenTapStartX <= -100 && lightboxImg.classList.contains('active')) {
        
        if(currentImg === galleryImgArray.length - 1) {
            return;
        };

        currentImg++;

        setLightboxImg();
        preloadAdjacentImgs();
    }
    // checks if the swipe moved at least 100px to the right
    else if(screenTapEnd - screenTapStartX >= 100 && lightboxImg.classList.contains('active')) {

        if(currentImg === 0) {
            return;
        };

        currentImg--;

        setLightboxImg();
        preloadAdjacentImgs();
    };
});