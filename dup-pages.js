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

    err.println("Dup");
    err.println("Pages: " + pageCount);

    var cb = writer.getDirectContent();
    for (var page = 1; page <= pageCount; page++) {
	err.print("[");

	var pdfPage = writer.getImportedPage(pdfIn, page);
	var pageSize  = pdfIn.getPageSize(page);

	var wd = pageSize.getWidth();
	var ht = pageSize.getHeight();

	document.setPageSize(new Rectangle(wd, ht));
	for (var copy = 1; copy <= copies; copy++) {
	    err.print("[" + page);

	    document.newPage();

	    var c = 1;
	    var s = 0;
	    var x = 0;
	    var y = 0;
	    cb.addTemplate(pdfPage, c, s, -s, c, x, y);

	    err.print("]");
	}

	err.print("]");
    }

    err.println();
    document.close();
}

registerModule({'command': 'dup-pages',
		'name': 'Duplicate individual PDF pages',
		'usage': dupPagesUsage,
		'entry': dupPages});
