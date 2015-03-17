var https = require('https');
var validator = require('validator');

var validate = {};

/*
* Validate takes all the fields of the form as an object and
* confirms if the field is valid. If any of the fields is incorrect
* an error JSON is passed back in the callback. If all the fields are correct, the callback is
* executed.
*
* @param submission {Object} form fields
* @param err [Function] function to be called when an err occurs
* @param cb [Function] function called when the form is valid
*/
validate.validateFields = function(submission, err, cb){
  var error = {
    success: false,
    error: null
  }

  //check if the title field is filled
  if (validator.isNull(submission.title)) {
    error.error = 'Please enter a title';
    return err(error);
  }

  //check if the URL is valid + protocol
  if (!validator.isURL(submission.url, {require_protocol: true})) {
    error.error = 'Please enter a valid URL.';
    return err(error);
  }

  //check if the twitter handle field is null
  if (validator.isNull(submission.twitter)) {
    error.error = 'Please enter your Twitter handle.';
    return err(error);
  }

  //check if the description is null
  if (validator.isNull(submission.description)) {
    error.error = 'Please enter a description.';
    return err(error);
  }

  //check if the category is empty
  if (validator.isNull(submission.category)) {
    error.error = 'Please choose a category.';
    return err(error);
  }

  //check if the twitter handle is valid
  https.get({method: 'HEAD', host: 'twitter.com', port: 443, path: '/' + submission.twitter}, function(r) {
    if(r.statusCode != 200) {
      error.error = 'Please enter a valid Twitter handle.';
      return err(error);
    }
    else{
      //if this conditional is hit, the form has passed all the field validators
      cb();
    }
  });
}

module.exports = validate;
