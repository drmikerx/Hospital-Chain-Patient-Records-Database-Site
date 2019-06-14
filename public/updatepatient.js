// Code in this file used the code in the following git repository as a foundation:
// https://github.com/knightsamar/CS340-Sample-Web-App

function updatePatient(id){
    $.ajax({
        url: '/patient/' + id,
        type: 'PUT',
        data: $('#update_patient').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};
