/**
 * By default, breadcrumb is turned off, still the breadcrumb options are visible.
 * This file resolves the issue.
 */
(function($) {
    // Wait until the Customizer is fully loaded.
    wp.customize.bind('ready', function() {
        // Add click event listener to the breadcrumb section.
        $('#accordion-section-responsive_breadcrumb').on('click', function() {
            if(!isBreadcrumbEnable()){
                WhenBreadcrumbUnchecked();
            }
        });

        // Listen to changes on the main breadcrumb toggle
        if ( wp.customize('responsive_theme_options[breadcrumb]') ) {
            wp.customize('responsive_theme_options[breadcrumb]').bind(function(newval) {
                if ( newval ) {
                    let subSettings = [
                        'responsive_breadcrumb_enable_home_page',
                        'responsive_breadcrumb_enable_blog_posts_page',
                        'responsive_breadcrumb_enable_search',
                        'responsive_breadcrumb_enable_archive',
                        'responsive_breadcrumb_enable_single_page',
                        'responsive_breadcrumb_enable_single_post',
                        'responsive_breadcrumb_enable_404_page'
                    ];
                    
                    // Check if all sub-settings are false (which is the default state).
                    // If all are false, we assume it's the "first time" enabling them, 
                    // or the user explicitly turned them all off and we do a master reset.
                    let allFalse = subSettings.every(function(s) {
                        return wp.customize(s) && ( wp.customize(s).get() == false || wp.customize(s).get() == 0 );
                    });
                    
                    if ( allFalse ) {
                        subSettings.forEach(function(s) {
                            if ( wp.customize(s) ) {
                                wp.customize(s).set(true);
                            }
                        });
                    }
                }
            });
        }
    });

    function WhenBreadcrumbUnchecked() {
        // Get all IDs from elementIDs and set their display to block.
        let ids = elementIDs();
        ids.forEach(function(id) {
            $('#' + id).css('display', 'none');
        });

        if ($('#customize-control-responsive_breadcrumb_tabs #responsive_breadcrumb_general_tab').length) {
            $('#customize-control-responsive_breadcrumb_tabs #responsive_breadcrumb_general_tab').on('click', function() {
                setTimeout(function() {
                    if (!isBreadcrumbEnable()) {
                        ids.forEach(function(id) {
                            $('#' + id).css('display', 'none');
                        });
                    }
                }, 100);
            });
        }
    }

    function isBreadcrumbEnable() {
        if ( typeof wp !== 'undefined' && wp.customize && wp.customize('responsive_theme_options[breadcrumb]') ) {
            return wp.customize('responsive_theme_options[breadcrumb]').get() ? true : false;
        }
        
        let toggleControl = $('#customize-control-res_breadcrumb input[type="checkbox"]');
        if (toggleControl.length) {
            let isChecked = toggleControl.is(':checked');
            return isChecked ? true : false;
        } else {
            return false;
        }
    }

    function elementIDs() {
        let tab_ids_prefix  = 'customize-control-';
        let general_tab_ids = [
            tab_ids_prefix + 'responsive_breadcrumb_enable_separator',				
            tab_ids_prefix + 'responsive_breadcrumb_position',
            tab_ids_prefix + 'responsive_breadcrumb_position_separator',
            tab_ids_prefix + 'responsive_breadcrumb_enable_home_page',
            tab_ids_prefix + 'responsive_breadcrumb_enable_blog_posts_page',
            tab_ids_prefix + 'responsive_breadcrumb_enable_search',
            tab_ids_prefix + 'responsive_breadcrumb_enable_archive',
            tab_ids_prefix + 'responsive_breadcrumb_enable_single_page',
            tab_ids_prefix + 'responsive_breadcrumb_enable_single_post',
            tab_ids_prefix + 'responsive_breadcrumb_enable_404_page',
            tab_ids_prefix + 'responsive_breadcrumb_separator',
            tab_ids_prefix + 'responsive_breadcrumb_separator_separator',
            tab_ids_prefix + 'responsive_content_header_alignment',
            tab_ids_prefix + 'responsive_content_header_alignment_separator',
            tab_ids_prefix + 'responsive_breadcrumb_display_settings_separator',
        ];
        return general_tab_ids;
    }
})(jQuery);
