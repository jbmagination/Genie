// ==UserScript==
// @name        Bagon Bagel
// @description Redirect to the old song page on Genius by default
// @icon        https://assets.genius.com/images/apple-touch-icon.png
// @match       https://genius.com/*lyrics
// @match       https://genius.com/*annotated
// @grant       none
// @version     1.0.0
// @author      JBMagination, et al.
// @namespace   JBMagination
// @homepageURL https://jbmagination.com/genie/bagon-bagel
// @downloadURL https://jbmagination.com/genie/bagon-bagel/bagon-bagel.user.js
// @supportURL  https://genius.com/JBMagination
// ==/UserScript==

let params = new URLSearchParams(window.location.search);
if (!(params.has('bagon'))) { 
  params.set('bagon', '1')
  window.location.search = params.toString();
}

document.querySelector('.react_song_page_preview_link').style = "display:none;"
