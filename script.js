/* ============================================================
   شركة فيصل الطه للمقاولات المحدودة — سكربت الموقع
   اللغة / القائمة / حركات الظهور / النماذج / ملفات الارتباط / تصفية المشاريع
   ============================================================ */
(function () {
  'use strict';

  var LANG_KEY = 'fat-lang'; // مفتاح حفظ اللغة في المتصفح

  /* ----------------------------------------------------------
     1) تبديل اللغة (عربي / إنجليزي)
     ---------------------------------------------------------- */
  var langButtons = document.querySelectorAll('[data-lang]');
  var selects = document.querySelectorAll('select');

  // ترجمة خيارات القوائم المنسدلة (select) حسب اللغة
  function updateSelectOptions(lang) {
    selects.forEach(function (select) {
      Array.prototype.forEach.call(select.options, function (opt) {
        var txt = opt.getAttribute('data-' + lang);
        if (txt !== null) opt.textContent = txt;
      });
    });
  }

  function setLang(lang) {
    var root = document.documentElement;
    root.lang = lang;
    root.dir = lang === 'ar' ? 'rtl' : 'ltr';
    // تفعيل زر اللغة المطابق في جميع مواضع التبديل
    langButtons.forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
    updateSelectOptions(lang);
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) { /* التخزين قد لا يكون متاحاً */ }
  }

  langButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      setLang(btn.getAttribute('data-lang'));
    });
  });

  // تطبيق اللغة المحفوظة عند فتح الصفحة (الافتراضي: العربية)
  var saved = null;
  try { saved = localStorage.getItem(LANG_KEY); } catch (e) { /* ignore */ }
  if (saved === 'ar' || saved === 'en') setLang(saved);
  updateSelectOptions(document.documentElement.lang);

  /* ----------------------------------------------------------
     2) القائمة الجانبية للجوال
     ---------------------------------------------------------- */
  var mobileMenu = document.getElementById('mobileMenu');
  var menuBtn = document.getElementById('menuBtn');
  var menuClose = document.getElementById('menuClose');
  var menuOverlay = document.getElementById('menuOverlay');

  function openMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // منع تمرير الصفحة خلف القائمة
  }
  function closeMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (menuBtn) menuBtn.addEventListener('click', openMenu);
  if (menuClose) menuClose.addEventListener('click', closeMenu);
  if (menuOverlay) menuOverlay.addEventListener('click', closeMenu);
  // إغلاق القائمة عند الضغط على أي رابط داخلها
  if (mobileMenu) {
    mobileMenu.querySelectorAll('.mobile-nav a').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
  }
  // إغلاق القائمة عند الضغط على مفتاح Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  /* ----------------------------------------------------------
     3) تظليل شريط التنقل عند التمرير
     ---------------------------------------------------------- */
  var navbar = document.getElementById('navbar');
  function onScroll() {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 10);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ----------------------------------------------------------
     4) ظهور العناصر عند التمرير (Scroll Reveal)
     ---------------------------------------------------------- */
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealEls = document.querySelectorAll('.reveal');

  if (prefersReduced || !('IntersectionObserver' in window)) {
    // لا حركة مطلوبة أو المتصفح قديم: إظهار الكل مباشرة
    revealEls.forEach(function (el) { el.classList.add('revealed'); });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { observer.observe(el); });
  }

  /* ----------------------------------------------------------
     5) النماذج (إرسال وهمي — يعرض رسالة نجاح)
     ---------------------------------------------------------- */
  document.querySelectorAll('.contact-form').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var feedback = form.querySelector('.form-feedback');
      if (!feedback) return;

      var valid = form.checkValidity();
      if (!valid) {
        feedback.classList.remove('success');
        feedback.classList.add('error');
        feedback.textContent = document.documentElement.lang === 'ar'
          ? 'يرجى تعبئة جميع الحقول المطلوبة بشكل صحيح.'
          : 'Please fill in all required fields correctly.';
        feedback.style.display = 'flex';
        // تمييز الحقول غير الصحيحة
        Array.prototype.forEach.call(form.querySelectorAll('[required]'), function (f) {
          if (!f.checkValidity()) f.classList.add('field-error');
        });
        return;
      }

      // إزالة تمييز الأخطاء السابقة
      form.querySelectorAll('.field-error').forEach(function (f) { f.classList.remove('field-error'); });

      feedback.classList.remove('error');
      feedback.classList.add('success');
      feedback.textContent = document.documentElement.lang === 'ar'
        ? 'تم استلام رسالتك بنجاح. سيتواصل معك فريق الشركة في أقرب وقت.'
        : 'Your message has been received. Our team will get back to you shortly.';
      feedback.style.display = 'flex';
      form.reset();
    });

    // إخفاء رسالة الخطأ عند بدء التعديل
    form.querySelectorAll('input, textarea, select').forEach(function (f) {
      f.addEventListener('input', function () {
        f.classList.remove('field-error');
      });
    });
  });

  /* ----------------------------------------------------------
     6) إشعار ملفات تعريف الارتباط
     ---------------------------------------------------------- */
  var cookieBanner = document.getElementById('cookieBanner');
  var cookieAccept = document.getElementById('cookieAccept');
  var COOKIE_KEY = 'fat-cookies';

  function showCookies() { if (cookieBanner) cookieBanner.classList.remove('hidden'); }
  function hideCookies() { if (cookieBanner) cookieBanner.classList.add('hidden'); }

  var cookiesAccepted = null;
  try { cookiesAccepted = localStorage.getItem(COOKIE_KEY); } catch (e) { /* ignore */ }
  if (cookiesAccepted === 'yes') {
    hideCookies();
  } else {
    // إظهار الإشعار بعد لحظة قصيرة
    setTimeout(showCookies, 1200);
  }
  if (cookieAccept) {
    cookieAccept.addEventListener('click', function () {
      hideCookies();
      try { localStorage.setItem(COOKIE_KEY, 'yes'); } catch (e) { /* ignore */ }
    });
  }

  /* ----------------------------------------------------------
     7) تصفية المشاريع (صفحة مشاريعنا)
     ---------------------------------------------------------- */
  var filterButtons = document.querySelectorAll('.filter-bar [data-filter]');
  var projectCards = document.querySelectorAll('.project-card[data-category]');

  filterButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var filter = btn.getAttribute('data-filter');

      // تفعيل الزر المضغوط فقط
      filterButtons.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      projectCards.forEach(function (card) {
        var match = filter === 'all' || card.getAttribute('data-category') === filter;
        card.style.display = match ? '' : 'none';
      });
    });
  });

})();
