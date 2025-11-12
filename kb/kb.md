<div import-css="['comn-form']"></div>

$timeout(function tick(){
    if(windwo.initaccordion){
        window.initaccordion('accordion_wrap');
    }else{
        requestanimationframe(tick);
    }
})