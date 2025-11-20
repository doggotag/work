window.initBenefitCard = function () {
  var slides = document.querySelectorAll('.benefit-card__swiper .swiper-slide');
  if (!slides.length) return;

  var total     = slides.length;
  var currentEl = document.getElementById('benefitCurrent');
  var totalEl   = document.getElementById('benefitTotal');
  var pagerBtn  = document.getElementById('benefitPager');
  var toggleEl  = document.getElementById('benefitToggle');

  if (!currentEl || !totalEl || !pagerBtn || !toggleEl) return;
  if (pagerBtn.dataset.inited === '1') return;
  pagerBtn.dataset.inited = '1';

  totalEl.textContent = total;

  var swiper = new Swiper('.benefit-card__swiper', {
    loop: true,
    autoHeight: false,
    autoplay: 3000,
    autoplayDisableOnInteraction: false,

    onInit: function (sw) {
      currentEl.textContent = getIndex(sw, total) + 1;
    },
    onSlideChangeStart: function (sw) {
      currentEl.textContent = getIndex(sw, total) + 1;
    }
  });

  function getIndex(sw, total) {
    var idx;
    if (typeof sw.realIndex === 'number') {
      idx = sw.realIndex;
    } else {
      idx = sw.activeIndex % total;
    }
    if (idx < 0) idx += total;
    return idx % total;
  }

  toggleEl.classList.add('active');

  pagerBtn.addEventListener('click', function () {
    if (toggleEl.classList.contains('active')) {
      swiper.stopAutoplay();
      toggleEl.classList.remove('active');
    } else {
      swiper.startAutoplay();
      toggleEl.classList.add('active');
    }
  });
};

initBenefitCard();