(function ( $ ) {
	$.fn.pufs = function( options ) {
		// We store all our data and state stuff here
		var list = this;
		
		// Settings with defaults
		list.settings = $.extend({
			selector: 'li',
			page_length: 6,
			next_prev: false,
			next_text: 'Next',
			prev_text: 'Previous',
			filter: false,
			filter_selector: '#pufs-filter li',			
			search: false,
			search_selector: '#pufs-search',
			search_interval: 200
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
			var search_value;

			// Start the countdown on keyup
			$(list.settings.search_selector).keyup(function(){
			    clearTimeout(typing_timer);
			
				search_value = $(this).val();
				search_value = search_value.toLowerCase();
				
		        typing_timer = setTimeout(update_search, list.settings.search_interval, list, search_value);
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
		
		// Current page
		list.data('page', 1);

		// Create the pagination element
		var pagination = $('<div id="pufs-pagination"></div>')
			.attr('id', 'pufs-pagination');
		
		// Add the list elements
		for (var i = 1; i <= list.data('num_pages'); i++) {
			var page_number = $('<li class="pufs-page-number"></li>')
				.attr('data-pufs-page-number', i)
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
			var prev_button = $('<li id="pufs-prev-button">' + list.settings.prev_text + '</li>')
				.hide();

			// Next Button
			var next_button = $('<li id="pufs-next-button">' + list.settings.next_text + '</li>')
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
		
		reset_paging(list);
	}
	
	// Change the selector after a change in filtering
	function update_filter(list) {
		var func = function() {
			// Set the active class on the filter
			$(list.settings.filter_selector).each(function() {
				$(this).removeClass('active');
			});

			$(this).addClass('active');
			
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
	
	// Combine the filters together
	function execute_filters(list) {
		// Create the selector
		var selector = list.settings.selector;

		// Filter info
		if (list.filters.filter) {
			selector = selector + '[data-pufs-filter~="' + list.filters.filter + '"]';
		}
		
		// Search info
		if (list.filters.search) {
			selector = selector + '[data-pufs-search*="' + list.filters.search + '"]';
		}

		// Hide em all
		list.children(list.settings.selector)
			.addClass('pufs-filtered-out');
		
		// Let the filter sort em out
		list.children(selector)
			.removeClass('pufs-filtered-out');

		// Reset Paging
		reset_paging(list);
	}
	
	// Reset paging after a change in filtering
	function reset_paging(list) {
		// Elements are filtered so we just need to get those
		var filtered_selector = list.settings.selector + ':not(.pufs-filtered-out)';

		var list_length = list.children(filtered_selector).length;
		
		var num_pages = Math.ceil(list_length / list.settings.page_length);
		list.data('num_pages', num_pages);
		
		$.each(list.elements.page_numbers, function(key, val) {
			val.hide();
		});
				
		// Fade in the list elements
		var from = 0;
		var to = num_pages;

		$.each(list.elements.page_numbers.slice(from, to), function(key, val) {
			val.fadeIn();
		});

		// Go to page 1
		target_page = 1;
		
		// Active class for styling
		$('#pufs-pagination .pufs-page-number').removeClass('active');
		$('#pufs-pagination .pufs-page-number[data-pufs-page-number="'+ target_page +'"]').addClass('active');

		// Hide all the list elements
		list.children(list.settings.selector)
			.hide();

		// Fade in the list elements
		var from = (target_page - 1) * list.settings.page_length;
		var to = target_page * list.settings.page_length;

		list.children(list.settings.selector + ':not(.pufs-filtered-out)')
			.slice(from, to)
			.fadeIn();

		// Keep track of what page we're on
		list.data('page', target_page);
		
		// Update next/prev buttons
		if (list.settings.next_prev === true) {
			// Next Button
			if (num_pages > 1) {
				$('#pufs-pagination').show();
				$('#pufs-next-button').fadeIn();
			}
			else {
				$('#pufs-pagination').hide();
			}

			$('#pufs-prev-button').hide();
		}
	}
	
	// Progress the paging state
	function go_to_page(list, target) {
		var func = function() {
			var target_page;
			var current_page = list.data('page');

			// Set the list page
			if (target === 'prev') {
				target_page = current_page - 1;
			}
			else if (target === 'next') {
				target_page = current_page + 1;			
			}
			else if ($.isNumeric(target)) {
				target_page = target;
			}

			// Active class for styling
			$('#pufs-pagination .pufs-page-number').removeClass('active');
			$('#pufs-pagination .pufs-page-number[data-pufs-page-number="'+ target_page +'"]').addClass('active');

			// Hide all the list elements
			list.children(list.settings.selector)
				.hide();

			// Fade in the list elements
			var from = (target_page - 1) * list.settings.page_length;
			var to = target_page * list.settings.page_length;

			list.children(list.settings.selector + ':not(.pufs-filtered-out)')
				.slice(from, to)
				.fadeIn();

			// Keep track of what page we're on
			list.data('page', target_page);
			
			// Update next/prev buttons
			if (list.settings.next_prev === true) {				
				// Next Button
				if (target_page === list.data('num_pages')) {
					$('#pufs-next-button').hide();
				}
				else {
					$('#pufs-next-button').fadeIn();
				}

				// Previous Button
				if (target_page === 1) {
					$('#pufs-prev-button').hide();
				}
				else {
					$('#pufs-prev-button').fadeIn();
				}
			}
		}
		
		return func;
	}
	
}( jQuery ));
