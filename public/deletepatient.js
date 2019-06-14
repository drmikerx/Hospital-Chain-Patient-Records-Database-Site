// Code in this file used the code in the following git repository as a foundation:
// https://github.com/knightsamar/CS340-Sample-Web-App

function deletePatient(Id){
    $.ajax({
        url: '/patient/' + Id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
