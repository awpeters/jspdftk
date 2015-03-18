function catUsage(msg) {
    var err = System.err;

    err.print(msg + "\n");
    err.print("Usage:  cat [pdfs]\n");
    err.print("  Concatenate in-file with PDFS.\n");
    quit(1);
}


function checkCatArgs(params) {
    params['pdfs'] = params['opts'];
    params['pdfs'].push(params['infile']);
    return params;
}

function cat(params) {
    var err = params['err'];

    var pdfs = new Array();
    for (var idx in params["pdfs"]) {
	if (params['pdfs'][idx] == '-') {
	    pdfs[idx] = new PdfReader(new BufferedInputStream(System["in"]));
	} else {
	    pdfs[idx] = new PdfReader(new FileInputStream(params["pdfs"][idx]));
	}
    }

    var document = new Document();
    var copy = new PdfCopy(document, params['out']);

    document.open();
    err.print("cat: ");
    for (var idx in pdfs) {
	var reader = pdfs[idx];
	var pageCount = reader.getNumberOfPages();
	err.print("[" + params['pdfs'][idx] + ": ");
	for (var page = 1; page <= pageCount; page++) {
	    err.print("[" + page);

	    var pdfPage = copy.getImportedPage(reader, page);
	    copy.addPage(pdfPage);
	    err.print("]");
	}
	err.print("]");
    }

    err.println();
    document.close();
}

registerModule({'command': 'cat',
		'parse_params': checkCatArgs,
		'name': 'Concatenate PDF',
		'args': 'PDFS',
		'usage': catUsage,
		'entry': cat});
