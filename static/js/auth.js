function registrationAjax() {
    if ($('#password-signup').val() != $('#confirm-password-signup').val()) {
        $('#passwordErrorSpan').text('Passwords do not match!');
        $('#confirmErrorSpan').text('Passwords do not match!');
        return;
    }

    $.ajax({
        url: '/register-user',
        data: {
            "email": $("#email-signup").val(),
            "password": $("#password-signup").val()
        },
        type: 'POST',
        success: function(response) {
            $('#emailErrorSpan').empty();
            $('#passwordErrorSpan').empty();
            $('#confirmErrorSpan').empty();
            $('#signup-form')[0].reset();
            $('#confirmModal').modal('show');
        },
        error: function(error) {
            error = JSON.parse(JSON.stringify(error));
            
            if (error['status'] === 400) {
                if (error['responseJSON']['message'] === 'E-500-1') {
                    $('#emailErrorSpan').text('This user already exists!');
                } else if (error['responseJSON']['message'] === 'E-500-2') {
                    $('#emailErrorSpan').text('This user already exists, please confirm you account!');
                }
            }
        }
    })
}

function loginAjax() {
    $.ajax({
        url: '/login',
        data: {
            "email": $("#email-login").val(),
            "password": $("#password-login").val()
        },
        type: 'POST',
        success: function(response) {
            response = JSON.parse(JSON.stringify(response));
            window.location.href = response;
            $("#errorMessage").attr("hidden", "");
            $("#confirmError").attr("hidden", "");
            $("#credentialError").attr("hidden", "");
        },
        error: function(error) {
            if (error['status'] === 406) {
                $("#errorMessage").removeAttr("hidden");
                $("#confirmError").removeAttr("hidden");
                $("#credentialError").attr("hidden", "");
            } else {
                $("#errorMessage").removeAttr("hidden");
                $("#confirmError").attr("hidden", "");
                $("#credentialError").removeAttr("hidden");
            }
            $("#errorMessage").removeAttr("hidden");
        }
    })
}