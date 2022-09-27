let data = require('./output/structuredData.json');

let text = data.elements.reduce((text, el) => {
	if(el.Text) text += el.Text + '\n';
	return text;
},'');

console.log(text);