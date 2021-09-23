const PDFServicesSdk = require('@adobe/pdfservices-node-sdk');
const fs = require('fs');

const OUTPUT_ZIP = './output.zip';
//we remove this, but in case of error, check
if(fs.existsSync(OUTPUT_ZIP)) fs.unlinkSync(OUTPUT_ZIP);

const credentials = PDFServicesSdk.Credentials
		.serviceAccountCredentialsBuilder()
		.fromFile('pdftools-api-credentials.json')
		.build();

// Create an ExecutionContext using credentials
const executionContext = PDFServicesSdk.ExecutionContext.create(credentials);

// Build extractPDF options
const options = new PDFServicesSdk.ExtractPDF.options.ExtractPdfOptions.Builder()
	   	.addElementsToExtract(PDFServicesSdk.ExtractPDF.options.ExtractElementType.TEXT, PDFServicesSdk.ExtractPDF.options.ExtractElementType.TABLES)
        .addElementsToExtractRenditions(
				PDFServicesSdk.ExtractPDF.options.ExtractRenditionsElementType.FIGURES,
				PDFServicesSdk.ExtractPDF.options.ExtractRenditionsElementType.TABLES
		)
		.addTableStructureFormat(PDFServicesSdk.ExtractPDF.options.TableStructureType.CSV)
      	.build()

// Create a new operation instance.
const extractPDFOperation = PDFServicesSdk.ExtractPDF.Operation.createNew(),
	input = PDFServicesSdk.FileRef.createFromLocalFile(
		'PlanetaryScienceDecadalSurvey.pdf',
		PDFServicesSdk.ExtractPDF.SupportedSourceFormat.pdf
	);

extractPDFOperation.setInput(input);
extractPDFOperation.setOptions(options);

// Execute the operation
extractPDFOperation.execute(executionContext)
	.then(result => result.saveAsFile(OUTPUT_ZIP))
	.catch(err => console.log(err));