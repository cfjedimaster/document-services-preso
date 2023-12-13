require('dotenv').config();
const fs = require('fs');

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

async function getUploadData(mediaType, token, clientId) {

	let body = {
		'mediaType': mediaType
	};
	body = JSON.stringify(body);

	let req = await fetch(REST_API+'assets', {
		method:'post',
		headers: {
			'X-API-Key':clientId,
			'Authorization':`Bearer ${token}`,
			'Content-Type':'application/json'
		},
		body: body
	});

	let data = await req.json();
	return data;
}

async function uploadFile(url, filePath, mediaType) {

	let stream = fs.createReadStream(filePath);
	let stats = fs.statSync(filePath);
	let fileSizeInBytes = stats.size;

	let upload = await fetch(url, {
		method:'PUT', 
		redirect:'follow',
		headers: {
			'Content-Type':mediaType, 
			'Content-Length':fileSizeInBytes
		},
		duplex:'half',
		body:stream
	});

	if(upload.status === 200) return;
	else {
		throw('Bad result, handle later.');
	}

}

async function createPDFJob(asset, token, clientId) {
	// leaving off language for now...
	let body = {
		'assetID': asset.assetID
	}

	let resp = await fetch(REST_API + 'operation/createpdf', {
		method: 'POST', 
		headers: {
			'Authorization':`Bearer ${token}`, 
			'X-API-KEY':clientId,
			'Content-Type':'application/json'
		},
		body:JSON.stringify(body)
	});

	return resp.headers.get('location');

}

async function delay(x) {
	return new Promise(resolve => {
		setTimeout(() => resolve(), x);
	});
}

async function getJob(url, token, clientId) {

	let req = await fetch(url, {
		method:'GET',
		headers: {
			'X-API-Key':clientId,
			'Authorization':`Bearer ${token}`,
		}
	});

	return await req.json();

}

(async () => {

	let accessToken = await getAccessToken(CLIENT_ID, CLIENT_SECRET);

	let uploadedAsset = await getUploadData('application/vnd.openxmlformats-officedocument.wordprocessingml.document', accessToken, CLIENT_ID);
	
	await uploadFile(uploadedAsset.uploadUri, '../../../pdfs/cats.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');

	job = await createPDFJob(uploadedAsset, accessToken, CLIENT_ID);

	done = false;
	while(!done) {
		jobResult = await getJob(job, accessToken, CLIENT_ID);
		console.log('Latest job status', jobResult);

		if(jobResult.status == 'in progress') {
			await delay(2 * 1000);
		} else done = true;

	}

})();
