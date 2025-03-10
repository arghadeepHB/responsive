<?php

// Exit if accessed directly.
if( ! defined( 'ABSPATH' ) ) {
    exit;
}

$has_sides                    = array();

/**
 * Main Call for Responsive Header
 */
function header_markup() {
	get_template_part( 'template-parts/header/base' );
}

/**
 * Header Row Class.
 *
 * @param string $row the header row.
 */
function header_row_class( $row ) {
	$classes = 'responsive-site-' . esc_attr( $row ) . '-header-wrap site-header-row-container site-header-focus-item' . esc_attr( get_theme_mod( 'header_sticky', 0 ) === $row ? ' responsive-sticky-header' : '' );
	return apply_filters( 'responsive-header-row-class-string', $classes );
}

/**
 * Header Above Row
 */
function above_header() {
	if ( display_header_row( 'above' ) ) {
		get_other_template( 'template-parts/header/header', 'row', array( 'row' => 'above' ) );
	}
}

/**
 * Header Primary Row
 */
function primary_header() {
	if ( display_header_row( 'primary' ) ) {
		get_other_template( 'template-parts/header/header', 'row', array( 'row' => 'primary' ) );
	}
}

/**
 * Header Below Row
 */
function below_header() {
	if ( display_header_row( 'below' ) ) {
		get_other_template( 'template-parts/header/header', 'row', array( 'row' => 'below' ) );
	}
}

/**
 * Adds support to render header columns.
 *
 * @param string $row the name of the row.
 * @param string $column the name of the column.
 * @param string $header the name of the header.
 */
function render_header( $row = 'primary', $column = 'left', $header = 'desktop' ) {
	$elements = get_theme_mod( 'responsive_header_' . $header . '_items', Responsive\Core\get_responsive_customizer_defaults( 'responsive_header_' . $header . '_items' ) );
	if ( isset( $elements ) && isset( $elements[ $row ] ) && isset( $elements[ $row ][ $row . '_' . $column ] ) && is_array( $elements[ $row ][ $row . '_' . $column ] ) && ! empty( $elements[ $row ][ $row . '_' . $column ] ) ) {
		foreach ( $elements[ $row ][ $row . '_' . $column ] as $key => $item ) {
			$template = apply_filters( 'responsive_header_elements_template_path', 'template-parts/header/' . $item, $item, $row, $column );
			get_template_part( $template );
		}
	}
}

/**
 * Header Column
 *
 * @param string $row the column row.
 * @param string $column the row column.
 */
function header_column( $row, $column ) {
	render_header( $row, $column );
}

/**
 * Adds support to render header columns.
 *
 * @param string $row the name of the row.
 */
function display_header_row( $row = 'primary' ) {
	$display = false;
	foreach ( array( 'left', 'center', 'right' ) as $column ) {
		$elements = get_theme_mod( 'responsive_header_desktop_items', Responsive\Core\get_responsive_customizer_defaults( 'responsive_header_desktop_items' ) );
		if ( isset( $elements ) && isset( $elements[ $row ] ) && isset( $elements[ $row ][ $row . '_' . $column ] ) && is_array( $elements[ $row ][ $row . '_' . $column ] ) && ! empty( $elements[ $row ][ $row . '_' . $column ] ) ) {
			$display = true;
			break;
		}
	}
	return $display;
}

/**
 * Get other templates assing attributes and including the file.
 *
 * @param string $slug The slug name for the generic template.
 * @param string $name The name of the specialised template.
 * @param array  $args          Arguments. (default: array).
 */
function get_other_template( $slug, $name = null, $args = array() ) {

	/**
	 * Pass custom variables to the template file.
	 */
	foreach ( (array) $args as $key => $value ) {
		set_query_var( $key, $value );
	}

	return get_template_part( $slug, $name );
}

/**
 * Adds a check to see if the side columns should run.
 *
 * @param string $row the name of the row.
 */
function has_side_columns( $row = 'primary' ) {
	if ( isset( $has_sides[ $row ] ) ) {
		return $has_sides[ $row ];
	}
	$side     = false;
	$elements = get_theme_mod( 'responsive_header_desktop_items', Responsive\Core\get_responsive_customizer_defaults( 'responsive_header_desktop_items' ) );
	if ( isset( $elements ) && isset( $elements[ $row ] ) ) {
		if ( ( isset( $elements[ $row ][ $row . '_left' ] ) && is_array( $elements[ $row ][ $row . '_left' ] ) && ! empty( $elements[ $row ][ $row . '_left' ] ) ) || ( isset( $elements[ $row ][ $row . '_left_center' ] ) && is_array( $elements[ $row ][ $row . '_left_center' ] ) && ! empty( $elements[ $row ][ $row . '_left_center' ] ) ) || ( isset( $elements[ $row ][ $row . '_right_center' ] ) && is_array( $elements[ $row ][ $row . '_right_center' ] ) && ! empty( $elements[ $row ][ $row . '_right_center' ] ) ) || ( isset( $elements[ $row ][ $row . '_right' ] ) && is_array( $elements[ $row ][ $row . '_right' ] ) && ! empty( $elements[ $row ][ $row . '_right' ] ) ) ) {
			$side = true;
		}
	}
	$has_sides[ $row ] = $side;
	return $side;
}

/**
 * Adds a check to see if the center column should run.
 *
 * @param string $row the name of the row.
 */
function has_center_column( $row = 'primary' ) {
	if ( isset( $has_center[ $row ] ) ) {
		return $has_center[ $row ];
	}
	$centre   = false;
	$elements = get_theme_mod( 'responsive_header_desktop_items', Responsive\Core\get_responsive_customizer_defaults( 'responsive_header_desktop_items' ) );
	if ( isset( $elements ) && isset( $elements[ $row ] ) && isset( $elements[ $row ][ $row . '_center' ] ) && is_array( $elements[ $row ][ $row . '_center' ] ) && ! empty( $elements[ $row ][ $row . '_center' ] ) ) {
		$centre = true;
	}
	$has_center[ $row ] = $centre;
	return $centre;
}

function responsive_header_woo_cart_slide_in() {
	// Get the cart click action setting.
	$cart_click_action = get_theme_mod( 'responsive_header_woo_cart_click_action', 'dropdown' );
	// Hide cart slide in only if current page is checkout/cart or if redirect option is selected.
	$is_cart_element_loaded = Responsive\Core\responsive_check_element_present_in_hfb( 'woo-cart', 'header' );
	if (
		$is_cart_element_loaded && class_exists( 'WooCommerce' ) && ! is_cart() && ! is_checkout()
	) {
		// Prevent slide in markup when 'redirect' option is selected.
		// Remove the second if condition if we have mobile header builder.
		if( 'redirect' !== $cart_click_action || 'dropdown' === $cart_click_action && wp_is_mobile() ) {
		wp_enqueue_script( 'responsive-cart-slide-in', get_template_directory_uri() . '/core/js/slide-in-cart.js', array(), RESPONSIVE_THEME_VERSION, true );
		$rspv_cart_localize_data = array(
			'cart_click_action' => $cart_click_action,
			'isMobile'          => wp_is_mobile()
		);
		wp_localize_script( 'responsive-cart-slide-in', 'responsive_woo_cart', $rspv_cart_localize_data );
		wp_enqueue_style( 'dashicons' );
	?>
		<div class="rspv-slide-cart-overlay"></div>
		<div id="rspv-slide-cart-drawer" class="rspv-header-cart-drawer">
			<div class="rspv-cart-drawer-header">
				<button type="button" class="rspv-header-cart-drawer-close" aria-label="<?php echo esc_attr__( 'Close Cart Drawer', 'responsive' ); ?>">
					<span class="dashicons dashicons-no-alt"></span>
				</button>
				<div class="rspv-cart-drawer-title">
				<?php
					echo apply_filters( 'responsive_header_cart_slide_in_shopping_cart_text', __( 'Shopping Cart', 'responsive' ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				?>
				</div>
			</div>
			<div class="rspv-cart-drawer-content">
				<?php
				if ( class_exists( 'WooCommerce', false ) ) {
					the_widget( 'WC_Widget_Cart', 'title=' );
				}
				?>
			</div>
		</div>
	<?php
		}
	}
}