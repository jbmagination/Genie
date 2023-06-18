// ==UserScript==
// @name         Bagon Bagel
// @namespace    JBMagination
// @version      1.0.0
// @description  Redirect to the old song page on Genius by default
// @author       JBMagination, et al.
// @match        https://genius.com/*lyrics
// @match        https://genius.com/*annotated
// @icon         https://assets.genius.com/images/apple-touch-icon.png
// @grant        none
// ==/UserScript==

let params = new URLSearchParams(window.location.search);
if (!(params.has('bagon'))) { 
  params.set('bagon', '1')
  window.location.search = params.toString();
}

document.querySelector('.react_song_page_preview_link').style = "display:none;"
