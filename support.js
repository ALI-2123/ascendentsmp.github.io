function switchTab(type) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.form-section').forEach(form => form.classList.remove('active'));

    if (type === 'appeal') {
        document.querySelectorAll('.tab-btn')[0].classList.add('active');
        document.getElementById('appeal-form').classList.add('active');
    } else {
        document.querySelectorAll('.tab-btn')[1].classList.add('active');
        document.getElementById('report-form').classList.add('active');
    }
}

// Convert uploaded images to Base64
const fileToBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

// Submit Appeal Handler
document.getElementById('appeal-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const modsFile = document.getElementById('appeal-mods-img').files[0];
    const filesFile = document.getElementById('appeal-files-img').files[0];

    const ticket = {
        id: 'APP-' + Date.now().toString().slice(-5),
        type: 'Ban Appeal',
        ign: document.getElementById('appeal-ign').value,
        discord: document.getElementById('appeal-discord').value,
        reason: document.getElementById('appeal-reason').value,
        explanation: document.getElementById('appeal-explanation').value,
        modsImg: await fileToBase64(modsFile),
        filesImg: await fileToBase64(filesFile),
        status: 'Pending',
        comments: [],
        date: new Date().toLocaleDateString()
    };

    saveTicket(ticket);
    e.target.reset();
});

// Submit Report Handler
document.getElementById('report-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const ticket = {
        id: 'REP-' + Date.now().toString().slice(-5),
        type: 'Player Report',
        reporterIgn: document.getElementById('report-your-ign').value,
        targetIgn: document.getElementById('report-target-ign').value,
        videoUrl: document.getElementById('report-video-url').value,
        details: document.getElementById('report-details').value,
        status: 'Pending',
        comments: [],
        date: new Date().toLocaleDateString()
    };

    saveTicket(ticket);
    e.target.reset();
});

function saveTicket(ticket) {
    const tickets = JSON.parse(localStorage.getItem('support_tickets')) || [];
    tickets.unshift(ticket);
    localStorage.setItem('support_tickets', JSON.stringify(tickets));

    const statusBox = document.getElementById('status-box');
    statusBox.style.display = 'block';
    statusBox.style.background = '#1b3e20';
    statusBox.style.color = '#5cdb6d';
    statusBox.innerHTML = `Ticket Submitted! ID: <strong>#${ticket.id}</strong>. Please wait for an admin to respond.`;
}
