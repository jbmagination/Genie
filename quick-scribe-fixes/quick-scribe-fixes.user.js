// ==UserScript==
// @name        Quick Scribe Fixes
// @description Fix various mistakes that transcribers can make automatically
// @icon        https://jbmagination.com/genie/quick-scribe-fixes/icon.png
// @match       https://genius.com/*
// @grant       none
// @version     0.0.1
// @author      JBMagination, et al.
// @namespace   JBMagination
// @run-at      document-idle
// @homepageURL https://jbmagination.com/genie/quick-scribe-fixes
// @downloadURL https://jbmagination.com/genie/quick-scribe-fixes/quick-scribe-fixes.user.js
// @supportURL  https://genius.com/JBMagination
// ==/UserScript==

let notAlreadyDone = true;

function fixScribe(event) {
  let start = event.target.selectionStart;
  let end = event.target.selectionEnd;

  // let array;
  if (event.target.value) {
    event.target.value = event.target.value.replace(/“/g,'\"');
    event.target.value = event.target.value.replace(/”/g,'\"');
    event.target.value = event.target.value.replace(/‘/g,'\'');
    event.target.value = event.target.value.replace(/’/g,'\'');
    // array = event.target.value.split('\n');
  } 
  // else array = event.target.innerHTML.split('\n');

  event.target.innerHTML = event.target.innerHTML.replace(/”/g,'\"');
  event.target.innerHTML = event.target.innerHTML.replace(/“/g,'\"');
  event.target.innerHTML = event.target.innerHTML.replace(/‘/g,'\'');
  event.target.innerHTML = event.target.innerHTML.replace(/’/g,'\'');

  // array.forEach((line, index) => {
  //   if ((line[line.length - 1] == '-') && (array.length - 1 > index)) {
  //     array[index] = line.substring(0, line.length - 1) + '—';
  //     if (event.target.value) event.target.value = array.join('\n');
  //     event.target.innerHTML = array.join('\n');
  //   }
  // })

  event.target.innerHTML = event.target.value;
  event.target.value = event.target.innerHTML;
  
  event.target.setSelectionRange(start, end);
}

const observer = new MutationObserver((events) => {
  for (event of events) {
    if ((event.target.labels)) {
      if (!(notAlreadyDone && document.body.contains(event.target))) notAlreadyDone = true;
      if (notAlreadyDone) {
        notAlreadyDone = false;
        event.target.oninput = (event) => fixScribe(event);
      } else void(0);
    }
  }
});

observer.observe(document, { subtree: true, childList: true, attributes: true })
