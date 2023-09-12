const TEMP_DIR_NAME = 'temp';
const DEB_REPO_DIR = '@repositories/deb';
const REPO_DIR_NAME2 = 'repository3';
const DEB_URL = 'http://deb.ih-systems.com'
const RPM_URL = 'http://rpm.ih-systems.com'

const VERSION_EMPTY = '5.11.12';

const PRODUCT_SITES = {
  intrahouse: 'intrahouse.ru',
  intrascada: 'intrascada.com',
};

const PRODUCT_DESCRIPTIONS = {
  intrahouse: 'Software platform\n for Smart Home systems',
  intrascada: 'Open and scalable platform\n for industrial monitoring and control systems',
};
const PRODUCT_DESCRIPTIONS2 = {
  intrahouse: 'IntraHouse is a software platform for Smart Home systems that allows you to combine all the devices and equipment of your home for their smooth and economical functioning',
  intrascada: 'IntraSCADA is a universal and flexible software platform for creating professional automation and monitoring systems.\nIntraSCADA is a new generation of software that combines proven HMI / SCADA capabilities used by thousands of organizations around the world with new advanced features that deliver the best results.\nThe IntraSCADA system is developed on the basis of modern web technologies. Powerful configuration tools and rich visualization capabilities make it easy to develop projects of any size and complexity.',
};

const PRODUCT_TELEGRAM = {
  intrahouse: 'https://t.me/intraHouse',
  intrascada: 'https://t.me/IntraSCADA',
}

module.exports = {
  TEMP_DIR_NAME,
  DEB_REPO_DIR,
  REPO_DIR_NAME2,
  DEB_URL,
  RPM_URL,
  VERSION_EMPTY,
  PRODUCT_SITES,
  PRODUCT_DESCRIPTIONS,
  PRODUCT_DESCRIPTIONS2,
  PRODUCT_TELEGRAM
}