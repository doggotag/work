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

