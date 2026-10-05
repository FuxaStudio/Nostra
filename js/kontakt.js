(function () {
  var CN = window.CN;
  // Dočasně e-mail Pavla (klient zatím adresu nedodal). Až bude e-mail
  // orchestru, vygenerovat na web3forms.com nový access key a vyměnit zde.
  // Stejný klíč obsluhuje českou i anglickou verzi formuláře.
  var WEB3FORMS_KEY = 'a2084dcd-d791-4f0e-aa42-0040e5b56ebc';

  var form = document.getElementById('contactForm');
  var successPanel = document.getElementById('successPanel');
  var nameEl = document.getElementById('cn-name');
  var emailEl = document.getElementById('cn-email');
  var phoneEl = document.getElementById('cn-phone');
  var messageEl = document.getElementById('cn-message');
  var gdprEl = document.getElementById('cn-gdpr');
  var botcheckEl = document.getElementById('cn-botcheck');
  var submitBtn = form.querySelector('button[type="submit"]');

  function validEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

  /* Chybová hláška je s polem propojená přes aria-describedby (v HTML),
     aria-invalid pak čtečce řekne, že je pole vyplněné špatně. */
  function setError(field, input, msg) {
    var err = document.getElementById('err-' + field);
    if (msg) {
      err.textContent = msg;
      err.hidden = false;
      if (input) {
        input.classList.add('has-error');
        input.setAttribute('aria-invalid', 'true');
      }
    } else {
      err.hidden = true;
      err.textContent = '';
      if (input) {
        input.classList.remove('has-error');
        input.removeAttribute('aria-invalid');
      }
    }
  }

  [['name', nameEl], ['email', emailEl], ['message', messageEl]].forEach(function (pair) {
    pair[1].addEventListener('input', function () { setError(pair[0], pair[1], ''); });
  });
  gdprEl.addEventListener('change', function () { setError('gdpr', gdprEl, ''); });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = true;

    if (!nameEl.value.trim()) { setError('name', nameEl, CN.t('errName')); ok = false; }
    else setError('name', nameEl, '');

    if (!emailEl.value.trim()) { setError('email', emailEl, CN.t('errEmailEmpty')); ok = false; }
    else if (!validEmail(emailEl.value.trim())) { setError('email', emailEl, CN.t('errEmailInvalid')); ok = false; }
    else setError('email', emailEl, '');

    if (!messageEl.value.trim()) { setError('message', messageEl, CN.t('errMessage')); ok = false; }
    else setError('message', messageEl, '');

    if (!gdprEl.checked) { setError('gdpr', gdprEl, CN.t('errGdpr')); ok = false; }
    else setError('gdpr', gdprEl, '');

    if (!ok) {
      /* Fokus na první chybné pole — čtečka přečte popisek i chybu. */
      var firstBad = form.querySelector('[aria-invalid="true"]');
      if (firstBad) firstBad.focus();
      return;
    }

    setError('send', null, '');
    submitBtn.disabled = true;
    var btnHtml = submitBtn.innerHTML;
    submitBtn.textContent = CN.t('sending');

    function sendFailed() {
      setError('send', null, CN.t('errSend'));
    }

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        subject: CN.t('mailSubject') + nameEl.value.trim(),
        from_name: CN.t('mailFromName'),
        name: nameEl.value.trim(),
        email: emailEl.value.trim(),
        phone: phoneEl.value.trim() || '—',
        message: messageEl.value.trim(),
        botcheck: botcheckEl.checked
      })
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.success) {
          form.hidden = true;
          successPanel.hidden = false;
          document.getElementById('successTitle').focus();
        } else {
          sendFailed();
        }
      })
      .catch(sendFailed)
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.innerHTML = btnHtml;
      });
  });

  document.getElementById('resetFormBtn').addEventListener('click', function () {
    form.reset();
    setError('name', nameEl, '');
    setError('email', emailEl, '');
    setError('message', messageEl, '');
    setError('gdpr', gdprEl, '');
    setError('send', null, '');
    successPanel.hidden = true;
    form.hidden = false;
    nameEl.focus();
  });
})();
