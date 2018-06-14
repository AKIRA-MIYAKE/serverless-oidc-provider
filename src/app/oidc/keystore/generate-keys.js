const { promisify } = require('util')
const fs = require('fs')
const path = require('path')
const { createKeyStore } = require('oidc-provider')

const generateKeys = () => {
  const keystore = createKeyStore()

  return Promise.all([['RSA', 2048], ['EC', 'P-256'], ['EC', 'P-384'], ['EC', 'P-521']]
    .map(([v0, v1]) => keystore.generate(v0, v1)))
    .then(() => promisify(fs.writeFile)(
      path.resolve(__dirname, './keystore.json'),
      JSON.stringify(keystore.toJSON(true), null, 2)
    ))
}

generateKeys()
  .then(() => console.log('Generate complete.'))
  .catch(console.error)
