function xmpUsage() {
    var err = System.err;

    err.print("Usage:  xmp.js\n");
    err.print("  PDF xmp information.\n");
    quit(1);
}

function checkXmpArgs(args) {
    return { }
}

function xmp(args) {
    var err = System.err;

    var params = checkXmpArgs(args);

    var stdin = new BufferedInputStream(System["in"]);
    var pdfIn = new PdfReader(stdin);

    var stdout = System.out;

    err.print("Xmp");

    var xml = pdfIn.getMetadata();
    if (xml == null) {
	err.println(": No information available");
	return;
    }
    var s = new java.lang.String(xml);
    stdout.print(s);
}

registerModule({'command': 'xmp',
		'name': 'Display XMP information in PDF',
		'args': '',
		'usage': xmpUsage,
		'entry': xmp});
