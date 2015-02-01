/*
* Method to make an AJAX call to the API.
*
*/
var ajax = require('component-ajax');

function submitForm(){
	ajax.ajax('/api/resource', {
		success: function(result){
      console.log('success!', result);
    },
    error: function(err){
      console.log('err:  ', err);
    }
  });
}
