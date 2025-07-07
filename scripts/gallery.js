const gallery = document.querySelectorAll('.gallery img');
const lightbox = document.querySelector('.lightbox img');
const previousBtn = document.querySelector('.previous');
const nextBtn = document.querySelector('.next');
const overlay = document.querySelector('.overlay');

// Stores the index of the currently displayed image
let currentImage;

// loop through each image in the gallery
gallery.forEach((img, index) => {

    img.addEventListener('click', () => {
        currentImage = index;

        displayOverlay();
        imagePreview();
        preload(currentImage +1);
        preload(currentImage -1);
    });

    // opens the selected image when pressing enter on keyboard
    img.addEventListener('keydown', (e) => {
        if(e.key === 'Enter') {
            currentImage = index;

            displayOverlay();
            imagePreview();
            preload(currentImage +1);
            preload(currentImage -1);
        };
    });
});

// preloads the previous and next image
function preload(imageIndex) {
    // checks if the image is within the length of the gallery 
    if (imageIndex >= 0 && imageIndex < gallery.length) {
        // creates a new image element, whose source is equal to that of the gallery position, + or - 1 when called
        new Image().src = gallery[imageIndex].src;
    };
};

// displays an overlay
function displayOverlay() {
    document.querySelector('body').style.overflow = 'hidden';
    overlay.style.display = 'block';
};

// displays image & buttons
function imagePreview() {
    lightbox.src = gallery[currentImage].src;
    lightbox.classList.add('active');

    displayGalleryBtns();
};

// removes the buttons from the first and last gallery img
function displayGalleryBtns() {
    if(currentImage == 0) {
        previousBtn.style.display = 'none';
    } else {
        previousBtn.style.display = 'block';
    };

    if(currentImage == gallery.length - 1) {
        nextBtn.style.display = 'none';
    } else {
        nextBtn.style.display = 'block';
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
    preload(currentImage -1);
});

// removes overlay, image and buttons
function closeOverlay() {
    document.querySelector('body').style.overflow = 'auto';
    lightbox.classList.remove('active');
    overlay.style.display = 'none';
    nextBtn.style.display = 'none';
    previousBtn.style.display = 'none';
};

overlay.addEventListener('click', () => {
    closeOverlay();
});

lightbox.addEventListener('touchstart', (e) => {
    // stops the default event from happening (swiping from the edge of the screenmakes the page go back)
    e.preventDefault();
    
    // returns the location of where the touch started on the X-axis
    touchStart = e.touches[0].clientX;
});

lightbox.addEventListener('touchend', (e) => {

    // returns the location of where touch ended on the X-axis
    touchEnd = e.changedTouches[0].clientX;

    const minSwipe = 100;
    const swipeToChangeImg = touchStart - touchEnd;

    if(swipeToChangeImg > minSwipe && currentImage < gallery.length - 1) {
        currentImage ++;
        imagePreview();
        preload(currentImage +1);

    } else if (swipeToChangeImg < -minSwipe && currentImage > 0) {
        currentImage --;
        imagePreview();
        preload(currentImage -1);
    };
});

// image navigation using the arrows keys
window.addEventListener('keydown', (e) => {
    if(overlay.style.display == 'block' && e.key == 'ArrowRight' &&  currentImage < gallery.length - 1) {
        currentImage ++;
        imagePreview();
        preload(currentImage +1);
    } else if (overlay.style.display == 'block' && e.key == 'ArrowLeft' && currentImage > 0) {
        currentImage --;
        imagePreview();
        preload(currentImage -1);
    } else if (e.key == 'Escape') {
        closeOverlay();
    };
});