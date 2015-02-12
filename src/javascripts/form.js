/**
* @jsx React.DOM
*/
'use strict';

var React = require('react');
window.React = React;

var FormComponent = require('./components/FormComponent');

document.addEventListener('DOMContentLoaded', function() {
  React.render(<FormComponent categories={["philosophy","sources","redesigns","inspiration","tutorials",]}/>, document.body);
}, false);
