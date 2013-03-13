function extractOceOdlUsage() {
    var err = System.err;

    err.print("Usage:  extractOceOdl.js\n");
    err.print("  Extract Oce ODL XML stream from PDF.\n");
    quit(1);
}


function checkExtractOceOdlArgs(args) {
    if (args.length > 0) {
	extractOceOdlUsage();
    }

    return { }
}

function getPDFObject(pdf, parent, key) {
    var indirect = parent.get(new PdfName(key));
    return pdf.getPdfObject(indirect.getNumber());
}

function extractOceOdl(args) {
    var stdin = new BufferedInputStream(System["in"]);
    var stdout = System.out;
    var err = System.err;

    var params = checkExtractOceOdlArgs(args);

    var pdf = new PdfReader(stdin);

    var catalog = pdf.getCatalog();
    var PI = getPDFObject(pdf, catalog, "PieceInfo");
    var ODL = getPDFObject(pdf, PI, "OCED_ODL_DATA");
    var privat = getPDFObject(pdf, ODL, "Private");
    var stream = getPDFObject(pdf, privat, "OCED_ODL_STREAM");
    if (stream.isStream()) {
        b = PdfReader.getStreamBytes(stream);
        stdout.print(new java.lang.String(b, "UTF-16LE"));
    }
    stdout.println();
}

registerModule({'command': 'extractOceOdl',
		'name': 'Extract Oce ODL XML stream from PDF',
		'usage': extractOceOdlUsage,
		'entry': extractOceOdl});
