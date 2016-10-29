// webrtc chokes on data uri
// maybe a moz corollary to https://code.google.com/p/chromium/issues/detail?id=368742
//var targetURL = 'data:text/html,' + encodeURIComponent(getCameraContent());

// settle for random cat gifs
//var catURL = 'http://thecatapi.com/api/images/get?format=src&type=gif&' + (new Date());
//var targetURL = 'data:text/html,' + encodeURIComponent('<html><body scrolling="no" style="margin:0;padding:0"><img height="260px" width="180px" style="position:absolute;top:0;left:0;border:0" src="' + catURL +'"></body></html>');

var armed = false;

document.addEventListener('DOMContentLoaded', function() {
  var config = {video: true, audio: false};

  initCamera(config, function(stream) {
    //var video = document.createElement('video');
    var video = document.querySelector('.bg-video');
    video.setAttribute('autoplay', true);
    video.src = window.URL.createObjectURL(stream);
    console.log('camera initialized');
  });
});

function initCamera(config, callback) {
  navigator.mediaDevices.getUserMedia(config).then(function (stream) {
    callback(stream);
  });
}

function createPortalGun() {
  var el = document.querySelector('.portalGun');
  el.style.display = 'block';
}

function removePortalGun() {
  var el = document.querySelector('.portalGun');
  el.style.display = 'none';
}

function armWeapon() {
  if (armed)
    return;

  // get sound going early
  controlSound('play', 'portalgun_powerup1');

  createPortalGun()

  // listen to clicks to shoot
  document.addEventListener('click', onShoot, false);
  // change cursor to crosshairs
  // TODO: fix this
  document.body.style.cursor = 'crosshair';

  armed = true;
}

function disarmWeapon() {
  if (!armed) {
    return;
  }

  // remove click listener to disable shooting
  document.removeEventListener('click', onShoot);
  // make cursor normal
  document.body.style.cursor = 'crosshair';
  // clear existing portal if exists
  clearPortal();
  // remove gun
  removePortalGun()

  armed = false;
}

function onShoot(e) {
  //console.log('onShoot', e.pageX, e.pageY);

  // clear any existing portal
  clearPortal();

  // make sounds
  controlSound('play', 'portalgun_shoot_blue1');
  controlSound('play', 'portal_open1');
  controlSound('loop', 'portal_ambient_loop1');

  // make portal visible and position per click coordinates
  var div = document.querySelector('.portalBorderContainer');
  div.style.display = 'block';
  div.style.left = (e.pageX - 90) + 'px';
  div.style.top = (e.pageY - 120) + 'px';
}

function clearPortal() {
  var div = document.querySelector('.portalBorderContainer');
  // stop looping portal sound
  controlSound('stop', 'portal_ambient_loop1');
  // close portal sound
  controlSound('play', 'portal_close2');
  // hide portal
  div.style.display = 'none';
}

function onKeyDown(evt){
  switch (evt.keyCode) {
  case 38:  /* Up arrow was pressed */
    zoom();
  break;
  case 40:  /* Down arrow was pressed */
  break;
  case 37:  /* Left arrow was pressed */
  break;
  case 39:  /* Right arrow was pressed */
  break;
  case 32:
    if (armed) {
      disarmWeapon();
    }
    else {
      armWeapon();
    }
  break;
  }
}
window.addEventListener('keydown', onKeyDown, false);

// not sure what i was planning on doing here, but it sounds interesting!
function zoom() {
  // before creating the portal, render <body> to a canvas, using moz-element
  // this makes the canvas a live-updating version of the body
  // then render canvas to an img element, creating a snapshot of the web content
  //ctx.drawImage(img, 0, 0); 
  // then set targeting layer's background image to the img
}

function controlSound(action, s) {
  //console.log(action, s)
  var el = document.getElementById(s);

  if (!el) {
    console.error('no sound for', s);
    return;
  }

  if (action == 'play') {
    el.pause();
    el.currentTime = 0;
    el.play();
  }

  else if (action == 'loop') {
    el.pause();
    el.currentTime = 0;
    el.play();
  }

  else if (action == 'pause') {
    el.pause();
    el.removeEventListener('ended', onEnded, false);
  }

  else if (action == 'stop') {
    el.pause();
    el.currentTime = 0;
    el.removeEventListener('ended', onEnded, false);
  }

  function onEnded(e) {
    e.target.currentTime = 0;
  }
}
