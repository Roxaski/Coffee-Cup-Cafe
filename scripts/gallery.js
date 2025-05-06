const gallery = document.querySelectorAll('.gallery img');
const lightbox = document.querySelector('.lightbox img');
const previousBtn = document.querySelector('.previous');
const nextBtn = document.querySelector('.next');
const overlay = document.querySelector('.overlay');

// stores the value of the selected image
let currentImage;

// loop through each image in the gallery
gallery.forEach((img, index) => {

    img.addEventListener('click', () => {
        currentImage = index;

        displayOverlay();
        imagePreview();
    });
});

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
});

// displays previous image
previousBtn.addEventListener('click', () => {
    currentImage --;
    imagePreview();
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

    } else if (swipeToChangeImg < -minSwipe && currentImage > 0) {
        currentImage --;
        imagePreview();
    };
});

// displaying images using the arrow keys
window.addEventListener('keydown', (e) => {
    if(overlay.style.display == 'block' && e.key == 'ArrowRight' &&  currentImage < gallery.length - 1) {
        currentImage ++;
        imagePreview();
    } else if (e.key == 'ArrowLeft' && currentImage > 0) {
        currentImage --;
        imagePreview();
    } else if (e.key == 'Escape') {
        closeOverlay();
    };
});