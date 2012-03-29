function twoupUsage(msg) {
    var err = System.err;

    err.print(msg + "\n");
    err.print("Usage:  twoup.js\n");
    err.print("  Put PDF 2-up.\n");
    quit(1);
}

function checkTwoupArgs(args) {
    if (args.length != 0)
	twoupUsage("twoup.js needs no arguments.");

    return { }
}

function twoup(args) {
    var err = System.err;

    var params = checkTwoupArgs(args);

    var stdin = new BufferedInputStream(System["in"]);
    var pdfIn = new PdfReader(stdin);

    var stdout = new BufferedOutputStream(System.out);
    var pageCount = pdfIn.getNumberOfPages();
    var pageSize = pdfIn.getPageSize(1);
    var w = pageSize.getWidth();
    var h = pageSize.getHeight();

    var W = 2 * w;
    var H = h;

    var document = new Document(new Rectangle(W, H));
    var writer = PdfWriter.getInstance(document, stdout);

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
	    var page = writer.getImportedPage(pdfIn, pagelt);
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
	    var page = writer.getImportedPage(pdfIn, pagert);
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
		'name': '2-up PDFs',
		'usage': twoupUsage,
		'entry': twoup});
