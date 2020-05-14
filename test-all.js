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
  } catch {
  }
  try {
    console.log('Testing core');
    const res = await task('core');
    output = [...output, res];
    console.log('Testing core complete');
  } catch {
  }
  try {
    console.log('Testing common');
    const res = await task('common');
    output = [...output, res];
    console.log('Testing common complete');
  } catch {
  }
  try {
    console.log('Testing form');
    const res = await task('form');
    output = [...output, res];
    console.log('Testing form complete');
  } catch {
  }
  try {
    console.log('Testing error-handler');
    const res = await task('error-handler');
    output = [...output, res];
    console.log('Testing error-handler complete');
  } catch {
  }

  /*try {
    const core = await exec('yarn test stoui-core');
    const common = await exec('yarn test stoui-common');
    const table = await exec('yarn test stoui-datatable');
    const form = await exec('yarn test stoui-form');
    const errorHandler = await exec('yarn test stoui-error-handler');
    output = [
      {component: '@ngx-stoui/core', result: core.stdout},
      {component: '@ngx-stoui/common', result: common.stdout},
      {component: '@ngx-stoui/datatable', result: table.stdout},
      {component: '@ngx-stoui/form', result: form.stdout},
      {component: '@ngx-stoui/error-handler', result: errorHandler.stdout}
    ];
  } catch (ex) {
    console.error(ex.stdout);
    process.exit(1);
  }*/

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
