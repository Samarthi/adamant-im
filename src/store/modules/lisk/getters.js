import { TX_FEE } from '@/lib/lisk-api'
import baseGetters from '../btc-base/btc-base-getters'

export default {
  ...baseGetters,
  fee: () => TX_FEE
}
