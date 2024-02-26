
<cfscript>
function getAccessToken(clientId, clientSecret) {
	var imsUrl = 'https://pdf-services-ue1.adobe.io/token';
	var result = '';

	cfhttp(url=imsUrl, method='post', result='result') {
		cfhttpparam(type='body', value='client_id=#arguments.clientId#&client_secret=#arguments.clientSecret#');
		cfhttpparam(type='header', name='Content-Type', value='application/x-www-form-urlencoded');
	};

	result = deserializeJSON(result.fileContent);

	// Also retrurns token_type and expires_in
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

function extractPDFJob(assetID, token, clientId) {
	var result = '';

	var body = {
		"assetID":arguments.assetID
	};

	cfhttp(url='https://pdf-services.adobe.io/operation/extractpdf', method='post', result='result') {
		cfhttpparam(type='header', name='Authorization', value='Bearer #arguments.token#'); 
		cfhttpparam(type='header', name='x-api-key', value=arguments.clientId); 
		cfhttpparam(type='header', name='Content-Type', value='application/json'); 
		cfhttpparam(type='body', value=serializeJSON(body));
	};

	if(result.responseheader.status_code == 201) return result.responseheader.location;
	else throw('Unknown error');

}

function getJob(jobUrl, token, clientID) {
	var result = '';

	cfhttp(url=jobUrl, method='get', result='result') {
		cfhttpparam(type='header', name='Authorization', value='Bearer #arguments.token#'); 
		cfhttpparam(type='header', name='x-api-key', value=arguments.clientId); 
	};

	result = deserializeJSON(result.fileContent);
	return result;
}	

function downloadAsset(assetOb, path) {
	var result = "";
	var dir = getDirectoryFromPath(arguments.path);
	var filename = getFileFromPath(arguments.path);
	cfhttp(method="get", url=arguments.assetOb.downloadUri, getasbinary=true, result="result", path=dir, file=filename);
}


token = getAccessToken(application.CLIENT_ID, application.CLIENT_SECRET);

sourceFile = expandPath('../../../pdfs/PDF32000_2008_NoTags_Part1.pdf');

asset = createAsset(sourceFile, token, application.CLIENT_ID);

job = extractPDFJob(asset, token, application.CLIENT_ID);
writeoutput('Job URL: #job#<p>');

done = false;
while(!done) {
	jobResult = getJob(job, token, application.CLIENT_ID);
	writedump(var=jobResult, label="Latest job status");
	cfflush();

	if(jobResult.status == 'in progress') {
		sleep(5 * 1000);
	} else done = true;

}

outputLocation = expandPath('../../../output/extract1.json');
downloadAsset(jobResult.content, outputLocation);
writeoutput('<p>All done.</p>');
</cfscript>

