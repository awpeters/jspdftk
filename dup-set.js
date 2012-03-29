function dupSetUsage() {
    var err = System.err;

    err.print("Usage:  dup-set.js copies\n");
    err.print("  Copy a set of pages COPIES times to output.\n");
    quit(1);
}


function checkDupSetArgs(args) {
    var copies;
    if (args.length == 1) {
	copies = parseInt(args[0]);
    } else {
	dupSetUsage();
    }

    return { copies: copies }
}

function dupSet(args) {
    var err = System.err;

    var params = checkDupSetArgs(args);
    var copies = params["copies"];

    var stdin = new BufferedInputStream(System["in"]);
    var pdfIn = new PdfReader(stdin);

    var stdout = new BufferedOutputStream(System.out);
    var document = new Document();

    var writer = PdfWriter.getInstance(document, stdout);

    document.open();

    var pageCount = pdfIn.getNumberOfPages();

    err.println("dup-set: " + copies + "x");

    var cb = writer.getDirectContent();
    err.print("[");
    for (var copy = 1; copy <= copies; copy++) {
	for (var pageno = 1; pageno <= pageCount; pageno++) {
	    err.print("[" + pageno);

	    var pageSize  = pdfIn.getPageSize(pageno);

	    document.setPageSize(pageSize);
	    document.newPage();

	    var c = 1;
	    var s = 0;
	    var x = 0;
	    var y = 0;

	    var pdfPage = writer.getImportedPage(pdfIn, pageno);
	    cb.addTemplate(pdfPage, c, s, -s, c, x, y);

	    err.print("]");
	}
    }
    err.print("]");    
    err.println();

    document.close();
}

registerModule({'command': 'dup-set',
		'name': 'Duplicate PDF pages as set',
		'usage': dupSetUsage,
		'entry': dupSet});
