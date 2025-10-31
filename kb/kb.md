if (!reloading) {
  window.d_reload();  
  reloading = true;
  setTimeout(()=> reloading=false, 1000); 
}


setInterval(() => {
  window.d_reload();
}, 600000);

const autoReload = setInterval(() => {
  window.d_reload();
}, 300000);

clearInterval(autoReload);




vm.formatDateKR = function(dateStr) {
  if (!dateStr) return ''; // 값이 없을 때 안전 처리
  var date = new Date(dateStr);
  if (isNaN(date)) return ''; // 잘못된 날짜일 경우
  
  var days = ['일', '월', '화', '수', '목', '금', '토'];
  var day = days[date.getDay()];
  

  var formatted = 
    date.getFullYear() + '.' +
    ('0' + (date.getMonth() + 1)).slice(-2) + '.' +
    ('0' + date.getDate()).slice(-2) + '(' + day + ')';
    
  return formatted;
};

<span class="range-date">{{ vm.formatDateKR(vm.sDate) || '가는날 선택' }}</span>
<span class="range-date">{{ vm.formatDateKR(vm.eDate) || '오는날 선택' }}</span>