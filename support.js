document.addEventListener("DOMContentLoaded", () => {
    const supportForm = document.getElementById("support-form");
    const successMsg = document.getElementById("success-msg");

    supportForm.addEventListener("submit", (e) => {
        e.preventDefault();

        // Get values from input fields
        const usernameInput = document.getElementById("user-name").value.trim();
        const messageInput = document.getElementById("user-message").value.trim();

        if (!usernameInput || !messageInput) {
            alert("Please fill out all fields.");
            return;
        }

        // Create new ticket object
        const newTicket = {
            id: Date.now(),
            username: usernameInput,
            message: messageInput,
            status: "Pending",
            date: new Date().toLocaleString()
        };

        // Fetch existing tickets from LocalStorage or start an empty array
        const existingTickets = JSON.parse(localStorage.getItem("support_tickets")) || [];

        // Add the new ticket to the list
        existingTickets.push(newTicket);

        // Save back to LocalStorage
        localStorage.setItem("support_tickets", JSON.stringify(existingTickets));

        // Show success message and clear form
        successMsg.style.display = "block";
        supportForm.reset();

        // Hide success message after 4 seconds
        setTimeout(() => {
            successMsg.style.display = "none";
        }, 4000);
    });
});
