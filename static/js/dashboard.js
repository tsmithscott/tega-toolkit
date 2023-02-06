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

		removeAllStyling();

		switch (latestSection) {
			case('introduction'):
				addSectionStyling('#introduction');
				break;
			case('profile'):
				addSectionStyling('#profile');
				break;
			case('typology'):
				addSectionStyling('#typology');
				break;
			case('characteristics'):
				addSectionStyling('#characteristics');
				break;
			case('foundation'):
				addSectionStyling('#foundation');
				break;
			case('model'):
				addSectionStyling('#model');
				break;
			case('accessibility'):
				addSectionStyling('#accessibility');
				break;
			case('design'):
				addSectionStyling('#design');
				break;
			case('instruction'):
				addSectionStyling('#instruction');
				break;
			case('playability'):
				addSectionStyling('#playability');
				break;
			case('assessment'):
				addSectionStyling('#assessment');
				break;
			case('justification'):
				addSectionStyling('#justification');
				break;
		}
	}
});

let sections = ['introduction', 
				'profile', 
				'typology', 
				'characteristics', 
				'foundation', 
				'model', 
				'accessibility', 
				'design', 
				'instruction', 
				'playability', 
				'assessment', 
				'justification'];

// Set all styling to default/disabled/hidden
function removeAllStyling() {
	$('.list-group-item.list-group-item-action').removeClass('active').removeAttr('aria-current');
	$('.list-group-item.list-group-item-action').attr('disabled', true).css('background-color', 'lightgray');
	$('.dashboard-content').hide();
}

// Helper function to add styling to sections on page load
// Uses saved cookie data to determine which sections to add styling to
function addStyling(latestSection) {
	no_previous_sections = sections.indexOf(latestSection);
	for (let i = 0; i < no_previous_sections; i++) {
		$('#' + sections[i]).removeAttr('disabled style');
	}
	$('#progress-bar').attr('aria-valuenow', (no_previous_sections) * 8.33333333333).css('width', (no_previous_sections) * 8.33333333333 + '%');
	$(latestSection).removeAttr('disabled style').addClass('active').attr('aria-current', 'true');
	$(latestSection + '-content').show();
}


// Helper function to increment progress bar
function incrementProgressBar() {
	let progress = parseInt($('#progress-bar').attr('aria-valuenow')) + 8.33333333333; // Increment progress bar value
	$('#progress-bar').attr('aria-valuenow', progress).css('width', progress + '%'); // Update progress bar
}


// Helper function to unlock next section when a section is completed
// Applies styling to the current/next section buttons and content sections
function unlockNextSection(currentSection) {
	let currentSectionButton = $('#' + currentSection);
	let currentSectionContent = $('#' + currentSection + '-content');

	let nextSectionButton = $('#' + currentSection).next();
	let nextSectionContent = $('#' + currentSection + '-content').next();

	if (currentSectionButton.children().val() === "0") {
		if (nextSectionButton.length !== 0) {
			currentSectionButton.removeClass('active').removeAttr('aria-current');
			nextSectionButton.removeAttr('disabled style');
			currentSectionButton.children().val(1);
			nextSectionButton.addClass('active').attr('aria-current', 'true');
			currentSectionContent.hide();
			nextSectionContent.show()
			incrementProgressBar();
		} else {
			$('#progress-bar').attr('aria-valuenow', 100).css('width', 100 + '%');
		}
	} else {
		// Change button styling
		currentSectionButton.removeClass('active').removeAttr('aria-current');
		nextSectionButton.addClass('active').attr('aria-current', 'true')
		// Change content section
		currentSectionContent.hide();
		nextSectionContent.show();
	}
}


// TODO: Add cookie functionality, remove redundant testing code (if (clickedButton.children().val() === "0"), etc.) 
// Handle dashboard list button clicks
$('.list-group-item').click(function() {
	let currentButton = $('.list-group-item.list-group-item-action.active');
	let clickedButton = $(this);
	let clickedButtonContent = clickedButton.attr('id') + '-content';

	$.ajax({
	  url: '/ajax_handler',
	  data: { "data": "TEST" },
	  type: 'POST',
	  success: function(response) {
		$('.dashboard-content').hide(); // Hide all content sections
		$('#' + clickedButtonContent).show(); // Show clicked content section
		currentButton.removeClass('active').removeAttr('aria-current'); // Remove active styling from previous button
		clickedButton.addClass('active').attr('aria-current', 'true') // Add styling to clicked button
	  },
	  error: function(error) {
		console.error(error);
	  }
	});
});


// Handle dashboard content submit button clicks
$('.dashboard-content-submit').click(function() {
	let submit_button = $(this);
	let currentSection = submit_button.attr('id').split('-')[0];
	$.ajax({
		url: '/ajax_handler',
		data: { "data": "TEST" },
		type: 'POST',
		success: function(response) {
			unlockNextSection(currentSection);
		},
		error: function(error) {
			console.error(error);
		}
	});
});
