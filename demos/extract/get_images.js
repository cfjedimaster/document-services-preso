import PDFServicesSDK from '@adobe/pdfservices-node-sdk';
import fs from 'fs';

import { nanoid } from 'nanoid';
import AdmZip from 'adm-zip';

(async () => {


	const inputPDF = 'cats.pdf';
	const outputDir = './images';

	const credentials = PDFServicesSDK.Credentials
			.serviceAccountCredentialsBuilder()
			.fromFile('pdfservices-api-credentials.json')
			.build();

	// Create an ExecutionContext using credentials
	let config = PDFServicesSDK.ClientConfig.clientConfigBuilder()
	.withConnectTimeout(240000)
	.withReadTimeout(240000)
	.build();
	const executionContext = PDFServicesSDK.ExecutionContext.create(credentials,config);

	// Build extractPDF options
	const options = new PDFServicesSDK.ExtractPDF.options.ExtractPdfOptions.Builder()
			.addElementsToExtract(PDFServicesSDK.ExtractPDF.options.ExtractElementType.TEXT)
			.addElementsToExtractRenditions(
				PDFServicesSDK.ExtractPDF.options.ExtractRenditionsElementType.FIGURES
			)
			.build()

	// Create a new operation instance.
	const extractPDFOperation = PDFServicesSDK.ExtractPDF.Operation.createNew(),
		input = PDFServicesSDK.FileRef.createFromLocalFile(
			inputPDF,
			PDFServicesSDK.ExtractPDF.SupportedSourceFormat.pdf
		);

	extractPDFOperation.setInput(input);
	extractPDFOperation.setOptions(options);

	let output = './' + nanoid() + '.zip';

	// Execute the operation
	let apiresult = await extractPDFOperation.execute(executionContext);
	await apiresult.saveAsFile(output);


	let zip = new AdmZip(output);
	let entries = zip.getEntries();
	zip.getEntries().forEach(entry => {
		if(entry.entryName.indexOf('figures/') === 0) {
			zip.extractEntryTo(entry, outputDir, false, true);
		}
	});

	fs.unlinkSync(output);



})();

