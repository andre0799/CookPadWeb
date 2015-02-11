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
var recipeStore = require('./stores/recipeStore')


var Recipe = React.createClass({displayName: "Recipe",

  mixins: [reactAsync.Mixin, Reflux.ListenerMixin],

  getInitialStateAsync: function(cb) {
    appActions.loadRecipe(this.props.recipe_id)
    recipeStore.listen(function(data) {
      try {
        return cb(null, {
          recipe: data
        })
      } catch(err) { }
    })
  },

  componentDidMount: function() {
    this.listenTo(recipeStore, this.refreshRecipe)
    appActions.loadRecipe(this.props.recipe_id)
  },

  componentWillReceiveProps: function(nextProps) {
    if(typeof(nextProps.recipe_id) !== "undefined") {
      appActions.loadRecipe(nextProps.recipe_id)
    }
  },

  getURI: function(recipe_id, recipe_name) {
    return '/recipe/' + recipe_id + '/' + slug(recipe_name)
  },

  beginImageLoad: function() {
    this.refs.recipeImage.getDOMNode().className += ' hide'
    this.refs.recipeTitle.getDOMNode().className += ' hide'
    this.refs.recipeDeck.getDOMNode().className += ' hide'
  },

  confirmImageLoad: function() {
    this.refs.recipeImage.getDOMNode().className = 'recipe-image'
    this.refs.recipeTitle.getDOMNode().className = 'recipe-title'
    this.refs.recipeDeck.getDOMNode().className = ''
  },

  refreshRecipe: function(data) {
    if(typeof(window) !== 'undefined' && this.props.recipe_slug != slug(data.title)) {
      window.location = this.getURI(data.id, data.title)
    } 
    this.setState({
      recipe: data
    })
  },

  render: function() {
    if(this.state.recipe.ingredients && this.state.recipe.ingredients.length && this.state.recipe.ingredients[0]) {
      var relatedRecipes = []
      var self = this
      var id_inc = 0;
      this.state.recipe.ingredients[0].forEach(function(recipe) {
        var recipeKey = "related-" + id_inc
        id_inc++;
        relatedRecipes.push(React.createElement("li", {key: recipeKey}, recipe.measure.amount+' '+recipe.measure.unit, " ", recipe.name))
      })
      var related = (
        React.createElement("div", {key: "recipe-related", className: "recipe-related"}, 
          React.createElement("h3", null, "Ingredients"), 
          
            React.createElement(ReactCSSTransitionGroup, {component: "ul", transitionName: "css-transition"}, 
              relatedRecipes
            )
          
        ))
    } else {
      var related = null
    }
    return (
      React.createElement(DocumentTitle, {title: this.state.recipe.title}, 
        React.createElement("div", {key: "recipe-detail", className: "recipe-detail clearfix"}, 
          React.createElement("h1", {ref: "recipeTitle", key: "recipe-title", className: "recipe-title"}, this.state.recipe.title), 
          React.createElement("div", {key: "recipe-info", className: "recipe-info"}, 
            React.createElement("p", {ref: "recipeDeck", key: "recipe-deck"}, this.state.recipe.story), 
            related
          ), 
          React.createElement("div", {key: "recipe-image-container", className: "recipe-image-container"}, 
            React.createElement("img", {className: "recipe-image", ref: "recipeImage", onLoad: this.confirmImageLoad, key: "recipe-image", src: this.state.recipe.imageUrl, alt: this.state.recipe.title})
          )
        )
      )
    )
  }

})


module.exports = Recipe