<script>
(() => {
  // ===== 유틸 =====
  const today = new Date();
  const Y0 = today.getFullYear();
  const M0 = today.getMonth();
  const iso = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  const todayISO = iso(today);
  const noonStamp = d => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12, 0, 0, 0).getTime();
  const daysIn = (y,m) => new Date(y, m+1, 0).getDate();

  // 상태
  const S = { start: null, end: null, maxYear: null };

  // DOM 레퍼런스는 초기화 함수 안에서 안전하게 가져오기 (렌더 후)
  let vp, box;

  const div   = cls => { const x=document.createElement('div'); if (cls) x.className=cls; return x; };
  const title = t   => { const x=div('new-m-title'); x.textContent=t; return x; };
  const dow   = ()  => {
    const x=div('new-dow');
    x.innerHTML = '<div class="new-sun">일</div><div>월</div><div>화</div><div>수</div><div>목</div><div>금</div><div>토</div>';
    return x;
  };

  function makeMonth(y,m){
    const wrap = div('new-dw-cal-slide');
    wrap.dataset.ym = `${y}-${m+1}`;
    wrap.appendChild(title(`${y}년 ${m+1}월`));
    wrap.appendChild(dow());

    const firstDow = new Date(y,m,1).getDay();
    const lastDay  = daysIn(y,m);
    const isThisMonth = (y===Y0 && m===M0);

    let day = 1;
    for (let r=0; r<6; r++){
      const row = div('new-dw-cal-row');
      for (let c=0; c<7; c++){
        const idx = r*7 + c;
        const cell = div('new-dw-cal-day');

        if (r===0 && idx<firstDow){ cell.classList.add('new-empty'); row.appendChild(cell); continue; }
        if (day > lastDay){ cell.classList.add('new-empty'); row.appendChild(cell); continue; }

        const dObj = new Date(y,m,day);
        const ds   = iso(dObj);

        if (dObj.getDay() === 0) cell.classList.add('new-sun');
        if (ds === todayISO)     cell.classList.add('new-dw-cal-today');

        const isPast = isThisMonth && ds < todayISO; // 이번 달의 오늘 이전
        if (isPast) cell.classList.add('new-past');

        cell.dataset.date = ds;
        cell.innerHTML = `
          <div class="new-range-bg"></div>
          <div class="new-cap" style="display:none"></div>
          <div class="new-dw-i"><div class="new-dw-cal-day-fg">${day}</div></div>
          ${ds===todayISO ? '<div class="new-today-tag">오늘</div>' : ''}
        `;
        row.appendChild(cell);
        day++;
      }
      wrap.appendChild(row);
      if (day > lastDay) break;
    }
    return wrap;
  }

  function addYearFrom(y, monthStart=0){
    const frag = document.createDocumentFragment();
    for (let m=monthStart; m<12; m++) frag.appendChild(makeMonth(y,m));
    box.appendChild(frag);
  }

  function pick(d){
    if (!S.start || S.end){ S.start = d; S.end = null; }
    else { S.end = (d < S.start) ? S.start : d; S.start = (d < S.start) ? d : S.start; }
    paint();
  }

  function paint(){
    const cells = box.querySelectorAll('.new-dw-cal-day');
    cells.forEach(c=>{
      c.classList.remove('new-in-range','new-is-start','new-is-end','new-range-left','new-range-right');
      const cap=c.querySelector('.new-cap'); if (cap) cap.style.display='none';
      const tag=c.querySelector('.new-today-tag'); if (tag) tag.style.display='';
    });

    const todayCell = box.querySelector(`.new-dw-cal-day[data-date="${todayISO}"]`);
    if (todayCell){
      todayCell.classList.add('new-dw-cal-today');
      const tag=todayCell.querySelector('.new-today-tag'); if (tag) tag.style.display='';
    }

    if (!S.start && !S.end) return;

    const A = noonStamp(S.start);
    const B = S.end ? noonStamp(S.end) : null;

    cells.forEach(c=>{
      const ds = c.dataset.date;
      if (!ds || c.classList.contains('new-empty') || c.classList.contains('new-past')) return;

      const [yy,mm,dd] = ds.split('-').map(Number);
      const t = noonStamp(new Date(yy,mm-1,dd));

      if (t === A){
        c.classList.add('new-is-start');
        c.querySelector('.new-cap').style.display='block';
      } else if (B !== null && t === B){
        c.classList.add('new-is-end');
        c.querySelector('.new-cap').style.display='block';
      } else if (B !== null && t > A && t < B){
        c.classList.add('new-in-range');
      }

      if (c.classList.contains('new-in-range')){
        const row = c.parentElement;
        const i   = Array.prototype.indexOf.call(row.children, c);
        const L   = row.children[i-1], R = row.children[i+1];
        if (!(L && L.classList.contains('new-in-range'))) c.classList.add('new-range-left');
        if (!(R && R.classList.contains('new-in-range'))) c.classList.add('new-range-right');
      }
    });
  }

  function appendNextYear(){
    const y = S.maxYear + 1;
    addYearFrom(y, 0);
    S.maxYear = y;
    paint();
  }

  function init(){
    // 렌더 후 안전하게 DOM 바인딩
    vp  = document.getElementById('vp');
    box = document.getElementById('yearContainer');

    if (!vp || !box){
      console.warn('[calendar] vp/yearContainer를 찾지 못했습니다.');
      return;
    }

    // 클릭 이벤트 "위임" (한 번만 등록, 리렌더에도 안전)
    box.addEventListener('click', (e) => {
      const cell = e.target.closest('.new-dw-cal-day');
      if (!cell || cell.classList.contains('new-empty') || cell.classList.contains('new-past')) return;
      const ds = cell.dataset.date;
      if (!ds) return;
      const [yy,mm,dd] = ds.split('-').map(Number);
      pick(new Date(yy, mm-1, dd));
    }, { capture:false });

    // 첫 렌더
    addYearFrom(Y0, M0);
    S.maxYear = Y0;
    paint();

    const cur = box.querySelector(`[data-ym="${Y0}-${M0+1}"]`) || box.firstElementChild;
    if (cur) cur.scrollIntoView({ behavior:'instant', block:'start' });

    // 아래로 1년 미리
    appendNextYear();

    // 스크롤 끝 감지
    const EDGE = 40;
    vp.addEventListener('scroll', () => {
      if (vp.scrollTop + vp.clientHeight >= vp.scrollHeight - EDGE) {
        appendNextYear();
      }
    }, { passive:true });

    // 레이아웃 잡힌 뒤 치수 확인(디버그)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        console.log('[vp sizes]', vp.scrollTop, vp.clientHeight, vp.scrollHeight);
      });
    });
  }

  // Angular/SPA 환경에서도 안전: DOMContentLoaded 이후 + 한 프레임 대기
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => requestAnimationFrame(init));
  } else {
    requestAnimationFrame(init);
  }
})();
</script>