var currentButton = "#introduction";

$(function(){
	$(currentButton).click(function(){
		$.ajax({
			url: '/ajax_handler',
			data: {"data":"TEST"},
			type: 'POST',
			success: function(response){
                test($('#introduction').next());
                // $('.list-group-item-action .active').removeClass("active");
			},
			error: function(error){
				console.log(error);
			}
		});
	});
});

function test(nextButton) {
    $(nextButton).click(function(){
		$.ajax({
			url: '/ajax_handler',
			data: {"data":"TEST"},
			type: 'POST',
			success: function(response){
                test(nextButton.next());
                // $('.list-group-item-action .active').removeClass("active");
			},
			error: function(error){
				console.log(error);
			}
		});
	});
};