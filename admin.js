document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("admin-login-form");
    const loginSection = document.getElementById("login-section");
    const adminPanel = document.getElementById("admin-panel");
    const errorMsg = document.getElementById("error-msg");
    const logoutBtn = document.getElementById("logout-btn");

    // Check existing session
    if (localStorage.getItem("admin_logged_in") === "true") {
        showPanel();
    }

    // Login Submission Handler
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const user = document.getElementById("admin-user").value;
        const pass = document.getElementById("admin-pass").value;

        // Replace with your credentials or backend endpoint check
        if (user === "admin" && pass === "admin123") {
            localStorage.setItem("admin_logged_in", "true");
            errorMsg.style.display = "none";
            showPanel();
        } else {
            errorMsg.style.display = "block";
        }
    });

    // Logout Handler
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("admin_logged_in");
        adminPanel.classList.add("hidden");
        loginSection.classList.remove("hidden");
    });

    function showPanel() {
        loginSection.classList.add("hidden");
        adminPanel.classList.remove("hidden");
        loadTickets();
    }

    // Load Support Tickets (Stored from support.html via localStorage or API)
    function loadTickets() {
        const ticketList = document.getElementById("ticket-list");
        const tickets = JSON.parse(localStorage.getItem("support_tickets")) || [];

        ticketList.innerHTML = "";

        if (tickets.length === 0) {
            ticketList.innerHTML = `<tr><td colspan="5" style="text-align:center;">No open support tickets found.</td></tr>`;
            return;
        }

        tickets.forEach((ticket, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>#${index + 1}</td>
                <td>${escapeHtml(ticket.username || 'Anonymous')}</td>
                <td>${escapeHtml(ticket.message || '')}</td>
                <td><span style="color: ${ticket.status === 'Resolved' ? '#28a745' : '#ffc107'}">${ticket.status || 'Pending'}</span></td>
                <td><button onclick="resolveTicket(${index})" style="padding: 4px 8px;">Resolve</button></td>
            `;
            ticketList.appendChild(row);
        });
    }

    // Global helper to update ticket state
    window.resolveTicket = function(index) {
        let tickets = JSON.parse(localStorage.getItem("support_tickets")) || [];
        if (tickets[index]) {
            tickets[index].status = "Resolved";
            localStorage.setItem("support_tickets", JSON.stringify(tickets));
            loadTickets();
        }
    };

    function escapeHtml(str) {
        return str.replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m]));
    }
});
