function mergeUsage(msg) {
    var err = System.err;

    err.print(msg + "\n");
    err.print("Usage:  merge.js bgPDF\n");
    err.print("  Put bgPDF as background to every page.\n");
    quit(1);
}

function checkMergeArgs(args) {
    if (args.length < 1)
	mergeUsage("merge.js needs at least one argument.");

    if (args.length > 1)
	mergeUsage("merge.js needs no more than one argument.  Found: " + args);

    pdf = args[0];
    return { backgroundPdf: pdf }
}

function merge(args) {
    var err = System.err;

    var params = checkMergeArgs(args);
    var bgPdf = params["backgroundPdf"];

    var pdfBg = new PdfReader(bgPdf);

    var stdin = new BufferedInputStream(System["in"]);
    var pdfIn = new PdfReader(stdin);

    var stdout = new BufferedOutputStream(System.out);
    var document = new Document();

    var writer = PdfWriter.getInstance(document, stdout);

    document.open();

    var pageCount = pdfIn.getNumberOfPages();

    err.println("Merge");
    err.println("Pages: " + pageCount);

    var cb = writer.getDirectContent();
    var bgPage = writer.getImportedPage(pdfBg, 1);
    for (var page = 1; page <= pageCount; page++) {
	err.print("[" + page);

	var pdfPage = writer.getImportedPage(pdfIn, page);
	var pageSize = pdfIn.getPageSize(page);

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
		'name': 'Merge PDFs',
		'usage': mergeUsage,
		'entry': merge});
