var Reflux = require('reflux')
var request = require('superagent')

var appConfig = require('./../config')
var appActions = require('./../actions')

var searchStore = require('./searchStore')


var recipeStore = Reflux.createStore({

  init: function() {
    this.recipeData = {}
    this.listenTo(appActions.loadRecipe, this.loadRecipeData)
  },

  loadRecipeData: function() {
    var recipeId = arguments[0]
    if(searchStore.indexedRecipes[recipeId]) {
      this.trigger(searchStore.indexedRecipes[recipeId])
    }else if(this.recipeData[recipeId]){
      this.trigger(this.recipeData[recipeId])
    } else {
      var self = this
      request
        .get(appConfig.LOCAL_API_HOST + '/api/recipe/' + recipeId)
        .end(function(err, res) {
          if(res.body && res.body.results) {
            self.recipeData[recipeId] = res.body.results
            self.trigger(res.body.results)
          }
      })
    }
  }

})

module.exports = recipeStore