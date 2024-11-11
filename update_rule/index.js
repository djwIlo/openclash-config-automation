const AIRPORT_CONFIG = require('../base_config/base_config');
const listenProxy = require('./listenProxy')

const listenRulesSeller = async () => {
  console.log('rule');
  await listenProxy()
}

module.exports = listenRulesSeller;