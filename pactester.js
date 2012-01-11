
/* Copyright Stephen Vickers (vortex.is.at@gmail.com) 2012 */

var chld = require ("child_process");
var fs   = require ("fs");
var http = require ("http");
var net  = require ("net");
var os   = require ("os");
var url  = require ("url");
var util = require ("util");

var files   = {};

function onRequest (req, resp) {
	var req_url  = url.parse (req.url);
	var pathname = req_url.pathname == "/" ? "/index.html" : req_url.pathname;
	var filename = __dirname + "/static" + pathname;
	
	if (files[pathname]) {
		console.log ("serving embedded file " + pathname);
	
		var lines = files[pathname];
		var length = 0;
		
		for (var i = 0; i < lines.length; i++) {
			length += lines[i].length;
		}
		
		var buff = new Buffer (length / 2);
		var offset = 0;
		
		// Probably a better way to do this...
		for (var i = 0; i < lines.length; i++) {
			var line = lines[i];
			for (var j = 0; j < line.length; j += 2) {
				var ch = parseInt (line.charAt (j) + line.charAt (j + 1), 16);
				buff.writeUInt8 (ch, offset++);
			}
		}
	
		serveFileData (req, resp, buff.toString ("ascii"));
	} else if (files.length > 0) {
		console.log ("not found " + pathname);
		resp.writeHead (404);
		resp.end ("not found");
	} else {
		fs.stat (filename, function (err, stats) {
			if (err) {
				console.log ("not found " + pathname);
				resp.writeHead (404);
				resp.end ("not found");
			} else {
				console.log ("serving external file " + pathname);
			
				serveFile (req, resp, filename);
			}
		});
	}
}

function serveFile (req, resp, filename) {
	fs.readFile (filename, function (err, data) {
		if (err) {
			resp.writeHead (500);
			resp.end (err);
		} else {
			serveFileData (req, resp, data);
		}
	});
}

function serveFileData (req, resp, data) {
	resp.writeHead (200);
	resp.end (data);
}

var port = 8000;

if (process.argv.length > 2) {
	port = parseInt (process.argv[2]);
}

console.log ("starting server on http://127.0.0.1:" + port);

http.createServer (onRequest).listen (port);

if (os.platform () == "win32") {
	if (! process.env["PACTESTER_NO_BROWSER"]) {
		chld.spawn ("explorer.exe", ["http://127.0.0.1:" + port]);
	}
}
