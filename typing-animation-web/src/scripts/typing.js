const phrases = ["Elliot S. Lee", "a student at Princeton", "a passionate developer", "exploring new ideas"];
let currentPhraseIndex = 0;
let currentCharIndex = 0;
let isDeleting = false;
const typingSpeed = 150;
const deletingSpeed = 75;
const pauseDuration = 1000;

const textElement = document.getElementById("typing-text");

function type() {
    if (currentCharIndex < phrases[currentPhraseIndex].length) {
        textElement.textContent += phrases[currentPhraseIndex].charAt(currentCharIndex);
        currentCharIndex++;
        setTimeout(type, typingSpeed);
    } else {
        isDeleting = true;
        setTimeout(deleteText, pauseDuration);
    }
}

function deleteText() {
    if (currentCharIndex > 0) {
        textElement.textContent = phrases[currentPhraseIndex].substring(0, currentCharIndex - 1);
        currentCharIndex--;
        setTimeout(deleteText, deletingSpeed);
    } else {
        isDeleting = false;
        currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
        setTimeout(type, typingSpeed);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    type();
});