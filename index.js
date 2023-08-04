const initSlider = () => {
    return new Swiper(document.getElementById('slider-video'), {
        slidesPerView: 4,
        preloadImages: true,
        direction: 'horizontal',
        freeMode: true,
        speed: 400,
        spaceBetween: 10,
        loop: false,
        grabCursor: true,
        breakpoints: {
            320: {
                slidesPerView: 1,
                spaceBetween: 20,

            },
            768: {
                slidesPerView: 2,
                spaceBetween: 10,

            },
            900: {
                slidesPerView: 4,
                spaceBetween: 10,
            }
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        scrollbar: {
            el: '.swiper-scrollbar',
        },
    });
}

const addModalOpenHandlers = () => {
    const videoList = document.querySelectorAll('.swiper-slide');
    const modal = modalModule();

    videoList.forEach((video, index) => {
        video.addEventListener('click', (e) => {
            e.stopPropagation();

            modal.open(index);
        })
    });
}

function modalModule() {
    const modal = document.querySelector('[data-modal]');

    const createModalContent = (activeSlide) => {
        const slider = document.querySelector('.swiper');
        const modalContent = document.querySelector('[data-modal-content]');
        const cloneSlider = slider.cloneNode(true);
        cloneSlider.querySelector('.swiper-button-prev').remove();
        cloneSlider.querySelector('.swiper-button-next').remove();
        modalContent.appendChild(cloneSlider);

        const swiper = new Swiper(cloneSlider, {
            initialSlide: activeSlide,
            preloadImages: true,
            direction: 'horizontal',
            freeMode: false,
            speed: 400,
            slidesPerView: 1,
            spaceBetween: 10,
            loop: false,
            grabCursor: true,
            observer: true,

            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },

            navigation: {
                nextEl: '.dhs-next',
                prevEl: '.dhs-prev',
            },

        });
        const players = Array.from(modalContent.querySelectorAll('.swiper-slide iframe'))
            .map((iframe) => new Vimeo.Player(iframe));

        let activeVideo = players[activeSlide];

        swiper.on('slideChange', () => {
            if (activeVideo) {
                activeVideo.pause();
            }

            activeVideo = players[swiper.activeIndex];
            activeVideo.play();
        });

        activeVideo.play();
    }

    const close = () => {
        const modalContent = document.querySelector('[data-modal-content]');
        modal.close();
        modalContent.innerHTML = '';
    }

    const open = (index) => {
        createModalContent(index);
        modal.showModal();
    }

    window.addEventListener('click', (e) => {
        const modalContent = document.querySelector('[data-modal-content]');

        if (modalContent === e.target || modalContent.contains(e.target)) {
            return;
        }

        close();
    })

    return {
        open
    }
}

function init() {
    initSlider();
    addModalOpenHandlers();
}

document.addEventListener("DOMContentLoaded", (event) => {
    init();
});
