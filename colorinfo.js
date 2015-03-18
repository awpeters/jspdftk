importPackage(org.apache.pdfbox.pdmodel);
importPackage(org.apache.pdfbox.pdmodel.common);
importPackage(org.apache.pdfbox.cos);
importPackage(org.apache.pdfbox.pdfparser);
importPackage(org.apache.pdfbox.util);
importPackage(org.apache.pdfbox.pdmodel.graphics.xobject);
importPackage(org.apache.pdfbox.pdmodel.interactive.documentnavigation.outline);

function colorInfoUsage() {
    var err = System.err;

    err.print("Usage:  colorinfo.js\n");
    err.print("  PDF color information.\n");
    quit(1);
}

function checkColorInfoArgs(args) {
    return args;
}

function printOutline(outline, indent) {
    var result = "";
    if (outline == null)
	return result;

    var current = outline.getFirstChild();
    while (current != null) {
	result = (result +
		  indent + current.getTitle() + "\n" +
		  printOutline(current, indent + "    "));
	current = current.getNextSibling();
    }
    return result;
}

function colorinfo(params) {
    var err = params['err'];

    var reader = new PDDocument.load(params['in']);

    if (params['outfile'] == '-') {
	var out = System.out;
    } else {
	var out = PrintStream(params['out']);
    }

    if (true) {
	var outline = reader.getDocumentCatalog().getDocumentOutline();
	out.println(printOutline(outline, ""));
    }


    var pages = reader.getDocumentCatalog().getAllPages();

    //    var files = reader.getEmbeddedFiles();
    //    out.println(files);

    var pageCount = 0;

    for (var pageCounter = 0; pageCounter < pages.size(); pageCounter++) {
	out.println("Page: " + (pageCounter + 1));

	var curPage = pages.get(pageCounter);

	var mediaBox = curPage.findMediaBox();
	out.println("MediaBox: W x H: " +
		    pt2mm(mediaBox.getWidth()) + " x " +
		    pt2mm(mediaBox.getHeight()));
	var cropBox = curPage.findMediaBox();
	out.println("CropBox: W x H: " +
		    pt2mm(cropBox.getWidth()) + " x " +
		    pt2mm(cropBox.getHeight()));

	var images = curPage.findResources().getImages();
	//out.println("Resources: " + images);

	//var colorSpaces = curPage.findResources().getColorSpaces();

	var parser = PDFStreamParser(curPage.getContents().getStream());
	parser.parse();

	var pageTokens = parser.getTokens();

	for (var counter = 0; counter < pageTokens.size(); counter++) {
	    var token = pageTokens.get(counter);
	    if (token instanceof PDFOperator) {
		var op = token.getOperation();
		if (op.equals("cs") ||
		    op.equals("CS")) {
		    // set colorspace
		    var colorSpace = pageTokens.get(counter - 1).getName();
		    // var colorSpace = colorSpaces.get(colorSpace);
		    out.println("colorspace for " + op + ": " + colorSpace);
		}

		if (op.equals("scn") ||
		    op.equals("SCN")) {
		    // set color
		    var color = pageTokens.get(counter - 1);
		    out.println("color for " + op + ": " +
				color);
		}

		if (op.equals("Do")) {
		    // print image
		    var image = pageTokens.get(counter - 1).getName();

		    var pixels = images.get(image);
		    var type = "unknown";
		    var colorspace = "null";

		    out.println("pixels: " + pixels);

		    if (pixels instanceof PDCcitt) {
			type = "CCITT";
			colorspace = pixels.getColorSpace().getName();
		    } else if (pixels instanceof PDJpeg) {
			type = "JPEG";
			colorspace = pixels.getColorSpace().getName();
		    } else if (pixels instanceof PDPixelMap) {
			type = "PNG";
			//colorspace = pixels.getColorSpace().getName();
		    }
		    if (pixels != null) {
			var bitdepth = pixels.getBitsPerComponent();
		    }

		    //var imageObject = reader.getObject(image);
		    out.println("image " + op + ": " +
				colorspace + ", " +
				image + ", " +
				type + ", " +
				bitdepth + ", " +
				pixels);
		}
		if (op.equals("rg") ||
		    op.equals("RG")) {
		    // set RGB color
		    var red = pageTokens.get(counter - 3).floatValue();
		    var green = pageTokens.get(counter - 2).floatValue();
		    var blue = pageTokens.get(counter - 1).floatValue();

		    if ((red == green) && (green == blue)) {
			// black or gray scale
		    } else {
			out.println("RGB " + op + ": (" +
				    red + ", " +
				    green + ", " +
				    blue + ")");
		    }
		}
		if (op.equals("k") ||
		    op.equals("K")) {
		    // set CMYK color
		    var C = pageTokens.get(counter - 4).floatValue();
		    var M = pageTokens.get(counter - 3).floatValue();
		    var Y = pageTokens.get(counter - 2).floatValue();
		    var K = pageTokens.get(counter - 1).floatValue();

		    if ((C == M) || (M == Y)) {
			// black or gray scale
		    } else {
			out.println("CMYK " + op + ": (" +
				    C + ", " +
				    M + ", " +
				    Y + ", " +
				    K + ")");
		    }
		}
		if (op.equals("g") ||
		    op.equals("G")) {
		    // set gray level
		}

	    }
	    //	    // out.print(key);
	    //	    // out.print(": ");
	    //	    // out.println(info.get(key));
	}
	out.println(" ");
    }

    reader.close();
}

registerModule({'command': 'colorinfo',
		'parse_params': checkColorInfoArgs,
		'name': 'Show PDF color information per page',
		'args': '',
		'usage': colorInfoUsage,
		'entry': colorinfo});
