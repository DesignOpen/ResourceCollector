/*
* Method to make an AJAX call to the API. 
*
*/
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