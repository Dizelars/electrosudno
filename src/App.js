import {useEffect} from "react";
import Electrosudno from "./js/threeJS/Three.js";
import AR from "./js/threeJS/AR.js";

const urlParams = new URLSearchParams(window.location.search);
const newsId = urlParams.get("ar");
let hellopreloader = document.getElementById("hellopreloader_preload");

const createVideoSource = (el, i, fileType) => {
  const source = document.createElement("source");
  source.setAttribute("src", `/${i + 1}${fileType}.mp4`);
  source.setAttribute("type", "video/mp4");
  el.appendChild(source);
};

const initVideos = () => {
  const isiPad = window.innerWidth < 1200;
  const isMobile = window.innerWidth < 700;
  const isVertical = window.innerHeight > window.innerWidth;

  if (!isiPad && !isVertical && !isMobile) {
    document.querySelectorAll(".bg-video").forEach((el, i) => {
      createVideoSource(el, i, "video");
    });
    document.querySelectorAll(".section-video").forEach((el, i) => {
      createVideoSource(el, i, "doors");
    });
  } else if (isiPad && !isVertical && !isMobile) {
    document.querySelectorAll(".video-background").forEach((el, i) => {
      createVideoSource(el, i, "ipad_mob");
    });
    document.querySelectorAll(".section-video").forEach((el, i) => {
      createVideoSource(el, i, "doors_mob");
    });
  } else if (isiPad && isVertical && !isMobile) {
    document.querySelectorAll(".video-background").forEach((el, i) => {
      createVideoSource(el, i, "long_mob");
    });
    document.querySelectorAll(".section-video").forEach((el, i) => {
      createVideoSource(el, i, "doors_mob");
    });
  } else if (isMobile) {
    document.querySelectorAll(".video-background").forEach((el, i) => {
      createVideoSource(el, i, "long_mob");
    });
    document.querySelectorAll(".section-video").forEach((el, i) => {
      createVideoSource(el, i, "doors_mob");
    });
  }

  // document.querySelectorAll(".section-video").forEach((el, i) => {
  //   createVideoSource(el, i, "doors");
  // });
};

// Анимация проблеска букв (проезжающий блок под текстом)
let mousePrevWrappers = document.querySelectorAll('.mouse_prev-wrapper_desctop, .mouse_prev-wrapper_mobile');
mousePrevWrappers.forEach(function(element) {
  element.classList.add('autoflash');
  let flashElement = document.createElement('div');
  flashElement.className = 'flash lighting';
  flashElement.style.height = '28px';
  flashElement.style.width = '15px';
  flashElement.style.top = '0px';
  flashElement.style.left = '-140px';
  element.appendChild(flashElement);
});

function App() {
  useEffect(() => {
    // Логика Егора НАЧИНАЕТСЯ
    const isMobile = window.innerWidth < 1200;

    let onVideoEndListener = null;
    let touchstartY = 0;
    let isEndVideos = false;
    const infoElem = document.querySelector(".info_block");
    const videoContent = document.querySelector(".video_content");
    const siteContent = document.querySelector(".site_content");
    const contentNone = document.querySelectorAll('.video_active, section#pier-routes, section#sinichka-section, footer#footer');
    const firstSection = document.querySelector('section#pier-description');
    const mouseTrigger = document.querySelector('.video_content .mouse_prev .mouse_prev-wrapper_desctop');
    const mouseTriggerText = document.querySelector('.video_content .mouse_prev .mouse_prev-wrapper_desctop span');
    const mouseArrow = document.querySelector('.video_content .mouse_prev .mouse_prev-wrapper_desctop .mouse_prev_arrow');
    const progressStories = document.querySelector('.video_content .video_progress_container');
    const endButton = document.querySelector(".video_content .leave_button");
    const reloadBtn = document.querySelector('.reload_button');

    // if (videoContent) {
    //
    // }

    initVideos();

    if (isMobile) {
      mobileVideo();
    } else {
      desctopVideo();
    }

    function desctopVideo() {
      console.log('desctop video');

      const finishVideosBlock = () => {
        videoContent.style.display = "none";
        firstSection.classList.remove('fixed');
        contentNone.forEach((e) => {
          e.classList.remove('video_active');
        });
        isEndVideos = true;
      }

      if (newsId) {
        finishVideosBlock();
        // WheelContentSmooth();
        hellopreloader.style.display = "none";
      }

      function fadeVideo(lastVideo) {
        lastVideo.addEventListener("timeupdate", function() {
          const currentTime = lastVideo.currentTime;
          const cardElem = infoElem.querySelector('.card');

          if (currentTime >= 5.6 && currentTime < 6) {
            cardElem.style.visibility = 'hidden';
            progressStories.style.display = 'none';
            mouseTrigger.style.display = 'none';
            endButton.style.display = 'none';
            reloadBtn.style.display = 'none';
          } else if (currentTime < 10) {
            videoContent.style.opacity = 1;
          } else if (currentTime >= 11 && currentTime < 11.25) {
            videoContent.style.opacity = 0.9;
          } else if (currentTime >= 11.5 && currentTime < 11.75) {
            videoContent.style.opacity = 0.6;
          } else if (currentTime >= 12 && currentTime < 12.5) {
            videoContent.style.opacity = 0.3;
          } else if (currentTime >= 13) {
            videoContent.style.opacity = 0;
          }
        });
        function onlastVideoEndListener() {
          lastVideo.removeEventListener("ended", onlastVideoEndListener);
          finishVideosBlock();
          WheelContentSmooth();
        }
        lastVideo.addEventListener("ended", onlastVideoEndListener);
        // onlastVideoEndListener();
      }

      const firstVideo = document.querySelector('#progress_one');
      const onVideoFirstEndListener = () => {
        const currentTime = firstVideo.currentTime;
        if (currentTime >= 4.5) {
          endButton.style.display = 'flex';
          mouseTrigger.style.display = 'block';
          firstVideo.removeEventListener("timeupdate", onVideoFirstEndListener);
        }
      };
      firstVideo.addEventListener("timeupdate", onVideoFirstEndListener);

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

        if (!clickOnEndButton) {
          mouseTriggerText.innerHTML = 'Внимание на экран';
          mouseArrow.style.display = 'none';
        }

        // console.log("nextActiveNumber", nextActiveNumber);

        // Верхний край
        if (!nextActiveNumber) {
          return;
        }

        const nextVideo = document.querySelector(
            `.js-number-block[data-number="${nextActiveNumber}"]`
        );

        // Нижний край
        // if (!nextVideo) {
        //   finishVideosBlock();
        //   WheelContentSmooth();
        // }

        if (nextVideo.id === 'progress_eight') {
          fadeVideo(nextVideo);
        }

        const doSwitch = () => {
          if (!nextVideo) {
            return;
          }

          activeBlock.classList.remove("active");
          // if (activeBlock.hasAttribute("autoplay")) {
          //   activeBlock.removeAttribute("autoplay");
          // }
          nextVideo.classList.add("active");
          nextVideo.play();


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
            if (!clickOnEndButton) {
              mouseTriggerText.innerHTML = 'Крутите вниз';
              mouseArrow.style.display = 'block';
            }
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

      // Пропустить превью с видео
      // const leavePrev = document.querySelector(".video_content .leave_button");
      const endButtons = document.querySelectorAll(".video_content .leave_button");
      // const learn = document.querySelector(".video_content .learn_button");
      let allVideos = document.querySelectorAll(".bg-video");
      // let mouse = document.querySelector('.mouse_prev');
      let clickOnEndButton = false;
      endButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
          btn.style.display = 'none';
          clickOnEndButton = true;
          mouseArrow.style.display = 'none';
          mouseTriggerText.innerHTML = 'Внимание на экран';
          allVideos.forEach((e, index) => {
            e.removeAttribute('loop');
            e.setAttribute('data-transit', '');
            e.addEventListener("ended", () => {
              switchHandler("next");
            });
            if (index === allVideos.length - 1) {
              fadeVideo(e);
            }
            // fadeVideo(e);
          });
        });
      });

      // Cторис
      const progressBars = document.querySelectorAll('.progress-bar');
      const progressIcon = document.querySelectorAll('.progress_icon');
      let filteredArray = Array.from(allVideos).filter(video => video.getAttribute("data-transit") != null);
      filteredArray.forEach((video, index) => {
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
              progressBar.style.width = '100%';
              progressIcon[index].classList.add('filled');
            }
          }
        });

        video.addEventListener('ended', () => {
          if (!isProgressBarFull) {
            progressBar.style.width = '100%';
            isProgressBarFull = true;
            video.currentTime = 0;
            progressIcon[index].classList.add('filled');
          }
        });
      });

      // Добавляем обработчики для переключения видеофрагментов при прокрутке и событиях touch
      function anotherFunctionForScrollBack() {
        // const reloadBtn = document.querySelector('.reload_button');
        if (window.innerWidth >= 1200) {
          reloadBtn.style.display = 'flex';
          reloadBtn.addEventListener('click', () => {
            window.location.reload();
          });
        }
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
    }

    function mobileVideo() {
      // console.log('mobile video');

      const infoElemContent = {
        snow: {
          src: "/images/icons/snow.svg",
          text: "Возможность использования:",
          title: "круглый год",
        },
        ejection: {
          src: "/images/icons/ejection.svg",
          text: "Выброс вредных веществ:",
          title: "0",
        },
        capacity: {
          src: "/images/icons/capacity.svg",
          text: "Вместимость:",
          title: "50 комфортных мест",
        },
        moorings: {
          src: "/images/icons/moorings.svg",
          text: "Планируемое количество</br>плавучих причалов:",
          title: "23 шт.",
        }
      }
      const video = document.querySelector(".video_content .video-background");
      // const src = video.currentSrc || video.src;
      const htmlSmooth = document.querySelector("html");
      const bodyOverflow = document.querySelector("body");
      const mouseLogo = document.querySelector('.video_content .mouse_prev');
      const leavePrev = document.querySelector(".video_content .learn_button");

      let loopVideo = true;  // Флаг для циклического повторения видео
      // Функция для начала проигрывания видео с нулевой секунды
      function playVideoFromStart() {
        if (loopVideo) {
          video.currentTime = 0;  // Устанавливаем время видео в 0 секунд
          video.play();
        }
      }

      // Анимация карточек и промежутка времени видео
      let currentActiveContent = null;
      // let isPlayVideoStarted = false;
      video.addEventListener("timeupdate", function() {
        // const currentTime = video.currentTime;
        // let currentTime;
        // const cardElem = infoElem.querySelector('.card');
        // let newActiveContent = null;
        // console.log(currentTime);

        // const currentTimeInMilliseconds = video.currentTime * 1000;
        // console.log('Время в милисекундах:', currentTimeInMilliseconds);

        function updateVideoTime() {
          const currentTime = video.currentTime;
          const cardElem = infoElem.querySelector('.card');
          let newActiveContent = null;
          // console.log('Current time:', currentTime);

          if (currentTime >= 10.1499 && currentTime < 10.9) {
            playVideoFromStart();
          } else if (currentTime >= 11 && currentTime < 16.5) {
            newActiveContent = infoElemContent.ejection;
          } else if (currentTime >= 17.5 && currentTime < 28.5) {
            newActiveContent = infoElemContent.snow;
          } else if (currentTime >= 29.5 && currentTime < 34.5) {
            newActiveContent = infoElemContent.capacity;
          } else if (currentTime >= 35.5 && currentTime < 40) {
            newActiveContent = infoElemContent.moorings;
          } else if (currentTime >= 40) {
            cardElem.style.visibility = 'hidden';
            leavePrev.style.display = "none";
          } else if (currentTime >= 44.5 && currentTime < 45) {
            videoContent.style.opacity = 0.9;
          } else if (currentTime >= 45 && currentTime < 45.5) {
            videoContent.style.opacity = 0.6;
          } else if (currentTime >= 45.6 && currentTime < 46) {
            videoContent.style.opacity = 0.3;
          } else if (currentTime >= 46) {
            videoContent.style.opacity = 0;
          }

          if (newActiveContent !== currentActiveContent) {
            if (newActiveContent) {
              const { src, text, title } = newActiveContent;

              // Анимация ухода текущего контента
              if (currentActiveContent) {
                const card = infoElem.querySelector('.card');
                card.classList.remove('animateUp');
                card.classList.add('animateDown');
                setTimeout(() => {
                  updateInfoElement(src, text, title);
                  card.classList.remove('animateDown');
                  setTimeout(() => {
                    card.classList.add('animateUp');
                  }, 50);
                }, 500);
              } else {
                // Первый контент (без анимации ухода)
                updateInfoElement(src, text, title);
                const card = infoElem.querySelector('.card');
                card.classList.add('animateUp');
              }
            } else {
              // Анимация ухода текущего контента при очистке
              if (currentActiveContent) {
                const card = infoElem.querySelector('.card');
                card.classList.remove('animateUp');
                card.classList.add('animateDown');
                setTimeout(() => {
                  clearInfoElement();
                  card.classList.remove('animateDown');
                }, 500);
              } else {
                clearInfoElement();
              }
            }
            currentActiveContent = newActiveContent;
          }

          // Вызываем requestAnimationFrame для обновления времени на следующем кадре
          requestAnimationFrame(updateVideoTime);
        }

        updateVideoTime();
      });
      function updateInfoElement(src, text, title) {
        infoElem.style.display = "block";
        infoElem.innerHTML = `
      <div class="card">
        <div class="card_marker">
          <img class="card_marker-img" src="${src}" alt="snow">
        </div>
        <div class="card_descr">
          <p class="card_descr-text">${text}</p>
          <p class="card_descr-title">${title}</p>
        </div>
      </div>
    `;
      }
      function clearInfoElement() {
        infoElem.style.display = "none";
      }

      function onVideoEndListener() {
        video.removeEventListener("ended", onVideoEndListener);
        videoContent.style.display = "none";
        siteContent.style.display = "block";
        bodyOverflow.style.overflow = 'auto';
        firstSection.classList.remove('fixed');
        htmlSmooth.classList.remove('smooth');
        setTimeout(() => {
          WheelContentSmooth();
        }, 500);
        setTimeout(() => {
          contentNone.forEach((section) => {
            section.classList.remove('video_active');
          });
        }, 600);
      }
      const finishVideos = () => {
        bodyOverflow.style.overflow = 'hidden';
        mouseLogo.style.display = 'none';
        loopVideo = false;
        video.play();
        video.addEventListener("ended", onVideoEndListener);
        // onVideoEndListener()
      };

      if (newsId) {
        onVideoEndListener();
        hellopreloader.style.display = "none";
      }

      video.addEventListener("ended", onVideoEndListener);


      leavePrev.addEventListener("click", () => {
        leavePrev.querySelector('button').innerHTML = 'Внимание на экран';
        leavePrev.style.background = 'none';
        leavePrev.style.backdropFilter = 'none';
        leavePrev.style.opacity = '0.6';
        loopVideo = false;  // Отключаем циклическое повторение видео
        video.play();  // Запускаем видео с текущей секунды
        finishVideos();
      });
    }

    // Добавляем обработчик прокрутки на блок siteContent
    siteContent.addEventListener("scroll", () => {
      // Если прокрутка дошла до верха блока siteContent
      if (siteContent.scrollTop === 0) {
        // Показываем блок с видео и скрываем блок site_content
        videoContent.style.display = "block";
        siteContent.style.display = "none";
      }
    });


    // Выезжающее описание на синичке в вектари (на мобилке)
    const specsBlock = document.querySelector('.vectary .info_wrapper .info_position');
    const specClick = document.querySelector('.vectary .tech_speck .tech_speck-click');
    const speckArrow = document.querySelector('.vectary .tech_speck .tech_speck-click .tech_speck-img');

    specClick.addEventListener('click', () => {
      // setTimeout(() => {
      //   specsBlock.classList.toggle('active');
      // }, 500);
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
      const modalNoScroll = document.getElementById('modal');

      if (modalNoScroll.classList.contains('open'))  {
        return
      }

      if (video && (currentPosition < section.offsetTop)) {
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
        // window.scrollTo(0, currentPosition + distance * easing); // Прокрутка
        setTimeout(() => {
          window.scrollTo(0, currentPosition + distance * easing); // Прокрутка
        }, 150);


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


    // aframe
    let rollup = document.querySelectorAll('#aframe_rollupSinich, #aframe_rollupPier');

    let dotLink = document.querySelectorAll('.footer-list .footer-link, .footer-links-wrapper-tab .footer-link');
    let dotSection = document.querySelectorAll('#pier-description, #sinichka-section, #pier-routes, #pier-faq');
    // Создаем объект для сопоставления id с индексами
    const sectionIdToIndex = {
      'pier-description': 0,
      'sinichka-section': 1,
      'pier-routes': 2,
      'pier-faq': 3,
    };

    // Плавное переключение секций на весь экран при движении колеса мыши
    function WheelContentSmooth() {
      let sectionVideoEndListener = null;
      let sections;
      let currentSectionIndex = 0;
      let isScrolling = false;

      if (newsId) {
        currentSectionIndex = 1;
      }

      rollup.forEach((sphere, indexSphere) => {
        sphere.addEventListener("click", function () {
          if (indexSphere === 0) {
            scrollToSection(dotSection[indexSphere]);
            currentSectionIndex = indexSphere;
          } else {
            scrollToSection(dotSection[indexSphere]);
            currentSectionIndex = indexSphere;
          }
        });
      });

      dotLink.forEach((link, indexLink) => {
        link.addEventListener('click', () => {
          scrollToSection(dotSection[indexLink]);
          // Получаем id текущей секции
          const currentSectionId = dotSection[indexLink].getAttribute('id');
          // Получаем индекс из объекта сопоставления
          currentSectionIndex = sectionIdToIndex[currentSectionId];
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

      // На устройствах меньше 1200px переходное видео показывается, если блок с vectary попал в область видимости вьюпорта.
      const sectionVideo = document.querySelector('.sinichka_fixed');
      const rollup_Button = document.querySelector('#aframe_rollupSinich');
      let rollup_Buttons_Click;
      rollup_Button.addEventListener('click', () => {
        rollup_Buttons_Click = true;
      });

      function executeCode() {
        // Выполняется если видна секция с vectary
        if (window.scrollY < sectionVideo.offsetTop) {
          scrollToSection(sectionVideo);
        }
      }
      function handleIntersection(entries) {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !rollup_Buttons_Click) {
            executeCode();
          } else {
            rollup_Buttons_Click = false;
          }
        });
      }
      // Создаем экземпляр Intersection Observer
      const observer = new IntersectionObserver(handleIntersection);
      // Находим секцию с классом .sinichka_fixed
      if ((window.innerWidth < 1200 || window.innerHeight < 1000)) {
        observer.observe(sectionVideo);
        // Наблюдаем за секцией только если ширина окна меньше 481 пикселя и секция существует
      }

      // Добавляем обработчик события "wheel"
      document.addEventListener('wheel', handleWheelEvent, { passive: false });
      // Добавляем обработчик события "touch"
      // document.addEventListener('touchstart', handleTouchEvent, { passive: false });
    }
    if (newsId) {
      WheelContentSmooth();
    }
  }, []);
  return <>
    <AR />
    <Electrosudno />
  </>;
}

export default App;
