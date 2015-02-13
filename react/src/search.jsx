/** @jsx React.DOM */
'use strict'

var React = require('react/addons')
var Reflux = require('reflux')

var searchStore = require('./stores/searchStore')


var Search = React.createClass({

  mixins: [Reflux.ListenerMixin],

  getInitialState: function() {
    console.log('getInitialState');
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
    console.log('componentDidMount');
    this.listenTo(searchStore, this.stopLoading)
    this.refs.search.getDOMNode().focus()
  },

  handleSubmit: function(e) {
    console.log('handleSubmit');
    e.preventDefault()
    if(this.state.searchString.trim().length) {
      this.setState({
        loading: true
      })
      this.props.onSearch(this.state.searchString)
    }
  },

  handleChange: function(e) {
    console.log('handleChange');
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
    console.log('handleClick');
    if(this.state.defaultClass != 'search-home') {
      this.setState({
        defaultClass: 'search-focused',
        searchString: ''
      })
    }
  },

  handleBlur: function(e) {
    console.log('handleBlur');
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
    console.log('stopLoading');
    this.setState({
      loading: false,
      defaultClass: 'search-blurred'
    })
  },

  render: function() {
    console.log('render');
    var searchContext
    if(this.state.loading) {
      searchContext = <img className="search-loading" src="/images/cookpad.png" />
    } else {
      searchContext = <button className="search-submit" type="submit">search</button>
    }
    return (
      <div className={this.state.defaultClass}>
        <form method="get" action="/" className="search-form" onSubmit={this.handleSubmit}>
          <input placeholder="Pulled Pork" type="text" ref="search" className="search-input" onChange={this.handleChange} onClick={this.handleClick} onBlur={this.handleBlur} value={this.state.searchString} />
          {searchContext}
        </form>
      </div>
    )
  }

})


module.exports = Search