const execCb = require('child_process').exec;
const promisify = require('util').promisify;

const exec = promisify(execCb);

(async () => {
  const buildDeps = process.argv.includes('--ci');
  if (buildDeps) {
    console.log('Building core & form');
    await exec('node builder.js --project core');
    await exec('node builder.js --project form');
  } else {
    console.log('--ci not present, skip pre-requisite build.')
  }

  let output = [];

  console.log('Running tests...');
  try {
    console.log('Testing datatable');
    const res = await task('datatable');
    output = [...output, res];
    console.log('Testing datatable complete');
  } catch (ex) {
    console.log('Datatable test failures');
    console.error(ex);
    process.exit(1);
  }
  try {
    console.log('Testing core');
    const res = await task('core');
    output = [...output, res];
    console.log('Testing core complete');
  } catch (ex) {
    console.log('Core test failures');
    console.error(ex);
    process.exit(1);
  }
  try {
    console.log('Testing common');
    const res = await task('common');
    output = [...output, res];
    console.log('Testing common complete');
  } catch (ex) {
    console.log('Common test failures');
    console.error(ex);
    process.exit(1);
  }
  try {
    console.log('Testing form');
    const res = await task('form');
    output = [...output, res];
    console.log('Testing form complete');
  } catch (ex) {
    console.log('Form test failures');
    console.error(ex);
    process.exit(1);
  }
  try {
    console.log('Testing error-handler');
    const res = await task('error-handler');
    output = [...output, res];
    console.log('Testing error-handler complete');
  } catch (ex) {
    console.log('Error handler test failures');
    console.error(ex);
    process.exit(1);
  }

  console.log('Test suite completed OK, see results below!');
  output.forEach(op => {
    console.log('------------------------------------');
    console.log(`Results for ${op.component}`);
    console.log(op.result);
  });
})();

async function task(project) {
  const run = await exec(`yarn test stoui-${project}`)
  return {component: `@ngx-stoui/${project}`, result: run.stdout};
}
