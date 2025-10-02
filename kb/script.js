function bindConfirmActive(obj){
  var $wrap = $(obj);

  $wrap.on('click', '.tabCont button', function(e){
    e.preventDefault();

    var $cont  = $(this).closest('.tabCont');
    var idx    = $wrap.find('> .tabCont').index($cont); // 현재 탭 인덱스
    var $tabs  = $wrap.find('> .tab li');
    var $links = $tabs.find('> a');

    if (idx >= 0) {
      // 1) 현재 탭에 active 클래스 부여
      $tabs.eq(idx).addClass('active');

      // 2) 다음 탭 on 처리
      var nextIdx = idx + 1;
      if (nextIdx < $tabs.length) {
        $tabs.eq(nextIdx).addClass('on').siblings().removeClass('on');
        $links.attr('title','');
        $tabs.eq(nextIdx).find('a').attr('title','선택됨');

        // 컨텐츠 전환
        $wrap.find('> .tabCont').hide().eq(nextIdx).show();
      }
    }
  });
}