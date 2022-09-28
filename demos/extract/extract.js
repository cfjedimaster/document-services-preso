import PDFServicesSDK from '@adobe/pdfservices-node-sdk';
import fs from 'fs';


const OUTPUT_ZIP = './output.zip';
if(fs.existsSync(OUTPUT_ZIP)) fs.unlinkSync(OUTPUT_ZIP);

const credentials = PDFServicesSDK.Credentials
		.serviceAccountCredentialsBuilder()
		.fromFile('pdfservices-api-credentials.json')
		.build();

// Create an ExecutionContext using credentials
const executionContext = PDFServicesSDK.ExecutionContext.create(credentials);

// Build extractPDF options
const options = new PDFServicesSDK.ExtractPDF.options.ExtractPdfOptions.Builder()
	   	.addElementsToExtract(PDFServicesSDK.ExtractPDF.options.ExtractElementType.TEXT, PDFServicesSDK.ExtractPDF.options.ExtractElementType.TABLES)
        .addElementsToExtractRenditions(
				PDFServicesSDK.ExtractPDF.options.ExtractRenditionsElementType.FIGURES,
				PDFServicesSDK.ExtractPDF.options.ExtractRenditionsElementType.TABLES
		)
		.addTableStructureFormat(PDFServicesSDK.ExtractPDF.options.TableStructureType.CSV)
      	.build()

// Create a new operation instance.
const extractPDFOperation = PDFServicesSDK.ExtractPDF.Operation.createNew(),
	input = PDFServicesSDK.FileRef.createFromLocalFile(
		'PlanetaryScienceDecadalSurvey.pdf',
		PDFServicesSDK.ExtractPDF.SupportedSourceFormat.pdf
	);

extractPDFOperation.setInput(input);
extractPDFOperation.setOptions(options);

// Execute the operation
extractPDFOperation.execute(executionContext)
	.then(result => result.saveAsFile(OUTPUT_ZIP))
	.catch(err => console.log(err));