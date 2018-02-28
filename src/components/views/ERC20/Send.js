import { ETH } from '/api/Coins'
import { bigNumber } from '/api/numbers'
import Send from '/components/views/BTC/Send'
import state from '/store/state'
import { fetchBalance } from '/store/actions'

export default class SendERC20 extends Send {
    getMax() {
        const max = bigNumber(this.balance)
        return max.gt(0) ? max : 0
    }

    fetchBalance() {
        fetchBalance(this.asset_id).then(balance => {
            this.balance = bigNumber(balance)
        })
        ETH.fetchBalance(this.asset.address).then(balance => {
            this.balance_fee = bigNumber(balance)
        })
    }

    // get isEnoughBalance() {
    //     return (
    //         this.amount.lte(this.getMax()) && this.fee.lt(this.ethereum_balance)
    //     )
    // }
}
