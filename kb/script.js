window.initBenefitCard = function () {
  const swiper = document.getElementById("benefitSwiper");
  const wrapper = swiper.querySelector(".swiper-wrapper");
  const slides = wrapper.querySelectorAll(".swiper-slide");

  const currentEl = document.getElementById("benefitCurrent");
  const totalEl = document.getElementById("benefitTotal");
  const toggleEl = document.getElementById("benefitToggle");
  const pagerBtn = document.getElementById("benefitPager");

  if (!slides.length) return;

  let total = slides.length;
  let currentIndex = 0;
  let autoPlay = true;
  let autoTimer;

  totalEl.textContent = total;

  // --- 슬라이드 이동 함수 ---
  function goToSlide(index, animate = true) {
    if (!animate) wrapper.style.transition = "none";
    else wrapper.style.transition = "transform 0.35s ease";

    wrapper.style.transform = `translateX(${-index * 100}%)`;
    currentEl.textContent = index + 1;
  }

  // --- 자동롤링 ---
  function startAutoPlay() {
    autoTimer = setInterval(() => {
      currentIndex = (currentIndex + 1) % total;
      goToSlide(currentIndex);
    }, 3000);
  }

  function stopAutoPlay() {
    clearInterval(autoTimer);
  }

  startAutoPlay();
  toggleEl.classList.add("active"); // 처음엔 재생 아이콘

  // --- 재생/정지 버튼 ---
  pagerBtn.addEventListener("click", () => {
    autoPlay = !autoPlay;

    if (autoPlay) {
      startAutoPlay();
      toggleEl.classList.add("active");
    } else {
      stopAutoPlay();
      toggleEl.classList.remove("active");
    }
  });

  // --- 터치/스와이프 구현 ---
  let startX = 0;
  let currentX = 0;
  let isDragging = false;

  swiper.addEventListener("touchstart", startDrag, { passive: true });
  swiper.addEventListener("mousedown", startDrag);

  function startDrag(e) {
    isDragging = true;
    wrapper.style.transition = "none";
    startX = e.touches ? e.touches[0].clientX : e.clientX;
  }

  window.addEventListener("touchmove", dragMove, { passive: false });
  window.addEventListener("mousemove", dragMove);

  function dragMove(e) {
    if (!isDragging) return;

    currentX = (e.touches ? e.touches[0].clientX : e.clientX) - startX;
    wrapper.style.transform =
      `translateX(${currentX - currentIndex * swiper.offsetWidth}px)`;
    e.preventDefault();
  }

  window.addEventListener("touchend", endDrag);
  window.addEventListener("mouseup", endDrag);

  function endDrag() {
    if (!isDragging) return;
    isDragging = false;

    const threshold = swiper.offsetWidth * 0.25;

    if (currentX > threshold) {
      // → 오른쪽 스와이프 (이전)
      currentIndex = (currentIndex - 1 + total) % total;
    } else if (currentX < -threshold) {
      // ← 왼쪽 스와이프 (다음)
      currentIndex = (currentIndex + 1) % total;
    }

    currentX = 0;

    goToSlide(currentIndex);

    if (autoPlay) {
      stopAutoPlay();
      startAutoPlay();
    }
  }

  // 초기 화면 출력
  goToSlide(0);
};

document.addEventListener("DOMContentLoaded", initBenefitCard);


.benefit-card__swiper {
  overflow: hidden;
  position: relative;
}

.benefit-card__swiper .swiper-wrapper {
  display: flex;
  transition: transform 0.35s ease;
}

.benefit-card__swiper .swiper-slide {
  flex-shrink: 0;
  width: 100%;
}


<div class="benefit-card">
  <div class="benefit-card__swiper" id="benefitSwiper">
    <div class="swiper-wrapper">
      <div class="swiper-slide"> ... slide 1 ... </div>
      <div class="swiper-slide"> ... slide 2 ... </div>
      <div class="swiper-slide"> ... slide 3 ... </div>
    </div>
  </div>

  <button type="button" class="benefit-card__pager" id="benefitPager">
    <span class="benefit-card__counter">
      <span id="benefitCurrent">1</span> / <span id="benefitTotal">3</span>
    </span>
    <span id="benefitToggle"></span>
  </button>
</div>