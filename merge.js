function mergeUsage(msg) {
    var err = System.err;

    err.print(msg + "\n");
    err.print("Usage:  merge bgPDF\n");
    err.print("  Put bgPDF as background to every page.\n");
    quit(1);
}

function checkMergeArgs(params) {
    args = params['opts'];
    if (args.length < 1)
	mergeUsage("merge needs at least one argument.");

    if (args.length > 1)
	mergeUsage("merge needs no more than one argument.  Found: " + args);

    params['backgroundPdf'] = args[0];

    return params;
}

function merge(params) {
    var err = params['err'];

    var bgPdf = params["backgroundPdf"];

    var pdfBg = new PdfReader(bgPdf);

    var reader = new PdfReader(params['in']);

    var document = new Document();
    var writer = PdfWriter.getInstance(document, params['out']);

    document.open();

    var pageCount = reader.getNumberOfPages();

    err.println("Merge");
    err.println("Pages: " + pageCount);

    var cb = writer.getDirectContent();
    var bgPage = writer.getImportedPage(pdfBg, 1);
    for (var page = 1; page <= pageCount; page++) {
	err.print("[" + page);

	var pdfPage = writer.getImportedPage(reader, page);
	var pageSize = reader.getPageSize(page);

	document.setPageSize(pageSize);
	document.newPage();

	var c = 1;
	var s = 0;
	var x = 0;
	var y = 0;
	cb.addTemplate(bgPage,  c, s, -s, c, x, y);
	cb.addTemplate(pdfPage, c, s, -s, c, x, y);

	err.print("]");
    }

    err.println();
    document.close();

}

registerModule({'command': 'merge',
		'parse_params': checkMergeArgs,
		'name': 'Merge PDFs',
		'args': 'BG',
		'usage': mergeUsage,
		'entry': merge});
