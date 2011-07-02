function cutUsage() {
    var err = System.err;

    err.print("Usage:  cut.js width height\n");
    err.print("  Cut PDF to width, height.\n");
    err.print("  width / height in mm, default to A4 when omitted.\n");
    quit(1);
}

function checkCutArgs(args) {
    var width;
    var height;
    if (args.length == 0) {
	width = mm2pt(210);
	height = mm2pt(297);
    } else if (args.length == 2) {
	width = mm2pt(parseInt(args[0]));
	height = mm2pt(parseInt(args[1]));
    } else {
	cutUsage();
    }

    if (width <= 0 | width >= 200 * 72) {
	cutUsage();
    }

    if (height <= 0 | height >= 200 * 72) {
	cutUsage();
    }

    return { width: width, height: height }
}

function cut(args) {
    var err = System.err;

    var params = checkCutArgs(args);
    var wd = params["width"];
    var ht = params["height"];

    var stdin = new BufferedInputStream(System["in"]);
    var pdfIn = new PdfReader(stdin);

    var stdout = new BufferedOutputStream(System.out);
    var document = new Document();

    var writer = PdfWriter.getInstance(document, stdout);

    document.open();
    document.setPageSize(new Rectangle(wd, ht));

    var pageCount = pdfIn.getNumberOfPages();

    err.println("Cut to " + wd + "x" + ht + "mm");
    err.println("Pages: " + pageCount);

    var cb = writer.getDirectContent();
    for (var page = 1; page <= pageCount; page++) {
	err.print("[" + page);

	var pdfPage = writer.getImportedPage(pdfIn, page);
	var pageSize = pdfIn.getPageSize(page);
	var ws = pageSize.getWidth();
	var hs = pageSize.getHeight();

	document.newPage();

	var c = 1;
	var s = 0;
	var x = - 0.5 * (ws - wd);
	var y = - 0.5 * (hs - ht);
	cb.addTemplate(pdfPage, c, s, -s, c, x, y);

	err.print("]");
    }

    err.println();
    document.close();

}

registerModule({'command': 'cut',
		'name': 'Cut PDF page to size',
		'usage': cutUsage,
		'entry': cut});
