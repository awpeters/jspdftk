function xmpUsage() {
    var err = System.err;

    err.print("Usage:  xmp\n");
    err.print("  PDF xmp information.\n");
    quit(1);
}

function checkXmpArgs(params) {
    return params;
}

function xmp(params) {
    var err = params["err"];

    var reader = new PdfReader(params['in']);

    if (params['outfile'] == '-') {
	var out = System.out;
    } else {
	var out = PrintStream(params['out']);
    }

    err.print("Xmp");

    var xml = reader.getMetadata();
    if (xml == null) {
	err.println(": No information available");
	return;
    }
    var s = new java.lang.String(xml);
    out.print(s);
}

registerModule({'command': 'xmp',
		'parse_params': checkXmpArgs,
		'name': 'Display XMP information in PDF',
		'args': '',
		'usage': xmpUsage,
		'entry': xmp});
