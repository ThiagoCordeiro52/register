let minutes = 0;
let seconds = 0;
let isCounting = false;
let interval;
let workedHours = 0;
let workedMinutes = 0;
let workedSeconds = 0;

const [
  minuteLeftElement,
  minuteRightElement,
  secondLeftElement,
  secondRightElement,
] = document.querySelectorAll(".count-container div span");

const workedTimeDisplay = document.querySelector(
  ".completed-challenges-container .worked-time"
);

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
  if (workedSeconds + seconds >= 60) {
    workedMinutes += 1;
  } else {
    workedSeconds += seconds;
  }

  if (workedMinutes + minutes >= 60) {
    workedHours += 1;
    workedMinutes += workedMinutes + minutes - 60;
  }

  if (workedMinutes + minutes < 60) {
    workedMinutes += minutes;
  }

  workedTimeDisplay.textContent = `${String(workedHours).padStart(
    2,
    "0"
  )}h${String(workedMinutes).padStart(2, "0")}min`;

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
