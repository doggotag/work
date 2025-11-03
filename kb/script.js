function paintRange(start, end) {
  // 날짜 객체로 변환
  var startDate = new Date(start);
  var endDate = new Date(end);

  // 모든 날짜 셀 반복
  $('.dw-cal-day').each(function () {
    var cell = $(this);
    var val = cell.attr('data-full'); // mobiscroll이 day 셀마다 날짜 정보를 data-full 같은 속성으로 저장함
    if (!val) return;

    var cellDate = new Date(val);

    // 범위 안인지 체크
    if (cellDate >= startDate && cellDate <= endDate) {
      cell.addClass('in-range');
      if (cellDate.getTime() === startDate.getTime()) {
        cell.addClass('is-start');
      }
      if (cellDate.getTime() === endDate.getTime()) {
        cell.addClass('is-end');
      }
    } else {
      cell.removeClass('in-range is-start is-end');
    }
  });
}

