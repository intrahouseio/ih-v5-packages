const fs = require('fs-extra');
const path = require('path');

const filePostinst = require('./postinst');
const filePostrm = require('./postrm');
const filePrerm = require('./prerm');

const { VERSION_EMPTY, PRODUCT_SITES, PRODUCT_DESCRIPTIONS, PRODUCT_DESCRIPTIONS2 } = require('../tools/constatnts');

function fileSpec(buildPath, platform, proc, product) {
  return (
    'Name: ' + product.name + '\n' +
    'Version: ' + (global.__versions ? global.__versions[product.name] : VERSION_EMPTY) + '\n' +
    'Release: 1' + '\n' +
    // 'BuildArch: ' + proc.arch + '\n' +
    'Summary: ' + (PRODUCT_DESCRIPTIONS[product.name] || '').replace('\n', '') + '\n' +
    'URL: ' + 'https://' + PRODUCT_SITES[product.name] + '\n' +
    'Packager: ' + 'Intra LLC' + ' <support@ih-systems.com>' + '\n' +
    'Group: Converted/misc' + '\n' +
    'Conflicts: ' + (product.name === 'intrascada' ? 'intrahouse' : 'intrascada') + '\n' +
    'License: ' + 'Intra License' + '\n' +
    'Requires: zip, unzip' + '\n\n' +
    '%define _rpmdir ../\n%define _rpmfilename %%{NAME}.rpm\n%define _unpackaged_files_terminate_build 0' + '\n\n' +
    '%description' + '\n' + (PRODUCT_DESCRIPTIONS2[product.name] || '') + '\n\n' +
    '%post' + '\n' + filePostinst(platform, proc, product).replace(/deb-systemd-invoke/g, 'systemctl') + '\n\n' +
    '%postun' + '\n' + filePostrm(platform, proc, product).replace('purge', '0') + '\n\n' +
    '%preun' + '\n' + filePrerm(platform, proc, product).replace('remove', '0').replace(/deb-systemd-invoke/g, 'systemctl') + '\n\n' +
    '%files' + '\n' + files(product)
  );
}

function files(product) {
  return (`%dir "/lib/systemd/system/"
"/lib/systemd/system/__prefix.service"
"/usr/bin/__prefix"
%dir "/usr/share/"
%dir "/usr/share/doc/"
%dir "/usr/share/doc/__prefix/"
"/usr/share/doc/__prefix/changelog.gz"
"/usr/share/doc/__prefix/copyright"
%dir "/usr/share/__prefix/"
%dir "/usr/share/__prefix/plugins/"
"/usr/share/__prefix/plugins/emuls.ihpack"
%dir "/usr/share/__prefix/projects/"
"/usr/share/__prefix/projects/demo_project.ihpack"
%dir "/usr/share/lintian/"
%dir "/usr/share/lintian/overrides/"
"/usr/share/lintian/overrides/__prefix"
%dir "/usr/share/man/"
%dir "/usr/share/man/man8/"
"/usr/share/man/man8/__prefix.8.gz"`.replace(/__prefix/g, product.service))
}



module.exports = fileSpec;