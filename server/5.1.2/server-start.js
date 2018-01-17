var happn = require('happn-3');

var heapdump = require('heapdump');

var service = happn.service;

function act(message, cb){

  if (message == 'GC'){
    if (global.gc) {
      global.gc();
      console.log('ON SERVER GC:::');
      return cb();
    } else {
      return cb(new Error('Garbage collection unavailable.  Pass --expose-gc '));
    }
  }

  if (message == 'HEAP-DMP-BASELINE')
    return heapdump.writeSnapshot(__dirname + '/heap-dumps/1.baseline.heapsnapshot', function (err, filename) {
      console.log('dump written to', filename);
      cb();
    });


  if (message.indexOf('HEAP-DMP-POST-TESTS') == 0){
    console.log('ON SERVER HEAP DMP:::');
    var heapDumpNumber = message.split('_')[1];
    return heapdump.writeSnapshot(__dirname + '/heap-dumps/2.post-tests.heapsnapshot.' + heapDumpNumber, function(err, filename) {
      console.log('dump written to', filename);
      cb();
    });
  }

  cb(new Error('unknown message type: ' + message))
}

process.on('message', function(data){

  act(data.message, function(e){

    console.log('REPLYING:::', {
      handle:data.handle,
      status: e || 'ok'
    });

    process.send({
      handle:data.handle,
      status: e || 'ok'
    });
  });
});

service.create({secure:true}, function (e) {
  if (e) return process.send('SERVICE START FAILED: ' + e.toString());
  process.send('STARTED');
});