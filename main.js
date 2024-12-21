// ==UserScript==
// @name         Search Filter (-CSDN)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically append "-csdn" to search queries
// @author       Your name
// @match        *://www.google.com/*
// @match        *://www.google.com.hk/*
// @match        *://www.google.cn/*
// @match        *://www.bing.com/*
// @match        *://cn.bing.com/*
// @match        *://www.baidu.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Function to modify search query
    function modifySearchQuery() {
        const searchEngines = {
            'google': {
                inputSelector: 'input[name="q"]',
                formSelector: 'form[role="search"]',
                param: 'q'
            },
            'bing': {
                inputSelector: '#sb_form_q',
                formSelector: '#sb_form',
                param: 'q'
            }
        };

        let currentEngine = null;
        if (location.hostname.includes('google')) {
            currentEngine = searchEngines.google;
        } else if (location.hostname.includes('bing')) {
            currentEngine = searchEngines.bing;
        }

        if (!currentEngine) return;

        // Modify the search input
        const searchInput = document.querySelector(currentEngine.inputSelector);
        if (searchInput) {
            // Only append -csdn if it's not already present
            if (!searchInput.value.toLowerCase().includes('-csdn')) {
                const originalValue = searchInput.value.trim();
                if (originalValue) {
                    searchInput.value = originalValue + ' -csdn';
                }
            }
        }

        // Modify the URL if it's a search results page
        const urlParams = new URLSearchParams(window.location.search);
        const queryParam = urlParams.get(currentEngine.param);
        if (queryParam && !queryParam.toLowerCase().includes('-csdn')) {
            urlParams.set(currentEngine.param, queryParam.trim() + ' -csdn');
            const newUrl = window.location.pathname + '?' + urlParams.toString();
            history.replaceState(null, '', newUrl);
        }

        // Add event listener to the search form
        const searchForm = document.querySelector(currentEngine.formSelector);
        if (searchForm) {
            searchForm.addEventListener('submit', function(e) {
                const input = this.querySelector(currentEngine.inputSelector);
                if (input && !input.value.toLowerCase().includes('-csdn')) {
                    input.value = input.value.trim() + ' -csdn';
                }
            });
        }
    }

    // Run on page load
    modifySearchQuery();

    // Run when URL changes (for single-page applications)
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            modifySearchQuery();
        }
    }).observe(document, { subtree: true, childList: true });
})();
