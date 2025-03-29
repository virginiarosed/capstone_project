const languages = {
  "fil-PH": "Filipino",
  "ilo-PH": "Ilocano",
  "hil-PH": "Hiligaynon",
  "war-PH": "Waray",
  "ceb-PH": "Cebuano",
  "en-GB": "English",
  "zh-CN": "Chinese (CN)",
  "zh-TW": "Chinese (TW)",
  "fr-FR": "French",
  "ja-JP": "Japanese",
  "ko-KR": "Korean",
  "es-ES": "Spanish",
  "it-IT": "Italian",
};
      
let voices = [];

function loadVoices() {
  voices = speechSynthesis.getVoices(); // Get available voices
}

if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = loadVoices; // Load voices when they change (some browsers load voices asynchronously)
} else {
  loadVoices(); // For browsers that don't support onvoiceschanged
}

      const fromText = document.querySelector(".from-text"),
        toText = document.querySelector(".to-text"),
        exchageIcon = document.querySelector(".exchange"),
        selectTag = document.querySelectorAll("select"),
        icons = document.querySelectorAll(".row ion-icon");
      (translateBtn = document.querySelector("button")),
        selectTag.forEach((tag, id) => {
          for (let lang_code in languages) {
            let selected =
              id == 0
                ? lang_code == "en-GB"
                  ? "selected"
                  : ""
                : lang_code == "fa-IR"
                ? "selected"
                : "";
            let option = `<option ${selected} value="${lang_code}">${languages[lang_code]}</option>`;
            tag.insertAdjacentHTML("beforeend", option);
          }
        });
      
      fromText.addEventListener("keyup", () => {
        if (!fromText.value) {
          toText.value = "";
        }
      });
      
      translateBtn.addEventListener("click", () => {
        let text = fromText.value.trim(),
          translateFrom = selectTag[0].value,
          translateTo = selectTag[1].value;
        if (!text) return;
        toText.setAttribute("placeholder", "Translating...");
        let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
        fetch(apiUrl)
          .then((res) => res.json())
          .then((data) => {
            toText.value = data.responseData.translatedText;
            data.matches.forEach((data) => {
              if (data.id === 0) {
                toText.value = data.translation;
              }
            });
            toText.setAttribute("placeholder", "Translation");
          });
      });
      
      exchageIcon.addEventListener("click", () => {
        let tempText = fromText.value,
          tempLang = selectTag[0].value;
        fromText.value = toText.value;
        toText.value = tempText;
        selectTag[0].value = selectTag[1].value;
        selectTag[1].value = tempLang;
      });
      
      // Text-to-Speech: From Language (Input Text)
document.getElementById("from-volume").addEventListener("click", () => {
  const text = fromText.value;
  if (text) {
    const fromLang = selectTag[0].value; // Get selected language from 'from' dropdown
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Find the voice that matches the selected language
    const voice = voices.find(voice => voice.lang === fromLang);
    if (voice) {
      utterance.voice = voice; // Set the voice to the matching one
    }
    
    speechSynthesis.speak(utterance); // Speak the text aloud
  }
});

// Text-to-Speech: To Language (Translated Text)
document.getElementById("to-volume").addEventListener("click", () => {
  const text = toText.value;
  if (text) {
    const toLang = selectTag[1].value; // Get selected language from 'to' dropdown
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Find the voice that matches the selected language
    const voice = voices.find(voice => voice.lang === toLang);
    if (voice) {
      utterance.voice = voice; // Set the voice to the matching one
    }
    
    speechSynthesis.speak(utterance); // Speak the translated text aloud
  }
});
      
      // Copy Text: From Textarea
document.getElementById("from-copy").addEventListener("click", () => {
  const text = fromText.value;
  if (text) {
    navigator.clipboard.writeText(text).then(() => {
      // Trigger the Toast Notification
      const toast = document.getElementById("toast");
      toast.className = "toast show"; // Show the toast
      // Hide the toast after 2 seconds
      setTimeout(() => {
        toast.className = toast.className.replace("show", ""); // Hide the toast
      }, 2000);
    }).catch(err => {
      console.error("Error copying text: ", err);
    });
  }
});
      
      // Copy Text: To Textarea (Translated Text)
      document.getElementById("to-copy").addEventListener("click", () => {
        const text = toText.value;
        if (text) {
          navigator.clipboard.writeText(text).then(() => {
            // Trigger the Toast Notification
      const toast = document.getElementById("toast");
      toast.className = "toast show"; // Show the toast
      // Hide the toast after 2 seconds
      setTimeout(() => {
        toast.className = toast.className.replace("show", ""); // Hide the toast
      }, 2000);
          }).catch(err => {
            console.error("Error copying text: ", err);
          });
        }
      });

// Function to toggle the navigation menu
function toggleMenu() {
  const menu = document.getElementById("nav-menu");
  menu.classList.toggle("active");
}      