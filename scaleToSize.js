function scaleToSizeUsage() {
    var err = System.err;

    err.print("Usage:  scaletosize width height\n");
    quit(1);
}

function checkScaletosizeArgs(params) {
    args = params['opts'];
    if (args.length != 2) {
	scaletosizeUsage();
    }

    params['width'] = mm2pt(parseFloat(args[0]));
    params['height'] = mm2pt(parseFloat(args[1]));

    return params;
}

function scaleToSize(params) {
    var err = params['err'];

    var w = params["width"];
    var h = params["height"];

    var reader = new PdfReader(params['in']);

    var document = new Document();
    var writer = PdfWriter.getInstance(document, params['out']);

    var pagecount = reader.getNumberOfPages();

    document.open();

    err.print("Scale To Size ("
	      + Math.round(pt2mm(w), 0)
	      + " x "
	      + Math.round(pt2mm(h), 0)
	      + "): ");

    var cb = writer.getDirectContent();
    for (var page = 1; page <= pagecount; page++) {
	err.print("[");
	var pagesize  = reader.getPageSize(page);
	var W = pagesize.getWidth();
	var H = pagesize.getHeight();

	var factor = 0.5 * (w / W + h / H);

	document.setPageSize(new Rectangle(w, h));
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

registerModule({'command': 'scaletosize',
		'parse_params':  checkScaletosizeArgs,
		'name': 'Scale PDF pages to size',
		'args': 'W H',
		'usage': scaleToSizeUsage,
		'entry': scaleToSize});
