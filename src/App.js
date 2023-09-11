import {useEffect} from "react";

const IMAGE_WIDTH_OFFSET = 180;

// Маршруты
const ROUTES = [
  {
    name: 'kievsky',
    circles: [
      { bottom: '27.5%', right: '21.4%', hoverImgSrc: '/images/kievskii.jpg' },
      { bottom: '69.5%', right: '62.4%', hoverImgSrc: '/images/serdce_stolici.jpg '},
      { bottom: '38%', right: '41.5%', hoverImgSrc: '/images/kutuzovskii.jpg' },
      { bottom: '47%', right: '32%', hoverImgSrc: '/images/city_centr.jpg '},
      { bottom: '53%', right: '27%', hoverImgSrc: '/images/city_bagration.jpg '},
      { bottom: '52%', right: '17%', hoverImgSrc: '/images/trehgornii.jpg '},
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

// mob
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

      // function fadeVideo() {
      //   console.log('fade');
      //   console.log(activeBlock);
      //   activeBlock.addEventListener("timeupdate", function() {
      //     console.log('fade time listen');
      //     const currentTime = activeBlock.currentTime;
      //     // console.log(currentTime);
      //
      //     if (currentTime < 7) {
      //       videoContent.style.opacity = 1;
      //     } else if (currentTime >= 8 && currentTime < 8.25) {
      //       videoContent.style.opacity = 0.9;
      //     } else if (currentTime >= 8.5 && currentTime < 8.75) {
      //       videoContent.style.opacity = 0.6;
      //     } else if (currentTime >= 9 && currentTime < 9.5) {
      //       videoContent.style.opacity = 0.3;
      //     } else if (currentTime >= 10) {
      //       videoContent.style.opacity = 0;
      //     }
      //   });
      //   function onVideoEndListener2() {
      //     console.log('finish scroll');
      //     activeBlock.removeEventListener("ended", onVideoEndListener2);
      //     finishVideosBlock();
      //     WheelContentSmooth();
      //     // console.log('finish scroll');
      //   }
      //   activeBlock.addEventListener("ended", onVideoEndListener2);
      // }

      // Нижний край
      if (!nextVideo) {
        // fadeVideo();
        // activeBlock.addEventListener("timeupdate", () => {
        //   const currentTime2 = activeBlock.currentTime;
        //   console.log(currentTime2);
        //   console.log(activeBlock);
        //
        //   if (currentTime2 <= 7) {
        //     videoContent.style.opacity = 1;
        //   } else if (currentTime2 >= 8 && currentTime2 < 8.25) {
        //     videoContent.style.opacity = 0.9;
        //   } else if (currentTime2 >= 8.5 && currentTime2 < 8.75) {
        //     videoContent.style.opacity = 0.6;
        //   } else if (currentTime2 >= 9 && currentTime2 < 9.5) {
        //     videoContent.style.opacity = 0.3;
        //   } else if (currentTime2 >= 10) {
        //     videoContent.style.opacity = 0;
        //   }
        // });
        // videoContent.style.opacity = 0.5;
        finishVideosBlock();
        WheelContentSmooth();
      }

      const doSwitch = () => {
        if (!nextVideo) {
          return;
        }

        // function onVideoEndListenerCardDown() {
        //   console.log('ended');
        //   activeBlock.removeEventListener("ended", onVideoEndListenerCardDown);
        //   const cardElem = infoElem.querySelector('.card');
        //   // const video = activeBlock.querySelector('video');
        //
        //   // Задайте время (в секундах), за которое вы хотите выполнить анимацию
        //   const timeBeforeEnd = 1; // Например, 5 секунд до окончания
        //
        //   // Проверьте, находится ли текущее время видео близко к окончанию
        //   if (activeBlock.currentTime >= activeBlock.duration - timeBeforeEnd) {
        //     // Если близко к окончанию, добавьте и уберите классы анимации
        //     cardElem.classList.remove('animateUp');
        //     cardElem.classList.add('animateDown');
        //   }
        // }
        // activeBlock.addEventListener("ended", () => {console.log('ended')});
        // console.log(activeBlock);

        activeBlock.classList.remove("active");
        nextVideo.classList.add("active");



        if (nextVideo.hasAttribute("data-info-text")) {
          // добавить проверку на дата атрибуты и показывать один блок с разным контентом из атрибутов
          infoElem.classList.add("active");
          infoElem.innerHTML = `
            <div class="card">
              <div class="card_marker">
                <img class="card_marker-img" src="${nextVideo.getAttribute("data-info-src")}" alt="card">
              </div>
              <div class="card_descr">
                <p class="card_descr-text">${nextVideo.getAttribute("data-info-text")}</p>
                <p class="card_descr-title">${nextVideo.getAttribute("data-info-title")}</p>
              </div>
            </div>
          `;
          const cardElem = infoElem.querySelector('.card');
          cardElem.classList.add('animateUp');
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

        // const cardElem = infoElem.querySelector('.card');
        // // Задайте время (в секундах), за которое вы хотите выполнить анимацию
        // const timeBeforeEnd = 1; // Например, 5 секунд до окончания
        //
        // // Проверьте, находится ли текущее время видео близко к окончанию
        // if (cardElem && (activeBlock.currentTime >= activeBlock.duration - timeBeforeEnd)) {
        //   // Если близко к окончанию, добавьте и уберите классы анимации
        //   cardElem.classList.remove('animateUp');
        //   cardElem.classList.add('animateDown');
        // }

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
              if (currentTime < 7) {
                videoContent.style.opacity = 1;
              } else if (currentTime >= 8 && currentTime < 8.25) {
                videoContent.style.opacity = 0.9;
              } else if (currentTime >= 8.5 && currentTime < 8.75) {
                videoContent.style.opacity = 0.6;
              } else if (currentTime >= 9 && currentTime < 9.5) {
                videoContent.style.opacity = 0.3;
              } else if (currentTime >= 10) {
                videoContent.style.opacity = 0;
              }
            });
            function onVideoEndListenerButton() {
              finishVideosBlock();
              WheelContentSmooth();
            }
            // e.addEventListener("ended", finishVideosBlock, WheelContentSmooth);
            e.addEventListener("ended", onVideoEndListenerButton);
          }
        });
      });

      const progressBars = document.querySelectorAll('.progress-bar');
      const progressContainer = document.querySelectorAll('.progress-container');
      allVideos.forEach((video, index) => {
        const progressBar = progressBars[index];
        let isProgressBarFull = false; // Флаг для отслеживания заполнения прогресс-бара


        if (video.hasAttribute("data-transit")) {
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
                progressBar.style.width = '100%';
                progressContainer[index].classList.add('filled');
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
              progressContainer[index].classList.add('filled');
            }
          });
        } else if (video.hasAttribute("loop")) {
          progressContainer[index].style.display = 'none';
        }
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
    // document.addEventListener("wheel", (e) => switchHandler("next"));

    function anotherFunctionForScrollBack() {
      const reloadBtn = document.querySelector('.reload_button');
      reloadBtn.style.display = 'flex';
      reloadBtn.addEventListener('click', () => {
        window.location.reload();
      });
    }

    document.addEventListener("wheel", (e) => {
      if (e.deltaY > 0) {
        // Вызывать функцию для скролла вперед
        switchHandler("next");
      } else {
        // Вызывать другую функцию для скролла назад
        anotherFunctionForScrollBack();
      }
    });
    document.addEventListener("touchstart", function (e) {
      touchstartY = e.touches[0].clientY;
    });
    document.addEventListener("touchend", function (e) {
      const touchEndY = e.changedTouches[0].clientY;
      if (touchEndY - touchstartY > 0) {
        // Вызвать функцию для скролла назад
        anotherFunctionForScrollBack();
      } else if (touchEndY - touchstartY < 0) {
        // Вызвать функцию для скролла вперед
        switchHandler("next");
      }
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

    const routeImages = document.querySelectorAll('img[data-route]:not(.img-disabled)');

    const modal = document.getElementById('modal');
    const modalExits = modal.querySelectorAll('.modal-exit');
    const modalBody = document.querySelector('.modal-body');
    // const routeBtn = document.querySelector('.btn[data-route]');
    // const cardFaqs = document.querySelectorAll('.card-faq');

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
      modalBody.appendChild(hoverImg);

      circleEl.addEventListener('mouseover', (e) => {
        e.preventDefault();
        hoverImg.classList.add('opacity-1');
      })

      circleEl.addEventListener('mouseleave', (e) => {
        e.preventDefault();
        hoverImg.classList.remove('opacity-1');
      })

      modalBody.appendChild(circleEl);
    }

    // Открытие маршрута в модалке
    const handleOpenRoute = ({ src, routeName }) => {
      modalBody.innerHTML = '';

      const routeImg = document.createElement('img');
      routeImg.src = src;
      routeImg.classList.add('img-responsive');
      modalBody.appendChild(routeImg);
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
        modal.classList.add('open');
      })
    });

    // Закрытие модалки маршрута
    modalExits.forEach((modalExit) => {
      modalExit.addEventListener('click', (e) => {
        e.preventDefault();
        modal.classList.remove('open');
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
      let sectionVideoEndListener = null;
      let sections;
      let currentSectionIndex = 0;
      let isScrolling = false;

      // let aframeDot = document.querySelectorAll('#TeleportPier, #TeleportSinich');
      // aframeDot.forEach((sphere) => {
      //   sphere.addEventListener("click", function () {
      //     currentSectionIndex = 1;
      //   });
      // });

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
      if (window.innerWidth < 1200 || window.innerHeight < 1000) {
        console.log('no weel');
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
