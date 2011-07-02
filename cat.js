function catUsage(msg) {
    var err = System.err;

    err.print(msg + "\n");
    err.print("Usage:  cat.js [pdfs]\n");
    err.print("  Concatenate PDF on standard input with PDFS to standard output.\n");
    quit(1);
}


function checkCatArgs(args) {
    return { pdfs: args }
}

function cat(args) {
    var err = System.err;

    var params = checkCatArgs(args);

    var pdfs = new Array();
    var stdin = new BufferedInputStream(System["in"]);
    pdfs[0] = new PdfReader(stdin);
    for (var idx = 0; idx < params["pdfs"].length; idx += 1) {
	pdfs[idx + 1] = new PdfReader(params["pdfs"][idx]);
    }

    for (var idx in pdfs) {
	err.println(pdfs[idx]);
    }

    var stdout = new BufferedOutputStream(System.out);
    var document = new Document();

    var copy = new PdfCopy(document, stdout);

    document.open();
    err.println("Cat");
    for (var idx in pdfs) {
	var pdfIn = pdfs[idx];
	var pageCount = pdfIn.getNumberOfPages();
	err.print("[" + pageCount + ": ");
	for (var page = 1; page <= pageCount; page++) {
	    err.print("[" + page);

	    var pdfPage = copy.getImportedPage(pdfIn, page);
	    copy.addPage(pdfPage);
	    err.print("]");
	}
	err.print("]");
    }

    err.println();
    document.close();
}

registerModule({'command': 'cat',
		'name': 'Concatenate PDF',
		'usage': catUsage,
		'entry': cat});