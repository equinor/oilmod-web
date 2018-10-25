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
  await build('stoui-core');
  await runGulpTask();
  await buildOthers();
  await buildLast();
  await sharedFormCss();
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
  if (stderr) {
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
