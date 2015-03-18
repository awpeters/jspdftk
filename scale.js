function scaleUsage() {
    var err = System.err;

    err.print("Usage:  scale factor\n");
    quit(1);
}

function checkScaleArgs(params) {
    args = params['opts'];
    if (args.length != 1) {
	scaleUsage();
    }

    params['factor'] = parseFloat(args[0]);

    return params;
}

function scale(params) {
    var err = params['err'];

    var factor = params["factor"];

    var reader = new PdfReader(params['in']);

    var document = new Document();
    var writer = PdfWriter.getInstance(document, params['out']);

    var pagecount = reader.getNumberOfPages();

    document.open();

    err.print("Scale: ");

    var cb = writer.getDirectContent();
    for (var page = 1; page <= pagecount; page++) {
	err.print("[");
	var pagesize  = reader.getPageSize(page);
	var W = pagesize.getWidth();
	var H = pagesize.getHeight();

	document.setPageSize(new Rectangle(factor * W, factor * H));
	document.newPage();
	err.print("" + page);

	var pdfPage = writer.getImportedPage(reader, page);

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
		'parse_params': checkScaleArgs,
		'name': 'Scale PDF pages',
		'args': 'F',
		'usage': scaleUsage,
		'entry': scale});
