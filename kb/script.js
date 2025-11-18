<script>
  window.initBenefitCard = function () {
    var slides = document.querySelectorAll('.benefit-card__swiper .swiper-slide');
    if (!slides.length) return; // DOM 아직 없으면 그냥 종료

    var total = slides.length;

    var currentEl = document.getElementById('benefitCurrent');
    var totalEl   = document.getElementById('benefitTotal');
    var pagerBtn  = document.getElementById('benefitPager');
    var toggleEl  = document.getElementById('benefitToggle');

    if (!currentEl || !totalEl || !pagerBtn || !toggleEl) return;

    // 이미 초기화된 경우 또 하지 않게 막기
    if (pagerBtn.dataset.inited === '1') return;
    pagerBtn.dataset.inited = '1';

    totalEl.textContent = total;

    var swiper = new Swiper('.benefit-card__swiper', {
      loop: true,
      autoHeight: false,
      allowTouchMove: true,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false
      }
    });

    function updateIndex() {
      currentEl.textContent = swiper.realIndex + 1;
    }
    swiper.on('slideChange', updateIndex);
    updateIndex();

    // 초기 상태: 자동 재생 중 → active(▶)
    toggleEl.classList.add('active');

    pagerBtn.addEventListener('click', function () {
      if (toggleEl.classList.contains('active')) {
        swiper.autoplay.stop();
        toggleEl.classList.remove('active'); // 정지 아이콘
      } else {
        swiper.autoplay.start();
        toggleEl.classList.add('active'); // 재생 아이콘
      }
    });
  };
  initBenefitCard()
</script>