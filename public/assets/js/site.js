/* Core Memory Works — progressive enhancement only.
 *
 * The site is static and has no backend yet, so each form composes a prefilled
 * email instead of posting. To switch to a real endpoint later, set
 * FORM_ENDPOINT below (see README) — the same markup then posts as JSON and the
 * mailto path is only used as a fallback when the request fails.
 */
(function () {
  'use strict';

  var FORM_ENDPOINT = ''; // e.g. '/api/enquiry' — empty means "use mailto"

  function labelFor(field) {
    var id = field.getAttribute('id');
    var label = id && document.querySelector('label[for="' + id + '"]');
    return (label && label.textContent.trim()) ||
      field.getAttribute('placeholder') ||
      field.getAttribute('name') ||
      'Field';
  }

  function collect(form) {
    var fields = form.querySelectorAll('input, select, textarea');
    var lines = [];
    var data = {};
    Array.prototype.forEach.call(fields, function (field) {
      if (field.type === 'submit' || !field.value) return;
      var name = field.getAttribute('name') || labelFor(field);
      lines.push(labelFor(field) + ': ' + field.value);
      data[name] = field.value;
    });
    return { lines: lines, data: data };
  }

  function say(form, message) {
    var status = form.querySelector('.form-status');
    if (status) status.textContent = message;
  }

  function sendMail(form, payload) {
    var to = form.getAttribute('data-mailto');
    var subject = form.getAttribute('data-subject') || 'Website enquiry';
    var href = 'mailto:' + to +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(payload.lines.join('\n'));
    window.location.href = href;
    say(form, 'Opening your email app — send the message it drafts and we will pick it up.');
  }

  function onSubmit(event) {
    var form = event.currentTarget;
    if (!form.checkValidity()) return; // let the browser report it
    event.preventDefault();

    var payload = collect(form);
    if (!FORM_ENDPOINT) {
      sendMail(form, payload);
      return;
    }

    say(form, 'Sending…');
    fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload.data)
    }).then(function (res) {
      if (!res.ok) throw new Error('bad status ' + res.status);
      form.reset();
      say(form, 'Thanks — that reached us. We reply within a business day.');
    }).catch(function () {
      sendMail(form, payload);
    });
  }

  Array.prototype.forEach.call(
    document.querySelectorAll('form[data-mailto]'),
    function (form) { form.addEventListener('submit', onSubmit); }
  );
})();
