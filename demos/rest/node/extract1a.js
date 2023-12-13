const fs = require('fs');

inputLocation = '../../../output/extract1.json';
jsonString = fs.readFileSync(inputLocation);
json = JSON.parse(jsonString);

console.log(`A total of ${json.elements.length} array elements.\n`);

text = json.elements.reduce((prev, e) => {
	return e.Text?prev + e.Text + '\n':prev;
},'');

console.log(text);
