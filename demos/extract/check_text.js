/*
I look for acronyms
*/

import fs from 'fs';
let data = JSON.parse(fs.readFileSync('./output/structuredData.json', 'utf8'));

let text = data.elements.reduce((text, el) => {
	if(el.Text && 
		(el.Path.indexOf('H1') === -1) &&
		(el.Path.indexOf('H2') === -1) &&
		(el.Path.indexOf('H3') === -1) 
	) text += el.Text + '\n';
	return text;
},'');

let words = text.split(/\s+/);
let possibleAcro = words.reduce((matches, word) => {
	if(word.match(/^[A-Z]{3,}$/) && matches.indexOf(word) === -1) {
		matches.push(word);
	}
	return matches;
}, []);

console.log(possibleAcro);