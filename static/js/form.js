// $("#post-playing input[type='radio']") {
//     if ($(radio).hasClass("selected")) {
//         $(radio.removeClass("selected"));
//     } else {
//         $(radio).addClass("selected");
//     }
// }


$(document).ready(function() {
    $("body").css("overflow-y", "hidden");

    $(".yes-no-desc").find("input[type='radio']").on("change", function() {
        if ($(this).hasClass("selected")) {
            if ($(this).val() === "Yes") {
                $(this).parent().parent().find('input[type="text"]').attr("required", "required").show();
            } else {
                $(this).parent().parent().find('input[type="text"]').removeAttr("required").val("").hide();

            }
        } else {
            if ($(this).val() === "Yes") {
                $(this).parent().parent().find('input[type="text"]').attr("required", "required").show();
            } else {
                $(this).parent().parent().find('input[type="text"]').removeAttr("required").val("").hide();
            }
        }
    });

    $(".check-others").find("input[type='checkbox']").on("change", function() {
        if ($(this).hasClass("selected")) {
            if ($(this).val() == "Others") {
                $(this).parent().parent().find('input[type="text"]').removeAttr("required").hide();
            }
            $(this).removeClass("selected");
        } else {
            if ($(this).val() == "Others") {
                $(this).parent().parent().find('input[type="text"]').attr("required", "required").show();
            }
            $(this).addClass("selected");
        }
    });
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

    q3_checked_boxes = $("#post-playing-q-3").find(".selected");
    q3_text = $("#post-playing-q-3").find('input[type="text"]').val();
    q3_values = [];
    $(q3_checked_boxes).each(function() {
        q3_values.push($(this).val());
    });
    if (q3_text != "") {
        q3_values.push(q3_text);
    }
    
    q4_values = [];
    q4_values.push($("#post-playing-q-4").find('input[type="radio"]:checked').first().val());
    q4_text = $("#post-playing-q-4").find('input[type="text"]').val();
    if (q4_text != "") {
        q4_values.push(q4_text);
    }
    q5_values = [];
    q5_values.push($("#post-playing-q-5").find('input[type="radio"]:checked').first().val());
    q5_text = $("#post-playing-q-5").find('input[type="text"]').val();
    if (q5_text != "") {
        q5_values.push(q5_text);
    }
    q6_values = [];
    q6_values.push($("#post-playing-q-6").find('input[type="radio"]:checked').first().val());
    q6_text = $("#post-playing-q-6").find('input[type="text"]').val();
    if (q6_text != "") {
        q6_values.push(q6_text);
    }

    form_data["post_playing"] = {
        1: $("#post-playing-q-1").find('input[type="radio"]:checked').val(),
        2: $("#post-playing-q-2").find('input[type="radio"]:checked').val(),
        3: q3_values,
        4: q4_values,
        5: q5_values,
        6: q6_values,
    }
    console.log(form_data);
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
