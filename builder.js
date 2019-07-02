const util = require('util');
const path = require('path');
const exec = util.promisify(require('child_process').exec);
const fs = require('fs');
const stat = util.promisify(fs.stat);

const projects = {
  common: {
    name: 'stoui-common',
    order: 1,
  },
  core: {
    name: 'stoui-core',
    order: 0,
    extra: async () => await runGulpTask(),
  },
  datatable: {
    name: 'stoui-datatable',
    order: 1,
    extra: async () => await sharedFormCss(),
  },
  drawer: {
    name: 'stoui-drawer',
    order: 1,
  },
  'error-handler': {
    name: 'stoui-error-handler',
    order: 1,
  },
  form: {
    name: 'stoui-form',
    order: 1,
    extra: async () => await sharedFormCss(),
  },
  'quick-view': {
    name: 'stoui-quick-view',
    order: 1,
  },
  'unsaved-changes': {
    name: 'stoui-unsaved-changes',
    order: 2,
  },
};

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


async function buildOne(projectName) {
  if (projectName !== 'core') {
    await hasCore();
  }
  const project = projects[projectName];
  if (!project) {
    throw new Error(`${projectName} is not a valid project`);
  }
  await bumpVersions(project.name);
  await build(project.name);
  if (project.extra) {
    await project.extra();
  }
}

async function hasCore() {
  const corePath = path.join(__dirname, 'dist', 'stoui-core');
  let hasCore = true;
  try {
    await stat(corePath);
  } catch {
    hasCore = false;
    console.log('Missing core, will be built first..');
  }
  if (!hasCore) {
    await buildOne('core');
  }
}

async function buildAll() {
  await bumpVersions();
  await build('stoui-core');
  await runGulpTask();
  await buildOthers();
  await buildLast();
  await sharedFormCss();
}

async function runner() {
  const args = process.argv;
  if (args.includes('--project')) {
    const i = args.indexOf('--project');
    const project = args[i + 1];
    if (project === 'ALL') {
      await buildAll();
    } else {
      await buildOne(project);
    }
  } else {
    await buildAll();
  }
}

async function bumpVersions(project) {
  const shouldBump = process.argv.includes('--bump');
  if (shouldBump) {
    const i = process.argv.indexOf('--bump');
    const type = process.argv[i + 1];
    if (!['major', 'minor', 'patch'].includes(type)) {
      throw new Error(`Invalid version bump. Expected 'major', 'minor', 'patch' but got ${type}`);
    }
    if (project) {
      return await bumpLib(project, type);
    } else {
      return await Promise.all(['stoui-core', ...others, ...last].map(lib => bumpLib(lib, type)));
    }
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
