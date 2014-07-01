function scaleUsage() {
    var err = java.lang.System.err;

    err.print("Usage:  scale.js factor\n");
    quit(1);
}

function checkScaleArgs(args) {
    var factor;
    if (args.length != 1) {
	scaleUsage();
    }
    var factor = parseFloat(args[0]);
    return { factor: factor }
}

function scale(args) {
    var err = System.err;

    var params = checkScaleArgs(args);
    var factor = params["factor"];

    for (f in params) {
	err.println(f + ": " + params[f]);
    }

    var streamIn = new BufferedInputStream(System["in"]);
    var pdfIn = new PdfReader(streamIn);

    var pagecount = pdfIn.getNumberOfPages();

    var document = new Document();
    var streamOut = new BufferedOutputStream(System.out);
    // var streamOut = new FileOutputStream("out.pdf");

    var writer = PdfWriter.getInstance(document, streamOut);

    document.open();

    err.print("Scale: ");

    var cb = writer.getDirectContent();
    for (var page = 1; page <= pagecount; page++) {
	err.print("[");
	var pagesize  = pdfIn.getPageSize(page);
	var W = pagesize.getWidth();
	var H = pagesize.getHeight();

	document.setPageSize(new Rectangle(factor * W, factor * H));
	document.newPage();
	err.print("" + page);

	var pdfPage = writer.getImportedPage(pdfIn, page);

	var rot = 0;
	var c = factor * Math.cos(rot * pi / 2);
	var s = factor * Math.sin(rot * pi / 2);
	var x = 0;
	var y = 0;
	cb.addTemplate(pdfPage, c, s, -s, c, x, y);

	err.print("] ");
    }

    err.println();
    document.close();

}

registerModule({'command': 'scale',
		'name': 'Scale PDF pages',
		'args': 'F',
		'usage': scaleUsage,
		'entry': scale});
