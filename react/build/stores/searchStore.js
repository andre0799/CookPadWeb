var Reflux = require('reflux')
var request = require('superagent')

var appConfig = require('./../config')
var appActions = require('./../actions')


var searchStore = Reflux.createStore({

  init: function() {
    this.searchedRecipes = []
    this.indexedRecipes = {}
    this.currentSearchWord = ''
    this.listenTo(appActions.searchUpdate, this.handleSearchUpdate)
  },

  handleSearchUpdate: function() {
    // console.log('handleSearchUpdate dentro de recipeStore');
    var self = this
    var searchString = arguments[0]
    // console.dir(self.searchedRecipes)
    // console.log('['+this.currentSearchWord + '] [' + searchString+']')
    if(!self.searchedRecipes.length || this.currentSearchWord != searchString){
      // console.log('if');
    request
      .get(appConfig.LOCAL_API_HOST + '/api/search/' + searchString)
      .end(function(err, res) {
        self.currentSearchWord = searchString
        if(res.body && res.body.result) {
          self.searchedRecipes = res.body.result;
          for (var i = 0; i < res.body.result.length; i++) {
            self.indexedRecipes[res.body.result[i].id] = res.body.result[i];
          };
          self.trigger({
            searchString: searchString,
            searchResults: res.body.result
          })
        } else {
          self.trigger({
            searchString: searchString,
            searchResults: []
          })
        }
    })
    }else{
      // console.log('else');
      self.trigger({
            searchString: searchString,
            searchResults: self.searchedRecipes
          })
    }
  }

})

module.exports = searchStore