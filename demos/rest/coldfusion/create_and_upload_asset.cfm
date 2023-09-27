
<cfscript>
function getAccessToken(clientId, clientSecret) {
	var imsUrl = 'https://ims-na1.adobelogin.com/ims/token/v2?client_id=#arguments.clientId#&client_secret=#arguments.clientSecret#&grant_type=client_credentials&scope=openid,AdobeID,read_organizations';
	var result = '';
	
	cfhttp(url=imsUrl, method='post', result='result') {
		cfhttpparam(type='body', value='');
	};

	result = deserializeJSON(result.fileContent);
	return result.access_token;
}

/*
This method wraps -2- parts: 
	Make the asset
	Upload to it.
	Return the ID, all we need.
*/
function createAsset(path, token, clientId) {
	var result = '';
	var mimeType = fileGetMimeType(arguments.path);

	var body = {
		'mediaType': mimeType
	};
	body = serializeJSON(body);

	cfhttp(url='https://pdf-services.adobe.io/assets', method='post', result='result') {
		cfhttpparam(type='header', name='Authorization', value='Bearer #arguments.token#'); 
		cfhttpparam(type='header', name='x-api-key', value=arguments.clientId); 
		cfhttpparam(type='header', name='Content-Type', value='application/json'); 
		cfhttpparam(type='body', value=body);
	}
	var assetInfo = deserializeJSON(result.fileContent);

	cfhttp(url=assetInfo.uploadUri, method='put', result='result') {
		cfhttpparam(type='body', value=fileReadBinary(arguments.path));
		cfhttpparam(type='header', name='Content-Type', value=mimeType); 
	}

	if(result.responseheader.status_code == 200) return assetInfo.assetID;
	else throw('Unknown error');
}

token = getAccessToken(application.CLIENT_ID, application.CLIENT_SECRET);

sourceFile = expandPath('../../../pdfs/cats.docx');

asset = createAsset(sourceFile, token, application.CLIENT_ID);
writedump(asset);

</cfscript>

