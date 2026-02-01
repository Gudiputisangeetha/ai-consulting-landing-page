const FORM_ENDPOINT = 'https://formspree.io/f/mlgnkgnz';
const FORM_TIMEOUT = 10000;

document.addEventListener('DOMContentLoaded', () => {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
  initForm();
});

function initForm() {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  const fields = form?.querySelectorAll('input, textarea');
  if (!form || !status) return;
  let isSubmitting = false;

  fields?.forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => clearError(field));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    let isValid = true;
    fields?.forEach(field => { if (!validateField(field)) isValid = false; });
    if (isValid) {
      isSubmitting = true;
      submitForm(form, status, () => { isSubmitting = false; });
    }
  });
}

function validateField(field) {
  const value = field.value.trim();
  const type = field.type;
  const required = field.required;
  if (required && !value) {
    setInvalid(field, 'This field is required');
    return false;
  }
  if (type === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    setInvalid(field, 'Please enter a valid email');
    return false;
  }
  clearError(field);
  return true;
}

function setInvalid(field, message) {
  field.setAttribute('aria-invalid', 'true');
  field.setAttribute('aria-describedby', `error-${field.id}`);
  let error = document.getElementById(`error-${field.id}`);
  if (!error) {
    error = document.createElement('span');
    error.id = `error-${field.id}`;
    error.className = 'form-error';
    field.after(error);
  }
  error.textContent = message;
}

function clearError(field) {
  field.setAttribute('aria-invalid', 'false');
  const error = document.getElementById(`error-${field.id}`);
  if (error) error.textContent = '';
}

function submitForm(form, status, callback) {
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const subject = form.subject.value.trim() || 'Inquiry from website';
  const message = form.message.value.trim();

  function setStatus(text, type) {
    status.textContent = text;
    status.className = 'form-status';
    status.setAttribute('role', 'alert');
    if (type === 'success') status.classList.add('status-success');
    if (type === 'error') status.classList.add('status-error');
  }

  setStatus('Sending...', 'neutral');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FORM_TIMEOUT);

  fetch(FORM_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, subject, message }),
    signal: controller.signal
  })
    .then(r => {
      if (!r.ok) throw new Error('Server error');
      clearTimeout(timeout);
      setStatus("✓ Message sent successfully! We'll be in touch soon.", 'success');
      form.reset();
      form.querySelectorAll('input, textarea').forEach(f => clearError(f));
    })
    .catch(err => {
      if (err.name === 'AbortError') {
        setStatus('Request timed out. Please try again or email gudiputisangeetha@gmail.com', 'error');
      } else {
        setStatus('Failed to send. Please try emailing gudiputisangeetha@gmail.com', 'error');
      }
      console.error('Form submission error:', err);
    })
    .finally(() => { callback(); });
}
