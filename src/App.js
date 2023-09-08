import {useEffect} from "react";

const IMAGE_WIDTH_OFFSET = 180;

// Маршруты
const ROUTES = [
  {
    name: 'kievsky',
    circles: [
      { bottom: '27.5%', right: '21.4%', hoverImgSrc: '/images/kievskyPoint.svg' },
      { bottom: '69.5%', right: '62.4%', hoverImgSrc: '/images/kievskyPoint.svg '},
      { bottom: '38%', right: '41.5%', hoverImgSrc: '/images/kievskyPoint.svg' },
      { bottom: '47%', right: '32%', hoverImgSrc: '/images/kievskyPoint.svg '},
      { bottom: '53%', right: '27%', hoverImgSrc: '/images/kievskyPoint.svg '},
      { bottom: '52%', right: '17%', hoverImgSrc: '/images/kievskyPoint.svg '},
    ],
  }
];

// const initOneVideo = () => {
//
//   // Определяем, является ли устройство мобильным
//   const isMobile = window.innerWidth < 481;
//   console.log(isMobile);
//   console.log(window.innerWidth);
//
//   // Для каждого элемента с классом "bg-video"
//   document.querySelectorAll(".video-background").forEach((el, i) => {
//     // Создаем элемент "source" и задаем атрибуты для видеофайла
//     const source = document.createElement("source");
//     source.setAttribute(
//       "src",
//       `/${i + 1}${isMobile ? "mobile" : "video"}.mp4`
//     );
//     source.setAttribute("type", "video/mp4");
//
//     // Добавляем элемент "source" внутрь видеоэлемента
//     el.appendChild(source);
//   });
// };
//
// initOneVideo();


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
    // Логика Егора НАЧИНАЕТСЯ

    let onVideoEndListener = null;
    let touchstartY = 0;
    let isEndVideos = false;

    const infoElem = document.querySelector(".info_block");
    const videoContent = document.querySelector(".video_content");
    const siteContent = document.querySelector(".site_content");
    const contentNone = document.querySelectorAll('.video_active, section#pier-routes, section#sinichka-section, footer#footer');
    const firstSection = document.querySelector('section#pier-description');

    // if (videoContent) {
    //
    // }

    initVideos();

    const finishVideosBlock = () => {
      videoContent.style.display = "none";
      firstSection.classList.remove('fixed');
      contentNone.forEach((e) => {
        e.classList.remove('video_active');
      });
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

      function fadeVideo() {
        activeBlock.addEventListener("timeupdate", function() {
          const currentTime = activeBlock.currentTime;
          // console.log(currentTime);

          if (currentTime < 2) {
            videoContent.style.opacity = 1;
          } else if (currentTime >= 2 && currentTime < 2.5) {
            videoContent.style.opacity = 0.9;
          } else if (currentTime >= 2.5 && currentTime < 3) {
            videoContent.style.opacity = 0.6;
          } else if (currentTime >= 3 && currentTime < 3.5) {
            videoContent.style.opacity = 0.3;
          } else if (currentTime >= 4) {
            videoContent.style.opacity = 0;
          }
        });
        function onVideoEndListener2() {
          activeBlock.removeEventListener("ended", onVideoEndListener2);
          finishVideosBlock();
          WheelContentSmooth();
        }
        activeBlock.addEventListener("ended", onVideoEndListener2);
      }

      // Нижний край
      if (!nextVideo) {
        fadeVideo();
      }

      const doSwitch = () => {
        if (!nextVideo) {
          return;
        }
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



    // window.addEventListener("DOMContentLoaded", () => {
      // Пропустить превью с видео
      const leavePrev = document.querySelector(".video_content .leave_button");
      let allVideos = document.querySelectorAll(".bg-video");
      leavePrev.addEventListener("click", () => {
        allVideos.forEach((e, index) => {
          e.removeAttribute('loop');
          e.setAttribute('data-transit', '');
          e.addEventListener("ended", () => {
            switchHandler("next");
          });
          if (index === allVideos.length - 1) {
            e.addEventListener("timeupdate", function() {
              const currentTime = e.currentTime;
              if (currentTime < 30.5) {
                videoContent.style.opacity = 1;
              } else if (currentTime >= 30.5 && currentTime < 31) {
                videoContent.style.opacity = 0.9;
              } else if (currentTime >= 31 && currentTime < 31.5) {
                videoContent.style.opacity = 0.6;
              } else if (currentTime >= 31.5 && currentTime < 32) {
                videoContent.style.opacity = 0.3;
              } else if (currentTime >= 32) {
                videoContent.style.opacity = 0;
              }
            });
            e.addEventListener("ended", finishVideosBlock, WheelContentSmooth);
          }
        });
      });

      const progressBars = document.querySelectorAll('.progress-bar');
      allVideos.forEach((video, index) => {
        const progressBar = progressBars[index];
        let isProgressBarFull = false; // Флаг для отслеживания заполнения прогресс-бара

        video.addEventListener('timeupdate', () => {
          const currentTime = video.currentTime;
          const duration = video.duration;

          // Обновляем прогресс-бар, если он еще не достиг 100%
          if (!isProgressBarFull) {
            const progress = (currentTime / duration) * 100;
            progressBar.style.width = progress + '%';

            // Проверяем, достиг ли прогресс 100%
            if (progress >= 100) {
              isProgressBarFull = true;
              console.log('Прогресс достиг 100%');
            }
          }
        });

        // Событие pause срабатывает до события ended, из за этого первое видео не оставляло прогресс бар в 100% ширины при завершении с первого раза.
        // Код не успевал выполняться. Событие pause срабатывает раньше события ended
        video.addEventListener('ended', () => {
          if (!isProgressBarFull) {
            progressBar.style.width = '100%';
            isProgressBarFull = true;
            video.currentTime = 0;
          }
        });
      });
    // });

    // Добавляем обработчик прокрутки на блок siteContent
    siteContent.addEventListener("scroll", () => {
      // Если прокрутка дошла до верха блока siteContent
      if (siteContent.scrollTop === 0) {
        // Показываем блок с видео и скрываем блок site_content
        videoContent.style.display = "block";
        siteContent.style.display = "none";
      }
    });

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



    // const videoElements = document.querySelectorAll('.bg-video');
    // const progressBars = document.querySelectorAll('.progress-bar');
    //
    // videoElements.forEach((video, index) => {
    //   const progressBar = progressBars[index];
    //
    //   video.addEventListener('timeupdate', () => {
    //     const currentTime = video.currentTime;
    //     const duration = video.duration;
    //
    //     // Обновляем прогресс-бар
    //     const progress = (currentTime / duration) * 100;
    //     progressBar.style.width = progress + '%';
    //   });
    // });






    // Логика страницы после блоков видео

    const fullimageEl = document.querySelector('#fullimage');
    const fullimageWrapper = document.querySelector('.fullimage-wrapper');
    const routeImages = document.querySelectorAll('img[data-route]:not(.img-disabled)');
    // const routeBtn = document.querySelector('.btn[data-route]');
    // const cardFaqs = document.querySelectorAll('.card-faq');

    // Листнер для закрытия fullimage
    document.addEventListener('click', (e) => {
      e.preventDefault();

      // клик на изображение маршрута
      if (e.target.hasAttribute('data-route')) {
        return;
      }

      // клик за край fullimage
      // if (!fullimageEl.contains(e.target)) {
      //   fullimageEl.classList.remove('fullimage-active');
      //   fullimageEl.classList.add('fullimage-disabled');
      // }

      if (!fullimageWrapper.contains(e.target)) {
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
    // routeBtn.addEventListener('click', (e) => {
    //   e.preventDefault();
    //   const routeName = e.target.dataset.route;
    //   const src = document.querySelector(`img[data-route='${routeName}'`).src;
    //   handleOpenRoute({ src, routeName });
    // });



    // Переворачивание карточки справочная информация
    // cardFaqs.forEach((cardFaq) => {
    //   cardFaq.addEventListener('click', (e) => {
    //     e.preventDefault();
    //     const frontSide = cardFaq.querySelector('.card-body-active');
    //     const backSide = cardFaq.querySelector('.card-body-disabled');
    //
    //     if (!backSide || !frontSide) {
    //       return;
    //     }
    //
    //     frontSide.classList.remove('card-body-active');
    //     frontSide.classList.add('card-body-disabled');
    //
    //     backSide.classList.remove('card-body-disabled');
    //     backSide.classList.add('card-body-active');
    //   });
    // })


    // Выезжающее описание на синичке в вектари (на мобилке)
    const specsBlock = document.querySelector('.vectary .tech_speck');
    const specClick = document.querySelector('.vectary .tech_speck .tech_speck-click');
    const speckArrow = document.querySelector('.vectary .tech_speck .tech_speck-click .tech_speck-img');

    specClick.addEventListener('click', () => {
      specsBlock.classList.toggle('active');
      speckArrow.classList.toggle('active');
    });


    // Определение функции для анимированной прокрутки к указанной секции
    function scrollToSection(section) {
      const targetPosition = section.offsetTop; // Позиция верхней границы секции
      const currentPosition = window.scrollY; // Текущая позиция прокрутки
      const distance = targetPosition - currentPosition; // Расстояние до цели
      const startTime = performance.now(); // Время начала анимации
      const duration = 1000; // Длительность анимации в миллисекундах
      const video = section.querySelector('.section-video');

      if (video) {
        video.currentTime = 0;
        video.classList.add('section-video_active');
        video.play();

        const sectionVideoEndListenerOne = () => {
          video.classList.remove('section-video_active');
          video.removeEventListener("ended", sectionVideoEndListenerOne);
        };

        video.addEventListener("ended", sectionVideoEndListenerOne);
      }

      // Функция для анимации, использующая requestAnimationFrame
      function step(timestamp) {
        const currentTime = timestamp - startTime; // Прошедшее время
        const progress = Math.min(currentTime / duration, 1); // Прогресс анимации (0-1)
        const easing = easeInOutQuad(progress); // Функция для сглаживания анимации
        window.scrollTo(0, currentPosition + distance * easing); // Прокрутка

        // Продолжение анимации, если не достигнут конец анимации
        if (currentTime < duration) {
          requestAnimationFrame(step);
        }
      }
      // Запуск анимации
      requestAnimationFrame(step);
    }
    // Определение функции для сглаживания анимации прокрутки (функция easing)
    function easeInOutQuad(t) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    // Плавное переключение секций на весь экран при движении колеса мыши
    function WheelContentSmooth() {
      // let sectionVideoEndListener = null;
      let sections;
      let currentSectionIndex = 0;
      let isScrolling = false;

      let aframeDot = document.querySelectorAll('#TeleportPier, #TeleportSinich');
      aframeDot.forEach((sphere) => {
        sphere.addEventListener("click", function () {
          currentSectionIndex = 1;
        });
      });

      if (window.innerHeight > 1000) {
        sections = document.querySelectorAll('section');
      } else {
        sections = document.querySelectorAll('section, footer');
      }

      // Функция для обработки события "wheel"
      function handleWheelEvent(event) {
        if (window.innerWidth >= 1200 && window.innerHeight >= 1000) {
          console.log('wheel');
          const siteContent = document.querySelector('.site_content');
          const isSiteContentVisible = window.getComputedStyle(siteContent).display === 'block';

          if (!isSiteContentVisible) {
            return; // Если стиль не соответствует, не выполняем код ниже
          }

          event.preventDefault();
          event.stopPropagation();

          // if (sectionVideoEndListener) {
          //   return;
          // }

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
        }
      }

      // На устройствах меньше 1200px переходное видео показывается, если блок с vectary
      // попал в область видимости вьюпорта.
      function executeCode() {
        // Выполняется если видна секция с vectary
        scrollToSection(sectionVideo);
      }
      function handleIntersection(entries) {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            executeCode();
          }
        });
      }
      // Создаем экземпляр Intersection Observer
      const observer = new IntersectionObserver(handleIntersection);
      // Находим секцию с классом .sinichka_fixed
      const sectionVideo = document.querySelector('.sinichka_fixed');
      if ((window.innerWidth < 1200 || window.innerHeight < 1000) && sectionVideo) {
        // Наблюдаем за секцией только если ширина окна меньше 481 пикселя и секция существует
        observer.observe(sectionVideo);
      }

      // Добавляем обработчик события "wheel"
      document.addEventListener('wheel', handleWheelEvent, { passive: false });
      // Добавляем обработчик события "touch"
      // document.addEventListener('touchstart', handleTouchEvent, { passive: false });
    }



  }, []);
  return <></>;
}

export default App;
