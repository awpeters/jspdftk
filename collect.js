function collectUsage(msg) {
    var err = System.err;

    err.print(msg + "\n");
    err.print("Usage:  collect.js width height\n");
    err.print("  Collects as many pages into one page.\n");
    err.print("  width / height: resulting page.\n");
    quit(1);
}

function checkCollectArgs(params) {
    args = params['opts'];
    if (args.length != 2) {
	collectUsage("collect.js needs two arguments.");
    } else {
	params['width'] = mm2pt(parseInt(args[0]));
	params['height'] = mm2pt(parseInt(args[1]));
    }

    return params;
}

function collect(params) {
    var err = params['err'];

    var reader = new PdfReader(params['in']);
    var w = params["width"];
    var h = params["height"];

    var pageCount = reader.getNumberOfPages();
    var pageSize = reader.getPageSize(1);
    var wd = pageSize.getWidth();
    var ht = pageSize.getHeight();

    var document = new Document(new Rectangle(w, h));
    var writer = PdfWriter.getInstance(document, params['out']);

    // err.println("w: " + w + ", wd " + wd);
    // err.println("h: " + h + ", ht " + ht);

    var xcopies = Math.round(w / wd, 0);
    var ycopies = Math.round(h / ht, 0);

    document.open();

    err.println("collect (" + xcopies + " x " + ycopies + ")");

    var x0 = 0.5 * (w - wd * xcopies);
    var y0 = 0.5 * (h - ht * ycopies);

    var c = 1.0;
    var s = 0.0;
    var x = x0;
    var y = y0;

    var cb = writer.getDirectContent();
    var page = 0;
    err.print("collect [");
    document.newPage();
    for (var row = 0; row < xcopies; row++) {
	x = x0;
	err.print("[");
	for (var col = 0; col < ycopies; col++) {
	    page = page + 1;
	    if (page > pageCount) {
		break;
	    }

	    var pg = writer.getImportedPage(reader, page);
	    cb.addTemplate(pg, c, s, -s, c, x, y);

	    err.print("[" + page + "@"
		      + Math.round(pt2mm(x), 1) + ","
		      + Math.round(pt2mm(y), 1) + "]");

	    // advance to next column
	    x = x + wd;
	}
	err.print("]");
	// advance to next row
	y = y + ht;
    }

    err.print("]");
    err.println();
    document.close();

}

registerModule({'command': 'collect',
		'parse_params': checkCollectArgs,
		'name': 'collect pages into on PDFs',
		'args': 'W H',
		'usage': collectUsage,
		'entry': collect});
