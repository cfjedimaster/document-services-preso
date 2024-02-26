<!---
Ray, if you forget, you bind box to 0.0.0.0, but in the browser it will be localhost.
Also, you rock.
--->

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

token = getAccessToken(application.CLIENT_ID, application.CLIENT_SECRET);
writedump(token);
</cfscript>

