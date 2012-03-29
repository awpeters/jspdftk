function collectUsage(msg) {
    var err = System.err;

    err.print(msg + "\n");
    err.print("Usage:  collect.js width height\n");
    err.print("  Collects as many pages into one page.\n");
    err.print("  width / height: resulting page.\n");
    quit(1);
}

function checkCollectArgs(args) {
    if (args.length != 2) {
	collectUsage("collect.js needs two arguments.");
    } else {
	width = mm2pt(parseInt(args[0]));
	height = mm2pt(parseInt(args[1]));
    }
    return { width: width, height: height }
}

function collect(args) {
    var err = System.err;

    var params = checkCollectArgs(args);

    var stdin = new BufferedInputStream(System["in"]);
    var pdfIn = new PdfReader(stdin);
    var w = params["width"];
    var h = params["height"];

    var stdout = new BufferedOutputStream(System.out);
    var pageCount = pdfIn.getNumberOfPages();
    var pageSize = pdfIn.getPageSize(1);
    var wd = pageSize.getWidth();
    var ht = pageSize.getHeight();

    var document = new Document(new Rectangle(w, h));
    var writer = PdfWriter.getInstance(document, stdout);

    var xcopies = Math.floor(w / wd);
    var ycopies = Math.floor(h / ht);

    document.open();

    err.println("collect");

    var x0 = 0.5 * (w - wd * xcopies);
    var y0 = 0.5 * (h - ht * ycopies);

    var c = 1.0;
    var s = 0.0;
    var x = x0;
    var y = y0;

    var cb = writer.getDirectContent();
    for (var page = 0; page < pageCount; page++) {
	if (0 === (page % (xcopies * ycopies))) {
	    err.print("[");
	    document.newPage();
	    x = x0;
	    y = y0;
	} else {
	    x = x + wd;
	}
	if (x + wd > w) {
	    x = x0;
	    y = y + ht;
	}

	var pg = writer.getImportedPage(pdfIn, page + 1);
	cb.addTemplate(pg, c, s, -s, c, x, y);

	err.print("[" + (page + 1) + "]");
    }
    err.print("]");
    err.println();
    document.close();

}

registerModule({'command': 'collect',
		'name': 'collect pages into on PDFs',
		'usage': collectUsage,
		'entry': collect});
