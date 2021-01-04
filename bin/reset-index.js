#!/usr/bin/env node

// james conroy
// 7/9/2017
'use strict';

const fs = require('fs'),
    page = fs.readFileSync(`${process.env.PWD}/src/index.html`).toString();

const inject = "<script></script></body></html>";

const text = page.toString().substring( 0, page.lastIndexOf("<script>") ) + inject ;

// console.log( text );
fs.writeFileSync( `${process.env.PWD}/src/index.html`, text );

