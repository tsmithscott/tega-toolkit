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
            
            response = JSON.parse(JSON.stringify(response));
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
    return;
}