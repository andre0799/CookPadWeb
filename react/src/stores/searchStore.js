var Reflux = require('reflux')
var request = require('superagent')

var appConfig = require('./../config')
var appActions = require('./../actions')


var searchStore = Reflux.createStore({

  init: function() {
    this.listenTo(appActions.searchUpdate, this.handleSearchUpdate)
  },

  handleSearchUpdate: function() {
    console.log('handleSearchUpdate dentro de recipeStore');
    var self = this
    var searchString = arguments[0]
    request
      .get(appConfig.LOCAL_API_HOST + '/api/search/' + searchString)
      .end(function(err, res) {
        if(res.body && res.body.result) {
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
  }

})

module.exports = searchStore