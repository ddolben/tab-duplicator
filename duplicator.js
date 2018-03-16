function duplicateTo(url) {
  chrome.tabs.query({
    'active': true,
    'currentWindow': true
  },
  function(result) {
    if (!result || result.length == 0) { 
      console.error("Couldn't find current tab.");
      return;
    }
    chrome.tabs.duplicate(result[0].id, function(newTab) {
      chrome.tabs.update(newTab.id, { 'url': url });
    });
  });
}

function onLinkClick(info, tab) {
  duplicateTo(info.linkUrl);
}

function duplicateTab() {
  chrome.tabs.query({
    'active': true,
    'currentWindow': true
  },
  function(result) {
    if (!result || result.length == 0) { 
      console.error("Couldn't find current tab.");
      return;
    }
    chrome.tabs.duplicate(result[0].id);
  });
};

function createMenus() {
  chrome.contextMenus.create({
    'title': 'Open link in new tab with history',
    'contexts': [ 'link' ],
    'onclick': onLinkClick
  });
  chrome.contextMenus.create({
    'title': 'Duplicate Tab',
    'onclick': duplicateTab
  });
};

// Add command listener to respond to keyboard shortcuts.
chrome.commands.onCommand.addListener(function(command) {
  if (command === 'duplicate-tab') {
    duplicateTab();
  }
});

// Add a listener for messages from this extension's content script.
chrome.runtime.onMessage.addListener(function(request, sender) {
  // Only respond if from a content script (e.g. request came from a tab and not the extension);
  if (sender.tab) {
    duplicateTo(request.href);
  }
});

// Clear all menus created by this extension and re-create them in the callback.
chrome.contextMenus.removeAll(createMenus);
