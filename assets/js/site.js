/* zestcollective.ro — efecte: meniu mobil, slideshow home, galerie cu sageti, lightbox, cookies, formular */
(function () {
  'use strict';
  var body = document.body;

  /* ---------- meniu mobil ---------- */
  var toggle = document.querySelector('.menu-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var open = body.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  /* ---------- banner cookies ---------- */
  var banner = document.querySelector('.cookie-banner');
  var accepted = false;
  try { accepted = localStorage.getItem('zest-cookies-ok') === '1'; } catch (e) {}
  if (banner && !accepted) {
    banner.hidden = false;
    banner.querySelector('.cookie-ok').addEventListener('click', function () {
      banner.hidden = true;
      try { localStorage.setItem('zest-cookies-ok', '1'); } catch (e) {}
    });
  }

  /* ---------- slideshow prima pagina (5 s, slide) ---------- */
  var slides = document.querySelectorAll('.splash-slide');
  if (slides.length > 1) {
    var cur = 0;
    setInterval(function () {
      var prev = slides[cur];
      cur = (cur + 1) % slides.length;
      var next = slides[cur];
      next.style.transition = 'none';
      next.classList.remove('is-leaving');
      next.offsetWidth; // pozitioneaza slide-ul nou in dreapta inainte de animatie
      next.style.transition = '';
      prev.classList.remove('is-active');
      prev.classList.add('is-leaving');
      next.classList.add('is-active');
      setTimeout(function () { prev.classList.remove('is-leaving'); prev.style.transition = 'none'; }, 1000);
    }, 5000);
  }

  /* ---------- galerie orizontala cu sageti ---------- */
  var gallery = document.querySelector('.strip-gallery');
  var mobile = window.matchMedia('(max-width: 767px)');
  if (gallery) {
    var track = gallery.querySelector('.strip-track');
    var items = Array.prototype.slice.call(gallery.querySelectorAll('.strip-item'));
    var prevBtn = gallery.querySelector('.strip-arrow.prev');
    var nextBtn = gallery.querySelector('.strip-arrow.next');
    var index = 0;

    var maxShift = function () {
      var last = items[items.length - 1];
      // marginea dreapta a ultimei imagini ajunge la aceeasi distanta de margine ca prima, in stanga
      var margin = items[0].offsetLeft + parseFloat(getComputedStyle(items[0]).paddingLeft);
      return Math.max(0, last.offsetLeft + last.offsetWidth + margin - gallery.clientWidth);
    };
    var go = function (i) {
      index = Math.max(0, Math.min(i, items.length - 1));
      var shift = Math.min(items[index].offsetLeft - items[0].offsetLeft, maxShift());
      track.style.transform = 'translateX(' + (-shift) + 'px)';
      prevBtn.classList.toggle('is-on', index > 0);
      nextBtn.classList.toggle('is-off', shift >= maxShift() - 1);
    };
    prevBtn.addEventListener('click', function () { go(index - 1); });
    nextBtn.addEventListener('click', function () {
      if (items[index].offsetLeft - items[0].offsetLeft >= maxShift()) return;
      go(index + 1);
    });
    document.addEventListener('keydown', function (e) {
      if (lightbox && lightbox.classList.contains('is-open')) return;
      if (e.key === 'ArrowRight') nextBtn.click();
      if (e.key === 'ArrowLeft') prevBtn.click();
    });
    // glisare cu degetul / touchpad pe ecrane mari
    var startX = null;
    gallery.addEventListener('touchstart', function (e) { startX = e.touches[0].clientX; }, { passive: true });
    gallery.addEventListener('touchend', function (e) {
      if (startX === null || mobile.matches) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) (dx < 0 ? nextBtn : prevBtn).click();
      startX = null;
    });
    var wheelLock = false;
    gallery.addEventListener('wheel', function (e) {
      if (mobile.matches || Math.abs(e.deltaX) < Math.abs(e.deltaY) || Math.abs(e.deltaX) < 20 || wheelLock) return;
      wheelLock = true; setTimeout(function () { wheelLock = false; }, 600);
      (e.deltaX > 0 ? nextBtn : prevBtn).click();
    }, { passive: true });
    window.addEventListener('resize', function () { go(index); });
    window.addEventListener('load', function () { go(0); });
    go(0);

    /* ---------- lightbox (paginile de proiect) ---------- */
    var lightbox = null;
    if (gallery.classList.contains('with-lightbox')) {
      lightbox = document.createElement('div');
      lightbox.className = 'lightbox';
      lightbox.innerHTML = '<div class="lightbox-track"></div>' +
        '<button class="lb-close" type="button" aria-label="Inchide">&times;</button>' +
        '<button class="lb-prev" type="button" aria-label="Inapoi">&lsaquo;</button>' +
        '<button class="lb-next" type="button" aria-label="Inainte">&rsaquo;</button>';
      var lbTrack = lightbox.querySelector('.lightbox-track');
      items.forEach(function (it) {
        var s = document.createElement('div');
        s.className = 'lightbox-slide';
        var img = document.createElement('img');
        img.alt = '';
        img.dataset.src = it.querySelector('img').getAttribute('src');
        s.appendChild(img);
        lbTrack.appendChild(s);
      });
      body.appendChild(lightbox);
      var lbIndex = 0;
      var lbShow = function (i, animate) {
        lbIndex = (i + items.length) % items.length;
        [lbIndex - 1, lbIndex, lbIndex + 1].forEach(function (k) {
          var im = lbTrack.children[(k + items.length) % items.length].firstChild;
          if (!im.src) im.src = im.dataset.src;
        });
        lbTrack.style.transition = animate ? '' : 'none';
        lbTrack.style.transform = 'translateX(' + (-100 * lbIndex) + '%)';
      };
      var lbClose = function () { lightbox.classList.remove('is-open'); };
      items.forEach(function (it, i) {
        it.querySelector('.strip-img').addEventListener('click', function () {
          if (mobile.matches) return;
          lbShow(i, false);
          lightbox.classList.add('is-open');
        });
      });
      lbTrack.addEventListener('click', function (e) {
        if (e.target.tagName === 'IMG') lbShow(lbIndex + 1, true); else lbClose();
      });
      lightbox.querySelector('.lb-close').addEventListener('click', lbClose);
      lightbox.querySelector('.lb-prev').addEventListener('click', function () { lbShow(lbIndex - 1, true); });
      lightbox.querySelector('.lb-next').addEventListener('click', function () { lbShow(lbIndex + 1, true); });
      document.addEventListener('keydown', function (e) {
        if (!lightbox.classList.contains('is-open')) return;
        if (e.key === 'Escape') lbClose();
        if (e.key === 'ArrowRight') lbShow(lbIndex + 1, true);
        if (e.key === 'ArrowLeft') lbShow(lbIndex - 1, true);
      });
    }
  }

  /* ---------- formular de contact (trimis prin FormSubmit, fara reincarcarea paginii) ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('.contact-form'), function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type=submit]');
      btn.disabled = true;
      var data = {};
      new FormData(form).forEach(function (v, k) { data[k] = v; });
      fetch(form.action.replace('formsubmit.co/', 'formsubmit.co/ajax/'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      }).then(function (r) { return r.json(); }).then(function (res) {
        if (res && (res.success === true || res.success === 'true')) {
          var msg = document.createElement('div');
          msg.className = 'form-message';
          msg.textContent = form.getAttribute('data-success') || 'Thank you!';
          form.replaceWith(msg);
        } else { throw new Error(res && res.message); }
      }).catch(function () {
        btn.disabled = false;
        alert(document.documentElement.lang === 'en'
          ? 'The message could not be sent. Please write to us at design@zestcollective.ro.'
          : 'Mesajul nu a putut fi trimis. Te rugam sa ne scrii la design@zestcollective.ro.');
      });
    });
  });
})();
