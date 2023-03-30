$(document).ready(function() {
    $("body").css("overflow-y", "hidden");
    
});


function submitAssessmentForm(gameID) {
    // If valid, extract inputs and submit form
    let form_data = {};
    form_data["gameID"] = gameID;
    form_data["feedback"] = {
        1: $("#assessment-content-feedback-question-1").find("textarea").val(),
        2: $("#assessment-content-feedback-question-2").find("textarea").val(),
        3: $("#assessment-content-feedback-question-3").find("textarea").val(),
        4: $("#assessment-content-feedback-question-4").find("textarea").val(),
        5: $("#assessment-content-feedback-question-5").find("textarea").val(),
        6: $("#assessment-content-feedback-question-6").find("textarea").val(),
    }
    form_data["post_test"] = {
        1: $("#assessment-content-post-test-question-1").find('input[type="radio"]:checked').val(),
        2: $("#assessment-content-post-test-question-2").find('input[type="radio"]:checked').val(),
        3: $("#assessment-content-post-test-question-3").find('input[type="radio"]:checked').val(),
        4: $("#assessment-content-post-test-question-4").find('input[type="radio"]:checked').val(),
        5: $("#assessment-content-post-test-question-5").find('input[type="radio"]:checked').val(),
        6: $("#assessment-content-post-test-question-6").find('input[type="radio"]:checked').val(),
        7: $("#assessment-content-post-test-question-7").find('input[type="radio"]:checked').val(),
        8: $("#assessment-content-post-test-question-8").find('input[type="radio"]:checked').val(),
        9: $("#assessment-content-post-test-question-9a").find('input[type="radio"]:checked').val(),
        10: $("#assessment-content-post-test-question-9b").find('input[type="radio"]:checked').val()
    }

    $.ajax({
        contentType: "application/json;charset=utf-8",
        type: "POST",
        url: `/form-submit`,
        data: JSON.stringify({form_data}),
        success: function(data) {
            $('#form-content-submit').removeClass("btn-primary").addClass("green text-light").text("Success! Redirecting...");
            setTimeout(function() {
                $(location).attr("href", "/");
			}, 3000);

        },
        error: function(data) {
            $('#form-content-submit').removeClass("btn-primary").addClass("dtn-danger").text("Error! Please try again.");
        }
    });
}
