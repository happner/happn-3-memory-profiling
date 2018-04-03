describe('logins', function () {

  var expect = require('expect.js');
  var happn = require('happn-3');
  var happn_client = happn.client;
  var async = require('async');

  var test_secret = 'test_secret';

  var DURATION = 5000;
  var CLIENT_COUNT = 5;

  var payload = '';

  var payloadLength = 100000;

  for (var i = 0; i < payloadLength; i++) payload += 'A';

  this.timeout(DURATION + 15000);

  it('should do a bunch of failed logins', function (callback) {

    async.timesSeries(CLIENT_COUNT, function(n, next){

      happn_client.create({
        config: {
          username: 'BAD_USER',
          password: 'bad password'
        }
      }, function () {
        next();
      });

    }, callback);
  });
});
