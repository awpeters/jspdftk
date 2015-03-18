function twoupUsage(msg) {
    var err = System.err;

    err.print(msg + "\n");
    err.print("Usage:  2-up\n");
    err.print("  Put PDF 2-up.\n");
    quit(1);
}

function checkTwoupArgs(params) {
    if (params.opts != 0)
	twoupUsage("2-up needs no arguments.");

    return params;
}

function twoup(params) {
    var err = params['err'];

    var reader = new PdfReader(params["in"]);

    var pageCount = reader.getNumberOfPages();
    var pageSize = reader.getPageSize(1);
    var w = pageSize.getWidth();
    var h = pageSize.getHeight();

    var W = 2 * w;
    var H = h;

    var document = new Document();
    var writer = PdfWriter.getInstance(document, params["out"]);

    document.open();

    err.println("2-up");
    err.println("Pages: " + pageCount + ", WxH: " + Math.round(pt2mm(W)) + "x" + Math.round(pt2mm(H)) + "mm");

    var middlepage = 2 * Math.ceil(pageCount / 4);
    var y = .5 * (H - h);
    var xOddlt = 0.0;
    var xOddrt = .5 * W;
    var xEvenlt = (.5 * W) - w;
    var xEvenrt = W - w;
    var c = 1.0;
    var s = 0.0;

    var cb = writer.getDirectContent();
    for (var pageno = 0; pageno < middlepage; pageno++) {
	var page1 = pageno + 1;
	var page2 = 2 * middlepage - pageno;
	if (0 === (pageno % 2)) {
	    var pagelt = page2;
	    var pagert = page1;
	    var xlt = xEvenlt;
	    var xrt = xEvenrt;
	} else {
	    var pagelt = page1;
	    var pagert = page2;
	    var xlt = xOddlt;
	    var xrt = xOddrt;
	}

	document.newPage();
	err.print("[");
	if (pagelt <= pageCount) {
	    var page = writer.getImportedPage(reader, pagelt);
	    cb.addTemplate(page, c, s, -s, c, xlt, y);
	    err.print("" + pagelt);
	} else {
	    err.print("-");
	}
	if (page1 == 2) {
	    // endMark(cb, w);
	    err.print("|");
	} else {
	    err.print(" ");
	}
	if (pagert <= pageCount) {
	    var page = writer.getImportedPage(reader, pagert);
	    cb.addTemplate(page, c, s, -s, c, xrt, y);
	    err.print("" + pagert);
	} else {
	    err.print("-");
	}
	err.print("]");
    }
    err.println();
    document.close();

}

registerModule({'command': '2-up',
		'parse_params': checkTwoupArgs,
		'name': '2-up PDFs',
		'args': '',
		'usage': twoupUsage,
		'entry': twoup});
