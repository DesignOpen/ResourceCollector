/**
* @jsx React.DOM
*/
'use strict';

var React = require('react');
window.React = React;

var ajax = require('component-ajax');

var FormComponent = require('./components/FormComponent');

document.addEventListener('DOMContentLoaded', function() {
  var result = ajax({
    url: "http://designopen.org/categories.js",
    // The name of the callback parameter, as specified by the YQL service
    jsonpCallback: "functionCall",
    // Tell jQuery we're expecting JSONP
    dataType: "jsonp",
    // Tell YQL what we want and that we want JSON
    data: {
        format: "json"
    },
    done: function(){
      console.log('done');
    },
    // Work with the response
    success: function( response ) {
      console.log('test');
      console.log( response ); // server response
    },
    error: function (err) {
      console.log(err);
    }
  });
  console.log(result);


  React.render(<FormComponent categories={["philosophy","sources","redesigns","inspiration","tutorials",]}/>, document.body);
}, false);
