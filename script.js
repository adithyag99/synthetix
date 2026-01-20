// Google Sheets Web App URL - Replace with your deployed script URL
const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbw_ni-JHfr184SOeC3Tc_P_Zjh54pjgYHKctOtRC8SnjISE8k7-cZ8lNIOQRej7KZtL/exec';

// DOM Elements
const form = document.getElementById('email-form');
const emailInput = document.getElementById('email-input');
const submitBtn = document.getElementById('submit-btn');
const whitepaperBtn = document.getElementById('whitepaper-btn');

// Form submission handler
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = emailInput.value.trim();
  if (!email) return;

  // Show loading state
  submitBtn.classList.add('loading');
  submitBtn.disabled = true;

  try {
    // Send to Google Sheets using form data (more reliable with Apps Script)
    const formData = new FormData();
    formData.append('email', email);
    formData.append('timestamp', new Date().toISOString());

    await fetch(GOOGLE_SHEET_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: formData,
    });

    // Show success state
    submitBtn.classList.remove('loading');
    submitBtn.classList.add('success');

    // Clear input
    emailInput.value = '';

    // Reset button after 2 seconds
    setTimeout(() => {
      submitBtn.classList.remove('success');
      submitBtn.disabled = false;
    }, 2000);

  } catch (error) {
    console.error('Error submitting email:', error);

    // Reset to normal state on error
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;

    // Optional: Show error feedback
    alert('Something went wrong. Please try again.');
  }
});

// Whitepaper header button - scroll to section
if (whitepaperBtn) {
  whitepaperBtn.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('whitepaper-form').scrollIntoView({ behavior: 'smooth' });
  });
}

// Whitepaper form elements
const whitepaperForm = document.getElementById('whitepaper-form');
const whitepaperEmail = document.getElementById('whitepaper-email');
const whitepaperSubmitBtn = document.getElementById('whitepaper-submit-btn');

// Whitepaper form submission
whitepaperForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = whitepaperEmail.value.trim();
  if (!email) return;

  whitepaperSubmitBtn.classList.add('loading');
  whitepaperSubmitBtn.disabled = true;

  try {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('source', 'whitepaper');
    formData.append('timestamp', new Date().toISOString());

    await fetch(GOOGLE_SHEET_URL, {
      method: 'POST',
      mode: 'no-cors',
      body: formData,
    });

    whitepaperSubmitBtn.classList.remove('loading');
    whitepaperSubmitBtn.classList.add('success');
    whitepaperEmail.value = '';

    setTimeout(() => {
      whitepaperSubmitBtn.classList.remove('success');
      whitepaperSubmitBtn.disabled = false;
    }, 2000);

  } catch (error) {
    console.error('Error submitting email:', error);
    whitepaperSubmitBtn.classList.remove('loading');
    whitepaperSubmitBtn.disabled = false;
    alert('Something went wrong. Please try again.');
  }
});
