
self.port.on('play', function(s) {
  console.log('play', s)
  var el = document.getElementById(s);
  el.pause();
  el.currentTime = 0;
  el.play();
});

function onEnded(e) {
  e.target.currentTime = 0;
}

self.port.on('loop', function(s) {
  console.log('play', s)
  var el = document.getElementById(s);
  el.pause();
  el.currentTime = 0;
  el.play();
});

self.port.on('pause', function(s) {
  var el = document.getElementById(s);
  el.pause();
  el.removeEventListener('ended', onEnded, false);
});

self.port.on('stop', function(s) {
  var el = document.getElementById(s);
  el.pause();
  el.currentTime = 0;
  el.removeEventListener('ended', onEnded, false);
});
