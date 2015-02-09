/** @jsx React.DOM */
'use strict'

var React = require('react/addons')
var Reflux = require('reflux')
var slug = require('to-slug-case')
var reactAsync = require('react-async')
var Link = require('react-router-component').Link
var DocumentTitle = require('react-document-title')
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup

var appActions = require('./actions')
var searchStore = require('./stores/searchStore')


var SearchResults = React.createClass({displayName: "SearchResults",

  mixins: [reactAsync.Mixin, Reflux.ListenerMixin],

  getInitialStateAsync: function(cb) {    
    appActions.searchUpdate(this.props.query)
    searchStore.listen(function(data) {
      try {
        return cb(null, {
          searchString: data.searchString,
          searchResults: data.searchResults
        })
      } catch(err) { }
    })
  },  

  componentDidMount: function() {
    this.listenTo(searchStore, this.refreshSearch)
  },

  componentWillReceiveProps: function(nextProps) {
    if(typeof(nextProps.query) !== "undefined") {
      appActions.searchUpdate(nextProps.query)
    }
  },

  refreshSearch: function(data) {
    this.setState({
      searchString: data.searchString,
      searchResults: data.searchResults
    })
  },

  render: function() {
    var results = []
    if(this.state.searchResults && this.state.searchResults.length) {
      this.state.searchResults.forEach(function(game) {
        if(game.image) {
          var gameURL = '/game/' + game.id + '/' + slug(game.name)
          results.push(            
            React.createElement("div", {key: game.id, className: "search-result clearfix"}, 
              React.createElement("div", {className: "search-image"}, 
                React.createElement(Link, {href: gameURL}, React.createElement("img", {src: game.image.icon_url, alt: game.name}))
              ), 
              React.createElement("h2", {className: "search-title"}, React.createElement(Link, {href: gameURL}, game.name))
            ))
        }
      })
    } else {
      results.push(React.createElement("div", {key: "no-results", className: "no-results"}, "No Games Matching '", this.state.searchString, "'"))
    }
    var searchTitle = 'Search: ' + this.state.searchString
    return (
      React.createElement(DocumentTitle, {title: searchTitle}, 
        React.createElement("div", {className: "search-results clearfix"}, 
          React.createElement(ReactCSSTransitionGroup, {component: "div", transitionName: "css-transition"}, 
            results
          )
        )
      )
    )
  }

})


module.exports = SearchResults