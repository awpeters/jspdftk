function rotateUsage() {
    var err = System.err;

    err.print("Usage:  rotate.js angle\n");
    err.print("  Rotate PDF angle degrees clockwise.\n");
    err.print("  angle in degrees.\n");
    quit(1);
}


function checkRotateArgs(args) {
    var angle;
    if (args.length == 0) {
	angle = deg2rad(90);
    } else if (args.length == 1) {
	angle = deg2rad(parseInt(args[0]));
    } else {
	rotateUsage();
    }

    return { angle: angle }
}

function rotate(args) {
    var err = System.err;

    var params = checkRotateArgs(args);
    var angle = params["angle"];

    var stdin = new BufferedInputStream(System["in"]);
    var pdfIn = new PdfReader(stdin);

    var stdout = new BufferedOutputStream(System.out);
    var document = new Document();

    var writer = PdfWriter.getInstance(document, stdout);

    document.open();

    var pageCount = pdfIn.getNumberOfPages();

    err.println("Rotate");
    err.println("Pages: " + pageCount);

    var cb = writer.getDirectContent();
    for (var page = 1; page <= pageCount; page++) {
	err.print("[" + page);

	var pdfPage = writer.getImportedPage(pdfIn, page);
	var pageSize  = pdfIn.getPageSize(page);

	var pageRotation  = pdfIn.getPageRotation(page);

	var wd = pageSize.getWidth();
	var ht = pageSize.getHeight();

	document.setPageSize(new Rectangle(ht, wd));
	document.newPage();

	var c = Math.cos(angle);
	var s = Math.sin(angle);
	var x = ht;
	var y = 0;
	cb.addTemplate(pdfPage, c, s, -s, c, x, y);

	err.print("]");
    }

    err.println();
    document.close();

}

registerModule({'command': 'rotate',
		'name': 'Rotate PDF pages',
		'args': 'A',
		'usage': rotateUsage,
		'entry': rotate});
