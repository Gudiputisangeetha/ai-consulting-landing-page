﻿// Configuration: Formspree endpoint for contact form
const FORM_ENDPOINT = "https://formspree.io/f/mlgnkgnz"; // Formspree form endpoint

document.addEventListener('DOMContentLoaded', () => {
	// set year in footer
	const yearEl = document.getElementById('year');
	if (yearEl) yearEl.textContent = new Date().getFullYear();

	const form = document.getElementById('contactForm');
	const status = document.getElementById('formStatus');

	if (!form) return;

	form.addEventListener('submit', async (e) => {
		e.preventDefault();
		clearStatus();

		const data = {
			name: form.name.value.trim(),
			email: form.email.value.trim(),
			subject: form.subject.value.trim(),
			message: form.message.value.trim(),
		};

		if (!data.name) form.name.setAttribute('aria-invalid', 'true');
else form.name.removeAttribute('aria-invalid');
        if (!data.email) form.email.setAttribute('aria-invalid', 'true');
        else form.email.removeAttribute('aria-invalid');
        if (!data.message) form.message.setAttribute('aria-invalid', 'true');
        else form.message.removeAttribute('aria-invalid');


		// If a server endpoint is configured, POST JSON there.
		if (FORM_ENDPOINT) {
			try {
				showStatus('Sending...', 'neutral');
				const res = await fetch(FORM_ENDPOINT, {
					method: 'POST',
					headers: {'Content-Type':'application/json'},
					body: JSON.stringify(data),
				});
				if (!res.ok) throw new Error(`Status ${res.status}`);
				showStatus('Message sent — thank you!', 'success');
				form.reset();
			} catch (err) {
				showStatus('Failed to send (server). Try emailing gudiputisangeetha@gmail.com', 'error');
				console.error(err);
			}
			return;
		}

		// Default: open a mailto: link so the user's mail client handles sending.
		try {
			const subject = data.subject || 'Inquiry from website';
			const body = `Name: ${data.name}%0AEmail: ${data.email}%0A%0A${encodeURIComponent(data.message)}`;
			const mailto = `mailto:gudiputisangeetha@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
			window.location.href = mailto;
			showStatus('Opening your mail client...', 'success');
			form.reset();
		} catch (err) {
			showStatus('Unable to open mail client. Please email gudiputisangeetha@gmail.com', 'error');
		}
	});

	function showStatus(text, type){
		if (!status) return;
		status.textContent = text;
		status.className = 'form-status';
		if (type === 'success') status.classList.add('status-success');
		if (type === 'error') status.classList.add('status-error');
	}

	function clearStatus(){
		if (!status) return;
		status.textContent = '';
		status.className = 'form-status';
	}
});