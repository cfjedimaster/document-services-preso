<cfscript>
inputLocation = expandPath('../../../output/extract1.json');
jsonString = fileRead(inputLocation);
json = deserializeJSON(jsonString);

headers = json.elements.filter(e => {
	return e.Path == '//Document/H1';
});


for(i=1;i<=headers.len();i++) {
	writeoutput('<h1>#headers[i].Text#</h1>');
}
</cfscript>
