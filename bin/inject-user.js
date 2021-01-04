#!/usr/bin/env node

// dpw@seattle.local
// 2016.08.12
'use strict';

//copy a user from dev-user-account to user-dev.json


const fs = require('fs'),
  user = require(`${process.env.PWD}/user-dev.json`),
  page = fs.readFileSync(`${process.env.PWD}/src/index.html`).toString();

const inject = `<script>
    (function(){
        sessionStorage.setItem('userSession','${ JSON.stringify(user)}');
    })();
  </script>
`;


const end = page.toString().substring(page.lastIndexOf("</app-root>"));
const text = page.toString().substring(0, page.lastIndexOf("</app-root>")) + inject + end;

fs.writeFileSync(`${process.env.PWD}/src/index.html`, text);

