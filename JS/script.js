const fromText = document.querySelector(".from-text"),
    toText = document.querySelector(".to-text"),
    exchangeIcon = document.querySelector(".exchange"),
    selectTag = document.querySelectorAll("select"),
    icons = document.querySelectorAll(".row i"),
    translateBtn = document.querySelector("button");

selectTag.forEach((tag, id) => {
    for (let country_code in countries) {
        let selected = id === 0 ? country_code === "en-GB" ? "selected" : "" : country_code === "hi-IN" ? "selected" : "";
        let option = `<option ${selected} value="${country_code}">${countries[country_code]}</option>`;
        tag.insertAdjacentHTML("beforeend", option);
    }
});

exchangeIcon.addEventListener("click", () => {
    let tempText = fromText.value,
        tempLang = selectTag[0].value;
    fromText.value = toText.value;
    toText.value = tempText;
    selectTag[0].value = selectTag[1].value;
    selectTag[1].value = tempLang;
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
        .then(res => res.json())
        .then(data => {
            toText.value = data.responseData.translatedText;
            data.matches.forEach(data => {
                if (data.id === 0) {
                    toText.value = data.translation;
                }
            });
            toText.setAttribute("placeholder", "Translation");
        })
        .catch(error => {
            console.error("Error with translation API:", error);
            toText.setAttribute("placeholder", "Translation failed");
        });
});

icons.forEach(icon => {
    icon.addEventListener("click", ({ target }) => {
        if (!fromText.value && !toText.value) return;
        let utterance;
        if (target.classList.contains("fa-volume-up")) {
            if (target.id === "from" && fromText.value) {
                utterance = new SpeechSynthesisUtterance(fromText.value);
                utterance.lang = selectTag[0].value;
            } else if (target.id === "to" && toText.value) {
                utterance = new SpeechSynthesisUtterance(toText.value);
                utterance.lang = selectTag[1].value;
            }

            if (utterance) {
                // Log debugging information
                console.log(`Attempting to speak: ${utterance.text}`);
                console.log(`Language code: ${utterance.lang}`);
                
                // Check if the browser's speech synthesis is available and not currently speaking
                if (speechSynthesis.speaking) {
                    console.warn("Speech synthesis is already speaking. Please wait.");
                    speechSynthesis.cancel(); // Optional: stop any ongoing speech
                }

                try {
                    speechSynthesis.speak(utterance);
                } catch (e) {
                    console.error("Error in speech synthesis:", e);
                }
            } else {
                console.error("Utterance creation failed. No text available or unsupported language.");
            }
        }

        if (target.classList.contains("fa-copy")) {
            if (target.id === "from") {
                navigator.clipboard.writeText(fromText.value).then(() => {
                    console.log("Copied from text to clipboard.");
                }).catch(err => {
                    console.error("Failed to copy text:", err);
                });
            } else {
                navigator.clipboard.writeText(toText.value).then(() => {
                    console.log("Copied to text to clipboard.");
                }).catch(err => {
                    console.error("Failed to copy text:", err);
                });
            }
        }
    });
});
