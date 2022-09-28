/*
I return all the Text values from a PDF.
*/

import fs from 'fs';
let data = JSON.parse(fs.readFileSync('./output/structuredData.json', 'utf8'));

let text = data.elements.reduce((text, el) => {
	if(el.Text) text += el.Text + '\n';
	return text;
},'');

console.log(text);