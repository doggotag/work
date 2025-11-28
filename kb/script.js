define(['app'], function (app) {
  app.controller('BConsentCtrl', ['$scope', function ($scope) {
    var vm = this;

    // 선택동의 영역을 보여줄지 여부 (지금은 항상 보이게 true)
    vm.isShowMarketing   = true;
    vm.showElecEntryAgre = false; // 이 화면에서는 안 쓸 거면 false

    // 약관 동의 상태
    vm.agree = {
      // 필수
      opt1: 'N', // 계약체결을 위한 개인(신용)정보 동의
      opt5: 'N', // 전자금융거래 약관 동의
      opt6: 'N', // 예금자보호안내 및 소비자 권익보호...

      // 선택(마케팅)
      opt2: 'N',      // "상품 소개를 위한 개인(신용)정보 수집·이용 동의" 전체
      opt2_1_1: 'N',  // 상단 선택 버튼(상품 소개를 위한 광고성 정보 수신 동의)

      // 버튼 비활성/활성용
      reqAgreed: false, // 필수 모두 동의 여부
      optAgreed: false  // 선택 모두 동의 여부 (현재는 opt2만 기준)
    };

    // 상태 갱신 공통 함수
    function updateState() {
      // 필수: 1,5,6 모두 Y면 다음 버튼 활성
      vm.agree.reqAgreed =
        (vm.agree.opt1 === 'Y' &&
         vm.agree.opt5 === 'Y' &&
         vm.agree.opt6 === 'Y');

      // 선택: 현재는 opt2 하나만 사용
      vm.agree.optAgreed = (vm.agree.opt2 === 'Y');
    }

    // 개별 항목 클릭 (필수/선택 모두 이거로 처리)
    vm.checkOption = function (key) {
      var current = vm.agree[key] === 'Y' ? 'N' : 'Y';
      vm.agree[key] = current;

      // 선택동의 상단 "상품 소개..." 클릭 시
      if (key === 'opt2_1_1') {
        // opt2(전체 선택)와 연동
        vm.agree.opt2 = current;
      }

      updateState();
    };

    // [필수] 모두 동의
    vm.nextStepAllAgree = function () {
      var allOn =
        (vm.agree.opt1 === 'Y' &&
         vm.agree.opt5 === 'Y' &&
         vm.agree.opt6 === 'Y');

      var next = allOn ? 'N' : 'Y';

      vm.agree.opt1 = next;
      vm.agree.opt5 = next;
      vm.agree.opt6 = next;

      updateState();
    };

    // [선택] 모두 동의
    vm.optionalAllChecked = function () {
      // 지금은 선택쪽은 opt2만 본다고 가정
      var next = (vm.agree.opt2 === 'Y') ? 'N' : 'Y';

      vm.agree.opt2     = next;
      vm.agree.opt2_1_1 = next; // 상단 버튼도 같이

      updateState();
    };

    // "제공에 관한 사항" 버튼 클릭 시 동작 (필요하면 확장)
    vm.agreeOpt2 = function () {
      // 지금은 단순 토글 정도만 처리
      // 실제 로직이 필요하면 여기에 추가
      // 예: console.log('제공에 관한 사항 클릭');
    };

    // 상세 채널 토글 (전체동의/전화/DM/SMS/이메일/앱푸시)
    // HTML에서 ng-click="vm.setDetailToggle('chRcm', 'totAgre')" 이런 식으로 호출됨
    vm.setDetailToggle = function (group, kind) {
      // 여기서는 실제 값은 안 써도 되고,
      // 추후 필요하면 vm.agree 안에 채널용 객체 하나 더 만들어서 관리해도 됨.
      // ex) vm.channels = { telAgre: false, smsAgre: false, ... }

      if (kind === 'totAgre') {
        // 전체동의 토글 (지금은 UI만 있고 값은 크게 안 쓰니 패스해도 됨)
        // 필요한 경우 채널 전부 true/false 로 묶는 로직 추가
      } else {
        // 개별 채널 토글 로직도 필요하면 여기서 정의
      }
    };

    // "다음" 버튼
    vm.newGoNextPage = function () {
      if (!vm.agree.reqAgreed) {
        alert('필수 약관에 모두 동의해 주세요.');
        return;
      }

      // TODO: 실제 페이지 이동이나 다음 단계 호출
      // 예: $location.path('/다음경로');
      console.log('다음 단계로 이동 가능', angular.copy(vm.agree));
    };

    // 초기 상태 계산
    updateState();
  }]);
});