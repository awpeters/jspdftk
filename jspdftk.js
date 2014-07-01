#!/usr/bin/env ./rhino

importPackage(java.io);
importPackage(java.lang);
importPackage(com.itextpdf.text);
importPackage(com.itextpdf.text.pdf);

load("sprintf.js");

var pi = 4 * Math.atan(1);

function mm2pt(mm) {
    return 72.0 * mm / 25.4;
}

function pt2mm(pt) {
    return 25.4 * pt / 72.0;
}

function deg2rad(deg) {
    return deg * pi / 180;
}

var modules = [];

function registerModule(modinfo) {
    var err = System.err;
    var command = modinfo['command'];
    modules[command] = modinfo;
}

load("2up.js");
load("add-cutmarks.js");
load("cat.js");
load("colorinfo.js");
load("collect.js");
load("cut.js");
load("cross-impose.js");
load("dup-pages.js");
load("extractOceOdl.js");
load("info.js");
load("merge.js");
load("rotate.js");
load("rotateScale.js");
load("scale.js");
load("scaleToSize.js");
load("xmp.js");

function usage() {
    var err = System.err;

    err.print("\n");
    err.print("Usage:  jspdftk action [args] [file-in] [file-out]\n");
    err.print("Available actions:\n");
    for (var name in modules) {
	err.print(sprintf("  %15s  %-10s  %s\n",
			  modules[name]['command'],
			  modules[name]['args'],
			  modules[name]['name']));
    }
    err.print("\n");
    quit(1);
}

function jspdftk(args) {
    var err = System.err;

    if (args.length < 1) {
	usage();
    }
    
    var installdir = "./";
    var prog = args[0];

    if (prog in modules) {
	args.shift();
	(modules[prog]['entry'])(args);
    } else if (prog == null) {
	usage();
    } else {
	err.print("Unknown command " + prog + "\n");
    }
}

jspdftk(arguments);
