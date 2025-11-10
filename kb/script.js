<script>
(() => {
  /* ===== 날짜 유틸 ===== */
  const today = new Date();
  const Y0 = today.getFullYear();
  const M0 = today.getMonth(); // 0~11
  const iso = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  const todayISO = iso(today);
  const noonStamp = d => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12).getTime();
  const daysIn = (y,m) => new Date(y, m+1, 0).getDate();

  /* ===== 상태 & 기본 노드 ===== */
  const S = { start:null, end:null, maxYear:null };
  const vp  = document.getElementById('vp');            // 스크롤 컨테이너(안정적인 부모)
  const box = document.getElementById('yearContainer');  // 월들이 쌓이는 컨테이너
  let isAppending = false; // 중복 추가 방지

  /* ===== DOM 헬퍼 ===== */
  const div = cls => { const x=document.createElement('div'); if(cls) x.className=cls; return x; };
  const title = t => { const x=div('new-m-title'); x.textContent=t; return x; };
  const dow = () => {
    const x=div('new-dow');
    x.innerHTML = '<div class="new-sun">일</div><div>월</div><div>화</div><div>수</div><div>목</div><div>금</div><div>토</div>';
    return x;
  };

  /* ===== 한 달 생성 ===== */
  function makeMonth(y,m){
    const wrap = div('new-dw-cal-slide');
    wrap.dataset.ym = `${y}-${m+1}`;
    wrap.appendChild(title(`${y}년 ${m+1}월`));
    wrap.appendChild(dow());

    const firstDow = new Date(y,m,1).getDay();
    const lastDay  = daysIn(y,m);
    const isThisMonth = (y===Y0 && m===M0);

    let day = 1;
    for(let r=0;r<6;r++){
      const row = div('new-dw-cal-row');
      for(let c=0;c<7;c++){
        const idx = r*7+c;
        const cell = div('new-dw-cal-day');

        if(r===0 && idx<firstDow){ cell.classList.add('new-empty'); row.appendChild(cell); continue; }
        if(day>lastDay){ cell.classList.add('new-empty'); row.appendChild(cell); continue; }

        const dObj = new Date(y,m,day);
        const ds   = iso(dObj);

        if(dObj.getDay()===0) cell.classList.add('new-sun');
        if(ds===todayISO)     cell.classList.add('new-dw-cal-today');

        // 이번달의 '오늘 이전'은 회색 + 클릭 불가
        const isPast = isThisMonth && ds < todayISO;
        if(isPast) cell.classList.add('new-past');

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
      if(day>lastDay) break;
    }
    return wrap;
  }

  /* ===== 특정 연도의 monthStart부터 12월까지 추가 ===== */
  function addYearFrom(y, monthStart=0){
    const frag=document.createDocumentFragment();
    for(let m=monthStart;m<12;m++) frag.appendChild(makeMonth(y,m));
    box.appendChild(frag);
  }

  /* ===== 선택 로직 ===== */
  function pick(d){
    if(!S.start || S.end){ S.start=d; S.end=null; }
    else { S.end=(d<S.start)?S.start:d; S.start=(d<S.start)?d:S.start; }
    paint();
  }

  /* ===== 칠하기 ===== */
  function paint(){
    const cells=box.querySelectorAll('.new-dw-cal-day');
    // reset
    cells.forEach(c=>{
      c.classList.remove('new-in-range','new-is-start','new-is-end','new-range-left','new-range-right');
      const cap=c.querySelector('.new-cap'); if(cap) cap.style.display='none';
      const tag=c.querySelector('.new-today-tag'); if(tag) tag.style.display='';
    });

    // 오늘 태그 유지
    const todayCell=box.querySelector(`.new-dw-cal-day[data-date="${todayISO}"]`);
    if(todayCell){
      todayCell.classList.add('new-dw-cal-today');
      const tag=todayCell.querySelector('.new-today-tag'); if(tag) tag.style.display='';
    }

    if(!S.start && !S.end) return;

    const A=noonStamp(S.start);
    const B=S.end?noonStamp(S.end):null;

    cells.forEach(c=>{
      const ds=c.dataset.date;
      if(!ds || c.classList.contains('new-empty') || c.classList.contains('new-past')) return;

      const [yy,mm,dd]=ds.split('-').map(Number);
      const t=noonStamp(new Date(yy,mm-1,dd));

      if(t===A){
        c.classList.add('new-is-start');
        c.querySelector('.new-cap').style.display='block';
      } else if(B!==null && t===B){
        c.classList.add('new-is-end');
        c.querySelector('.new-cap').style.display='block';
      } else if(B!==null && t>A && t<B){
        c.classList.add('new-in-range');
      }

      if(c.classList.contains('new-in-range')){
        const row=c.parentElement;
        const i=Array.prototype.indexOf.call(row.children,c);
        const L=row.children[i-1], R=row.children[i+1];
        if(!(L&&L.classList.contains('new-in-range'))) c.classList.add('new-range-left');
        if(!(R&&R.classList.contains('new-in-range'))) c.classList.add('new-range-right');
      }
    });
  }

  /* ===== 초기 렌더 + 무한 스크롤(아래쪽) ===== */
  function init(){
    addYearFrom(Y0, M0);               // 올해: 이번 달부터 12월까지
    S.maxYear = Y0;
    paint();

    const cur=box.querySelector(`[data-ym="${Y0}-${M0+1}"]`)||box.firstElementChild;
    if(cur) cur.scrollIntoView({behavior:'instant',block:'start'});

    // 아래로 한 해 미리
    appendNextYear();
  }

  function appendNextYear(){
    if (isAppending) return;
    isAppending = true;
    const y=S.maxYear+1;
    addYearFrom(y,0);
    S.maxYear=y;
    paint();
    isAppending = false;
  }

  const EDGE=40;
  vp.addEventListener('scroll',()=>{
    if(vp.scrollTop + vp.clientHeight >= vp.scrollHeight - EDGE){
      appendNextYear();
    }
  },{passive:true});

  /* ===== 이벤트 위임: 셀 클릭 처리 =====
     Angular 리렌더로 셀이 교체되어도, 부모(vp)는 유지되므로 안전 */
  vp.addEventListener('click', (e) => {
    const cell = e.target.closest('.new-dw-cal-day');
    if (!cell || !vp.contains(cell)) return;

    // 빈칸/과거 셀은 무시
    if (cell.classList.contains('new-empty') || cell.classList.contains('new-past')) return;

    const ds = cell.dataset.date;
    if (!ds) return;

    const [yy, mm, dd] = ds.split('-').map(Number);
    const dObj = new Date(yy, mm - 1, dd);

    console.log('📅 위임 클릭:', ds);
    pick(dObj);
  }, { passive: true });

  init();

  // (선택 범위 확인용, 선택) window.getSelectedRange()
  window.getSelectedRange = () => ({
    start: S.start ? iso(S.start) : null,
    end:   S.end   ? iso(S.end)   : null
  });
})();
</script>