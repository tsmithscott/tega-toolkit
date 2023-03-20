$(document).ready(function() {
    $("body").css("overflow-y", "hidden");
});

function submitForm(gameID) {
    form_data = {
        "gameID": String(gameID),
        "data": "Test Data"
    }
    console.log(form_data);
    console.log(gameID);
    // Fix this
    $.ajax({
        type: "POST",
        url: `/form-submit`,
        data: form_data,
        success: function(data) {
            console.log("Success");
        }
    });
}