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




  {{
    vm.eDatePicked
      ? ((vm.eDate | date:'yyyy.MM.dd(')
        + ['일','월','화','수','목','금','토'][ (new Date(vm.eDate)).getDay() ]
        + ')')
      : '오는날 선택'
  }}