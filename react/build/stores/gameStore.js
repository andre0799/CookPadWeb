var Reflux = require('reflux')
var request = require('superagent')

var appConfig = require('./../config')
var appActions = require('./../actions')


var gameStore = Reflux.createStore({

  init: function() {
    this.gameData = {}
    this.listenTo(appActions.loadGame, this.loadGameData)
  },

  loadGameData: function() {
    console.log('search2');
    console.log(arguments[0]);
    console.dir(this.gameData);
    console.log('end');

    var gameId = arguments[0]
    if(this.gameData[gameId]) {
      this.trigger(this.gameData[gameId])
    } else {
      var self = this
      request
        .get(appConfig.LOCAL_API_HOST + '/api/game/' + gameId)
        .end(function(err, res) {
          console.log('le sapohaa!');
          console.dir(res.body);
          if(res.body && res.body.results) {
            console.log('my body result');
            console.log(res.body.results);
            self.gameData[gameId] = res.body.results
            self.trigger(res.body.results)
          }
      })
    }
  }

})

module.exports = gameStore