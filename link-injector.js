(function(w, d) {
  // Set up key tracking.
  // We need to track keys currently pressed because Javascript doesn't
  // actually provide a way of doing this natively.
  w.keysDown = {};
  d.onkeydown = function(e) {
    e = e || w.event;
    // Don't waste cycles or modify memory if we don't care about they keys.
    if (e.keyCode == 16 || e.keyCode == 18) {
      w.keysDown[e.keyCode] = true;
    }
  };
  d.onkeyup = function(e) {
    e = e || w.event;
    // Don't waste cycles or modify memory if we don't care about they keys.
    if (e.keyCode == 16 || e.keyCode == 18) {
      delete w.keysDown[e.keyCode];
    }
  };

  w.ClearKeysDown = function() {
    // Only clear the keys we care about.
    delete w.keysDown[16];
    delete w.keysDown[18];
  };

  w.CheckLink = function(e) {
    // 16 = shift
    // 18 = alt
    if (16 in w.keysDown && 18 in w.keysDown) {
      w.ClearKeysDown();
      console.log("Currently down:", w.keysDown);
      e.preventDefault();
      e.stopPropagation();  // TODO: do I want this?
      chrome.runtime.sendMessage({href: e.target.href});
      console.log("Tab history link hijacker click:", e.target.href);
    }
    console.log(w.keysDown);
  };

  d.addEventListener('click', function(e) {
    if (e.target.nodeName == "A" &&
        e.target.hasAttribute('href') &&
        !e.target.hasAttribute('onclick')) {
      w.CheckLink(e);
    }
  });
  console.log("Added link hijacker to page.");
})(window, document);
