let minutes = 0;
let seconds = 0;
let isCounting = false;
let interval;

const [
  minuteLeftElement,
  minuteRightElement,
  secondLeftElement,
  secondRightElement,
] = document.querySelectorAll(".count-container div span");

const buttonElement = document.querySelector(".count-button");

function updateDisplay() {
  minuteLeftElement.textContent = String(minutes).padStart(2, "0")[0];
  minuteRightElement.textContent = String(minutes).padStart(2, "0")[1];
  secondLeftElement.textContent = String(seconds).padStart(2, "0")[0];
  secondRightElement.textContent = String(seconds).padStart(2, "0")[1];
}

function incrementTime() {
  if (seconds < 59) {
    seconds++;
  } else if (minutes < 59) {
    seconds = 0;
    minutes++;
  } else {
    minutes = 0;
    seconds = 0;
  }
}

function startCount() {
  interval = setInterval(() => {
    incrementTime();
    updateDisplay();
  }, 1000);
}

function stopCount() {
  clearInterval(interval);
  minutes = 0;
  seconds = 0;
  updateDisplay();
}

function toggleCount() {
  isCounting = !isCounting;
  if (isCounting) {
    startCount();
    buttonElement.textContent = "Abandonar o ciclo";
    buttonElement.classList.add("active");
  } else {
    stopCount();
    buttonElement.textContent = "Iniciar um ciclo";
    buttonElement.classList.remove("active");
  }
}

buttonElement.addEventListener("click", toggleCount);
