function jpg2pdfUsage() {
    var err = System.err;

    err.print("Usage:  jpg2pdf.js JPEG PDF\n");
    err.print("  put JPEG in PDF.\n");
    quit(1);
}

function checkJpg2pdfArgs(params) {
    args = params.opts;

    if (args.length != 0) {
        jpg2pdfUsage();
    }

    return params;
}

function jpg2pdf(params) {
    var err = params["err"];

    var image = Image.getInstance("" + params["infile"]);

    var W = image.getPlainWidth();
    var H = image.getPlainHeight();

    if (W > H) {
        wd = mm2pt(500);
        ht = wd * H / W;
    } else {
        ht = mm2pt(500);
        wd = ht * W / H;
    }

    err.println("jpg is " + W + "x" + H + "px");
    err.println("Put jpg to " + pt2mm(wd) + "x" + pt2mm(ht) + "mm");

    image.setAbsolutePosition(0, 0);
    image.scaleToFit(wd, ht);

    var document = new Document(new Rectangle(wd, ht));
    var writer = PdfWriter.getInstance(document, params["out"]);

    document.open();
    document.add(image);
    err.println('[1]');
    err.println();
    document.close();

}

registerModule({'command': 'jpg2pdf',
                'parse_params': checkJpg2pdfArgs,
                'name': 'jpg2pdf PDF page to size',
                'args': '',
                'usage': jpg2pdfUsage,
                'entry': jpg2pdf});
