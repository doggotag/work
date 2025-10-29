if (!reloading) {
  window.d_reload();  
  reloading = true;
  setTimeout(()=> reloading=false, 1000); // 1초 디바운스
}


setInterval(() => {
  window.d_reload();
}, 600000);

const autoReload = setInterval(() => {
  window.d_reload();
}, 300000);
clearInterval(autoReload);


(function(){
  const bump = u => {
    const sep = u.includes('?') ? '&' : '?';
    return u.replace(/([?&]_v=\d+)?$/, '') + sep + '_v=' + Date.now();
  };
  document.querySelectorAll('img[src]').forEach(img => {
    img.src = bump(img.getAttribute('src'));
  });
})();