function scaleToSizeUsage() {
    var err = java.lang.System.err;

    err.print("Usage:  scaletosize.js width height\n");
    quit(1);
}

function checkScaletosizeArgs(args) {
    var factor;
    if (args.length != 2) {
	scaletosizeUsage();
    }
    var width = mm2pt(parseFloat(args[0]));
    var height = mm2pt(parseFloat(args[1]));
    return { width: width, height: height }
}

function scaleToSize(args) {
    var err = System.err;

    var params = checkScaletosizeArgs(args);
    var w = params["width"];
    var h = params["height"];

    var streamIn = new BufferedInputStream(System["in"]);
    var pdfIn = new PdfReader(streamIn);

    var pagecount = pdfIn.getNumberOfPages();

    var document = new Document();
    var streamOut = new BufferedOutputStream(System.out);
    // var streamOut = new FileOutputStream("out.pdf");

    var writer = PdfWriter.getInstance(document, streamOut);

    document.open();

    err.print("Scale To Size ("
	      + Math.round(pt2mm(w), 0)
	      + " x "
	      + Math.round(pt2mm(h), 0)
	      + "): ");

    var cb = writer.getDirectContent();
    for (var page = 1; page <= pagecount; page++) {
	err.print("[");
	var pagesize  = pdfIn.getPageSize(page);
	var W = pagesize.getWidth();
	var H = pagesize.getHeight();

	var factor = 0.5 * (w / W + h / H);

	document.setPageSize(new Rectangle(w, h));
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

registerModule({'command': 'scaletosize',
		'name': 'Scale PDF pages to size',
		'args': 'W H',
		'usage': scaleToSizeUsage,
		'entry': scaleToSize});
