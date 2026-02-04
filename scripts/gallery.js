const gallery = document.querySelector('.gallery');
const galleryImgs = document.querySelectorAll('.gallery img');
const galleryImgsArray = Array.from(galleryImgs);
const lightbox = document.querySelector('.lightbox img');
const lightboxSizes = '(max-width: 765px) 90vw, 600px';
const previousBtn = document.querySelector('.previous');
const nextBtn = document.querySelector('.next');
const overlay = document.querySelector('.overlay');
const navElements = document.querySelectorAll('nav a, nav button');

// stores the index of the currently displayed image
let currentImage;
// stores the value of wether the lightbox is open or not
let isLightboxOpen = false;

// listens out for a click on the gallery
gallery.addEventListener('click', (e) => {
    // check if the click is on a gallery image
    if (e.target.tagName === 'IMG') {
        // checks which image was clicked from the array of gallery images
        currentImage = galleryImgsArray.indexOf(e.target);

        displayOverlay();
        imagePreview();
        preload(currentImage + 1);
        preload(currentImage - 1);
    };
});

// listens out for the enter key on the gallery
gallery.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.tagName === 'IMG') {
        currentImage = galleryImgsArray.indexOf(e.target);

        displayOverlay();
        imagePreview();
        preload(currentImage + 1);
        preload(currentImage - 1);
    };
});

// preloads the previous and next image
function preload(imageIndex) {
    // checks if the image is within the length of the gallery 
    if (imageIndex >= 0 && imageIndex < galleryImgs.length) {
        const img = galleryImgs[imageIndex];
        const preloadImg = new Image();

        // sets the image src, srcset and size for the browser to preload
        preloadImg.srcset = img.srcset;
        preloadImg.sizes = lightboxSizes;
        preloadImg.src = img.src;
    };
};

// displays an overlay
function displayOverlay() {
    isLightboxOpen = true;
    document.body.style.overflow = 'hidden';
    overlay.style.display = 'block';

    // prevents the gallery images from being focused while the lightbox is open
    galleryImgs.forEach(img => {
        img.setAttribute('tabindex', '-1');
    });

    // prevents the nav from being focused while the lightbox is open
    navElements.forEach(element => {
        element.setAttribute('tabindex', '-1');
    });
};

// displays image & buttons
function imagePreview() {
    lightbox.classList.add('active');

    // lightbox should use more appropriate image sizes
    lightbox.srcset = galleryImgs[currentImage].srcset;
    lightbox.sizes = lightboxSizes;
    lightbox.alt = galleryImgs[currentImage].alt;

    // fallback in case srcset and sizes isn't supported on the browser
    lightbox.src = galleryImgs[currentImage].src;

    displayGalleryBtns();
};

// removes the buttons from the first and last lightbox images
function displayGalleryBtns() {
    if(currentImage == 0) {
        previousBtn.classList.remove('visible');
    } else {
        previousBtn.classList.add('visible');
    };

    if(currentImage == galleryImgs.length - 1) {
        nextBtn.classList.remove('visible');
    } else {
        nextBtn.classList.add('visible');
    };
};

// displays next image
nextBtn.addEventListener('click', () => {
    currentImage ++;
    imagePreview();
    preload(currentImage +1);
});

// displays previous image
previousBtn.addEventListener('click', () => {
    currentImage --;
    imagePreview();
    preload(currentImage - 1);
});

// removes overlay, image buttons, src and srcset along with alt
function closeOverlay() {
    isLightboxOpen = false;
    document.body.style.overflow = 'auto';
    lightbox.src = '';
    lightbox.srcset = '';
    lightbox.alt = '';
    lightbox.classList.remove('active');
    overlay.style.display = 'none';
    nextBtn.classList.remove('visible');
    previousBtn.classList.remove('visible');

    // allows the gallery images to be focused
    galleryImgs.forEach(img => {
        img.setAttribute('tabindex', '0');
    });

    // allows the nav to be focused
    navElements.forEach(element => {
        element.removeAttribute('tabindex');
    });
};

// closes the overlay
overlay.addEventListener('click', () => {
    closeOverlay();
});

// stores the value of the timeout ID which is used to delay the image resize from triggering too often
let timeoutID;

window.addEventListener('resize', () => {
    // clears the timeoutID after it's initially triggered
    clearTimeout(timeoutID);

    // triggers the timeout only if the lightbox is displayed
    if (isLightboxOpen) {
        // added active class to gallery to help with flickering during resize
        gallery.classList.add('active');

        // re-render image then show the content after a short delay set by the timeout below
        timeoutID = setTimeout(() => {
            imagePreview();

            // removes the active class on the next repaint
            requestAnimationFrame(() => {
                gallery.classList.remove('active');
            });
        }, 100); // 100ms delay before the next resize can happen
    }
});

// stores the value of where the finger touches the screen
let touchStart;

lightbox.addEventListener('touchstart', (e) => {
    // stops the default event from happening (swiping from the edge of the screen makes the page go back)
    e.preventDefault();
    
    // returns the location of where the touch started on the X-axis
    touchStart = e.touches[0].clientX;
});

//  stores the value of when the finger stops on the screen
let touchEnd;

lightbox.addEventListener('touchend', (e) => {
    // returns the location of where touch ended on the X-axis
    touchEnd = e.changedTouches[0].clientX;

    // defines the minimum distance needed to swipe for next and previous images
    const minSwipe = 100;
    // calculates the value to show the next or previous image
    const swipeToChangeImg = touchStart - touchEnd;

    // if you swipe to the left and aren't on the last image, then it displays the next image
    if(swipeToChangeImg > minSwipe && currentImage < galleryImgs.length - 1) {
        currentImage ++;
        imagePreview();
        preload(currentImage + 1);
    // else if you swipe to the right and aren't on the first image, then it displays the previous image
    } else if (swipeToChangeImg < -minSwipe && currentImage > 0) {
        currentImage --;
        imagePreview();
        preload(currentImage - 1);
    };
});

// image navigation using the arrows keys
window.addEventListener('keydown', (e) => {
    // checks if the overlay is open, if so it runs the navigation code below
    if (isLightboxOpen) {
        // navigates to the next image using the righ arrow, enter or space bar keys ( space bar works when the buttons are focused )
        if ((e.key === 'ArrowRight' || ((e.key === 'Enter' || e.key === ' ') 
            && document.activeElement === nextBtn)) 
            && currentImage < galleryImgs.length - 1) {
            e.preventDefault();
            currentImage++;
            imagePreview();
            preload(currentImage + 1);
        } 
        // navigates to the previous image using the righ arrow, enter or space bar keys ( space bar works when the buttons are focused )
        else if ((e.key === 'ArrowLeft' || ((e.key === 'Enter' || e.key === ' ')
            && document.activeElement === previousBtn)) 
            && currentImage > 0) {
            e.preventDefault();
            currentImage--;
            imagePreview();
            preload(currentImage - 1);
        }
        // closes the overlay with the escape key
        else if (e.key === 'Escape') {
            closeOverlay();
        };
    };
});