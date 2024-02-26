<cfscript>
inputLocation = expandPath('../../../output/extract1.json');
jsonString = fileRead(inputLocation);
json = deserializeJSON(jsonString);

headers = json.elements.filter(e => {
	return e.Path.find('//Document/H1') gt 0;
});

writeOutput('<h1>List of Headers</h1>');

for(i=1;i<=headers.len();i++) {
	writeoutput('<h2>#headers[i].Text#</h2>');
}
</cfscript>
