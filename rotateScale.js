function rotateScaleUsage() {
    var err = System.err;

    err.print("Usage:  rotateScale sides [width height]\n");
    err.print("  sides: 1 = single sided, 2 = double sided.\n");
    err.print("  width / height in mm, if omitted default to A4.\n");
    quit(1);
}

function checkRotateScaleArgs(params) {
    args = params['opts'];

    var sides;
    if (args.length >= 1) {
	var sides = parseInt(args[0]);
	if (sides != 1 && sides != 2) {
	    rotateScaleUsage();
	}
    }

    var width;
    var height;
    if (args.length == 1) {
	width = mm2pt(210);
	height = mm2pt(297);
    } else if (args.length == 3) {
	width = mm2pt(parseInt(args[1]));
	height = mm2pt(parseInt(args[2]));
    } else {
	rotateScaleUsage();
    }

    if (width <= 0 | width >= 200 * 72) {
	rotateScaleUsage();
    }

    if (height <= 0 | height >= 200 * 72) {
	rotateScaleUsage();
    }

    params['sides'] = sides;
    params['width'] = width;
    params['height'] = height;

    return params;
}

function rotateScale(params) {
    var err = params['err'];
    var sides = params["sides"];
    var wd = params["width"];
    var ht = params["height"];

    var reader = new PdfReader(params['in']);

    var pagecount = reader.getNumberOfPages();

    var document = new Document(new Rectangle(wd, ht));
    var writer = PdfWriter.getInstance(document, params['out']);

    document.open();

    err.print("Rotate / scale: ");

    var cb = writer.getDirectContent();
    for (var page = 1; page <= pagecount; page++) {
	err.print("[");

	document.newPage();
	err.print("" + page);

	var pdfPage = writer.getImportedPage(reader, page);
	var pagesize  = reader.getPageSize(page);

	var pageRot  = reader.getPageRotation(page);

	var ws = pagesize.getWidth();
	var hs = pagesize.getHeight();

	var wr = Math.min(hs, ws);
	var hr = Math.max(hs, ws);

	var scale = Math.min(ht / hr, wd / wr);
	var x0 = .5 * (wd - scale * wr);
	var y0 = .5 * (ht - scale * hr);

	var rot = 0;
	if (ws > hs) {
	    // landscape
	    if (sides == 2 && page % 2 == 0) {
		rot = -1;
	    } else {
		rot = 1;
	    }
	}

	var c = scale * Math.cos(rot * pi / 2);
	var s = scale * Math.sin(rot * pi / 2);
	if (rot == 0) {
	    var x = x0;
	    var y = y0;
	} else if (rot == 1) {
	    var x = -x0 + wd;
	    var y = y0;
	} else if (rot == -1) {
	    var x = x0;
	    var y = y0 + ht;
	}
	cb.addTemplate(pdfPage, c, s, -s, c, x, y);

	if (scale < minScale) {
	    err.print("<");
	} else if (scale > minScale) {
	    err.print(">");
	}
	if (rot == -1) {
	    err.print("L");
	} else if (rot == 1) {
	    err.print("R");
	}

	err.print("] ");
    }

    err.println();
    document.close();

}

registerModule({'command': 'rotateScale',
		'parse_params': checkRotateScaleArgs,
		'name': 'Rotate and Scale PDF pages',
		'args': 'S [W H]',
		'usage': rotateScaleUsage,
		'entry': rotateScale});
