/*
I return all the Text values from a PDF.
*/

import fs from 'fs';
let data = JSON.parse(fs.readFileSync('./output/structuredData.json', 'utf8'));

import fetch, { FormData } from 'node-fetch';

import * as dotenv from 'dotenv';
dotenv.config();

(async () => {

	let text = data.elements.reduce((text, el) => {
		if(el.Text && el.Path.indexOf('/P')) text += el.Text + '\n';
		return text;
	},'');

	let fd = new FormData();
	fd.set('key', process.env.MEANINGCLOUD_KEY);
	fd.set('txt', text);
	fd.set('sentences', 2);

	let req = await fetch('https://api.meaningcloud.com/summarization-1.0', {
		method:'POST', 
		body: fd
	});
	let result = await req.json();
	console.log(result.summary);

})();