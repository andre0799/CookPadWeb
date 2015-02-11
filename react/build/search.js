/** @jsx React.DOM */
'use strict'

var React = require('react/addons')
var Reflux = require('reflux')

var searchStore = require('./stores/searchStore')


var Search = React.createClass({displayName: "Search",

  mixins: [Reflux.ListenerMixin],

  getInitialState: function() {
    if(this.props.entryPath == '/') {
      var defaultClass = 'search-home'
    } else {
      var defaultClass = 'search-blurred'
    }
    return {
      searchString: '',
      defaultClass: defaultClass,
      loading: false
    }
  },

  componentDidMount: function() {
    this.listenTo(searchStore, this.stopLoading)
    this.refs.search.getDOMNode().focus()
  },

  handleSubmit: function(e) {
    e.preventDefault()
    if(this.state.searchString.trim().length) {
      this.setState({
        loading: true
      })
      this.props.onSearch(this.state.searchString)
    }
  },

  handleChange: function(e) {
    if(e.target.value.length) {
      this.setState({
        searchString: e.target.value,
        prevSearch: e.target.value
      })
    } else {
      this.setState({
        searchString: e.target.value,
      })
    }
  },

  handleClick: function(e) {
    if(this.state.defaultClass != 'search-home') {
      this.setState({
        defaultClass: 'search-focused',
        searchString: ''
      })
    }
  },

  handleBlur: function(e) {
    if(this.state.defaultClass != 'search-home') {
      if(this.state.searchString && !this.state.searchString.length) {
        this.setState({
          searchString: this.state.prevSearch,
          defaultClass: 'search-blurred'
        })
      } else {
        this.setState({
          defaultClass: 'search-blurred'
        })        
      }
    }
  },

  stopLoading: function() {
    this.setState({
      loading: false,
      defaultClass: 'search-blurred'
    })
  },

  render: function() {
    var searchContext
    if(this.state.loading) {
      searchContext = React.createElement("img", {className: "search-loading", src: "/images/cookpad.png"})
    } else {
      searchContext = React.createElement("button", {className: "search-submit", type: "submit"}, "search")
    }
    return (
      React.createElement("div", {className: this.state.defaultClass}, 
        React.createElement("form", {method: "get", action: "/", className: "search-form", onSubmit: this.handleSubmit}, 
          React.createElement("input", {placeholder: "Pulled Pork", type: "text", ref: "search", className: "search-input", name: "q", onChange: this.handleChange, onClick: this.handleClick, onBlur: this.handleBlur, value: this.state.searchString}), 
          searchContext
        )
      )
    )
  }

})


module.exports = Search