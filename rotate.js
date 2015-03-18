function rotateUsage() {
    var err = System.err;

    err.print("Usage:  rotate [angle]\n");
    err.print("  Rotate PDF angle degrees clockwise.\n");
    err.print("  angle in degrees, default 90 degrees clockwise.\n");
    quit(1);
}


function checkRotateArgs(params) {
    var angle;

    args = params.opts;
    if (args.length == 0) {
	angle = deg2rad(90);
    } else if (args.length == 1) {
	angle = deg2rad(parseInt(args[0]));
    } else {
	rotateUsage();
    }

    params['angle'] = angle;

    return params;
}

function rotate(params) {
    var err = params['err'];

    var angle = params["angle"];

    var reader = new PdfReader(params['in']);

    var document = new Document();
    var writer = PdfWriter.getInstance(document, params['out']);

    document.open();

    var pageCount = reader.getNumberOfPages();

    err.println("Rotate");
    err.println("Pages: " + pageCount);

    var cb = writer.getDirectContent();
    for (var page = 1; page <= pageCount; page++) {
	err.print("[" + page);

	var pdfPage = writer.getImportedPage(reader, page);
	var pageSize  = reader.getPageSize(page);

	var pageRotation  = reader.getPageRotation(page);

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
		'parse_params': checkRotateArgs,
		'name': 'Rotate PDF pages',
		'args': 'A',
		'usage': rotateUsage,
		'entry': rotate});
