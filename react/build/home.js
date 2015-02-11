/** @jsx React.DOM */
'use strict'

var React = require('react/addons')
var DocumentTitle = require('react-document-title')

var Home = React.createClass({displayName: "Home",

  render: function() {
    return (React.createElement(DocumentTitle, {title: "React Isomorphic Video Recipe Search"}))
  }

})

module.exports = Home