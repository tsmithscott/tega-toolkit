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
			} else { // if there is a next button
				currentButton.removeClass('active').removeAttr('aria-current');
				currentButton.children().val(1);
				nextButton.addClass('active').attr('aria-current', 'true').removeAttr('disabled style');
			}
		} else { // if the button has already been clicked
			currentButton.addClass('active').attr('aria-current', 'true')
			// only change the modal dont do anything with the buttons here.
		}
	  },
	  error: function(error) {
		console.error(error);
	  }
	});
  });
