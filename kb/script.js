<script>
  window.initBenefitCard = function () {
    var slides = document.querySelectorAll('.benefit-card__swiper .swiper-slide');
    if (!slides.length) return; // DOM 아직 없으면 그냥 종료

    var total     = slides.length;
    var currentEl = document.getElementById('benefitCurrent');
    var totalEl   = document.getElementById('benefitTotal');
    var pagerBtn  = document.getElementById('benefitPager');
    var toggleEl  = document.getElementById('benefitToggle');

    if (!currentEl || !totalEl || !pagerBtn || !toggleEl) return;

    // 이미 초기화된 경우 또 하지 않게 막기
    if (pagerBtn.dataset && pagerBtn.dataset.inited === '1') return;
    if (pagerBtn.dataset) pagerBtn.dataset.inited = '1';

    totalEl.textContent = total;

    // 인덱스 표시용 공통 함수
    function updateIndex(swiperInstance) {
      var idx;

      // 새 버전이면 realIndex, 아니면 activeIndex로 계산
      if (typeof swiperInstance.realIndex === 'number') {
        idx = swiperInstance.realIndex;
      } else {
        idx = swiperInstance.activeIndex % total;
        if (idx < 0) idx += total;
      }

      currentEl.textContent = idx + 1; // 1부터 표시
    }

    // 🔹 구버전 Swiper 스타일 (autoplay 숫자 / onInit, onSlideChangeStart)
    var swiper = new Swiper('.benefit-card__swiper', {
      loop: true,
      autoHeight: false,
      allowTouchMove: true,

      // 구버전: 객체 말고 숫자
      autoplay: 3000,

      onInit: function (sw) {
        updateIndex(sw);
      },
      onSlideChangeStart: function (sw) {
        updateIndex(sw);
      }
    });

    // 초기 상태: 자동 재생 중 → active(▶)
    toggleEl.classList.add('active');

    pagerBtn.addEventListener('click', function () {
      if (toggleEl.classList.contains('active')) {
        // 구버전: autoplay.stop() 대신 stopAutoplay()
        swiper.stopAutoplay();
        toggleEl.classList.remove('active'); // 정지 아이콘 상태
      } else {
        swiper.startAutoplay();
        toggleEl.classList.add('active'); // 재생 아이콘 상태
      }
    });
  };

  initBenefitCard();
</script>