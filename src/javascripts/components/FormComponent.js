/**
* @jsx React.DOM
*/

var React = require('react');
var ajax = require('component-ajax');

var FormComponent = React.createClass({
  focusHandler: function (e) {
    console.log('focus');
  },
  submitForms: function (e) {
    e.preventDefault();
    var data = {
      'title': this.refs.title.getDOMNode().value,
      'URL': this.refs.url.getDOMNode().value,
      'twitter': this.refs.twitter.getDOMNode().value,
      'description': this.refs.description.getDOMNode().value,
      'category': this.refs.category.getDOMNode().value
    };
    this.refs.submit.getDOMNode().disabled = true;
    ajax({
      type: 'POST',
      url: '/api/resource',
      data: data,
      success: this.formSuccess,
      error: this.formError
    });
  },
  formSuccess: function (result) {
    var url = JSON.parse(result).url;
    this.setState({bannerText: 'Thank you for your contribution. Your submission has been submitted for review. Follow up on your submission: <a href="' + url + '" target="_blank">' + url + '</a>'});
    this.setState({submitted: true});
  },
  formError: function (err) {
    this.setState({bannerText: JSON.parse(err.response).error || 'Unable to process your entry, please try again later.'});
    this.refs.submit.getDOMNode().disabled = false;
  },
  getInitialState: function () {
    return {
      bannerText:'',
      submitted:false
    };
  },
  render: function () {
    var form = <form id="submitResource"/>
    if (!this.state.submitted) {
      form = (
        <form id="submitResource" onSubmit={this.submitForms}>
         <div className="form-item">
           <label htmlFor="titleInput">Title</label>
           <input id="titleInput" type="text" name="title" required onFocus={this.focusHandler} ref="title" value={this.props.query.title}/>
         </div>
         <div className="form-item">
           <label htmlFor="urlInput">URL</label>
           <input id="urlInput" type="url" name="URL" required ref="url" value={this.props.query.url}/>
         </div>
         <div className="form-item">
           <label htmlFor="twitterInput">Twitter</label>
           <input id="twitterInput" type="text" name="twitter" required ref="twitter" value={this.props.query.twitter}/>
         </div>
         <div className="form-item">
           <label htmlFor="descriptionInput">Description</label>
           <textarea id="descriptionInput" name="description" required ref="description"></textarea>
         </div>
         <div className="form-item">
           <label htmlFor="categoryInput">Category</label>
           <select id="categoryInput" name="category" ref="category">
             {this.props.categories.map(function(category) {
               return <option value={category} key={category}>{category}</option>
             })}
           </select>
         </div>
         <div className="form-item">
           <input type="submit" value="Submit Resource" id="resourceSubmit" ref="submit"/>
         </div>
       </form>
     );
    }
    return (
      <div className="container">
        <h1>Submit a Design Resource</h1>
        <div><p id="banner" dangerouslySetInnerHTML={{__html:this.state.bannerText}}/></div>
        <div id="resourceForm">
          {form}
        </div>
      </div>
    );
  }

});

module.exports = FormComponent;
