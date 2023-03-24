$(document).ready(function() {
    $("body").css("overflow-y", "hidden");
});

function submitAssessmentForm(gameID) {
    form_data = {
        "gameID": String(gameID),
        "data": "Test Data"
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