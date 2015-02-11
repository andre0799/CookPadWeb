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


var SearchResults = React.createClass({

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

      this.state.searchResults.forEach(function(recipe) {
        if(recipe.imageUrl) {
          var recipeURL = '/recipe/' + recipe.id + '/' + slug(recipe.title);
          results.push(            
            <div key={recipe.id} className="search-result clearfix">
              <div className="search-image">
                <Link href={recipeURL}><img src={recipe.imageUrl} alt={recipe.title} /></Link>
              </div>
              <h2 className="search-title"><Link href={recipeURL}>{recipe.title}</Link></h2>
            </div>)
        }
      })
    } else {
      results.push(<div key="no-results" className="no-results">No Recipes Matching '{this.state.searchString}'</div>)
    }
    var searchTitle = 'Search: ' + this.state.searchString
    return (
      <DocumentTitle title={searchTitle}>
        <div className="search-results clearfix">
          <ReactCSSTransitionGroup component="div" transitionName="css-transition">
            {results}
          </ReactCSSTransitionGroup>
        </div>
      </DocumentTitle>
    )
  }

})


module.exports = SearchResults