/**
* @jsx React.DOM
*/
'use strict';

var React = require('react');
window.React = React;

var ajax = require('component-ajax');

var FormComponent = require('./components/FormComponent');

document.addEventListener('DOMContentLoaded', function() {
  window.categories.unshift('');
  React.render(<FormComponent categories={window.categories}/>, document.body);
}, false);
