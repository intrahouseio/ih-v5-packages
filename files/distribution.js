const fs = require('fs-extra');
const path = require('path');

const { VERSION_EMPTY, PRODUCT_DESCRIPTIONS } = require('../tools/constatnts');

function fileDistribution(buildPath, platform, proc, product) {
  return (`<?xml version="1.0" encoding="utf-8" standalone="no"?>
<installer-script minSpecVersion="1.000000">
    <title>${product.label}</title>
    <license file="license.txt"/>
    <options customize="never" allow-external-scripts="no"/>
    <domains enable_anywhere="false" enable_currentUserHome="false" enable_localSystem="true" />
    <installation-check script="installCheck();"/>
        <script>
function installCheck() {
    if(system.files.fileExistsAtPath('/Library/${((product.name === 'intrascada' || product.name === 'intraopc') ? 'intrahouse' : 'intrascada')}/')) {
        my.result.title = 'Конфликт пакетов';
        my.result.message = 'Обнаружен конфликт с пакетом ${(product.name === 'intrascada' || product.name === 'intraopc') ? 'IntraHouse' : 'IntraSCADA'}, необходимо удалить конфликтующий пакет и продолжить установку!';
        my.result.type = 'Fatal';
        return false;
    }
    return true;
}
    </script>
    <choices-outline>
        <line choice="${product.service}"/>
    </choices-outline>
    <choice id="${product.service}" title="${product.service}">
        <pkg-ref id="${product.service}.pkg"/>
    </choice>
    <pkg-ref id="${product.service}.pkg" auth="Root">${product.service}.pkg</pkg-ref>
</installer-script>`);
}

module.exports = fileDistribution;