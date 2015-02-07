/**
* @jsx React.DOM
*/

var React = require('react')

var form = React.createClass({
  render: function () {
    return (
      <div className="container">
        <h1>Submit a Design Resource</h1>
        <div><p id="banner"></p></div>
        <div id="resourceForm">
          <form id="submitResource" onsubmit="return submitForm()">
            <div className="form-item">
              <label htmlFor="titleInput">Title</label>
              <input id="titleInput" type="text" name="title" value="<%= title %>" required>
            </div>
            <div className="form-item">
              <label htmlFor="urlInput">URL</label>
              <input id="urlInput" type="url" name="URL" value="<%= url %>" required>
            </div>
            <div className="form-item">
              <label htmlFor="twitterInput">Twitter</label>
              <input id="twitterInput" type="text" name="twitter" value="<%= twitter %>" required>
            </div>
            <div className="form-item">
              <label htmlFor="descriptionInput">Description</label>
              <textarea id="descriptionInput" name="description" required></textarea>
            </div>
            <div className="form-item">
              <label htmlFor="categoryInput">Category</label>
              <select id="categoryInput" name="category">
                {this.props.categories.map(function(category) {
                  return <option>{category}</option>
                })}
              </select>
            </div>
            <div className="form-item">
              <input type="submit" value="Submit Resource" id="resourceSubmit">
            </div>
          </form>
        </div>
      </div>
    );
  }

});
