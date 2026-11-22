const API_URL = "/api/feedback";

const feedbackForm = document.getElementById("feedbackForm");
const feedbackContainer = document.getElementById("feedbackContainer");
const message = document.getElementById("message");

// Fetch all feedback
async function loadFeedback() {
    try {
        const response = await fetch(API_URL);
        const feedback = await response.json();

        feedbackContainer.innerHTML = "";

        if (feedback.length === 0) {
            feedbackContainer.innerHTML = "<p>No feedback submitted yet.</p>";
            return;
        }

        feedback.forEach(item => {
            const card = document.createElement("div");
            card.className = "feedback-item";

            card.innerHTML = `
                <h3>${item.subject}</h3>
                <p><strong>Name:</strong> ${item.name}</p>
                <p><strong>USN:</strong> ${item.usn}</p>
                <p><strong>Rating:</strong> ${item.rating}/5</p>
                <p><strong>Comments:</strong> ${item.comments || "No comments"}</p>
            `;

            feedbackContainer.appendChild(card);
        });

    } catch (error) {
        feedbackContainer.innerHTML =
            "<p>Unable to connect to the backend.</p>";
    }
}

// Submit feedback
feedbackForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const feedback = {
        name: document.getElementById("name").value,
        usn: document.getElementById("usn").value,
        subject: document.getElementById("subject").value,
        rating: Number(document.getElementById("rating").value),
        comments: document.getElementById("comments").value
    };

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(feedback)
        });

        if (!response.ok) {
            throw new Error("Submission failed");
        }

        message.textContent = "Feedback submitted successfully!";
        message.style.color = "green";

        feedbackForm.reset();

        loadFeedback();

    } catch (error) {
        message.textContent = "Error submitting feedback.";
        message.style.color = "red";
    }
});

// Load feedback when page opens
loadFeedback();
