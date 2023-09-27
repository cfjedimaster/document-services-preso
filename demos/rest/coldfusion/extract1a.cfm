<cfscript>
inputLocation = expandPath('../../../output/extract1.json');
jsonString = fileRead(inputLocation);
json = deserializeJSON(jsonString);

writeoutput('A total of #json.elements.len()# array elements.');

// Happy happy, joy joy
text = json.elements.reduce((prev, e) => {
	return e.keyExists('Text')?prev & e.Text & chr(10):prev;
},'');

writeoutput('<hr/><pre>#text#</pre>');
</cfscript>
