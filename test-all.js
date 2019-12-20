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
    const coreCommon = await Promise.all([exec('yarn test stoui-core'), exec('yarn test stoui-common')]);
    const tableForm = await Promise.all([exec('yarn test stoui-datatable'), exec('yarn test stoui-form')]);
    output = [
      {component: '@ngx-stoui/core', result: coreCommon[0].stdout},
      {component: '@ngx-stoui/common', result: coreCommon[1].stdout},
      {component: '@ngx-stoui/datatable', result: tableForm[0].stdout},
      {component: '@ngx-stoui/form', result: tableForm[1].stdout},
    ];
  } catch (ex) {
    console.error(ex);
    throw new Error('There were errors executing the test suite');
  }

  console.log('Test suite completed OK, see results below!');
  output.forEach(op => {
    console.log('------------------------------------');
    console.log(`Results for ${op.component}`);
    console.log(op.result);
  });
})();
