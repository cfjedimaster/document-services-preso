const fs = require('fs');

inputLocation = '../../../output/extract1.json';
jsonString = fs.readFileSync(inputLocation);
json = JSON.parse(jsonString);

headers = json.elements.filter(e => {
	return e.Path == '//Document/H1';
});


for(i=0;i<headers.length;i++) {
	console.log(headers[i].Text);
}