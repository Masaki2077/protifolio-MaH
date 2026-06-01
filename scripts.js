/* ==========================================================
   scripts.js — Matheus Henrique Anjos
   Portfólio HTML5 Front-End · ULBRA Itumbiara
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  /* ── MENU MOBILE ── */
  const toggle = document.querySelector('.nav-toggle');
  const links  = document.querySelector('.nav-links');

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', open);
    });
    
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', false);
      });
    });
  }

  /* ── LINK ATIVO NA NAVEGAÇÃO ── */
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });

  /* ── ALTERNADOR DE TEMA (DARK/LIGHT) ── */
  const themeBtn = document.querySelector('.theme-toggle');
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') document.body.classList.add('light-mode');
  if (themeBtn) {
    themeBtn.textContent = document.body.classList.contains('light-mode') ? '☀ Claro' : '🌙 Escuro';
    themeBtn.addEventListener('click', () => {
      document.body.classList.toggle('light-mode');
      const isLight = document.body.classList.contains('light-mode');
      localStorage.setItem('theme', isLight ? 'light' : 'dark');
      themeBtn.textContent = isLight ? '☀ Claro' : '🌙 Escuro';
    });
  }

  /* ── ANIMAÇÃO DA BARRA DE PROGRESSO ── */
  const prog = document.getElementById('progress-habilidades');
  if (prog) {
    setTimeout(() => { prog.value = prog.getAttribute('data-value') || 78; }, 500);
  }

  // Inicializa todos os módulos estruturados abaixo
  initFormValidation();
  initCanvas();
  initDragDrop();
  initGeolocation();
  initStorage();
  initClipboard();
  initShowcase();
});

/* ────────────────────────────────────────────────
   2. VALIDAÇÃO DE FORMULÁRIO (CONTRATO)
──────────────────────────────────────────────── */
function initFormValidation() {
  const form = document.getElementById('form-portfolio');
  if (!form) return;

  const fields = {
    nome:        { el: form.querySelector('#nome'),        msgs: { required: 'Nome é obrigatório.', minlength: 'Mínimo 3 caracteres.' } },
    email:       { el: form.querySelector('#email'),       msgs: { required: 'E-mail é obrigatório.', pattern: 'E-mail inválido.' } },
    tel:         { el: form.querySelector('#tel'),         msgs: { required: 'Telefone é obrigatório.', pattern: 'Use o formato (DD) 9XXXX-XXXX.' } },
    dataNasc:    { el: form.querySelector('#data-nasc'),   msgs: { required: 'Data de nascimento obrigatória.', age: 'Idade mínima: 16 anos.' } },
    senha:       { el: form.querySelector('#senha'),       msgs: { required: 'Senha obrigatória.', minlength: 'Mínimo 8 caracteres.' } },
    senhaConf:   { el: form.querySelector('#senha-conf'),  msgs: { required: 'Confirme a senha.', match: 'As senhas não coincidem.' } },
    bio:         { el: form.querySelector('#bio'),         msgs: { required: 'Bio obrigatória.', minlength: 'Mínimo 20 caracteres.' } },
    termos:      { el: form.querySelector('#termos'),      msgs: { required: 'Aceite os termos para continuar.' } },
  };

  Object.values(fields).forEach(({ el }) => {
    if (!el) return;
    el.addEventListener('input', () => clearError(el));
    el.addEventListener('change', () => clearError(el));
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    const nome = fields.nome.el;
    if (nome) {
      if (!nome.value.trim()) { showError(nome, fields.nome.msgs.required); valid = false; }
      else if (nome.value.trim().length < 3) { showError(nome, fields.nome.msgs.minlength); valid = false; }
    }

    const email = fields.email.el;
    if (email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.value.trim()) { showError(email, fields.email.msgs.required); valid = false; }
      else if (!re.test(email.value)) { showError(email, fields.email.msgs.pattern); valid = false; }
    }

    const tel = fields.tel.el;
    if (tel) {
      const retel = /^\(\d{2}\)\s9\d{4}-\d{4}$/;
      if (!tel.value.trim()) { showError(tel, fields.tel.msgs.required); valid = false; }
      else if (!retel.test(tel.value)) { showError(tel, fields.tel.msgs.pattern); valid = false; }
    }

    const dataNasc = fields.dataNasc.el;
    if (dataNasc) {
      if (!dataNasc.value) { showError(dataNasc, fields.dataNasc.msgs.required); valid = false; }
      else {
        const hoje = new Date();
        const nasc = new Date(dataNasc.value);
        let idade = hoje.getFullYear() - nasc.getFullYear();
        const m = hoje.getMonth() - nasc.getMonth();
        if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) idade--;
        if (idade < 16) { showError(dataNasc, fields.dataNasc.msgs.age); valid = false; }
      }
    }

    const senha = fields.senha.el;
    if (senha) {
      if (!senha.value) { showError(senha, fields.senha.msgs.required); valid = false; }
      else if (senha.value.length < 8) { showError(senha, fields.senha.msgs.minlength); valid = false; }
    }

    const senhaConf = fields.senhaConf.el;
    if (senhaConf && senha) {
      if (!senhaConf.value) { showError(senhaConf, fields.senhaConf.msgs.required); valid = false; }
      else if (senhaConf.value !== senha.value) { showError(senhaConf, fields.senhaConf.msgs.match); valid = false; }
    }

    const radios = form.querySelectorAll('input[name="nivel"]');
    const nivelErr = form.querySelector('#nivel-error');
    if (radios.length && nivelErr) {
      const checked = [...radios].some(r => r.checked);
      if (!checked) { nivelErr.textContent = 'Selecione seu nível de experiência.'; valid = false; }
      else nivelErr.textContent = '';
    }

    const bio = fields.bio.el;
    if (bio) {
      if (!bio.value.trim()) { showError(bio, fields.bio.msgs.required); valid = false; }
      else if (bio.value.trim().length < 20) { showError(bio, fields.bio.msgs.minlength); valid = false; }
    }

    const termos = fields.termos.el;
    if (termos && !termos.checked) {
      const err = document.getElementById('termos-error');
      if (err) err.textContent = fields.termos.msgs.required;
      valid = false;
    }

    if (valid) {
      const msg = document.getElementById('success-msg');
      if (msg) {
        msg.style.display = 'block';
        form.reset();
        msg.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => { msg.style.display = 'none'; }, 6000);
      }
    }
  });

  function showError(el, msg) {
    const span = el.closest('.form-group')?.querySelector('.error-msg');
    if (span) span.textContent = msg;
    el.setAttribute('aria-invalid', 'true');
  }
  function clearError(el) {
    const span = el.closest('.form-group')?.querySelector('.error-msg');
    if (span) span.textContent = '';
    el.removeAttribute('aria-invalid');
  }
}

/* ────────────────────────────────────────────────
   3. CANVAS — GALERIA (Formas Estáticas)
──────────────────────────────────────────────── */
function initCanvas() {
  const canvas = document.getElementById('galeria-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const colorPicker = document.getElementById('canvas-color');
  
  const btnFormas = document.getElementById('galeria-btn-formas');
  const btnGradiente = document.getElementById('galeria-btn-gradiente');
  const btnLimpar = document.getElementById('galeria-btn-limpar');

  function getColor() { 
    return colorPicker ? colorPicker.value : '#6c63ff'; 
  }

  if (btnFormas) {
    btnFormas.addEventListener('click', () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const corSelecionada = getColor();
      
      /* Retângulo */
      ctx.fillStyle = corSelecionada;
      ctx.fillRect(40, 60, 120, 80);
      
      /* Círculo */
      ctx.beginPath();
      ctx.arc(280, 100, 55, 0, Math.PI * 2);
      ctx.fillStyle = corSelecionada + 'cc';
      ctx.fill();
      
      /* Triângulo */
      ctx.beginPath();
      ctx.moveTo(440, 140); 
      ctx.lineTo(490, 50); 
      ctx.lineTo(540, 140);
      ctx.closePath();
      ctx.fillStyle = corSelecionada + '99';
      ctx.fill();
    });
  }

  if (btnGradiente) {
    btnGradiente.addEventListener('click', () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const corUsuario = getColor(); 
      
      const grd = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grd.addColorStop(0, corUsuario);          
      grd.addColorStop(0.5, '#ff6584');         
      grd.addColorStop(1, '#00b4d8');           
      
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    });
  }

  if (btnLimpar) {
    btnLimpar.addEventListener('click', () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
  }
}

/* ────────────────────────────────────────────────
   4. DRAG & DROP
──────────────────────────────────────────────── */
function initDragDrop() {
  const draggables = document.querySelectorAll('[draggable="true"]');
  const zones      = document.querySelectorAll('.drop-zone');

  draggables.forEach(el => {
    el.addEventListener('dragstart', e => {
      e.dataTransfer.setData('text/plain', el.id);
      el.style.opacity = '0.4';
    });

    el.addEventListener('dragend', () => {
      el.style.opacity = '1';
    });
  });

  zones.forEach(zone => {
    zone.addEventListener('dragover', e => {
      e.preventDefault();
      zone.classList.add('dragover');
    });

    zone.addEventListener('dragleave', () => {
      zone.classList.remove('dragover');
    });

    zone.addEventListener('drop', e => {
      e.preventDefault();
      zone.classList.remove('dragover');
      
      const id = e.dataTransfer.getData('text/plain');
      const draggedElement = document.getElementById(id);
      
      if (draggedElement) {
        zone.innerHTML = ''; 
        zone.appendChild(draggedElement); 
      }
    });
  });
}

/* ────────────────────────────────────────────────
   5. GEOLOCALIZAÇÃO
──────────────────────────────────────────────── */
function obterLocalizacao(resultId) {
  const result = document.getElementById(resultId || 'geo-result');
  if (!result) return;
  if (!navigator.geolocation) {
    result.textContent = '⚠ Geolocalização não suportada neste navegador.';
    return;
  }
  result.textContent = '📡 Obtendo localização...';
  navigator.geolocation.getCurrentPosition(
    pos => {
      const { latitude, longitude, accuracy } = pos.coords;
      result.innerHTML = `📍 Lat: <strong>${latitude.toFixed(5)}</strong> | Lon: <strong>${longitude.toFixed(5)}</strong> | Precisão: ±${accuracy.toFixed(0)} m`;
    },
    err => {
      const msgs = {
        1: '🚫 Permissão negada pelo usuário.',
        2: '⚠ Posição indisponível.',
        3: '⏱ Tempo esgotado.',
      };
      result.textContent = msgs[err.code] || 'Erro desconhecido.';
    }
  );
}

function initGeolocation() {
  // Inicialização passiva caso precise monitorar eventos de geolocalização no load
}

/* ────────────────────────────────────────────────
   6. WEB STORAGE
──────────────────────────────────────────────── */
function salvarStorage(inputId, resultId) {
  const input  = document.getElementById(inputId  || 'storage-input');
  const result = document.getElementById(resultId || 'storage-result');
  if (!input || !result) return;
  localStorage.setItem('portfolio_valor', input.value);
  result.textContent = `💾 Salvo: "${input.value}"`;
}

function carregarStorage(inputId, resultId) {
  const input  = document.getElementById(inputId  || 'storage-input');
  const result = document.getElementById(resultId || 'storage-result');
  const val = localStorage.getItem('portfolio_valor');
  if (input && val !== null) input.value = val;
  if (result) result.textContent = val !== null ? `📂 Carregado: "${val}"` : '⚠ Nada salvo ainda.';
}

function initStorage() {
  // Inicialização das variáveis de storage no load
}

/* ────────────────────────────────────────────────
   7. CLIPBOARD
──────────────────────────────────────────────── */
function copiarTexto(textoId, confirmId) {
  const el     = document.getElementById(textoId  || 'copy-text');
  const conf   = document.getElementById(confirmId|| 'copy-confirm');
  const texto  = el ? el.textContent.trim() : 'matheus.henrique@email.com';
  navigator.clipboard.writeText(texto).then(() => {
    if (conf) { conf.textContent = '✅ Copiado!'; setTimeout(() => conf.textContent = '', 2500); }
  }).catch(() => {
    if (conf) conf.textContent = '⚠ Não foi possível copiar.';
  });
}

function initClipboard() {
  // Inicialização passiva do módulo de transferência
}

/* ────────────────────────────────────────────────
   8. SHOWCASE — Canvas livre + SVG + Storage avançado
──────────────────────────────────────────────── */
function initShowcase() {
  const fc = document.getElementById('free-canvas');
  if (fc) {
    const ctx = fc.getContext('2d');
    let drawing = false;
    let lastX = 0;
    let lastY = 0;
    
    const colorEl = document.getElementById('draw-color');
    const sizeEl  = document.getElementById('draw-size');
    const btnLimparShowcase = document.getElementById('showcase-btn-limpar');

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, fc.width, fc.height);

    function desenhar(e) {
      if (!drawing) return;
      
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(e.offsetX, e.offsetY);
      
      ctx.strokeStyle = colorEl ? colorEl.value : '#6c63ff';
      ctx.lineWidth   = sizeEl  ? sizeEl.value  : 4;
      ctx.lineCap = 'round'; 
      ctx.lineJoin = 'round';
      
      ctx.stroke();
      [lastX, lastY] = [e.offsetX, e.offsetY];
    }

    fc.addEventListener('mousedown', e => {
      drawing = true;
      [lastX, lastY] = [e.offsetX, e.offsetY];
    });
    
    fc.addEventListener('mousemove', desenhar);
    fc.addEventListener('mouseup',   () => drawing = false);
    fc.addEventListener('mouseleave',() => drawing = false);

    if (btnLimparShowcase) {
      btnLimparShowcase.addEventListener('click', () => {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, fc.width, fc.height);
      });
    }
  }

  /* Listar chaves do localStorage e sessionStorage */
  window.listarStorage = () => {
    const lista = document.getElementById('storage-lista');
    if (!lista) return;
    lista.innerHTML = '';
    const todosLocal   = Object.keys(localStorage);
    const todosSession = Object.keys(sessionStorage);
    if (!todosLocal.length && !todosSession.length) { lista.textContent = 'Nenhum item salvo.'; return; }
    todosLocal.forEach(k => {
      lista.innerHTML += `<div><strong>[LS]</strong> ${k}: ${localStorage.getItem(k)}</div>`;
    });
    todosSession.forEach(k => {
      lista.innerHTML += `<div><strong>[SS]</strong> ${k}: ${sessionStorage.getItem(k)}</div>`;
    });
  };

  window.salvarSession = () => {
    const inp = document.getElementById('session-input');
    if (inp) sessionStorage.setItem('session_valor', inp.value);
    listarStorage();
  };

  /* Mini formulário do Showcase */
  const miniForm = document.getElementById('mini-form');
  if (miniForm) {
    miniForm.addEventListener('submit', e => {
      e.preventDefault();
      const nomeEl = miniForm.querySelector('#mini-nome');
      const err    = miniForm.querySelector('#mini-nome-err');
      if (nomeEl && err) {
        if (!nomeEl.value.trim() || nomeEl.value.trim().length < 3) {
          err.textContent = 'Nome inválido (mín. 3 caracteres).';
        } else {
          err.textContent = '';
          const ok = miniForm.querySelector('#mini-ok');
          if (ok) { ok.textContent = '✅ Enviado com sucesso!'; setTimeout(() => ok.textContent = '', 3000); }
          miniForm.reset();
        }
      }
    });
  }
}