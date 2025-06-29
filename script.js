document.addEventListener('DOMContentLoaded', () => {
// Inicializa AOS (animações ao scroll)
AOS.init({ duration: 1200, once: true });

// Tema claro/escuro
const toggleThemeBtn = document.getElementById('toggle-theme');
const icon = toggleThemeBtn.querySelector('i');

function applyTheme(theme) {
  if (theme === 'light') {
    document.body.classList.add('light-mode');
    icon.classList.replace('fa-moon', 'fa-sun');
  } else {
    document.body.classList.remove('light-mode');
    icon.classList.replace('fa-sun', 'fa-moon');
  }
}

const savedTheme = localStorage.getItem('theme') || 'dark';
applyTheme(savedTheme);

toggleThemeBtn.addEventListener('click', () => {
  const isLight = document.body.classList.toggle('light-mode');
  if (isLight) {
    icon.classList.replace('fa-moon', 'fa-sun');
    localStorage.setItem('theme', 'light');
  } else {
    icon.classList.replace('fa-sun', 'fa-moon');
    localStorage.setItem('theme', 'dark');
  }
});

// Mostrar mensagens no formulário
function showMessage(msg, type = 'success') {
  const box = document.getElementById('form-message');
  if (!box) return;

  box.style.display = 'flex';
  box.style.opacity = '1';

  let bgColor, textColor, iconHTML;
  switch (type) {
    case 'success':
      bgColor = '#d4edda';
      textColor = '#155724';
      iconHTML = '<i class="fas fa-check-circle" style="color:#155724;"></i>';
      break;
    case 'error':
      bgColor = '#f8d7da';
      textColor = '#721c24';
      iconHTML = '<i class="fas fa-exclamation-circle" style="color:#721c24;"></i>';
      break;
    case 'info':
    default:
      bgColor = '#cce5ff';
      textColor = '#004085';
      iconHTML = '<i class="fas fa-info-circle" style="color:#004085;"></i>';
      break;
  }

  box.style.backgroundColor = bgColor;
  box.style.color = textColor;
  box.innerHTML = `
    <span style="display:flex; align-items:center; gap:0.5rem;">
      ${iconHTML} <span>${msg}</span>
    </span>
  `;

  const closeBtn = document.createElement('button');
  closeBtn.textContent = '×';
  closeBtn.setAttribute('aria-label', 'Fechar mensagem');
  Object.assign(closeBtn.style, {
    background: 'transparent',
    border: 'none',
    color: 'inherit',
    fontSize: '1.5rem',
    cursor: 'pointer',
    lineHeight: '1',
    padding: '0',
    marginLeft: 'auto',
  });

  closeBtn.addEventListener('click', () => {
    box.style.opacity = '0';
    setTimeout(() => {
      box.style.display = 'none';
      box.innerHTML = '';
    }, 300);
  });

  box.appendChild(closeBtn);
}

// Validação simples do formulário
function validateForm(form) {
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();

  if (name.length < 2) {
    showMessage('Por favor, insira um nome válido.', 'error');
    form.name.focus();
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showMessage('Por favor, insira um e-mail válido.', 'error');
    form.email.focus();
    return false;
  }
  if (message.length < 5) {
    showMessage('Por favor, insira uma mensagem com pelo menos 5 caracteres.', 'error');
    form.message.focus();
    return false;
  }
  return true;
}

// EmailJS (substitua pelos seus dados)
emailjs.init('SEU_USER_ID_AQUI');

const form = document.getElementById('contact-form');
const submitBtn = form.querySelector('button[type="submit"]');

async function sendEmail(form) {
  showMessage('Enviando mensagem...', 'info');
  submitBtn.disabled = true;
  submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Enviando...`;

  try {
    await emailjs.sendForm('SEU_SERVICE_ID_AQUI', 'SEU_TEMPLATE_ID_AQUI', form);
    showMessage('Mensagem enviada com sucesso! Obrigada pelo contato 😊', 'success');
    form.reset();
  } catch (error) {
    console.error('EmailJS Error:', error);
    showMessage('Erro ao enviar mensagem. Tente novamente mais tarde.', 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Enviar Mensagem';
  }
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!validateForm(form)) return;
  sendEmail(form);
});
});
