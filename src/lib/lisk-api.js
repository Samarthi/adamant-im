import { APIClient } from '@liskhq/lisk-client'
import BtcBaseApi from './bitcoin/btc-base-api'
import { Cryptos } from './constants'
import config from '@/config'

const nodes = config.server.lisk.map(p => p.url)

export const TX_FEE = 0.0001

export default class LiskApi extends BtcBaseApi {
  constructor (passphrase) {
    super(Cryptos.LSK, passphrase)
  }

  /**
   * @override
   */
  getBalance () {
    return this._invoke(`/addr/${this.address}/balance`)
    // .then(balance => Number(balance) / this.multiplier)
  }

  /** @override */
  getFee () {
    return TX_FEE
  }

  /** @override */
  sendTransaction (txHex) {
    // return this._post('/tx/send', { rawtx: txHex }).then(res => res.txid)
  }

  /** @override */
  getTransaction (txid) {
    // return this._get(`tx/${txid}`).then(tx => this._mapTransaction(tx))
  }

  /** @override */
  getTransactions ({ from = 0 }) {
    /* const to = from + CHUNK_SIZE
    return this._get(`/addrs/${this.address}/txs`, { from, to })
      .then(resp => ({
        ...resp,
        hasMore: to < resp.totalItems,
        items: resp.items.map(tx => this._mapTransaction(tx))
      })) */
  }

  /** @override */
  _getUnspents () {
    /* return this._get(`/addr/${this.address}/utxo?noCache=1`)
      .then(unspents => unspents.map(tx => ({
        ...tx,
        amount: new BigNumber(tx.amount).times(this.multiplier).toNumber()
      }))) */
  }

  /** Executes a GET request to the DOGE API */
  _get (url, params) {
    // return this._getClient().get(url, params).then(response => response.data)
  }

  /** Executes a POST request to the DOGE API */
  _post (url, data) {
    // return this._getClient().post(url, qs.stringify(data), POST_CONFIG).then(response => response.data)
  }

  /** Picks a client for a random API endpoint */
  _getClient () {
    // const client = new APIClient(nodes)
    const client = APIClient.createTestnetAPIClient()

    return client
  }

  /**
   * Invokes Lisk JSON-RPC method.
   * @param {string} method method name
   * @param {object | Array<any>} params method params
   * @returns {Promise<any>} method result
   */
  _invoke (method, params) {
    return this._getClient().blocks
      .get({ blockId: '17572751491778765213' })
      .then(r => {
        console.log(r.data)
      })
  }
}
