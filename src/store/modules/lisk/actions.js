import LiskApi from '@/lib/lisk-api'
import baseActions from '../btc-base/btc-base-actions'

/**
 * Fetches Lisk transactions. Paging is not supported at the moment.
 *
 * @param {LiskApi} api API client
 * @param {*} context Vuex context
 */
const getTransactions = (api, context) => {
  const excludes = Object.keys(context.state.transactions)

  return api.getTransactions({ excludes }).then(r => {
    context.commit('transactions', r.items)
    context.commit('bottom')
  })
}

export default {
  ...baseActions({
    apiCtor: LiskApi,
    getNewTransactions: getTransactions,
    getOldTransactions: getTransactions
  })
}
