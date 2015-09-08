function infoUsage() {
    var err = System.err;

    err.print("Usage:  info\n");
    err.print("  PDF information.\n");
    quit(1);
}

function checkInfoArgs(args) {
    return args;
}

function info(params) {
    var err = params['err'];

    var reader = new PdfReader(params['in']);

    if (params['outfile'] == '-') {
	var out = System.out;
    } else {
	var out = PrintStream(params['out']);
    }

    var pageCount = reader.getNumberOfPages();
    var info = reader.getInfo();

    var it = info.keySet().iterator();
    while (it.hasNext()) {
	var key = it.next();

	out.print(key);
	out.print(": ");
	out.println(info.get(key));
    }

    out.println("Pages: " + pageCount);

    for (var page = 1; page <= pageCount; page++) {

	var pageSize = reader.getPageSize(page);
	var pageRotation  = reader.getPageRotation(page);
	var w = Math.round(pt2mm(pageSize.getWidth()));
	var h = Math.round(pt2mm(pageSize.getHeight()));
	out.println(
	    "Page: " + page
		+ ", W: " + w
		+ ", H: " + h
		+ ", R: " + pageRotation
	);
    }
}

registerModule({'command': 'info',
		'parse_params': checkInfoArgs,
		'name': 'Show PDF info',
		'args': '',
		'usage': infoUsage,
		'entry': info});
