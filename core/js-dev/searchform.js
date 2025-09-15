/**
 * File searchform.js.
 *
 * Handles display of header search element's form.
 * 
 */

( function() {

    document.addEventListener("DOMContentLoaded", function () {

        const containers    = document.getElementsByClassName("responsive-header-search");
        const search_link   = document.getElementById("res-search-link");
        const search_style  = document.getElementById("full-screen-res-search-link");
        const search_close  = document.getElementById("search-close");
        const searchSubmits = document.querySelectorAll('.search-submit');

        // Debounce function for the live search functionality.
        function debounce(func, delay) {
            let timer;
            return function (...args) {
                clearTimeout(timer);
                timer = setTimeout(() => func.apply(this, args), delay);
            };
        }

        if (search_link && containers.length > 0) {
            let sibling;
        
            search_link.addEventListener("click", function () {
                sibling = this.parentNode.querySelector(".search-type-responsive-slide");
                if (sibling) {    
                    Array.from(containers).forEach((container) => {
                        let search_form = container.querySelector("#searchform");
                        if (search_form) {
                            sibling.classList.add("search-active");
                            setTimeout(() => {
                                search_form.querySelector("input[type='search']").focus();
                            }, 50);
                        }
                    });
                }
            });
        
            // Hide search form if clicking outside
            document.addEventListener("click", function (event) {
                Array.from(containers).forEach(function (container) {
                    let search_form = container.querySelector("#searchform");
                    if (search_form && sibling && !container.contains(event.target)) {
                        sibling.classList.remove('search-active');
                    }
                });
            });
        }       

        searchSubmits.forEach(searchSubmit => {
            searchSubmit.addEventListener('click', function(event) {
                if (this.classList.contains('responsive-header-slide-search')) {
                    event.preventDefault();
                    const searchForm = this.closest('.search-type-responsive-slide').querySelector('.search-form'); // Replace '.parent-selector' with the appropriate parent selector

                    if (searchForm) {
                        const searchField = searchForm.querySelector('.search-field');
                        const searchTerm = searchField ? searchField.value.trim() : '';
        
                        if (searchTerm) {
                            searchForm.submit();
                        } else {
                            searchForm.parentElement.classList.remove('search-active');
                        }
                    }
                }
            });
        });

        if (wpApiSettings.enable_live_search || wpApiSettings.enable_live_search === 1) {
            document.querySelectorAll('.search-field').forEach(input => {
                // Select the results panel relative to the current input's form
                const resultsPanel = input.closest('form').querySelector('.live-search-results');
                const performSearch = debounce(async () => {
                const term = input.value.trim();

                // Clear the result panel before each new request
                resultsPanel.innerHTML = '';
                
                if (!term) {
                    // Hide panel when input is empty
                    resultsPanel.classList.remove('active');
                    resultsPanel.innerHTML = '';
                    return;
                }
                
                try {
                    const params = new URLSearchParams({
                        search: term,
                        per_page: 5
                    });
                    
                    if(wpApiSettings.live_search_post_types.length > 0) {
                        wpApiSettings.live_search_post_types.forEach(type => {
                            params.append('subtype[]', type);
                        });
                    } else {
                        const noResultFound = document.createElement('h3'); 
                        noResultFound.textContent = 'No results found';
                        noResultFound.classList.add('live-search-section-title');
                        resultsPanel.appendChild(noResultFound);
                        resultsPanel.classList.add('active'); 
                        return;
                    }
                    // Data fetching logic using WordPress REST API
                    const url      = buildApiUrl('wp/v2/search', params);
                    const response = await fetch(url);
                    const data     = await response.json();

                    if (data.length === 0) {
                        const noResultFound = document.createElement('h3'); 
                        noResultFound.textContent = 'No results found';
                        noResultFound.classList.add('live-search-section-title');
                        resultsPanel.appendChild(noResultFound);
                        resultsPanel.classList.add('active'); 
                        return;
                    }
    
                    let isPageTitleAdded = false;
                    let isPostTitleAdded = false;
                    data.forEach(item => {
                        // Container for each search result
                        const itemContainer = document.createElement('div');
                        itemContainer.classList.add('live-search-result-item');
    
                        if (item.subtype === "page") {
                        
                            if (!isPageTitleAdded) {
                            
                                const pageTitle = document.createElement('h3'); 
                                pageTitle.textContent = 'Pages';
                                pageTitle.classList.add('live-search-section-title');
                                resultsPanel.appendChild(pageTitle);
                                isPageTitleAdded = true;
                            }
    
                            const pageAnchor = document.createElement('a');
                            pageAnchor.href = item.url;
                            pageAnchor.textContent = item.title;
                            pageAnchor.classList.add('live-search-result-link');
                            resultsPanel.appendChild(pageAnchor);
                        } else if (item.subtype === "post") {
                    
                            if (!isPostTitleAdded) {
                                
                                const postTitle = document.createElement('h3'); 
                                postTitle.textContent = 'Posts';
                                postTitle.classList.add('live-search-section-title');
                                postTitle.classList.add('posts');
                                resultsPanel.appendChild(postTitle);
                                isPostTitleAdded = true;
                            }
    
                            const postAnchor = document.createElement('a');
                            postAnchor.href = item.url;
                            postAnchor.textContent = item.title;
                            postAnchor.classList.add('live-search-result-link');
                            resultsPanel.appendChild(postAnchor);
                        }
    
                    });
    
                    // Ensure the panel is visible after results are added
                    resultsPanel.classList.add('active');
                
                } catch (err) {
                    console.error(err); 
                    const errorFetchingResultMessage = document.createElement('h3'); 
                    errorFetchingResultMessage.textContent = 'Error fetching results.';
                    errorFetchingResultMessage.classList.add('live-search-section-title');
                    resultsPanel.appendChild(errorFetchingResultMessage);
                    resultsPanel.classList.add('active'); 
                }
                }, 300);
                input.addEventListener('input', performSearch);
            });
        }
        
    
        if (search_style && containers.length > 0) {
            let search_style_form = document.getElementById("full-screen-search-wrapper");
            if (search_style_form) {
                search_style.onclick = function () {
                    search_style_form.style.display = "block";
                    search_style_form.style.position = "fixed";
                    Array.from(containers).forEach(function (container) {
                        let search_form = container.getElementsByTagName("form")[0];
                        if (search_form) {
                            search_form.style.display = "block";
                            search_form.querySelector("input[type='search']").focus();
                        }
                    });
                };
            }
        }
    
        if (search_close) {
            search_close.onclick = function () {
                let search_style_form = document.getElementById("full-screen-search-wrapper");
                if (search_style_form) {
                    search_style_form.style.display = "none";
                }
            };
        }

        function buildApiUrl(path, params) {
            // If root already has a "?" (plain permalinks), append with &
            const separator = wpApiSettings.root.includes('?') ? '&' : '?';
            return `${wpApiSettings.root}${path}${separator}${params.toString()}`;
        }
    });
    

} )();