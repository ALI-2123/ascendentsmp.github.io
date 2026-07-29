// Default password is set to: admin123
const ADMIN_HASH = "240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9";

async function hashPassword(str) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

document.addEventListener("DOMContentLoaded", () => {
    const authSection = document.getElementById("auth-section");
    const panelSection = document.getElementById("panel-section");
    const loginForm = document.getElementById("login-form");
    const loginErr = document.getElementById("login-err");

    if (sessionStorage.getItem("admin_authenticated") === "true") {
        showPanel();
    }

    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const inputPass = document.getElementById("admin-pass").value;
        const hashedInput = await hashPassword(inputPass);

        if (hashedInput === ADMIN_HASH) {
            sessionStorage.setItem("admin_authenticated", "true");
            loginErr.style.display = "none";
            showPanel();
        } else {
            loginErr.style.display = "block";
        }
    });

    document.getElementById("logout-btn").addEventListener("click", () => {
        sessionStorage.removeItem("admin_authenticated");
        location.reload();
    });

    function showPanel() {
        authSection.classList.add("hidden");
        panelSection.classList.remove("hidden");
        renderTickets();
    }
});

function renderTickets() {
    const container = document.getElementById("tickets-container");
    const tickets = JSON.parse(localStorage.getItem("support_tickets")) || [];

    if (tickets.length === 0) {
        container.innerHTML = "<p>No submitted tickets found.</p>";
        return;
    }

    container.innerHTML = tickets.map((t, idx) => `
        <div class="ticket-card">
            <div style="display:flex; justify-content:space-between;">
                <h3>[${t.type}] #${t.id} - ${t.ign || t.reporterIgn}</h3>
                <span class="badge ${t.status}">${t.status}</span>
            </div>
            <p><strong>Date:</strong> ${t.date}</p>

            ${t.type === 'Ban Appeal' ? `
                <p><strong>Discord:</strong> ${escapeHtml(t.discord)}</p>
                <p><strong>Reason:</strong> ${escapeHtml(t.reason)}</p>
                <p><strong>Explanation:</strong> ${escapeHtml(t.explanation)}</p>
                <div>
                    <p><strong>Mods Screenshot:</strong></p>
                    <a href="${t.modsImg}" target="_blank"><img src="${t.modsImg}" class="img-preview"/></a>
                    <p><strong>Game Files Screenshot:</strong></p>
                    <a href="${t.filesImg}" target="_blank"><img src="${t.filesImg}" class="img-preview"/></a>
                </div>
            ` : `
                <p><strong>Reported Player:</strong> ${escapeHtml(t.targetIgn)}</p>
                <p><strong>Evidence Video:</strong> <a href="${escapeHtml(t.videoUrl)}" target="_blank" style="color:#ffaa00;">Watch Evidence Link</a></p>
                <p><strong>Details:</strong> ${escapeHtml(t.details)}</p>
            `}

            <hr style="border-color:#282c37; margin:15px 0;">

            <div>
                <h4>Admin Actions & Response</h4>
                <select onchange="updateStatus(${idx}, this.value)">
                    <option value="Pending" ${t.status === 'Pending' ? 'selected' : ''}>Pending</option>
                    <option value="Accepted" ${t.status === 'Accepted' ? 'selected' : ''}>Accepted</option>
                    <option value="Denied" ${t.status === 'Denied' ? 'selected' : ''}>Denied</option>
                    <option value="Resolved" ${t.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
                </select>

                <div class="comments-list">
                    <strong>Admin Comments:</strong>
                    ${(t.comments || []).map(c => `<p style="margin:5px 0;">• ${escapeHtml(c)}</p>`).join('') || '<p style="margin:5px 0; color:#777;">No comments added yet.</p>'}
                </div>

                <div style="display:flex; gap:10px;">
                    <input type="text" id="comment-input-${idx}" placeholder="Add admin response...">
                    <button onclick="addComment(${idx})" style="width:120px;">Add Note</button>
                </div>
            </div>
        </div>
    `).join('');
}

function updateStatus(index, newStatus) {
    const tickets = JSON.parse(localStorage.getItem("support_tickets")) || [];
    tickets[index].status = newStatus;
    localStorage.setItem("support_tickets", JSON.stringify(tickets));
    renderTickets();
}

function addComment(index) {
    const input = document.getElementById(`comment-input-${index}`);
    if (!input.value.trim()) return;

    const tickets = JSON.parse(localStorage.getItem("support_tickets")) || [];
    if (!tickets[index].comments) tickets[index].comments = [];
    
    tickets[index].comments.push(input.value.trim());
    localStorage.setItem("support_tickets", JSON.stringify(tickets));
    renderTickets();
}

function escapeHtml(str) {
    return (str || '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m]));
}
