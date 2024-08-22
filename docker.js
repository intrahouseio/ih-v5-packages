const fs = require('fs-extra');
const spawn = require('child_process').spawn;

const versions = (JSON.parse(fs.readFileSync('@repositories/deb/versions', 'utf8')));

function cmd(txt) {
  return new Promise((resolve, reject) => {
    const args = txt.split(' ');
    const cp = spawn(args[0], args.slice(1), { stdio: 'inherit' });
  
    cp.on('exit', function(code) {
      resolve();
    });
  });
}

async function main() {
  const products = ['intrascada', 'intrahouse'];
  const variants = ['debian_amd64'];


  for (const product of products) {
    for (const variant of variants) {
      const item = versions[product][variant];
      console.log('-----------' + product + '-----------' );
      await cmd(`docker buildx build --no-cache --push --platform linux/amd64,linux/arm64,linux/arm/v7 -t ihsystems/${product}:v${item.version} -t ihsystems/${product}:latest -f Dockerfile_${product} .`)
    }
  }

  console.log('Complete!')
}

main();

