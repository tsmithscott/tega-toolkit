$(document).ready(function() {
	// TODO:
	// Check if jwt token exists
	// If it does, parse it and get the last section visited
	// Set the last section button styles
	// If the cookie doesn't exist start from the beginning

	if (getCookie("_game_data") !== null) {
		sections = JSON.parse(getCookie("_game_data"));
		sections_keys = Object.keys(sections);
		latestSection = sections_keys[sections_keys.length - 1];
		switch (latestSection) {
			// No need for 'introduction' case - it is the default case
			case('profile'):
				// Set the button styles accordingly, 
				// and display content section.
				// Also, set the progress bar value
				break;
			case('typology'):
				break;
			case('characteristics'):
				break;
			case('foundation'):
				break;
			case('model'):
				break;
			case('accessibility'):
				break;
			case('design'):
				break;
			case('instruction'):
				break;
			case('playability'):
				break;
			case('assessment'):
				break;
			case('justification'):
				break;
		}
	}
});

let currentButton = $('.list-group-item.list-group-item-action.active') 


$('.list-group-item').click(function() {
	var currentButton = $(this);
	var nextButton = currentButton.next();

	$.ajax({
	  url: '/ajax_handler',
	  data: { "data": "TEST" },
	  type: 'POST',
	  success: function(response) {
		var button = $('.list-group-item.list-group-item-action.active'); // get all buttons with active class
		button.removeClass('active').removeAttr('aria-current'); // remove active class and aria-current attribute
		if (currentButton.children().val() === "0") { // if the button has not been clicked
			if (nextButton.length === 0) { // if there is no next button
				currentButton.addClass('active').attr('aria-current', 'true');
				currentButton.children().val(1);
				// Increment progress bar value
				let progress = parseInt($('#progress-bar').attr('aria-valuenow')) + 8.33333333333;
				$('#progress-bar').attr('aria-valuenow', progress).css('width', progress + '%');
			} else { // if there is a next button
				currentButton.removeClass('active').removeAttr('aria-current');
				currentButton.children().val(1);
				nextButton.addClass('active').attr('aria-current', 'true').removeAttr('disabled style');
			}
			// Increment progress bar value
			let progress = parseInt($('#progress-bar').attr('aria-valuenow')) + 8.33333333333;
			$('#progress-bar').attr('aria-valuenow', progress).css('width', progress + '%');
		} else { // If the button has already been clicked
			currentButton.addClass('active').attr('aria-current', 'true')
			// Only change the modal dont do anything with the buttons here.
		}
	  },
	  error: function(error) {
		console.error(error);
	  }
	});
});
