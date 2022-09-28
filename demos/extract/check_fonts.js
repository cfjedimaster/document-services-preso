/*
I return a list of unique fonts used in a PDF. This can be used for compliance purposes, design updates, etc.
*/

import fs from 'fs';
let data = JSON.parse(fs.readFileSync('./output/structuredData.json', 'utf8'));

let fonts = new Set();

data.elements.forEach(e => {
	if(e.Font) fonts.add(e.Font.name);
});

console.log('List of fonts from input PDF:\n');
for(let font of fonts) console.log(font);
