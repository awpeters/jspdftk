function dupPagesUsage() {
    var err = System.err;

    err.print("Usage:  dup-pages.js copies\n");
    err.print("  Copy individual pages COPIES times to output.\n");
    quit(1);
}


function checkDupPagesArgs(params) {
    var copies;

    args = params.opts;
    if (args.length == 1) {
	copies = parseInt(args[0]);
    } else {
	dupPagesUsage();
    }

    params['copies'] = copies;

    return params
}

function dupPages(params) {
    var err = params['err'];

    var copies = params["copies"];

    var reader = new PdfReader(params['in']);

    var document = new Document();
    var writer = PdfWriter.getInstance(document, params['out']);

    document.open();

    var pageCount = reader.getNumberOfPages();

    err.println("dup-pages: " + copies + "x");

    var cb = writer.getDirectContent();

    err.print("dup-pages [");
    for (var pageno = 1; pageno <= pageCount; pageno++) {
	var pageSize  = reader.getPageSize(pageno);
	document.setPageSize(pageSize);

	var pdfPage = writer.getImportedPage(reader, pageno);
	for (var copy = 1; copy <= copies; copy++) {
	    err.print("[" + pageno);

	    var c = 1;
	    var s = 0;
	    var x = 0;
	    var y = 0;

	    document.newPage();
	    cb.addTemplate(pdfPage, c, s, -s, c, x, y);

	    err.print("]");
	}
    }
    err.print("]");
    err.println();

    document.close();
}

registerModule({'command': 'dup-pages',
		'parse_params': checkDupPagesArgs,
		'name': 'Duplicate individual PDF pages',
		'args': 'C',
		'usage': dupPagesUsage,
		'entry': dupPages});
