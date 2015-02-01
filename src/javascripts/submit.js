/*
* Method to make an AJAX call to the API.
*
*/
var ajax = require('component-ajax');

window.submitForm = function(){
  //create the data object from the form
  var data = {
    'title': document.forms['submitResource']['title'].value,
    'URL': document.forms['submitResource']['URL'].value,
    'twitter': document.forms['submitResource']['twitter'].value, 
    'description': document.forms['submitResource']['description'].value, 
    'category': document.forms['submitResource']['category'].value
  }; 

  //make the AJAX call to the server
  ajax({
    type: 'POST', 
    url: '/api/resource',
    data: data,
    success: function(result){
      var url = JSON.parse(result).url;
      document.getElementById('banner').innerHTML = 'Thank you for your contribution. Your submission has been submitted for review. Follow up on your submission: <a href="' + url + '" target="_blank">' + url + '</a>';
      document.getElementById('resourceForm').innerHTML = '';
    }, 
    error: function(err){
      document.getElementById('banner').innerHTML = JSON.parse(err.response).error || 'Unable to process your entry, please try again later.'
    }
  });

  return false; 
}