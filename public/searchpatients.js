// Code in this file used the code in the following git repository as a foundation:
// https://github.com/knightsamar/CS340-Sample-Web-App

function searchPatientsByLastName() {
    //get the last name entered by user in the search bar
    var last_name_to_search  = document.getElementById('last_name_to_search').value
    //construct the URL and redirect to it
    if (last_name_to_search === ""){
        window.location = '/patient'
    }
    
    else{
        window.location = '/patient/search/' + encodeURI(last_name_to_search)
    }
}
