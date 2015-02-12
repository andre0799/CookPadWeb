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
var searchedRecipes = {}

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
  console.log('/api/search/:query dentro de app.js');
  var myQuery = req.params.query.replace(' '+'+');
  request.get(appConfig.REMOTE_API_HOST + '/api/recipe/search.json?q='+myQuery+'&filter=title%2Cingredients%2Cdirections&ordering=relevance&size=10&start=0&v=7').end(function(data) {
    res.set('Content-Type', 'application/json')
    for (var i = 0; i < data.body.result.length; i++) {
      searchedRecipes[data.body.result[i].id] = data.body.result[i];
    };
    res.send(data.body)
  })
})

app.get('/api/recipe/:recipe_id', function(req, res) {
  console.log('/api/recipe/:recipe_id dentro de app.js');
  if(req.params.recipe_id){
    res.set('Content-Type', 'application/json');
    if(searchedRecipes[req.params.recipe_id]){
      res.send({results: searchedRecipes[req.params.recipe_id]});
    }else{
      request.get(appConfig.REMOTE_API_HOST + '/api/recipe/get.json?recipeId='+req.params.recipe_id).end(function(data) {
        res.set('Content-Type', 'application/json');
       
        res.send({results:data.body.result});
      })
    }
   }else{
    //page not found
   } 
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
