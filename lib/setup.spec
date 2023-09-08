Buildroot: /home/vam/temp/intrascada-5.15.18
Name: intrascada
Version: 5.15.18
Release: 2
Summary: Open and scalable platform
License: see /usr/share/doc/intrascada/copyright
Distribution: Debian
Group: Converted/misc

%define _rpmdir ../
%define _rpmfilename %%{NAME}-%%{VERSION}-%%{RELEASE}.%%{ARCH}.rpm
%define _unpackaged_files_terminate_build 0

%description
for industrial monitoring and control systems


(Converted from a deb package by alien version 8.95.)

%post
#!/bin/bash
set -e
if [ ! -f "/etc/intrascada/config.json" ]; then
  mkdir -p /etc/intrascada
  echo '{"name_service":"intrascada","lang":"ru","port":8088,"vardir":"/var/lib","assets":"/usr/share/intrascada
","log":"/var/log/intrascada","temp":"/var/lib/intrascada/temp"}' > "/etc/intrascada/config.json"
fi
if [ ! -n "$IH_SERVICE_ACTIVE" ]; then
  systemctl enable intrascada.service > /dev/null 2>&1
  systemctl restart intrascada.service > /dev/null 2>&1
fi

%postun
#!/bin/bash
set -e
if [ "$1" == "0" ]; then
  rm -Rf /var/lib/intrascada > /dev/null 2>&1
  rm -Rf /etc/intrascada > /dev/null 2>&1
  rm -Rf /var/log/intrascada > /dev/null 2>&1
fi

%preun
#!/bin/bash
set -e
if [ "$1" == "0" ]; then
  systemctl stop intrascada.service > /dev/null 2>&1
  systemctl disable intrascada.service > /dev/null 2>&1
fi

%clean
echo NOOP

%files
%dir "/lib/systemd/system/"
"/lib/systemd/system/intrascada.service"
"/usr/bin/intrascada"
%dir "/usr/share/"
%dir "/usr/share/doc/"
%dir "/usr/share/doc/intrascada/"
"/usr/share/doc/intrascada/changelog.gz"
"/usr/share/doc/intrascada/copyright"
%dir "/usr/share/intrascada/"
%dir "/usr/share/intrascada/plugins/"
"/usr/share/intrascada/plugins/emuls.ihpack"
%dir "/usr/share/intrascada/projects/"
"/usr/share/intrascada/projects/demo_project.ihpack"
%dir "/usr/share/lintian/"
%dir "/usr/share/lintian/overrides/"
"/usr/share/lintian/overrides/intrascada"
%dir "/usr/share/man/"
%dir "/usr/share/man/man8/"
"/usr/share/man/man8/intrascada.8.gz"