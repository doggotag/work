
  window.initBenefitCard = function () {
    var slides = document.querySelectorAll('.benefit-card__swiper .swiper-slide');
    if (!slides.length) return; // DOM 아직 없으면 그냥 종료

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

      // ⬇⬇ 3.x 에서는 autoplay 숫자
      autoplay: 3000,
      autoplayDisableOnInteraction: false,

      // 손가락 스와이프 관련 옵션들 명시적으로 켜주기
      touchRatio: 1,        // 0이면 드래그 안됨
      simulateTouch: true,  // PC에서도 마우스로 드래그 가능
      noSwiping: false      // 스와이프 막지 않기
      // 필요하면 resistance, threshold 도 추가 가능
    });

    // ✅ 3.x에서는 swiper.on(...) 대신 옵션/콜백 방식
    function updateIndex(sw) {
      var idx;
      // 3.3.1도 realIndex가 있긴 한데 안전하게 처리
      if (typeof sw.realIndex === 'number') {
        idx = sw.realIndex;
      } else {
        idx = sw.activeIndex % total;
        if (idx < 0) idx += total;
      }
      currentEl.textContent = (idx % total) + 1;
    }

    // 초기 인덱스 세팅
    swiper.params.onInit = function (sw) {
      updateIndex(sw);
    };
    swiper.params.onSlideChangeStart = function (sw) {
      updateIndex(sw);
    };
    // Swiper 3는 init() 직접 호출해야 onInit 실행됨
    swiper.init && swiper.init();

    // 초기 상태: 자동 재생 중 → active(▶)
    toggleEl.classList.add('active');

    var isPlaying = true;

    pagerBtn.addEventListener('click', function () {
      if (isPlaying) {
        // 3.x : stopAutoplay()
        swiper.stopAutoplay();
        toggleEl.classList.remove('active'); // 정지 아이콘
      } else {
        swiper.startAutoplay();
        toggleEl.classList.add('active');    // 재생 아이콘
      }
      isPlaying = !isPlaying;
    });
  };

  initBenefitCard();
