(function () {
  var form = document.getElementById('contactForm');
  var successPanel = document.getElementById('successPanel');
  var nameEl = document.getElementById('cn-name');
  var emailEl = document.getElementById('cn-email');
  var messageEl = document.getElementById('cn-message');
  var gdprEl = document.getElementById('cn-gdpr');

  function validEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

  function setError(field, input, msg) {
    var err = document.getElementById('err-' + field);
    if (msg) {
      err.textContent = msg;
      err.hidden = false;
      if (input) input.classList.add('has-error');
    } else {
      err.hidden = true;
      err.textContent = '';
      if (input) input.classList.remove('has-error');
    }
  }

  [['name', nameEl], ['email', emailEl], ['message', messageEl]].forEach(function (pair) {
    pair[1].addEventListener('input', function () { setError(pair[0], pair[1], ''); });
  });
  gdprEl.addEventListener('change', function () { setError('gdpr', null, ''); });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = true;

    if (!nameEl.value.trim()) { setError('name', nameEl, 'Vyplňte prosím své jméno.'); ok = false; }
    else setError('name', nameEl, '');

    if (!emailEl.value.trim()) { setError('email', emailEl, 'Vyplňte prosím e-mail.'); ok = false; }
    else if (!validEmail(emailEl.value.trim())) { setError('email', emailEl, 'Zadejte platný e-mail.'); ok = false; }
    else setError('email', emailEl, '');

    if (!messageEl.value.trim()) { setError('message', messageEl, 'Napište nám prosím zprávu.'); ok = false; }
    else setError('message', messageEl, '');

    if (!gdprEl.checked) { setError('gdpr', null, 'Bez souhlasu nelze zprávu odeslat.'); ok = false; }
    else setError('gdpr', null, '');

    if (!ok) return;

    form.hidden = true;
    successPanel.hidden = false;
  });

  document.getElementById('resetFormBtn').addEventListener('click', function () {
    form.reset();
    setError('name', nameEl, '');
    setError('email', emailEl, '');
    setError('message', messageEl, '');
    setError('gdpr', null, '');
    successPanel.hidden = true;
    form.hidden = false;
  });
})();
