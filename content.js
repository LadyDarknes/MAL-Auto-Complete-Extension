(() => {
  const Butsel = '#myinfo_status.js-form-user-status-btn';

  function isVisible(elem) {
    if (!elem) return false;
    const style = getComputedStyle(elem);
    return style && style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
  }

  function waitForPopupReady(retries = 20) {
    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        const popupDiv = document.querySelector('#addtolist');
        const statusSelect = document.querySelector('#addtolist select#myinfo_status');
        const scoreSelect = document.querySelector('#addtolist select#myinfo_score');
        const epsInput = document.querySelector('#addtolist input#myinfo_watchedeps');
        const updateBtn = document.querySelector('#addtolist input.js-anime-update-button');

        if (popupDiv && isVisible(popupDiv) && statusSelect && scoreSelect && epsInput && updateBtn) {
          clearInterval(interval);
          console.log("Popup hazır, gerekli tüm elemanlar bulundu.");
          resolve({ statusSelect, scoreSelect, epsInput, updateBtn });
        } else {
          retries--;
          if (retries <= 0) {
            clearInterval(interval);
            reject("Popup açılmadı veya gerekli elemanlar bulunamadı.");
          }
        }
      }, 300);
    });
  }

  async function fillPopupAndSubmit() {
    try {
      const { statusSelect, scoreSelect, epsInput, updateBtn } = await waitForPopupReady();

      if (scoreSelect.value !== "0" && scoreSelect.value !== "") {
        console.log("Puan zaten verilmiş.");
        return;
      }

      statusSelect.value = "2"; // Dropped (Complicated gibi)

      let userScore = prompt("Anime için 1-10 arasında puan veriniz:", "10");
      if (!userScore) {
        console.log("Puan girilmedi, işlem iptal edildi.");
        return;
      }

      userScore = parseInt(userScore);
      if (isNaN(userScore) || userScore < 1 || userScore > 10) {
        alert("Geçersiz puan girdiniz. 1 ile 10 arasında olmalı.");
        return;
      }

      scoreSelect.value = userScore.toString();

      const totalEpsSpan = document.querySelector('#addtolist #curEps');
      if (totalEpsSpan && totalEpsSpan.dataset && totalEpsSpan.dataset.num) {
        epsInput.value = totalEpsSpan.dataset.num;
      } else {
        epsInput.value = "0";
      }

      updateBtn.click();

      console.log("Güncelle butonuna tıklandı, puan, durum ve bölüm sayısı kaydediliyor...");
    } catch (error) {
      console.error(error);
    }
  }

  function tryAddToList(retries = 10) {
    const addToListBtn = document.querySelector(Butsel);
    if (!addToListBtn) {
      console.log("Add to List butonu bulunamadı, 1 saniye sonra tekrar deneniyor...");
      if (retries <= 0) {
        console.error("Add to List butonu bulunamadı, işlem iptal edildi.");
        return;
      }
      setTimeout(() => tryAddToList(retries - 1), 1000);
      return;
    }

    console.log("Add to List butonu bulundu, tıklanıyor...");
    addToListBtn.click();

    // Popup açılmasını bekle
    setTimeout(() => {
      fillPopupAndSubmit();
    }, 1000);  // delay konusunu çözemedim kendi kararınıza bağlı.
  }

  window.addEventListener('load', () => {
    setTimeout(() => tryAddToList(), 1000);
  });
})();
