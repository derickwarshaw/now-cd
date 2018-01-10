#!/usr/bin/env node

let { event, repo, branch } = require('ci-env')

/* debug statements */
// repo = 'siddharthkp/now-cd-test'
// branch = 'feature'
/* end */

const deploy = require('./deploy')
const { getAlias, setAlias } = require('./alias')
const remove = require('./remove')

const authorAndRepo = repo.replace('/', '-') // repo ~ siddharthkp/ci-env

/* alias according to branch name */
let alias
if (branch === 'master') alias = `${authorAndRepo}.now.sh`
else alias = `${authorAndRepo}-${branch}.now.sh`

const run = async alias => {
  /* Step 1: Deploy to a new instance */
  const newInstance = await deploy()
  /* Step 2: Get the old deployment instance for this alias */
  const oldInstance = await getAlias(alias)
  /* Step 3: Map the alias to new instance */
  await setAlias(newInstance, alias)
  /* Step 4: If it exists, delete the old instance */
  if (oldInstance && newInstance !== oldInstance) await remove(oldInstance)
}

try {
  run(alias)
} catch (err) {
  console.log(err)
}

/* Catch errors throughout the app for debugging */
process.on('unhandledRejection', err => {
  console.log('unhandledRejection', err)
  process.exit(1)
})