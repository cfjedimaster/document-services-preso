<!---
Ray, if you forget, you bind box to 0.0.0.0, but in the browser it will be localhost.
Also, you rock.
--->

<cfscript>
function getAccessToken(clientId, clientSecret) {
	var imsUrl = 'https://ims-na1.adobelogin.com/ims/token/v2?client_id=#arguments.clientId#&client_secret=#arguments.clientSecret#&grant_type=client_credentials&scope=openid,AdobeID,read_organizations';
	var result = '';
	
	cfhttp(url=imsUrl, method='post', result='result') {
		cfhttpparam(type='body', value='');
	};

	result = deserializeJSON(result.fileContent);
	// Also retrurns token_type and expires_in
	return result.access_token;
}

token = getAccessToken(application.CLIENT_ID, application.CLIENT_SECRET);
writedump(token);
</cfscript>

