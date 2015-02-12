var Reflux = require('reflux')
var request = require('superagent')

var appConfig = require('./../config')
var appActions = require('./../actions')


var recipeStore = Reflux.createStore({

  init: function() {
    this.recipeData = {}
    this.listenTo(appActions.loadRecipe, this.loadRecipeData)
  },

  loadRecipeData: function() {
    console.log('loadRecipeData dentro de recipeStore');
    var recipeId = arguments[0]
    console.log('find this shit');
    console.dir(searchedRecipes);
    if(this.recipeData[recipeId]) {
      console.log('contains');
      this.trigger(this.recipeData[recipeId])
    } else {
      console.log('doesnt contain');
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