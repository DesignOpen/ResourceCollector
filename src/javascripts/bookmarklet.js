(function(){
	var endpoint = 'localhost:4000/';

  var DOMReady = function(a,b,c){b=document,c='addEventListener';b[c]?b[c]('DOMContentLoaded',a):window.attachEvent('onload',a)}
	var updateLink = function(twitter) {
		if (!twitter) {
			twitter = '';
		}
		var link = 'javascript:var d=document,w=window,x=d.selection,f=\'' + endpoint + '\',l=d.location,e=encodeURIComponent,u=f+\'?url=\'+e(l.href)+\'&title=\'+e(d.title)+\'&twitter=' + twitter + '\';a=function(){if(!w.open(u,\'t\',\'toolbar=0,resizable=1,scrollbars=1,status=1,width=600,height=590\'))l.href=u;};if (/Firefox/.test(navigator.userAgent)) setTimeout(a, 0); else a();void(0)';
		var el = document.getElementById('bookmarklet-link');
		if (!el) {
			return;
		}
		el.href = link;
	};
  
  DOMReady(function () {
  	updateLink();
  	var el = document.getElementById('bookmarklet-twitter');
		if (!el) {
			return;
		}
		el.onkeyup = function() {
			updateLink(el.value);
		};
  });
})();