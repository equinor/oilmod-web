const util = require('util');
const path = require('path');
const exec = util.promisify(require('child_process').exec);

const others = [
  'stoui-common',
  'stoui-datatable',
  'stoui-drawer',
  'stoui-error-handler',
  'stoui-form',
  'stoui-quick-view',
];

const last = [
  'stoui-unsaved-changes',
];

runner()
  .catch(console.error);

async function runner() {
  await bumpVersions();
  /*  await build('stoui-core');
    await runGulpTask();
    await buildOthers();
    await buildLast();
    await sharedFormCss();*/
}

async function bumpVersions() {
  const shouldBump = process.argv.includes('--bump');
  if (shouldBump) {
    const i = process.argv.indexOf('--bump');
    const type = process.argv[i + 1];
    if (!['major', 'minor', 'patch'].includes(type)) {
      throw new Error(`Invalid version bump. Expected 'major', 'minor', 'patch' but got ${type}`);
    }
    return await Promise.all(['stoui-core', ...others, ...last].map(lib => bumpLib(lib, type)));
  }
  return true;
}

async function bumpLib(lib, increment) {
  console.log(`Bumping ${lib} by one ${increment}`);
  const {stdout, stderr} = await exec(`cd ${path.join(__dirname, 'projects', lib)} && yarn version --no-git-tag-version --${increment} && cd ${__dirname}`);
  if (stderr) {
    console.error(`Failed bumping ${lib}`);
    console.error(`Stacktrace: `, stderr);
    throw new Error('Exiting due to build failure');
  }
  console.log(stdout);
  return true;
}

async function buildOthers() {
  return await Promise.all(others.map(async project => await build(project)));
}

async function buildLast() {
  return await Promise.all(last.map(async project => await build(project)));
}

async function sharedFormCss() {
  return await runGulpTask('sass:form');
}

async function build(lib) {
  console.log(`Building ${lib}...`);
  const {stdout, stderr} = await exec(`${path.normalize('./node_modules/.bin/ng')} build ${lib}`);
  if (stderr && !/caniuse/.test(stderr)) {
    console.error(`Failed building ${lib}`);
    console.error(`Stacktrace: `, stderr);
    throw new Error('Exiting due to build failure');
  }
  console.log(`Successfully built ${lib}`);
  return true;
}

async function runGulpTask(taskName) {
  const {stdout, stderr} = await exec(`${path.normalize('./node_modules/.bin/gulp')} ${taskName || ''}`);
  if (stderr) {
    console.error(`Failed building executing gulp task`);
    console.error(`Stacktrace: `, stderr);
    throw new Error('Exiting due to build failure');
  }
  console.log(stdout);
  return true;
}
