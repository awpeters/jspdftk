function cutUsage() {
    var err = System.err;

    err.print("Usage:  cut.js width height [xoffset yoffset]\n");
    err.print("  Cut PDF to width, height.\n");
    err.print("  width / height in mm, default to A4 when omitted.\n");
    err.print("  centers cut on page when offsets omitted.\n");
    quit(1);
}

function checkCutArgs(params) {
    var width;
    var height;
    var xoffset = 0;
    var yoffset = 0;
    var center = true;

    args = params.opts;

    if (args.length == 0) {
	width = mm2pt(210);
	height = mm2pt(297);
    } else if (args.length == 2) {
	width = mm2pt(parseInt(args[0]));
	height = mm2pt(parseInt(args[1]));
    } else if (args.length == 4) {
	width = mm2pt(parseInt(args[0]));
	height = mm2pt(parseInt(args[1]));
	xoffset = mm2pt(parseInt(args[2]));
	yoffset = mm2pt(parseInt(args[3]));
	center = false;
    } else {
	cutUsage();
    }

    if (width <= 0 | width >= 200 * 72) {
	cutUsage();
    }

    if (height <= 0 | height >= 200 * 72) {
	cutUsage();
    }

    params['width'] = width;
    params['height'] = height;
    params['xoffset'] = xoffset;
    params['yoffset'] = yoffset;
    params['center'] = center;

    return params;
}

function cut(params) {
    var err = params["err"];

    var wd = params["width"];
    var ht = params["height"];
    var center = params["center"];

    var reader = new PdfReader(params["in"]);

    var document = new Document();
    var writer = PdfWriter.getInstance(document, params["out"]);

    document.open();
    document.setPageSize(new Rectangle(wd, ht));

    var pageCount = reader.getNumberOfPages();

    err.println("Cut to " + pt2mm(wd) + "x" + pt2mm(ht) + "mm");
    err.println("Pages: " + pageCount);

    var cb = writer.getDirectContent();
    for (var page = 1; page <= pageCount; page++) {
	err.print("[" + page);

	var pdfPage = writer.getImportedPage(reader, page);
	var pageSize = reader.getPageSize(page);
	var ws = pageSize.getWidth();
	var hs = pageSize.getHeight();

	document.newPage();

	var c = 1;
	var s = 0;
	if (center) {
	    var x = - 0.5 * (ws - wd);
	    var y = - 0.5 * (hs - ht);
	} else {
	    var x = params["xoffset"];
	    var y = - (hs - ht) + params["yoffset"];
	}
	cb.addTemplate(pdfPage, c, s, -s, c, x, y);

	err.print("]");
    }

    err.println();
    document.close();

}

registerModule({'command': 'cut',
		'parse_params': checkCutArgs,
		'name': 'Cut PDF page to size',
		'args': 'W H [X Y]',
		'usage': cutUsage,
		'entry': cut});
