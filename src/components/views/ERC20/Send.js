import { bigNumber } from '/api/numbers'
import Send from '/components/views/BTC/Send'

export default class SendERC20 extends Send {
    getMax() {
        const max = bigNumber(this.asset.balance)
        return max.gt(0) ? max : 0
    }
}
