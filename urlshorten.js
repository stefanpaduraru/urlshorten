/**
 * Short lib for shortening urls using express, redis and newbase 60
 */
var app, nb, rds, redClient, xprs;

rds = require('redis');
nb = require('./nb60');
xprs = require('express');

app = xprs.createServer();
redClient = rds.createClient();

app.configure(function () {
  app.use(xprs.bodyDecoder());
  return app.register('.haml', require('hamljs'));
});

// show home page for root get requests
app.get('/', function (request, result) {
  return result.render("index.haml");
});

// interpret short urls
app.get('/:short', function (request, result) {
  var key;
  key = request.params.short;
  return redClient.get(key, function (err, reply) {
    //redirect to homepage if key not found, redirect to url if key found
    return !(reply) ? result.redirect('/') : result.redirect(reply.toString());
  });
});

// generate key and add url-key pair to redis for post requests
app.post('/', function (request, result) {
  var url;
  url = !request.body.url.startsWith('http') ? "http://" + request.body.url : request.body.url;
  return redClient.get(url, function (error, reply) {
    return reply ? result.send(reply.toString()) : redClient.incr('ids', function (error, reply) {
      var key;
      // get new id and create hash
      key = nb.toSxg(reply);

      // store new association
      return redClient.set(key, url, function (error, reply) {
        return redClient.set(url, key, function (reply) {
          return result.send(key);
        });
      });
    });
  });
});

app.listen(3000);