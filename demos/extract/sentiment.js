/*
I use Diffbot to figure out the sentiment of a PDF

https://docs.diffbot.com/reference/introduction-to-natural-language-api
Sentiment, -1 very negative, 1 very positive
*/

import fs from 'fs';
let data = JSON.parse(fs.readFileSync('./output/structuredData.json', 'utf8'));

import * as dotenv from 'dotenv';
dotenv.config();

import fetch from 'node-fetch';

(async () => {

	let text = data.elements.reduce((text, el) => {
		if(el.Text) text += el.Text + '\n';
		return text;
	},'');

	let fields = 'sentiment';
	let token = process.env.DIFFBOT_KEY;
	let url = `https://nl.diffbot.com/v1/?fields=${fields}&token=${token}`;
	
	let body = [{
		content:text, 
		lang:'en',
		format:'plain text'
	}];

	let req = await fetch(url, { 
		method:'POST',
		body:JSON.stringify(body),
		headers: { 'Content-Type':'application/json' }
	});

	let result = await req.json();
	console.log('Sentiment rating (-1 is bad, 1 is good):');
	console.log(result[0].sentiment);


})();

