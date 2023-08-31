import {useEffect} from "react";

const IMAGE_WIDTH_OFFSET = 180;

// Маршруты
const ROUTES = [
  { 
    name: 'kievsky', 
    circles: [
      { bottom: '27.5%', right: '21.4%', hoverImgSrc: '/images/kievskyPoint.svg' },
      { bottom: '69.5%', right: '62.4%', hoverImgSrc: '/images/kievskyPoint.svg '},
    ],
  }
];

const initVideos = () => {

  // Определяем, является ли устройство мобильным
  const isMobile = window.innerWidth < 481;

  // Для каждого элемента с классом "bg-video"
  document.querySelectorAll(".bg-video").forEach((el, i) => {
    // Создаем элемент "source" и задаем атрибуты для видеофайла
    const source = document.createElement("source");
    source.setAttribute(
      "src",
      `/${i + 1}${isMobile ? "mob" : "video"}.mp4`
    );
    source.setAttribute("type", "video/mp4");

    // Добавляем элемент "source" внутрь видеоэлемента
    el.appendChild(source);
  });
};

function App() {
  useEffect(() => {
    let onVideoEndListener = null;
    let touchstartY = 0;
    let isEndVideos = false;

    const infoElem = document.querySelector(".info_block");
    const videoContent = document.querySelector(".video_content");
    const siteContent = document.querySelector(".site_content");

    initVideos();

    const finishVideosBlock = () => {
      videoContent.style.display = "none";
      siteContent.style.display = "block";
      isEndVideos = true;
    }

    // Обработчик для переключения видеофрагментов
    const switchHandler = (direction) => {
      // TODO: Избавиться от direction вовсе
      if (direction === "prev" || isEndVideos) {
        return;
      }
      if (onVideoEndListener) {
        return;
      }

      const activeBlock = document.querySelector(".js-number-block.active");
      const activeNumber = Number(activeBlock.getAttribute("data-number"));

      const nextActiveNumber =
          direction === "next" ? activeNumber + 1 : activeNumber - 1;

      console.log("nextActiveNumber", nextActiveNumber);

      // Верхний край
      if (!nextActiveNumber) {
        return;
      }

      const nextVideo = document.querySelector(
          `.js-number-block[data-number="${nextActiveNumber}"]`
      );

      // Нижний край
      if (!nextVideo) {
        finishVideosBlock();
        return;
      }

      const doSwitch = () => {
        activeBlock.classList.remove("active");
        nextVideo.classList.add("active");

        if (nextVideo.hasAttribute("data-info-text")) {
          // добавить проверку на дата атрибуты и показывать один блок с разным контентом из атрибутов
          infoElem.classList.add("active");
          infoElem.innerHTML = `
            <div class="card">
              <div class="card_marker">
                <img class="card_marker-img" src="${nextVideo.getAttribute("data-info-src")}" alt="snow">
              </div>
              <div class="card_descr">
                <p class="card_descr-text">${nextVideo.getAttribute("data-info-text")}</p>
                <p class="card_descr-title">${nextVideo.getAttribute("data-info-title")}</p>
              </div>
            </div>
          `;
        } else {
          infoElem.classList.remove("active");
          infoElem.innerHTML = ""; // Удалить контент из infoElem
        }

        // Если видео транзитное - дождемся его завершения и симитируем прокрутку колесика дальше
        if (nextVideo.hasAttribute("data-transit")) {
          if (nextVideo.hasAttribute("loop")) {
            throw new Error("Транзитное видео не может быть зациклено");
          }

          onVideoEndListener = () => {
            nextVideo.removeEventListener("ended", onVideoEndListener);
            onVideoEndListener = null;

            switchHandler("next");
          };
          nextVideo.addEventListener("ended", onVideoEndListener);
        }
      };

      // Если текущий активный блок - незаконченное видео, тогда ждем завершения и переключаем блок
      if (
          activeBlock.tagName === "VIDEO" &&
          activeBlock.currentTime < activeBlock.duration
      ) {
        // Удаляем у активного блока цикличность чтобы дождаться события его завершения
        activeBlock.removeAttribute("loop");

        // Слушатель события завершения видео
        onVideoEndListener = () => {
          activeBlock.removeEventListener("ended", onVideoEndListener);
          onVideoEndListener = null;

          // Возвращаем атрибут цикличности после завершения и ставим на старт
          activeBlock.setAttribute("loop", "true");
          activeBlock.currentTime = 0;

          doSwitch();
        };

        activeBlock.addEventListener("ended", onVideoEndListener);
      } else {
        doSwitch();
      }
    };

    // // Добавляем обработчик прокрутки на блок siteContent
    // siteContent.addEventListener("scroll", () => {
    //   // Если прокрутка дошла до верха блока siteContent
    //   if (siteContent.scrollTop === 0) {
    //     // Показываем блок с видео и скрываем блок site_content
    //     videoContent.style.display = "block";
    //     siteContent.style.display = "none";
    //   }
    // });

    // Добавляем обработчики для переключения видеофрагментов при прокрутке и событиях touch
    document.addEventListener("wheel", (e) => switchHandler("next"));
    document.addEventListener("touchstart", function (e) {
      touchstartY = e.touches[0].clientY;
    });
    document.addEventListener("touchend", function (e) {
      const touchEndY = e.changedTouches[0].clientY;
      touchEndY - touchstartY < 0
          ? switchHandler("next")
          : switchHandler("prev");
    });

    // Костыль для переключения видео (не зацикленных)
    // function processActiveBlocks() {
    //   const activeBlock2 = document.querySelectorAll(".js-number-block");
    //   activeBlock2.forEach((e) => {
    //     if (e.hasAttribute("data-transit") && e.classList.contains("active")) {
    //       console.log(e);
    //       switchHandler("next");
    //     }
    //   });
    // }
    // Вызывать функцию, пока videoContent не станет невидимым
    // const intervalId = setInterval(() => {
    //   if (getComputedStyle(videoContent).display === 'none') {
    //     clearInterval(intervalId); // Остановить вызов функции
    //   } else {
    //     processActiveBlocks();
    //   }
    // }, 3000);

    // Пропустить превью с видео
    const leavePrev = document.querySelector(".video_content .leave_button");
    leavePrev.addEventListener("click", () => {
      finishVideosBlock();
    });





    // Логика страницы после блоков видео

    const fullimageEl = document.querySelector('#fullimage');
    const fullimageWrapper = document.querySelector('.fullimage-wrapper');

    const routeImages = document.querySelectorAll('img[data-route]:not(.img-disabled)')
    const routeBtn = document.querySelector('.btn[data-route]')

    const cardFaqs = document.querySelectorAll('.card-faq');

    // Листнер для закрытия fullimage
    document.addEventListener('click', (e) => {
      e.preventDefault();

      // клик на изображение маршрута
      if (e.target.hasAttribute('data-route')) {
        return;
      }

      // клик за край fullimage
      if (!fullimageEl.contains(e.target)) {
        fullimageEl.classList.remove('fullimage-active');
        fullimageEl.classList.add('fullimage-disabled');
      }
    });

    // добавление кружка-станции
    const handleAddCircle = ({ bottom, right, hoverImgSrc }) => {
      const isMobile = window.innerWidth <= 440;
      const circleEl = document.createElement('div');
      circleEl.classList.add('circle', 'pos-abs', 'cursor-pointer');
      circleEl.style.bottom = bottom;
      circleEl.style.right = right;

      const hoverImg = document.createElement('img');
      hoverImg.classList.add('pos-abs', 'circle-hover-img');
      hoverImg.src = hoverImgSrc;

      hoverImg.style.setProperty('bottom', `calc(${bottom} + 3%`);
      const hoverImgRight = isMobile ? `${right}` : `calc(${right} - ${IMAGE_WIDTH_OFFSET}px`;
      hoverImg.style.setProperty('right', hoverImgRight);
      fullimageWrapper.appendChild(hoverImg);

      circleEl.addEventListener('mouseover', (e) => {
        e.preventDefault();
        hoverImg.classList.add('opacity-1');
      })

      circleEl.addEventListener('mouseleave', (e) => {
        e.preventDefault();
        hoverImg.classList.remove('opacity-1');
      })

      fullimageWrapper.appendChild(circleEl);
    }

    // добавление изображения маршрута
    const handleOpenRoute = ({ src, routeName }) => {
      fullimageWrapper.innerHTML = '';
      fullimageEl.classList.remove('fullimage-disabled');
      fullimageEl.classList.add('fullimage-active');

      const routeImg = document.createElement('img');
      routeImg.src = src;
      routeImg.classList.add('img-responsive');
      fullimageWrapper.appendChild(routeImg);
      const currRoute = ROUTES.find((route) => route.name === routeName);
      currRoute.circles.forEach((circle) => {
        handleAddCircle(circle)
      });
    }

    // Листнеры на картинках с маршрутами
    routeImages.forEach((routeEl) => {
      routeEl.addEventListener('click', (e) => {
        e.preventDefault();
        handleOpenRoute({ src: e.target.src, routeName: routeEl.dataset.route })
      })
    });

    // Листнер на кнопке с маршрутами
    routeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const routeName = e.target.dataset.route;
      const src = document.querySelector(`img[data-route='${routeName}'`).src;
      handleOpenRoute({ src, routeName });
    });

    // Переворачивание карточки справочная информация
    cardFaqs.forEach((cardFaq) => {
      cardFaq.addEventListener('click', (e) => {
        e.preventDefault();
        const frontSide = cardFaq.querySelector('.card-body-active');
        const backSide = cardFaq.querySelector('.card-body-disabled');

        if (!backSide || !frontSide) {
          return;
        }

        frontSide.classList.remove('card-body-active');
        frontSide.classList.add('card-body-disabled');

        backSide.classList.remove('card-body-disabled');
        backSide.classList.add('card-body-active');
      });
    })


    // const sinichkaVue = document.querySelector('.vue_button');
    // const vectary = document.querySelector('.vectary');
    // const contentMain = document.getElementById('main');
    // const LeaveButton = document.querySelector('.vectary .leave_button');
    //
    // sinichkaVue.addEventListener('click', () => {
    //   vectary.classList.add('visible');
    //   contentMain.style.display = 'none';
    // });
    //
    // LeaveButton.addEventListener('click', () => {
    //   vectary.classList.remove('visible');
    //   contentMain.style.display = 'block';
    // });




    // Плавное переключение секций на весь экран при движении колеса мыши
    let sectionVideoEndListener = null;
    const sections = document.querySelectorAll('section');
    let currentSectionIndex = 0;
    let isScrolling = false;

// Ожидание события "wheel" (прокрутка колеса мыши)
    document.addEventListener('wheel', (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (sectionVideoEndListener) {
        return;
      }

      if (!isScrolling) {
        isScrolling = true;

        // Определение направления прокрутки
        const delta = Math.sign(event.deltaY);

        // Изменение индекса текущей секции в зависимости от направления
        if (delta > 0 && currentSectionIndex < sections.length - 1) {
          currentSectionIndex++;
        } else if (delta < 0 && currentSectionIndex > 0) {
          currentSectionIndex--;
        }

        const currentSection = sections[currentSectionIndex];

        // Вызов функции для плавной анимированной прокрутки
        scrollToSection(currentSection);

        // Установка таймера для предотвращения множественных срабатываний
        setTimeout(() => {
          isScrolling = false;
        }, 1000); // Здесь задержка, чтобы избежать множественных срабатываний
      }
    }, { passive: false });

// Функция для анимированной прокрутки к указанной секции
    function scrollToSection(section) {
      const targetPosition = section.offsetTop; // Позиция верхней границы секции
      const currentPosition = window.scrollY; // Текущая позиция прокрутки
      const distance = targetPosition - currentPosition; // Расстояние до цели
      const startTime = performance.now(); // Время начала анимации
      const duration = 1000; // Длительность анимации в миллисекундах

      // Функция для анимации, использующая requestAnimationFrame
      function step(timestamp) {
        const currentTime = timestamp - startTime; // Прошедшее время
        const progress = Math.min(currentTime / duration, 1); // Прогресс анимации (0-1)
        const easing = easeInOutQuad(progress); // Функция для сглаживания анимации
        window.scrollTo(0, currentPosition + distance * easing); // Прокрутка

        // Продолжение анимации, если не достигнут конец анимации
        if (currentTime < duration) {

          const video = section.querySelector('.section-video');

          if (video) {
            video.currentTime = 0;
            video.classList.add('section-video_active');

            sectionVideoEndListener = () => {
              video.classList.remove('section-video_active');
              video.removeEventListener("ended", sectionVideoEndListener);
              sectionVideoEndListener = null;
            };

            video.addEventListener("ended", sectionVideoEndListener);
          }

          requestAnimationFrame(step);
          // return;
        }

        // const video = section.querySelector('.section-video');
        //
        // if (video) {
        //   video.currentTime = 0;
        //   video.classList.add('section-video_active');
        //
        //   sectionVideoEndListener = () => {
        //     video.classList.remove('section-video_active');
        //     video.removeEventListener("ended", sectionVideoEndListener);
        //     sectionVideoEndListener = null;
        //   };
        //
        //   video.addEventListener("ended", sectionVideoEndListener);
        // }
      }

      // Запуск анимации
      requestAnimationFrame(step);
    }

// Функция для сглаживания анимации прокрутки (функция easing)
    function easeInOutQuad(t) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }


  }, []);
  return <></>;
}

export default App;
