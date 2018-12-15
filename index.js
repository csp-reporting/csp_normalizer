var express = require('express');
var http = require('http');
var app = express();
app.set('port', (process.env.PORT || 8000));
if (process.env.FWD_HOST !== undefined) {
  app.set('fwd_host', process.env.FWD_HOST);
} else {
  throw new Error('No forward HOST defined.')
}
if (process.env.FWD_PORT !== undefined) {
  app.set('fwd_port', process.env.FWD_PORT);
} else {
  throw new Error('No forward PORT defined.')
}
if (process.env.FWD_PATH !== undefined) {
  app.set('fwd_path', process.env.FWD_PATH);
} else {
  throw new Error('No forward PATH defined, leading slash neeeded.')
}

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});


/* your app config here */

app.post('/api/csp_reciever', function(req, res) {
  console.log(req.headers['content-length']);
  delete req.headers['content-length']
  console.log(req.headers['content-length']);
  var options = {
    // host to forward to
    host:   app.get("fwd_host"),
    // port to forward to
    port:   app.get("fwd_port"),
    // path to forward to
    path:   app.get("fwd_path"),
    // request method
    method: 'POST',
    // headers to send
    headers: req.headers
  };
  console.log(options.host + options.port + options.path);
  var callback = function(response) {
    var str = ''
    response.on('data', function (chunk) {
      str += chunk;
    });

    response.on('end', function () {
      console.log(str);
    });
  };
  var req = http.request(options, callback);
  //This is the data we are posting, it needs to be a string or a buffer
  req.write("hello world!");
  req.end();
  
  // var creq = http.request(options, function(cres) {
  //   // set encoding
  //   cres.setEncoding('utf8');
  //
  //   // wait for data
  //   cres.on('data', function(chunk){
  //     res.write(chunk);
  //   });
  //
  //   cres.on('close', function(){
  //     // closed, let's end client request as well
  //     res.writeHead(cres.statusCode);
  //     res.end();
  //   });
  //
  //   cres.on('end', function(){
  //     // finished, let's finish client request as well
  //     res.writeHead(cres.statusCode);
  //     res.end();
  //   });
  //
  // }).on('error', function(e) {
  //   // we got an error, return 500 error to client and log error
  //   console.log(e.message);
  //   res.writeHead(500);
  //   res.end();
  // });
  // creq.write("hello world!");
  // creq.end();

});
