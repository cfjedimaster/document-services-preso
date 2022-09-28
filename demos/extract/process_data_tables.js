import fs from 'fs';
let data = JSON.parse(fs.readFileSync('./data_tables.json', 'utf8'));


let brightest = {
	month:0,
	name:'',
	luminosity:-1
}

let averages = {

}

data.forEach(month => {
	// month itself is an array of stars and lumin
	month.forEach((star,x) => {
		if(!averages[star.NAME]) averages[star.NAME] = { name: star.NAME, total:0 }
		let lumin = parseFloat(star.LUMINOSITY, 10);
		averages[star.NAME].total += lumin;

		if(lumin > brightest.luminosity) {
			brightest = {
				month: x+1, 
				name: star.NAME, 
				luminosity: lumin
			}
		}
	});
});

for(let star in averages) {
	averages[star].average = averages[star].total / 12;
}

console.log('AVERAGE LUMINOSITY:');
for(let star in averages) {
	console.log(`${averages[star].name.padEnd(15)}= ${averages[star].average}`);
}

console.log('\nBRIGHTEST REPORT');
console.log(`The brightest star was ${brightest.name} with a luminosity of ${brightest.luminosity} on month ${brightest.month}.`);