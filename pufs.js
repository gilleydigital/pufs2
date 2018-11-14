(function ( $ ) {
	$.fn.pufs = function( options ) {
		// We store all our data and state stuff here
		var list = this;
		
		// Settings with defaults
		list.settings = $.extend({
			selector: 'li',
			page_length: 6,
			next_prev: false,
			filter: false,
			filter_selector: '#pufs-filter li',			
			search: false,
			search_selector: '#pufs-search',
			search_interval: 150
		}, options );
		
		// Store the elements we create for later access
		list.elements = {
			pagination: false,
			prev_button: false,
			next_button: false,
			page_numbers: []
		};
		
		// Where we store currently active filters
		list.filters = {};
	
		// Initialize the elements
		initialize(list);
		
		// Filter
		if (list.settings.filter !== false) {
			$(list.settings.filter_selector).click(update_filter(list));
		}
		
		// Search Bar
		if (list.settings.search !== false) {
			var typing_timer;

			// Start the countdown on keyup
			$(list.settings.search_selector).keyup(function(){
			    clearTimeout(typing_timer);
		        typing_timer = setTimeout(update_search, list.settings.search_interval, list, list.settings.search_selector.val);
			});
		}
		
		return list;
	};
	
	function initialize(list) {
		// Store filters
		list.filters = {};
		
		// Number of child elements
		var list_length = list.children(list.settings.selector).length;
		
		// Calculate the number of pages
		var num_pages = Math.ceil(list_length / list.settings.page_length);
		list.data('num_pages', num_pages);

		// Create the pagination element
		var pagination = $('<div id="pufs-pagination"></div>')
			.attr('id', 'pufs-pagination');
		
		// Add the list elements
		for (var i = 1; i <= list.data('num_pages'); i++) {
			var page_number = $('<li class="pufs-page-number"></li>')
				.data('pufs-page-number', i)
				.text(i);
			
			// User clicks page number
			page_number.bind('click', go_to_page(list, i));

			// Add the button to the elements list for later access
			list.elements.page_numbers.push(page_number);

			// Add the button to the page
			pagination.append(page_number);
		}
		
		// Create next/prev buttons if applicable
		if (list.settings.next_prev === true) {
			// Prev Button
			var prev_button = $('<li id="pufs-prev-button">Previous</li>')
				.hide();

			// Next Button
			var next_button = $('<li id="pufs-next-button">Next</li>')
				.hide();
				
			// User clicks prev
			prev_button.bind('click', go_to_page(list, 'prev'));
			
			// User clicks next
			next_button.bind('click', go_to_page(list, 'next'));
				
			// Add the buttons to the elements list for later access
			list.elements.prev_button = prev_button;
			list.elements.next_button = next_button;

			// Add the buttons to the page
			pagination.prepend(prev_button);
			pagination.append(next_button);
			
			// Show Next Button if there are multiple pages
			if (num_pages >= 1) {
				next_button.fadeIn();
			}
		}

		// Add the pagination to the elements list for later access
		list.elements.pagination = pagination;
		
		// Add the pagination to the page
		list.after(pagination);		
	}
	
	// Change the selector after a change in filtering
	function update_filter(list) {
		var func = function() {
			// Get the string we will filter on
			var filter = $(this).data('pufs-filter');
			
			// Set the filter
			list.filters.filter = filter;
			
			execute_filters(list);
		}
		
		return func;
	}
	
	// Change the selector after a change in search string
	function update_search(list, search) {
		// Set the search filter
		list.filters.search = search;
		
		execute_filters(list);
	}
	
	// Progress the paging state
	function go_to_page(list, target) {
		var func = function() {
			
		}
		
		return func;
	}
	
	// Combine the filters together
	function execute_filters(list) {
		// Create the selector
		var selector = list.settings.selector;

		// Filter info
		if (list.filters.filter) {
			selector = selector + '[data-pufs-filter="' + list.filters.filter + '"]';
		}
		
		// Search info
		if (list.filters.search) {
			selector = selector + '[data-pufs-search*="' + list.filters.search + '"]';
		}

		// Hide em all
		list.children(list.settings.selector).hide();
		
		// Let the filter sort em out
		list.children(selector)
			.addClass('pufs-active')
			.fadeIn();

		// Reset Paging
		reset_paging(list);
	}
	
	// Reset paging after a change in filtering
	function reset_paging(list) {
		
	}
	
}( jQuery ));
