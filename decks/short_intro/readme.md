Notes pre-reInvent:
Show Embed

show embed/test1.html, test2.html, test3.html

This isn't a deck per se, but an outline for a quick presentation I need to give, twice, that's meant to show a few services in a tight amount of time. 


1) PDF Services example

We're going to start off by showing an OCR operation. It's quick, it's simple, and it gives you an idea of how pretty much every other service works.

Discuss the OCR example, and show the PDF.

/demos/services/ocr_example.js


2) Doc Gen: First, what is it at a high level?


https://developer.adobe.com/document-services/apis/doc-generation/

Word document as a template, so imagine a regular Word doc with a few special looking tokens in it
API takes that, takes your data, generates out a dynamic PDF, or result Doc
Invoices, offer letters to a group of people at once, reports, etc

Unique in that we ship an authoring tool in Word via an Add-In

Show the Word add in, quick demo, 

Show template gallery:
https://developer.adobe.com/document-services/apis/doc-gen-api-template/

Show online demo:
https://documentservices.adobe.com/dc-docgen-playground/index.html

Note how code rarely changes, template + data will

Not going to show code as it's very similar - but mention how sometimes you manipulate data, mention 
template language isn't perfect.

3) Extract

https://developer.adobe.com/document-services/apis/pdf-extract/

Super intelligent parsing of a document - 
	grabs all the elements: text, tables, images
	grabs document tree knowledge (this is a header, this is a list, etc)
	auto OCRs
	does basic stuff like understanding N columns, tables over pages, etc.

Results ARE complex. 

You get a JSON file (I'm going to show in a minute), you get a folder of images, you get a folder of tables 
(tables can be XLSX, CSV, or image)

Show input doc, sample.pdf
Show demos/extract/output, show the json

Show visualizer: 

https://documentcloud.adobe.com/dc-visualizer-app/index.html

Many of our APIs work well with _other_ things, I think Extract is the best example. You probably won't ever use it by itself. 

Use cases:

	* extracting text for search engines, summarization, looking for problematic text
	* integrating with ML - does this PDF talk about Adobe the company vs Adobe the housing material
	* aggregating CSV data from science journals

* Auto Tag

screen readers need a document to be properly structured via document tags, helps define reading order, identify headings, paragraphs, othert things

auto tag api will use AI to scan a document and attempt to add tags

EAP: 
https://developer.adobe.com/document-services/docs/overview/pdf-accessibility-auto-tag-api/

"good first step" - we do not sell this as a 100% solution

result is a tagged document and optionally an XLSX reporting on the result

code, same as before

online demo: https://documentservices.adobe.com/dc-accessibility-playground/main.html

sample file is from pdfs folder, output is in demos

* Seal 

https://developer.adobe.com/document-services/docs/overview/pdf-electronic-seal-api/

A PDF Electronic Seal, powered by a digital signature, enables an organization to digitally sign the PDFs. E-signatures are legal, trusted, and enforceable around the world. The validation process performs two actions:

It authenticates the signing organization's identity via its digital certificate.
It verifies a document's integrity.

Code wise - it's a bit more complex. You need a TSP - Trust Service Provider

You auth with TSP first, you send that result back to Adobe, Adobe reverifies the auth, plus your own auth with Adobe, 
and then seals it

You have args for how the seal appears

SDK - Java only

