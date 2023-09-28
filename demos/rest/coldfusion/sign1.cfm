<cfscript>
key = application.SIGN_KEY;

template = 'CBJCHBCAABAAd1SxIAAJZBp2Nd4ZdLEwMZEDG7i8X9wO';

endpoint = 'https://api.na4.adobesign.com/api/rest/v6/agreements';

body = {
	"fileInfos": [
		{
			"libraryDocumentId":template
		}
	],
	"name":"Waiver",
	"state":"IN_PROCESS",
	"signatureType":"ESIGN",
	"participantSetsInfo":[
		{
			"order":1,
			"role":"SIGNER", 
			"memberInfos": [
				{
					"email":"jedimaster@adobe.com"
				}
			]
		}
	]
};

cfhttp(url=endpoint, method='post', result='result') {
	cfhttpparam(type='header', name='Authorization', value='Bearer #key#'); 
	cfhttpparam(type='header', name='Content-Type', value='application/json'); 
	cfhttpparam(type='body', value=serializeJSON(body));
}

writedump(result.filecontent);
</cfscript>