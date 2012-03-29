# Overview

jsPdftk is a PDF toolkit driven by the Rhino JavaScript interpreter.


# Licence

This software is licensed under AGPL version 3 or later.  See LICENSE
for details.


# Usage

    jspdftk info < input.pdf

    cat input.pdf | jspdftk merge background.pdf > output.pdf

    cat input.pdf | jspdftk cat 2.pdf 3.pdf > output.pdf

    cat input.pdf | \
        jspdftk cat 2.pdf 3.pdf | \
        jspdftk merge background.pdf > output.pdf

