'use strict'

require('node-jsx').install({extension: '.jsx'})
var reactAsync = require('react-async')

var reactApp = require('./react/src/app.jsx')
var appConfig = require('./react/src/config')

var request = require('superagent')
var express = require('express')
var path = require('path')
var favicon = require('serve-favicon')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var app = express()


app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});


 
// /api/recipe/search.json?q=pork+chops&filter=title%2Cingredients%2Cdirections&ordering=relevance&size=10&start=0&v=7

app.get('/api/search/:query', function(req, res) {
  console.log('Busca!!!');
  request.get(appConfig.REMOTE_API_HOST + '/api/recipe/search.json?q=pork+chops&filter=title%2Cingredients%2Cdirections&ordering=relevance&size=10&start=0&v=7').end(function(data) {
    res.set('Content-Type', 'application/json')
    console.log(data.body);
    res.send(data.body)
  })
})

app.get('/api/game/:game_id', function(req, res) {
  console.log('the id: '+req.params.game_id);

    res.set('Content-Type', 'application/json')
    res.send({results:{ type: 'recipe',
       id: '4836445483171840',
       title: 'Grilled Apricot Pork Chops',
       story: '',
       markup: [Object],
       ingredients: [Object],
       ingredientGroupNames: [Object],
       annotatedDirections: [Object],
       path: [],
       categoryIds: [Object],
       rating: 4.894737,
       recipeId: 4836445483171840,
       imageUrl: 'http://a3.picmix.net/5630479441068032',
       created: '2013-12-09T02:12:44Z',
       bookmarkCount: 1248,
       commentCount: 19,
       reviews: [Object],
       forumThreadCount: 5,
       threads: [Object],
       markupCount: 9,
       snapshotCount: 10,
       snapshots: [Object],
       previewUrl: '/grilled-apricot-pork-chops.html',
       tags: [Object],
       hasNutrition: false,
       approved: true,
       username: 'bbqtvtv.com',
       userInfo: [Object] }}); 

  // request.get(appConfig.REMOTE_API_HOST + '/api/game/' + req.params.game_id + '/?api_key=' + appConfig.GIANT_BOMB_API_KEY + '&format=json&field_list=name,image,id,similar_games,deck').end(function(data) {
  //   res.set('Content-Type', 'application/json')
  //   res.send(data.body)    
  // })
})


// render react routes on server
app.use(function(req, res, next) {
  if(req.query.q) {
    res.redirect('/search/' + req.query.q)
  }  
  try {
    reactAsync.renderToStringAsync(reactApp.routes({path: req.path}), function(err, markup) {
      if(err) {
        return next()
      }
      return res.send('<!DOCTYPE html>' + markup.replace('%react-iso-vgs%', reactApp.title.rewind()))
    })
  } catch(err) {
    return next()
  }
})


// handle errors
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send('error', {
    message: err.message,
    error: {}
  })
})

module.exports = app
