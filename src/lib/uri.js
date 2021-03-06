import { isValidAddress } from 'ethereumjs-util'
import { Cryptos, isErc20,
  RE_BTC_ADDRESS, RE_DASH_ADDRESS, RE_DOGE_ADDRESS, RE_LISK_ADDRESS
} from './constants'

/**
 * Get an ADAMANT URI
 * Complies with AIP-2, AIP-8, AIP-9
 * @returns {string}
 */
export function getURI () {
  let aip2 = ''

  if (process.env.IS_ELECTRON) {
    const { remote } = require('electron')
    const args = remote.getGlobal('process').argv

    aip2 = args.find(v => /^adm:U[0-9]{6,}/.test(v)) || ''
  }

  return aip2 || document.URL
}

/**
 * Parse info from an URI containing a cryptocurrency address
 * Complies with AIP-2, AIP-8, AIP-9
 * @param {string} uri URI
 * @returns {
 *   {
 *     address: string,
 *     crypto: string,
 *     params: Object<string, string>,
       protocol: string
 *   }
 * }
 */
export function parseURI (uri = getURI()) {
  const [origin, query = ''] = uri.split('?')
  let address = ''
  let crypto = ''
  let params = Object.create(null)
  let protocol = ''

  if (query) {
    params = query.split('&').reduce((accum, param) => {
      const [key, value = ''] = param.split('=')

      return key && value ? {
        ...accum,
        [key]: window.decodeURIComponent(
          value.includes('+') ? value.replace(/\+/g, ' ') : value
        )
      } : accum
    }, Object.create(null))
  }
  if (origin.includes(':')) {
    [protocol, address] = origin.split(':')
    if (protocol === 'ethereum') {
      crypto = Cryptos.ETH
    } else if (/^https?$/.test(protocol)) {
      crypto = Cryptos.ADM
      address = params.address; delete params.address
    } else if (Cryptos.hasOwnProperty(protocol.toUpperCase())) {
      crypto = protocol.toUpperCase()
    }
  } else {
    address = origin
    if (RE_BTC_ADDRESS.test(address)) {
      crypto = Cryptos.BTC
    } else if (RE_DASH_ADDRESS.test(address)) {
      crypto = Cryptos.DASH
    } else if (RE_DOGE_ADDRESS.test(address)) {
      crypto = Cryptos.DOGE
    } else if (isValidAddress(address)) {
      crypto = Cryptos.ETH
    } else if (RE_LISK_ADDRESS.test(address)) {
      crypto = Cryptos.LISK
    }
  }

  return { address, crypto, params, protocol }
}

/**
 * Generate a cryptocurrency URI
 * Complies with AIP-8, AIP-9
 * @param {string} address Cryptocurrency address
 * @param {string} name ADAMANT contact name
 * @returns {string}
 */
export function generateURI (crypto = Cryptos.ADM, address, name) {
  if (crypto === Cryptos.ADM) {
    const label = name ? '&label=' + window.encodeURIComponent(name) : ''

    return `${window.location.origin}?address=${address}${label}`
  }
  if (crypto === Cryptos.BTC) {
    return `bitcoin:${address}`
  }
  if (crypto === Cryptos.ETH || isErc20(crypto)) {
    return `ethereum:${address}`
  }

  return `${crypto.toLowerCase()}:${address}`
}
