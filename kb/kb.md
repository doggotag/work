if (!reloading) {
  window.d_reload();   // ▶ 모듈 undef 후 _state.reload() 실행 (부분 리로드)
  reloading = true;
  setTimeout(()=> reloading=false, 1000); // 1초 디바운스
}



setInterval(() => {
  console.log('[AUTO] d_reload 실행:', new Date().toLocaleTimeString());
  window.d_reload();
}, 60000);