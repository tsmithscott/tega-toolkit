$(document).ready(function() {
    $("body").css("overflow-y", "hidden");
});


function submitAssessmentForm(gameID) {
    // // // Form validation
    // // Textareas
    // let textareas = $("#assessment-content-feedback").find("textarea");
    // if (textareas.length == 0) {
    //     let no_empty = 0;
    //     textareas.each(function(i) {
    //         if ($(textareas[i]).val() === "") {
    //             no_empty++;
    //             $(textareas[i]).css("border", "1px solid red");
    //         } else {
    //             no_empty--
    //             $(textareas[i]).css("border", "");
    //         }
    //     });
    // }
    // // Radios
    // let question = $(this).attr('name');
    // if ($('input[type=radio]:checked').length !== 5) {
    //     if ($('input[type=radio][name="' + question + '"]:checked').length == 0) {
    //         console.log("No radio button selected for question " + question);
    //         $('input[type=radio][name="' + question + '"]').css('outline-style', 'auto');
    //         $('input[type=radio][name="' + question + '"]').css('outline-color', 'red');
    //     } else {
    //         $('input[type=radio][name="' + question + '"]').css('outline-style', 'none');
    //         $('input[type=radio][name="' + question + '"]').css('outline-color', 'black');
    //     }
    //     return;
    // }

    // // If all questions are answered, submit form
    // let form_data = {};
    // form_data["gameID"] = gameID;
    // form_data["data"]["feedback"] = {
    //     1: $("#assessment-content-feedback-question-1").find("textarea").val(),
    //     2: $("#assessment-content-feedback-question-2").find("textarea").val(),
    //     3: $("#assessment-content-feedback-question-3").find("textarea").val(),
    //     4: $("#assessment-content-feedback-question-4").find("textarea").val(),
    //     5: $("#assessment-content-feedback-question-5").find("textarea").val(),
    //     6: $("#assessment-content-feedback-question-6").find("textarea").val(),
    //     7: $("#assessment-content-feedback-question-7").find("textarea").val(),
    // }
    // form_data["data"]["post_test"] = {
    //     1: $("#assessment-content-post-test-question-1").find("input[type='radio']:checked").attr("id").val(),
    //     2: $("#assessment-content-post-test-question-2").find("input[type='radio']:checked").attr("id").val(),
    //     3: $("#assessment-content-post-test-question-3").find("input[type='radio']:checked").attr("id").val(),
    //     4: $("#assessment-content-post-test-question-4").find("input[type='radio']:checked").attr("id").val(),
    //     5: $("#assessment-content-post-test-question-5").find("input[type='radio']:checked").attr("id").val()
    }
    $.ajax({
        type: "POST",
        url: `/form-submit`,
        data: form_data,
        success: function(data) {
            console.log("Successfully submitted form data!")
        }

    });
}
