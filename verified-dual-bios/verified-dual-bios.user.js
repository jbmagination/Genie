// ==UserScript==
// @name        Genius.com dual artist/user bio
// @description Show both artist and user bios on verified profiles
// @icon        https://jbmagination.com/genie/icons/verified.png
// @match       https://genius.com/*
// @grant       none
// @version     0.0.1
// @author      JBMagination, et al.
// @namespace   JBMagination
// @run-at      document-idle
// ==/UserScript==

let path = false;
if (!(document.querySelector('meta[name="newrelic-resource-path"]').content)) void(0);
else path = document.querySelector('meta[name="newrelic-resource-path"]').content;
if ((!(path)) || (path && (!((path.split('/')[1] == 'users') || (path.split('/')[1] == 'artists'))))) void(0);
else {
    let isString = value => typeof value === 'string' || value instanceof String;
    let insertAfter = (newNode, referenceNode) => referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    let profileType = path.split('/')[1];
    let bioURL;
    
    fetch(`https://genius.com/api${path}`)
    .then((response) => response.json())
    .then((dataRaw) => {
        data = JSON.parse(JSON.stringify(dataRaw)).response;
        if ((profileType == 'users') && !(data.user.artist == null)) bioURL = `https://genius.com/api${data.user.artist['api_path']}`
        if ((profileType == 'artists') && !(data.artist.user == null)) bioURL = `https://genius.com/api${data.artist.user['api_path']}`
        
        fetch(bioURL)
        .then((response) => response.json())
        .then((dataRaw) => {
            data = JSON.parse(JSON.stringify(dataRaw)).response;
            let bioData;
            let bio;
            if (profileType == 'users') bioData = data.artist.description;
            if (profileType == 'artists') bioData = data.user.about_me;
            
            async function createBioSection(element) {
                if (isString(element)) {
                    bio = bio + '\n\n'
                } else {
                    bio = bio + `<${element.tag}`
                    if (element.attributes) for (var key in element.attributes) {
                        bio = bio + ` ${key}="${element.attributes['key']}"`
                    }
                    bio = bio + `>`
                    if (element.children) element.children.forEach((child, index) => {
                        if (isString(child)) bio = bio + child
                        else createBioSection(child);
                    })
                    bio = bio + `</${element.tag}>`
                }
            }
            
            bio = '';
            bioData.dom.children.forEach((child, index) => {
                createBioSection(child);
                
                if (index == bioData.dom.children.length - 1) {
                    if (document.querySelector("[ng-if='$ctrl.user.about_me.html']") && document.querySelector("[ng-if='variants.isDescription']")) return;
                    // todo: fix bio boxes
                    else if (document.querySelector("[ng-if='$ctrl.user.about_me.html']")) {
                        if ((bio == '<p>?</p>') && (profileType == 'users')) return;
                        else {
                            // todo: make artist bio actually function instead of copying user bio
                            var bioPane = document.createElement('div');
                            bioPane.classList.add('u-top_margin');
                            bioPane.setAttribute('ng-switch', '$ctrl.display_as_artist()');
                            bioPane.innerHTML = `<div class="white-container"><div class="rich-text-formatting"><div ng-if="$ctrl.user.about_me.html" ng-bind-html="$ctrl.user.about_me.html">${bio}</div></div></div>`;
                            insertAfter(bioPane, document.querySelector("[ng-if='$ctrl.user.about_me.html']").parentNode.parentNode);    
                        }
                    } 
                    else if (document.querySelector("[ng-if='variants.isDescription']")) {
                        if (bio == '') bio = `<p>${data.user.login} is keeping quiet for now</p>`
                        else {
                            var bioPane = document.createElement('div');
                            bioPane.classList.add('u-top_margin');
                            bioPane.setAttribute('ng-switch', '$ctrl.display_as_artist()');
                            bioPane.innerHTML = `<profile-user-pane ng-switch-when="false" user="ctrl-user" on-statistics-select="$ctrl.change_state('description'); $ctrl.filter_activity_by_type(statistics_type)'"><div class="white-container"><div class="rich-text-formatting"><div ng-if="$ctrl.user.about_me.html" ng-bind-html="$ctrl.user.about_me.html">${bio}</div></div></div>`;
                            insertAfter(bioPane, document.querySelector("[ng-if='variants.isDescription']").parentNode.parentNode.parentNode.parentNode);    
                        }
                    }
                }
            })
        })
    })
}
