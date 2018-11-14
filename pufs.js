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
			filter_selector: '#pufs-filter',			
			search: false,
			search_selector: '#pufs-search'
		}, options );
		
		// Store the elements we create for later access
		list.elements = {
			pagination: false,
			prev_button: false,
			next_button: false,
			page_numbers: []
		};
		
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
			var prev_button = $('<li class="pufs-prev-button">Previous</li>')
				.hide();

			// Next Button
			var next_button = $('<li class="pufs-next-button">Next</li>')
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
		}

		// Add the pagination to the elements list for later access
		list.elements.pagination = pagination;
		
		// Add the pagination to the page
		list.after(pagination);
		
		if (num_pages >= 1) {
			next_button.fadeIn();
		}
		
		return list;
	};
	
	// Reset paging after a change in filtering
	function reset_paging() {
		
	}
	
	// Progress the paging state
	function go_to_page(list, target) {
		
	}
	
}( jQuery ));
