const pdfServices = require('@adobe/pdfservices-node-sdk');
const fs = require('fs');

(async ()=> {

	const input = './pdf_that_needs_ocr.pdf';
	const output = './pdf_that_is_now_ocr.pdf';

	console.log(`OCR ${input} to ${output}`);
	//clean up existing output
	if(fs.existsSync(output)) fs.unlinkSync(output);
	await ocrPDF(input, output, './pdftools-api-credentials.json');
	
})();

async function ocrPDF(source, output, creds) {

    return new Promise((resolve, reject) => {

		const credentials =  pdfServices.Credentials
		.serviceAccountCredentialsBuilder()
		.fromFile(creds)
		.build();

		const executionContext = pdfServices.ExecutionContext.create(credentials),
				ocrOperation = pdfServices.OCR.Operation.createNew();

		// Set operation input from a source file
		const input = pdfServices.FileRef.createFromLocalFile(source);
		ocrOperation.setInput(input);

		// Execute the operation and Save the result to the specified location.
		ocrOperation.execute(executionContext)
		.then(result => result.saveAsFile(output))
		.then(() => resolve())
		.catch(err => {
			if(err instanceof pdfServices.Error.ServiceApiError
			|| err instanceof pdfServices.Error.ServiceUsageError) {
				reject(err);
			} else {
				reject(err);
			}
		});

	});
}