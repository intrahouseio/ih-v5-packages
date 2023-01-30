const isBeta = process.argv.includes('--beta');
const branch = isBeta ? 'beta' : 'stable';

function fileRelease(platform) {
  const list = Object.keys(platform.processors).join(' ');
  return (
    `APT::FTPArchive::Release::Codename "${branch}";` + '\n' +
    'APT::FTPArchive::Release::Components "main";' + '\n' +
    'APT::FTPArchive::Release::Label "APT Repository";' + '\n' +
    `APT::FTPArchive::Release::Architectures "${list}";`
  );
}

module.exports = fileRelease;