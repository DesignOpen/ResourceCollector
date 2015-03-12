(function(a) {
  if (a == ""){
    window.query = {};
    return;
  }
  else{
    var b = {};
    for (var i = 0; i < a.length; ++i){
      var p=a[i].split('=', 2);
      if (p.length == 1)
      b[p[0]] = "";
      else
      b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    window.query = b;
    return;
  }
})(window.location.search.substr(1).split('&'));
