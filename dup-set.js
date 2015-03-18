function dupSetUsage() {
    var err = System.err;

    err.print("Usage:  dup-set.js copies\n");
    err.print("  Copy a set of pages COPIES times to output.\n");
    quit(1);
}


function checkDupSetArgs(args) {
    if (args.length == 1) {
	args['copies'] = parseInt(args[0]);
    } else {
	dupSetUsage();
    }

    return args;
}

function dupSet(params) {
    var err = params['err'];

    var copies = params["copies"];

    var reader = new PdfReader(params['in']);

    var document = new Document();
    var writer = PdfWriter.getInstance(document, params['out']);

    document.open();

    var pageCount = reader.getNumberOfPages();

    err.println("dup-set: " + copies + "x");

    var cb = writer.getDirectContent();
    err.print("[");
    for (var copy = 1; copy <= copies; copy++) {
	for (var pageno = 1; pageno <= pageCount; pageno++) {
	    err.print("[" + pageno);

	    var pageSize  = reader.getPageSize(pageno);

	    document.setPageSize(pageSize);
	    document.newPage();

	    var c = 1;
	    var s = 0;
	    var x = 0;
	    var y = 0;

	    var pdfPage = writer.getImportedPage(reader, pageno);
	    cb.addTemplate(pdfPage, c, s, -s, c, x, y);

	    err.print("]");
	}
    }
    err.print("]");    
    err.println();

    document.close();
}

registerModule({'command': 'dup-set',
		'parse_params': checkDupSetArgs,
		'name': 'Duplicate PDF pages as set',
		'usage': dupSetUsage,
		'entry': dupSet});
