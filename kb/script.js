    vm.highlight = function (text) {
      var q = (vm.searchText || '').trim();
      if (!q) return $sce.trustAsHtml(text);


      var escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');


      var re = new RegExp('(' + escaped + ')', 'gi');
      var html = (text || '').replace(re, '<mark>$1</mark>');
      return $sce.trustAsHtml(html);
    };

    vm.searchNote = function (o) {
      if (!(vm.searchText || '').trim()) return '';
      return '검색어 일치'; 
    };
