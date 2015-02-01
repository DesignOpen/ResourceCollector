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
      displayBanner(result, true);
    }, 
    error: function(err){
      displayBanner(err);
    }
  });

  return false; 
}

/*
* Method for displaying a banner with the status of the 
* AJAX post. Automatically sets timeout for the banner after 5 seconds
*
* @param {Object} res - Response from the server
* @param {boolean} success - indicator variable if the response was successful
*/
var displayBanner = function(res, success){
  var msg = document.createElement('p');
  msg.id = 'bannerText';
  if(!success){ //its an error
    var node = document.createTextNode('Error: ' + JSON.parse(res.response).error);
  }
  else{ //success
    var response = JSON.parse(res); //have the Issue & the URL
    var node = document.createTextNode('Success! Created Issue #' + response.issue + ' URL: ' + response.url);
    emptyForm();
  }
  msg.appendChild(node);

  var element = document.getElementById('banner');
  element.appendChild(msg);
  // removeBanner();
}

/*
* Method for removing banner from the DOM.
*
*/
var removeBanner = function(){
  setTimeout(function(){
    var msg = document.getElementById('bannerText');
    msg.parentNode.removeChild(msg);
  }, 5000); 
}

/*
* Simple method to empty the form after success. 
*
*/
var emptyForm = function(){
  document.forms['submitResource']['title'].value = '';
  document.forms['submitResource']['URL'].value = '';
  document.forms['submitResource']['twitter'].value = '';
  document.forms['submitResource']['description'].value = '';
}