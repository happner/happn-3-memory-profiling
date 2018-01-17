describe.only('connections', function () {

  var expect = require('expect.js');
  var happn = require('happn-3');
  var happn_client = happn.client;
  var async = require('async');

  var test_secret = 'test_secret';

  var DURATION = 5000;
  var CLIENT_COUNT = 5;
  var MESSAGE_INTERVAL = 1000;

  var startedClients = [];

  this.timeout(DURATION + 15000);

  before('should initialize the clients', function (callback) {

    async.timesSeries(CLIENT_COUNT, function(n, next){

      happn_client.create({
        config: {
          username: '_ADMIN',
          password: 'happn'
        }
      }, function (e, instance) {
        if (e) return next(e);
        startedClients.push(instance);
        next();
      });

    }, callback);
  });

  it('sets up events on all the clients', function (done) {

    async.eachSeries(startedClients, function(client, next){

      client.on('/a/test/message/*', function(){
        console.log('received a message');
      }, next);

    }, done);

  });

  it('emits an event every ' + MESSAGE_INTERVAL / 1000 + ' seconds for ' + DURATION / 1000 + ' seconds.', function (done) {

    var messageKey = 0;

    var interval = setInterval(function(){

      startedClients.forEach(function(client){
        messageKey++;
        client.set('/a/test/message/' + messageKey, {key:messageKey}, {noStore:true}, function(e){
          if (e) console.log('set error:::', e.toString());
        });
      });
    }, MESSAGE_INTERVAL);

    setTimeout(function(){
      clearInterval(interval);
      done();
    }, DURATION);

  });

  after(function (done) {

    if (startedClients.length == 0) return done();

    async.eachSeries(startedClients, function(client, next){

      client.disconnect(next);
    }, done);

  });
});
