'use strict';

// this function ucwords taken from: http://blog.justin.kelly.org.au/ucwords-javascript/
// but modified a bit :-)
String.prototype.ucwords = function() {
	var str = this.toLowerCase();
	return str.replace(/(^([a-zA-Z\p{M}]))|([ -][a-zA-Z\p{M}])/g,
		function($1){
			return $1.toUpperCase();
		});
}

String.prototype.formatAlias = function() {
	var str = this.replace('_', ' ');
	return str.ucwords();
};



var Fs = require('fs'),
	data = [];

var pathLvl1 = 'files/',
	dLvl1 = Fs.readdirSync(pathLvl1),
	dLvl1Id = 1;

var pathLvl2 = pathLvl1,
	dLvl2 = [],
	dLvl2Id = 1;
	
var entry = null,
doc = {};
	
for (dLvl1Id in dLvl1) {
	entry = dLvl1[dLvl1Id];
	
	pathLvl2 = pathLvl1 + entry;
	if (Fs.statSync(pathLvl2).isDirectory()) {
		
		doc = {
			'title' : entry,
			'data'	: []
		};
		
		pathLvl2 += '/';
		dLvl2 = Fs.readdirSync(pathLvl2);
		for (dLvl2Id in dLvl2) {
			entry = dLvl2[dLvl2Id];
			
			if (entry.substr(-2) == 'md') {
				doc.data.push({
					'src'	: pathLvl2 + entry,
					'type'	: 'markdown',
					'name'	: entry.substring(0, entry.length - 3).formatAlias()
				});
			}
			
			if (entry.substr(-4) == 'html') {
				doc.data.push({
					'src'	: pathLvl2 + entry,
					'type'	: 'html',
					'name'	: entry.substring(0, entry.length - 5).formatAlias()
				});
			}
			
			if ('jpg,gif,png'.split(',').indexOf(entry.substr(-3)) != -1) {
				doc.data.push({
					'src'	: pathLvl2 + entry,
					'type'	: 'image',
					'name'	: entry.substring(0, entry.length - 4).formatAlias()
				});
			}
			
		}
		
		data.push(doc);
	}
}


var out = JSON.stringify(data, null, "\t");
	Fs.writeFileSync('files/repo.json', out);

console.log(out);
