// Code in this file used the code in the following git repository as a foundation:
// https://github.com/knightsamar/CS340-Sample-Web-App

function deleteDoctorBranch(BId, DocId){
  $.ajax({
      url: '/doctor_branch/BId/' + BId + '/DocId/' + DocId,
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
