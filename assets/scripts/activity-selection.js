document.addEventListener("DOMContentLoaded", function () {
  loadActivities();
});

async function loadActivities() {
  const response = await fetch("http://localhost:3333/activities");
  const activities = await response.json();

  const activityList = document.getElementById("activity-list");
  activityList.innerHTML = "";

  activities.forEach((activity) => {
    const activityItem = document.createElement("a");

    activityItem.classList.add("activity-item");
    activityItem.textContent = activity.name;
    activityItem.href = "counter.html";
    activityItem.addEventListener("click", (event) => {
      event.preventDefault();
      selectActivity(activity, activityItem);
    });

    activityList.appendChild(activityItem);
  });
}

function selectActivity(activity, element) {
  document.querySelectorAll('.activity-item').forEach(item => {
    item.classList.remove('selected');
  });

  element.classList.add('selected');

  // Store the selected activity ID in localStorage
  localStorage.setItem('selectedActivityId', activity.id);

  // Redirect to the counter page
  window.location.href = 'counter.html';
}
