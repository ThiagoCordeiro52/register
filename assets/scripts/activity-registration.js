const form = document.querySelector('#activity-form'); //submit-button
//if it can't find the form, it will return error
if (!form) {
    throw new Error('Cannot find the form element');
}

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const activityData = {
        name: formData.get('activity-name'),
        goalDaily: formData.get('goal-daily'),
        goalWeekly: formData.get('goal-weekly'),
    };


    try {
        const response = await fetch('http://localhost:3333/activities', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            //body: JSON.stringify(activityData),
            //manually creating the body
            body: JSON.stringify({
                name: activityData.name,
                goalDaily: parseInt(activityData.goalDaily, 10),
                goalWeekly: parseInt(activityData.goalWeekly, 10),
            })
        });

        if (response.ok) {
            // Activity created successfully
            console.log('Activity created!');
            // Redirect to the activity selection page, aka index.html
            window.location.href = 'index.html';
            // send popup message of success
            alert('Activity created successfully!');
        } else {
            // Handle error response
            console.error('Failed to create activity');
            // send popup message of error
            alert('Failed to create activity');
            alert(response.statusText);
        }
    } catch (error) {
        // Handle network or other errors
        console.error('An error occurred', error);
    }
});