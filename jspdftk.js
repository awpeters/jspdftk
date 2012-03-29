#!/usr/bin/env ./rhino

importPackage(java.io);
importPackage(java.lang);
importPackage(com.itextpdf.text);
importPackage(com.itextpdf.text.pdf);

var pi = 4 * Math.atan(1);

function mm2pt(mm) {
    return 72.0 * (mm / 25.4);
}

function pt2mm(pt) {
    return 25.4 * (pt / 72.0);
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
load("cat.js");
load("colorinfo.js");
load("collect.js");
load("cut.js");
load("dup-pages.js");
load("info.js");
load("merge.js");
load("rotate.js");
load("rotateScale.js");
load("xmp.js");

function usage() {
    var err = System.err;

    err.print("Usage:  jspdftk action [args]\n");
    err.print("  action [args]\n");
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
