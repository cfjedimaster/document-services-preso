const PDFToolsSdk = require('@adobe/pdfservices-node-sdk');
const fs = require('fs');
const { report } = require('process');
const slugify = require('slugify');

const templateFile = './catTemplate_done.docx';
const outputDir = './reportOutput/';


// Initial setup, create credentials instance.
const credentials =  PDFToolsSdk.Credentials
    .serviceAccountCredentialsBuilder()
    .fromFile("pdftools-api-credentials.json")
    .build();

const data = require('./catdata.json');

(async () => {

	console.log('Getting data for cat reports.');
	console.log(`I've got ${data.length} reports to generate.`);
	
	let promises = [];
	data.forEach(c => {

		/*
		c represents the original data from the database, one specific record.
		Before we pass this to the Document Generation API, we can absolutely
		modify stuff. We have a value, nextAppointment, which is a date. We 
		will calculate the daysTill
		*/
		c.daysTill = daysTill(c.nextAppointment);
		
		let reportFilename = `${outputDir}${slugify(c.owner)}.pdf`;
		//remove output if exists
		if(fs.existsSync(reportFilename)) fs.unlinkSync(reportFilename);
		
		promises.push(
			generateFromTemplate(templateFile, c, reportFilename, './pdftools-api-credentials.json')
		)
		console.log(reportFilename);
	});

	await Promise.all(promises);
	console.log('I\'ve fininished generating your reports. Have a nice day.');

})();

async function generateFromTemplate(template, data, dest, creds) {
    return new Promise((resolve, reject) => {

        // Initial setup, create credentials instance.
        const credentials =  PDFToolsSdk.Credentials
        .serviceAccountCredentialsBuilder()
        .fromFile(creds)
        .build();

        // Create an ExecutionContext using credentials.
        const executionContext = PDFToolsSdk.ExecutionContext.create(credentials);

        const documentMerge = PDFToolsSdk.DocumentMerge,
        documentMergeOptions = documentMerge.options;

        //dest determines if Word or PDF
        let format;
        let destExt = dest.split('.').pop();
        if(destExt === 'docx') format = documentMergeOptions.OutputFormat.DOCX;
        else if(destExt === 'pdf') format = documentMergeOptions.OutputFormat.PDF;
        else throw('Invalid destination extension')

        // Create a new DocumentMerge options instance.
        options = new documentMergeOptions.DocumentMergeOptions(data, format);

        // Create a new operation instance using the options instance.
        const documentMergeOperation = documentMerge.Operation.createNew(options);

        // Set operation input document template from a source file.
        const input = PDFToolsSdk.FileRef.createFromLocalFile(template);
        documentMergeOperation.setInput(input);

        // Execute the operation and Save the result to the specified location.
        documentMergeOperation.execute(executionContext)
        .then(result => result.saveAsFile(dest))
        .then(() => resolve(true))
        .catch(err => {
            if(err instanceof PDFToolsSdk.Error.ServiceApiError
                || err instanceof PDFToolsSdk.Error.ServiceUsageError) {
                console.log('Exception encountered while executing operation', err);
                reject(err);
            } else {
                console.log('Exception encountered while executing operation', err);
                reject(err);
            }
        });

    });

}

//credit: https://stackoverflow.com/a/16485073/52160
function daysTill(d) {
	let date = new Date(d);
	let today = new Date();
	let oneDay = 24*60*60*1000;
	return Math.round(Math.abs((date.getTime() - today.getTime())/(oneDay)));
}