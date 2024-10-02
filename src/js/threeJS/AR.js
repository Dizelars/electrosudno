function AR() {
    // function isUserOnTelegram() {
    //     let isTelegram = navigator.userAgent.includes('Telegram');
    //     alert(isTelegram);
    //     return isTelegram;
    // }

    // isUserOnTelegram();

    document.querySelector('.pulse_wrapper').addEventListener('click', () => {
        const modelViewer = document.querySelector('#pageWithModel');
    
        console.log("Доступность AR: " + modelViewer.canActivateAR)
        
        if (modelViewer.canActivateAR) {
            // modelViewer.activateAR();
            window.open('https://garagetest.ru/pageAR.html');
        } else {
            if (window.innerWidth < 1200) {
                window.open('https://garagetest.ru/pageAR.html');
            } else {
                openPopupQR();
            }
        }
    });
    
    // Popip с QR-кодом
    const statusError = document.querySelector('.qrCode-popup');
    const arButton = document.querySelector('.pulse_wrapper');
    
    // Для отключения скролла
    let bodyOverflow = document.querySelector('body');
    let scrollPosition = 0;
    
    function closePopup() {
        bodyOverflow.style.removeProperty("overflow");
        bodyOverflow.style.removeProperty("position");
        bodyOverflow.style.removeProperty("top");
        bodyOverflow.style.removeProperty("width");
        window.scrollTo(0, scrollPosition);
    }
    
    function openPopup() {
        scrollPosition = window.scrollY;
        bodyOverflow.style.overflow = "hidden";
        bodyOverflow.style.position = "fixed";
        bodyOverflow.style.top = `-${scrollPosition}px`;
        bodyOverflow.style.width = "100%";
    }
    
    function openPopupQR() {
        statusError.classList.add('active');
        statusError.style.visibility = 'visible';
        arButton.classList.add('hidden');
        openPopup();
    }
    
    function closePopupQR() {
        statusError.classList.remove('active');
        arButton.classList.remove('hidden');
        // setTimeout(() => {
            statusError.style.visibility = 'hidden';
        // }, 450);
        closePopup();
    }
    
    // function clickOutOfPopup(popup, closeFunc) {
    // 	popup.addEventListener('mousedown', (event) => {
    // 		const target = event.target;
    // 		const isInsidePopup = target.closest('.qrCode-popup_wrapper');
    // 		if (!isInsidePopup) {
    // 			closeFunc();
    // 		}
    // 	});
    // }
    
    // clickOutOfPopup(statusError, closePopupQR);
    
    function clickButtonClose(clickedElem, closeFunc) {
        clickedElem.addEventListener('click', () => {
            closeFunc();
        });
    }
    
    const statusErrorCloseIcon = document.querySelector('.qrCode-popup .closeButton');
    clickButtonClose(statusErrorCloseIcon, closePopupQR);
};

export default AR;