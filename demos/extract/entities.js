/*
I use Diffbot to figure out the sentiment of a PDF

https://docs.diffbot.com/reference/introduction-to-natural-language-api
Entities
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

	let fields = 'entities';
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
	let entities = result[0].entities;
	console.log(`We discovered ${entities.length} entities:\n`);
	entities.forEach(e => {
		console.log(`
Name: ${e.name}
Link: ${e.allUris[0]}
Confidence: ${e.confidence}`);
		
		if(e.allTypes && e.allTypes[0]) console.log(`Type: ${e.allTypes[0].name}`);
		if(e.location) console.log(`Location: ${e.location.latitude}, ${e.location.longitude} `);
	});


})();

