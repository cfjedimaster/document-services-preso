import PDFServicesSDK from '@adobe/pdfservices-node-sdk';
import fs from 'fs';

import { nanoid } from 'nanoid';
import StreamZip from 'node-stream-zip';
import csvtojson from 'csvtojson';

(async () => {


	const inputPDF = '1981.pdf';
	const outputJSON = 'data_tables.json';

	const credentials = PDFServicesSDK.Credentials
			.serviceAccountCredentialsBuilder()
			.fromFile('pdfservices-api-credentials.json')
			.build();

	// Create an ExecutionContext using credentials
	const executionContext = PDFServicesSDK.ExecutionContext.create(credentials);

	// Build extractPDF options
	const options = new PDFServicesSDK.ExtractPDF.options.ExtractPdfOptions.Builder()
			.addElementsToExtract(PDFServicesSDK.ExtractPDF.options.ExtractElementType.TEXT, PDFServicesSDK.ExtractPDF.options.ExtractElementType.TABLES)
			.addTableStructureFormat(PDFServicesSDK.ExtractPDF.options.TableStructureType.CSV)
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

	// ok, now we need to get tables/*.csv from the zip
	const zip = new StreamZip.async({ file: output });
	const entries = await zip.entries();
	let csvs = [];
	for (const entry of Object.values(entries)) {
		if(entry.name.endsWith('.csv')) csvs.push(entry.name);
	}

	let result = [];

	for(let i=0; i<csvs.length;i++) {
		const data = await zip.entryData(csvs[i]);
		let csvContent = data.toString();
		let csvData = await csvtojson().fromString(csvContent);
		result.push(csvData);
	}

	// cleanup
	zip.close();
	fs.unlinkSync(output);

	fs.writeFileSync(outputJSON, JSON.stringify(result), 'utf8');
	console.log('Extracted data from PDF');


})();

