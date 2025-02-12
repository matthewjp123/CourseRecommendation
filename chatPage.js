document.addEventListener('DOMContentLoaded', function() {
    displayStoredUsers(); // Corrected function name to match the definition
});

function displayStoredUsers() {
    // Retrieve user profiles from localStorage, defaulting to an empty array if none found
    const userProfiles = JSON.parse(localStorage.getItem('userProfiles')) || [];

    // Get the container element where users will be displayed
    const container = document.getElementById('container');
    if (!container) {
        console.error('Container element not found');
        return;
    }

    // Clear previous content
    container.innerHTML = '';

    // Check if there are any user profiles to display
    if (userProfiles.length === 0) {
        const noUsersMessage = document.createElement('p');
        noUsersMessage.textContent = "No users available.";
        container.appendChild(noUsersMessage);
        return;
    }

    // Iterate over each user profile and create elements to display them
    userProfiles.forEach((profile, index) => {
        // Create a div element to hold user information
        const userContainer = document.createElement('div');
        userContainer.className = 'user-container'; // For styling

        // Set the text content of the userContainer to the user's name and availability
        const userNameElement = document.createElement('p');
        userNameElement.textContent = `${profile.name} - Available`;
        userContainer.appendChild(userNameElement);

        // Create a div to contain the message input and request match button
        const inputContainer = document.createElement('div');
        inputContainer.className = 'input-container'; // For styling

        // Create a textarea for message input
        const messageInput = document.createElement('textarea');
        messageInput.placeholder = 'Enter your message';
        messageInput.className = 'message-input'; // For styling

        // Create a button for requesting a match
        const requestMatchButton = document.createElement('button');
        requestMatchButton.textContent = 'Request Match';
        requestMatchButton.className = 'request-match-button'; // For styling

        // Add an event listener to the request match button
        requestMatchButton.addEventListener('click', function() {
            // Retrieve the message from the textarea
            const message = messageInput.value;

            // Call the requestMatch function with the message and user index (or name)
            requestMatch(index, profile.name, message);
        });

        // Append elements to the inputContainer
        inputContainer.appendChild(messageInput);
        inputContainer.appendChild(requestMatchButton);

        // Append the inputContainer to the userContainer
        userContainer.appendChild(inputContainer);

        // Append the userContainer to the container
        container.appendChild(userContainer);
    });
}

function requestMatch(userIndex, userName, inputMessage) {
    // Retrieve user profiles from localStorage
    const profiles = JSON.parse(localStorage.getItem('userProfiles'));
    // Find the profile matching the userName
    const userProfile = profiles.find(profile => profile.name === userName);
    // Use the stored personal message from the userProfile, or a default message if not found
    const personalMessage = userProfile ? userProfile.message : "No personal message provided.";

    // Construct the data object including both the message entered by the requester and the user's personal message
    const data = {
        userName, 
        inputMessage, // The message entered by the requester in the textarea
        personalMessage // The personal message from the user's profile
    };

    // Convert the data object to a JSON string and create a Blob object
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    // Create a URL for the Blob object
    const url = URL.createObjectURL(blob);

    // Create an anchor element (<a>) and set its href to the Blob URL
    const link = document.createElement('a');
    link.href = url;
    link.download = 'message.json'; // Specify the file name for the download

    // Programmatically click the link to trigger the download
    link.click();

    // Clean up by revoking the Blob URL to free up resources
    URL.revokeObjectURL(url);

    // Notify the user that the message has been prepared for download
    alert(`Message for ${userName} has been prepared for download.`);
}

async function fetchStudentsByCourse(courseId) {
    const response = await fetch(`http://localhost:3000/api/courses/${courseId}/students`);
    if (!response.ok) {
        console.error('Failed to fetch students');
        return;
    }
    const students = await response.json();
    displayStudents(students);
}

function displayStudents(students) {
    const studentsListElement = document.getElementById('students-list');
    studentsListElement.innerHTML = ''; // Clear existing list
    students.forEach(student => {
        const studentElement = document.createElement('div');
        studentElement.textContent = `${student.name} - ${student.hasPartner ? 'Partnered' : 'Available'}`;

        if (!student.hasPartner) {
            const requestMatchButton = document.createElement('button');
            requestMatchButton.textContent = 'Request Match';
            requestMatchButton.addEventListener('click', () => requestMatch(student.id));
            studentElement.appendChild(requestMatchButton);
        }
        studentsListElement.appendChild(studentElement);
    });
}
