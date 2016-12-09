// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 */
function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, function(tabs) {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];

    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    var url = tab.url;

    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url);
  });

  // Most methods of the Chrome extension APIs are asynchronous. This means that
  // you CANNOT do something like this:
  //
  // var url;
  // chrome.tabs.query(queryInfo, function(tabs) {
  //   url = tabs[0].url;
  // });
  // alert(url); // Shows "undefined", because chrome.tabs.query is async.
}

/**
 * @param {string} searchTerm - Search term for Google Image search.
 * @param {function(string,number,number)} callback - Called when an image has
 *   been found. The callback gets the URL, width and height of the image.
 * @param {function(string)} errorCallback - Called when the image is not found.
 *   The callback gets a string that describes the failure reason.
 */
function getImageUrl(searchTerm, callback, errorCallback) {
  // Google image search - 100 searches per day.
  // https://developers.google.com/image-search/
  var searchUrl = 'https://ajax.googleapis.com/ajax/services/search/images' +
    '?v=1.0&q=' + encodeURIComponent(searchTerm);
  var x = new XMLHttpRequest();
  x.open('GET', searchUrl);
  // The Google image search API responds with JSON, so let Chrome parse it.
  x.responseType = 'json';
  x.onload = function() {
    // Parse and process the response from Google Image Search.
    var response = x.response;
    if (!response || !response.responseData || !response.responseData.results ||
        response.responseData.results.length === 0) {
      errorCallback('No response from Google Image search!');
      return;
    }
    var firstResult = response.responseData.results[0];
    // Take the thumbnail instead of the full image to get an approximately
    // consistent image size.
    var imageUrl = firstResult.tbUrl;
    var width = parseInt(firstResult.tbWidth);
    var height = parseInt(firstResult.tbHeight);
    console.assert(
        typeof imageUrl == 'string' && !isNaN(width) && !isNaN(height),
        'Unexpected respose from the Google Image Search API!');
    callback(imageUrl, width, height);
  };
  x.onerror = function() {
    errorCallback('Network error.');
  };
  x.send();
}

function renderStatus(statusText) {
  document.getElementById('status').textContent = statusText;
}

let checkButton = null;

function domSome() {
  var someVar = {text: 'test', foo: 1, bar: false};
  chrome.tabs.executeScript({
    code: '(' + function(params) {
      // document.body.querySelector("#player_object").style.position = "fixed";
      // document.body.querySelector("#player_object").style.left = 0;
      // document.body.querySelector("#player_object").style.top = 0;
      // document.body.querySelector("#player_object").style.zIndex = 1000;
      var script = document.createElement('script');
      script.async = false;
      script.src = 'https://localhost:4000/socket.io.js';
      script.onload = function () {
      };
      document.head.appendChild(script);
      var script = document.createElement('script');
      script.async = false;
      script.src = 'https://localhost:4000/youtube.js';
      script.onload = function () {
      };
      document.head.appendChild(script);
      return {success: true, html: document.body.innerHTML};
    } + ')(' + JSON.stringify(someVar) + ');'
  }, function(results) {
    console.log(results[0]);
  });
}

function interval() {
  document.querySelector("#time").innerHTML = new Date().toString();
}

document.addEventListener('DOMContentLoaded', function() {
  setTimeout(function () {
    var bkg = chrome.extension.getBackgroundPage();
  }, 3000);

  function modifyDOM() {
    //You can play with your DOM here or check URL against your regex
    return localStorage.getItem("extension_action");
  }

  chrome.tabs.executeScript({
    code: '(' + modifyDOM + ')();' //argument here is a string but function.toString() returns function's code
  }, (results) => {
    //Here we have just the innerHTML and not DOM structure
    var action = results[0];
    if (action) {
      var newURL = action;
      if (action == "open bilibili download") {
        newURL = "http://member.bilibili.com/v/video/submit.html";
        chrome.tabs.create({ url: newURL });
      }
    } else {
      console.log("what could I say");
    }
  });
});