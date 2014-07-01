function crossImposeUsage(msg) {
    var err = System.err;

    err.print(msg + "\n");
    err.print("Usage:  crossImpose.js [full]\n");
    err.print("  Put PDF in cross impose.\n");
    quit(1);
}

function checkCrossImposeArgs(args) {
    var full = false;

    if (args.length == 0) {
    } else if (args.length == 1) {
	full = true;
    } else {
	crossImposeUsage("crossImpose.js needs at most 1 argument.");
    }

    return { full: full }
}

function crossImpose(args) {
    var err = System.err;

    var params = checkCrossImposeArgs(args);

    var stdin = new BufferedInputStream(System["in"]);
    var pdfIn = new PdfReader(stdin);

    var stdout = new BufferedOutputStream(System.out);
    var pageCount = pdfIn.getNumberOfPages();
    var pageSize = pdfIn.getPageSize(1);
    var w = pageSize.getWidth();
    var h = pageSize.getHeight();

    var W = 3 * w;
    var H = 3 * h;

    var document = new Document(new Rectangle(W, H));
    var writer = PdfWriter.getInstance(document, stdout);

    document.open();

    err.println("cross-impose");
    err.println("Pages: " + pageCount + ", WxH: " + Math.round(pt2mm(W)) + "x" + Math.round(pt2mm(H)) + "mm");

    var x0 = w
    var y0 = h

    var cb = writer.getDirectContent();
    for (var pageno = 1; pageno < pageCount + 1; pageno++) {
	document.newPage();
	err.print("[");
	err.print("" + pageno);

	var page = writer.getImportedPage(pdfIn, pageno);

	// middle
	cb.addTemplate(page, 1, 0, 0, 1, w, h);

	// left
	cb.addTemplate(page, 0, -1, 1, 0, 0, 2 * h);

	// right
	cb.addTemplate(page, 0, -1, 1, 0, 2 * w, 2 * h);

	// top
	cb.addTemplate(page, 1, 0, 0, -1, w, 3 * h);

	// bottom
	cb.addTemplate(page, 1, 0, 0, -1, w, h);

	if (params['full']) {
	    // upper left
	    cb.addTemplate(page, -1, 0, 0, -1, w, 3 * h);

	    // lower left
	    cb.addTemplate(page, -1, 0, 0, -1, w, h);

	    // upper right
	    cb.addTemplate(page, -1, 0, 0, -1, 3 * w, 3 * h);

	    // lower right
	    cb.addTemplate(page, -1, 0, 0, -1, 3 * w, h);
	}

	err.print("]");
    }
    err.println();
    document.close();

}

registerModule({'command': 'cross-impose',
		'name': 'impose PDF page as cross',
		'args': '[full]',
		'usage': crossImposeUsage,
		'entry': crossImpose});
