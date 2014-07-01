function dupPagesUsage() {
    var err = System.err;

    err.print("Usage:  dup-pages.js copies\n");
    err.print("  Copy individual pages COPIES times to output.\n");
    quit(1);
}


function checkDupPagesArgs(args) {
    var copies;
    if (args.length == 1) {
	copies = parseInt(args[0]);
    } else {
	dupPagesUsage();
    }

    return { copies: copies }
}

function dupPages(args) {
    var err = System.err;

    var params = checkDupPagesArgs(args);
    var copies = params["copies"];

    var stdin = new BufferedInputStream(System["in"]);
    var pdfIn = new PdfReader(stdin);

    var stdout = new BufferedOutputStream(System.out);
    var document = new Document();

    var writer = PdfWriter.getInstance(document, stdout);

    document.open();

    var pageCount = pdfIn.getNumberOfPages();

    err.println("dup-pages: " + copies + "x");

    var cb = writer.getDirectContent();

    err.print("dup-pages [");
    for (var pageno = 1; pageno <= pageCount; pageno++) {
	var pageSize  = pdfIn.getPageSize(pageno);
	document.setPageSize(pageSize);

	var pdfPage = writer.getImportedPage(pdfIn, pageno);
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
		'name': 'Duplicate individual PDF pages',
		'args': 'C',
		'usage': dupPagesUsage,
		'entry': dupPages});
