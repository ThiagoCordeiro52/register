let minutes = 0;
let seconds = 0;
let isCounting = false;
let interval;
let workedHours = 0;
let workedMinutes = 0;
let workedSeconds = 0;

let dailyGoalMinutes = 0;
let weeklyGoalMinutes = 0;
let dailyGoalHours = 0;
let weeklyGoalHours = 0;


const [
  minuteLeftElement,
  minuteRightElement,
  secondLeftElement,
  secondRightElement,
] = document.querySelectorAll(".count-container div span");


const workedTimeDisplay = document.querySelector(
  ".completed-challenges-container .worked-time"
);

const dailyGoalDisplay = document.querySelector(
  ".completed-challenges-container .remaining-time"
);

const weeklyGoalDisplay = document.querySelector(
  ".completed-challenges-container .remaining-weekly-time"
);

const buttonElement = document.querySelector(".count-button");

//when the page loads, load the activity
document.addEventListener("DOMContentLoaded", loadActivity);

//load activity data from id
// using /activities/:id endpoint
function loadActivity() {
  fetch('http://localhost:3333/activities/' + localStorage.getItem('selectedActivityId'))
    .then((response) => response.json())
    .then((activity) => {
      dailyGoalMinutes = activity.goalDaily;
      weeklyGoalMinutes = activity.goalWeekly;

      const today = new Date();
      const lastLog = activity.logs[activity.logs.length - 1];
      const lastDate = new Date(lastLog.date);

      if (lastDate.getDate() === today.getDate() &&
          lastDate.getMonth() === today.getMonth() &&
          lastDate.getFullYear() === today.getFullYear()) {
        workedHours = lastLog.workedHours;
        workedMinutes = lastLog.workedMinutes;
        workedSeconds = lastLog.workedSeconds;
        calculateRemainingTime();
      } else {
        alert('Não há registros de atividade para hoje');
      }
      calculateRemainingWeeklyTime();
      updateDisplay();
    });
}

/*
function loadActivity() {
  fetch('http://localhost:3333/activities')
    .then((response) => response.json())
    .then((activities) => {
      const selectedActivityId = Number(localStorage.getItem('selectedActivityId'));
      const selectedActivity = activities.find(activity => activity.id === selectedActivityId);
      dailyGoalMinutes = selectedActivity.goalDaily;
      weeklyGoalMinutes = selectedActivity.goalWeekly;
      today = new Date();
      //alert(today.getDate());
      //selectedActivity.logs is an array of activityLog
      //selectedActivity.logs[0].date.getDate() is not working, why?
      //A: selectedActivity.logs[0].date is a string, not a Date object
      //Q: How to convert it to a Date object?
      //A: new Date(selectedActivity.logs[0].date)
      lastDate = new Date(selectedActivity.logs[selectedActivity.logs.length - 1].date);
      alert(selectedActivity.logs)
      alert(lastDate.getDate());
      //alert(selectedActivity.logs[0].date.getDate());
      if (selectedActivity.activityLog[selectedActivity.activityLog.size - 1].date.getDate() === today.getDate()) {
        workedHours = selectedActivity.lastActivityLog.workedHours;
        workedMinutes = selectedActivity.lastActivityLog.workedMinutes;
        workedSeconds = selectedActivity.lastActivityLog.workedSeconds;
        calculateRemainingTime();
      } else {
        alert('Não há registros de atividade para hoje');
      }
      calculateRemainingWeeklyTime();
      updateDisplay();
    });
}
*/

//calculate the remaining time to reach the daily goal
function calculateRemainingTime() {
  const remainingTime = dailyGoalMinutes - workedMinutes - minutes;
  if (remainingTime < 0) {
    dailyGoalDisplay.textContent = "Meta diária alcançada!";
  } else {
    dailyGoalHours = Math.floor(remainingTime / 60);
    dailyGoalMinutes = remainingTime % 60;
    dailyGoalDisplay.textContent = `${String(dailyGoalHours).padStart(
      2,
      "0"
    )}h${String(dailyGoalMinutes).padStart(2, "0")}min`;
  }
}

//calculate the remaining time to reach the weekly goal
function calculateRemainingWeeklyTime() {
  const remainingTime = weeklyGoalMinutes - workedMinutes - minutes;
  if (remainingTime < 0) {
    weeklyGoalDisplay.textContent = "Meta semanal alcançada!";
  } else {
    weeklyGoalHours = Math.floor(remainingTime / 60);
    weeklyGoalMinutes = remainingTime % 60;
    weeklyGoalDisplay.textContent = `${String(weeklyGoalHours).padStart(
      2,
      "0"
    )}h${String(weeklyGoalMinutes).padStart(2, "0")}min`;
  }
}
  

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

  fetch('http://localhost:3333/activity_logs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      activityId: Number(localStorage.getItem('selectedActivityId')),
      workedHours,
      workedMinutes: Number(minutes),
      workedSeconds: Number(seconds),
      date: new Date().toISOString(),
    })
  });

  minutes = 0;
  seconds = 0;
  //update the remaining time to reach the daily goal
  calculateRemainingTime();
  //update the remaining time to reach the weekly goal
  calculateRemainingWeeklyTime();
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
