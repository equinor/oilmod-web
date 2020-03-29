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

  let output;

  console.log('Running tests...');
  try {
    /*    const coreCommon = await Promise.all([exec('yarn test stoui-core'), exec('yarn test stoui-common')]);
        const tableForm = await Promise.all([exec('yarn test stoui-datatable'), exec('yarn test stoui-form')]);
        const errorHandler = await exec('yarn test stoui-error-handler');*/
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
  }

  console.log('Test suite completed OK, see results below!');
  output.forEach(op => {
    console.log('------------------------------------');
    console.log(`Results for ${op.component}`);
    console.log(op.result);
  });
})();
