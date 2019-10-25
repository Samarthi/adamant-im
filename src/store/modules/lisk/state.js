import { Cryptos } from '@/lib/constants'
import baseState from '../btc-base/btc-base-state'

export default () => ({
  ...baseState(),
  crypto: Cryptos.LSK
})
