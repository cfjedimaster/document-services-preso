require('dotenv').config();

const REST_API = "https://pdf-services.adobe.io/";
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

async function getAccessToken(id, secret) {

	const params = new URLSearchParams();
	params.append('client_id', id);
	params.append('client_secret', secret);

	let resp = await fetch('https://pdf-services-ue1.adobe.io/token', { 
		method: 'POST', 
		headers: {
			'Content-Type':'application/x-www-form-urlencoded'
		},
		body:params 
	});
	let data = await resp.json();
	return data.access_token;
}

(async () => {

	let accessToken = await getAccessToken(CLIENT_ID, CLIENT_SECRET);
	console.log(accessToken);

})();
