var sqlite = require('spatialite');
var sys = require('sys');
var util = require('util'),
    twitter = require('twitter');
var settings = require('./configuration');

var twit = new twitter(settings.twitter);
var db = new sqlite.Database('new.db');

var qry = 'SELECT name, ((X(Geometry)-X(loc))*(X(Geometry)-X(loc))) + ((Y(Geometry)-Y(loc))*(Y(Geometry)-Y(loc))) as distance FROM test, (SELECT MakePoint(%LAT%,%LONG%) as loc) ORDER BY distance LIMIT 1'; //CBA. Accepting patches.
var state = {last_id: 0};

twit.getMentions({count: 2}, function (json) {
	var foo = json[0];
	if (foo.id > state.last_id) {
		cords = foo.text.substr(13).split(' ');
		newqry = qry.replace('%LAT%', cords[0]).replace('%LONG%', cords[1]);
		console.log(newqry);
		db.spatialite(function(err) {
			db.each(newqry, function(err, row) { console.log(row); });
		});

		state.last_id = foo.id;
	}
});
