function cutmarksUsage(msg) {
    var err = System.err;

    err.print(msg + "\n");
    err.print("Usage:  cutmarks.js\n");
    err.print("  Put cutmarks on every page.\n");
    quit(1);
}

function checkCutmarksArgs(args) {
    return args;
}

function cutmarks(params) {
    var err = params['err'];

    var reader = new PdfReader(params['in']);

    var document = new Document();
    var writer = PdfWriter.getInstance(document, params['out']);

    document.open();

    var pageCount = reader.getNumberOfPages();

    err.println("Cutmarks");
    err.println("Pages: " + pageCount);

    var overlap = mm2pt(5)
    var marklen = mm2pt(4);

    var cb = writer.getDirectContent();
    for (var page = 1; page <= pageCount; page++) {
	err.print("[" + page);

	var pdfPage = writer.getImportedPage(reader, page);
	var pageSize = reader.getPageSize(page);

	var W = pageSize.width;
	var H = pageSize.height;

	var c = 1;
	var s = 0;
	var x = mm2pt(2);	// 3 mm overlap
	var y = x;
	var w = W + 2 * x;
	var h = H + 2 * y;

	document.setPageSize(new Rectangle(w, h));
	document.newPage();

	cb.addTemplate(pdfPage, c, s, -s, c, x, y);

	//cb.setLineWidth(2.0f); // Make a bit thicker than 1.0 default
        //cb.setGrayStroke(0.95f); // 1 = black, 0 = white
        cb.setGrayStroke(0.0);	 // 0 = black, 1 = white

	// horizontal lines
	var x0 = 0;
        var y0 = overlap;
        cb.moveTo(x0, y0);
        cb.lineTo(x0 + marklen, y0);
        cb.stroke();

        cb.moveTo(x0 + w, y0);
        cb.lineTo(x0 + w - marklen, y0);
        cb.stroke();

	x0 = 0;
        y0 = h - overlap;
        cb.moveTo(x0, y0);
        cb.lineTo(x0 + marklen, y0);
        cb.stroke();

        cb.moveTo(x0 + w, y0);
        cb.lineTo(x0 + w - marklen, y0);
        cb.stroke();

	// vertical lines
	x0 = overlap;
        y0 = 0;
        cb.moveTo(x0, y0);
        cb.lineTo(x0, y0 + marklen);
        cb.stroke();

        cb.moveTo(x0, y0 + h);
        cb.lineTo(x0, y0 + h - marklen);
        cb.stroke();

	x0 = w - overlap;
        y0 = 0;
        cb.moveTo(x0, y0);
        cb.lineTo(x0, y0 + marklen);
        cb.stroke();

        cb.moveTo(x0, y0 + h);
        cb.lineTo(x0, y0 + h - marklen);
        cb.stroke();


	err.print("]");
    }

    err.println();
    document.close();

}

registerModule({'command': 'cutmarks',
		'parse_params': checkCutmarksArgs,
		'name': 'Cutmarks PDFs',
		'args': '',
		'usage': cutmarksUsage,
		'entry': cutmarks});
