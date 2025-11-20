
  window.initBenefitCard = function () {
    var slides = document.querySelectorAll('.benefit-card__swiper .swiper-slide');
    if (!slides.length) return; // DOM 아직 없으면 종료

    var total     = slides.length;
    var currentEl = document.getElementById('benefitCurrent');
    var totalEl   = document.getElementById('benefitTotal');
    var pagerBtn  = document.getElementById('benefitPager');
    var toggleEl  = document.getElementById('benefitToggle');

    if (!currentEl || !totalEl || !pagerBtn || !toggleEl) return;

    // 중복 초기화 방지
    if (pagerBtn.dataset.inited === '1') return;
    pagerBtn.dataset.inited = '1';

    totalEl.textContent = total;

    // ✅ Swiper 3.3.1 스타일 옵션
    var swiper = new Swiper('.benefit-card__swiper', {
      loop: true,
      autoHeight: false,

      // 3.x 에서는 숫자
      autoplay: 3000,
      autoplayDisableOnInteraction: false,

      // 터치 관련 옵션들
      touchRatio: 1,          // 0이면 드래그 안 됨
      simulateTouch: true,    // PC에서도 마우스로 드래그 가능
      noSwiping: false,       // 슬라이드에 swiper-no-swiping 있으면 막힘
      preventClicks: false,
      preventClicksPropagation: false,

      // 이벤트 콜백 (3.x 스타일)
      onInit: function (sw) {
        updateIndex(sw);
      },
      onSlideChangeStart: function (sw) {
        updateIndex(sw);
      },
      onTouchStart: function (sw, e) {
        console.log('[benefit swiper] touchstart', e && e.type);
      }
    });

    function updateIndex(sw) {
      var idx;
      if (typeof sw.realIndex === 'number') {
        idx = sw.realIndex;
      } else {
        idx = sw.activeIndex % total;
        if (idx < 0) idx += total;
      }
      currentEl.textContent = (idx % total) + 1;
    }

    // 초기 상태: 자동 재생 중 → active(▶)
    toggleEl.classList.add('active');
    var isPlaying = true;

    pagerBtn.addEventListener('click', function () {
      if (isPlaying) {
        swiper.stopAutoplay();         // ✅ 3.x 방식
        toggleEl.classList.remove('active'); // 정지 아이콘
      } else {
        swiper.startAutoplay();        // ✅ 3.x 방식
        toggleEl.classList.add('active');    // 재생 아이콘
      }
      isPlaying = !isPlaying;
    });
  };

