function infoUsage() {
    var err = System.err;

    err.print("Usage:  info.js\n");
    err.print("  PDF information.\n");
    quit(1);
}

function checkInfoArgs(args) {
    return { }
}

function info(args) {
    var err = System.err;

    var params = checkInfoArgs(args);

    var stdin = new BufferedInputStream(System["in"]);
    var pdfIn = new PdfReader(stdin);

    var stdout = System.out;

    var pageCount = pdfIn.getNumberOfPages();
    var info = pdfIn.getInfo();

    // var it = info.entrySet().iterator();
    var it = info.keySet().iterator();
    while (it.hasNext()) {
	var key = it.next();

	stdout.print(key);
	stdout.print(": ");
	stdout.println(info.get(key));
    }

    stdout.println("Pages: " + pageCount);
}

registerModule({'command': 'info',
		'name': 'Show PDF info',
		'usage': infoUsage,
		'entry': info});