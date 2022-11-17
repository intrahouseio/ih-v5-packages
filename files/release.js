function fileRelease(platform) {
  const list = Object.keys(platform.processors).join(' ');
  return (
    'APT::FTPArchive::Release::Codename "stable";' + '\n' +
    'APT::FTPArchive::Release::Components "main";' + '\n' +
    'APT::FTPArchive::Release::Label "APT Repository";' + '\n' +
    `APT::FTPArchive::Release::Architectures "${list}";`
  );
}

module.exports = fileRelease;