#!/bin/bash

cat ~/flyer-upcoming-events.pdf | \
    ./jspdftk cutmarks - - | \
    ./jspdftk scaletosize 105 148 - - | \
    ./jspdftk dup-pages 4 - - | \
    ./jspdftk collect 210 297 - - \
    > fu.pdf
