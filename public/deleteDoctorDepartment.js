// Code in this file used the code in the following git repository as a foundation:
// https://github.com/knightsamar/CS340-Sample-Web-App

function deleteDoctorDepartment(DocId, DepartId){
  $.ajax({
      url: '/doctor_department/DocId/' + DocId + '/DepartId/' + DepartId,
      type: 'DELETE',
      success: function(result){
          if(result.responseText != undefined){
            alert(result.responseText)
          }
          else {
            window.location.reload(true)
          } 
      }
  })
};
