import { ETH } from '/api/Coins'
import { bigNumber } from '/api/numbers'
import Send from '/components/views/BTC/Send'
import state from '/store/state'

export default class SendERC20 extends Send {
    getMax() {
        const max = bigNumber(this.balance)
        return max.gt(0) ? max : 0
    }

    fetchRecomendedFee() {
        ETH.fetchBalance(this.asset.address).then(balance => {
            this.balance_fee = balance
            return this.Coin.fetchRecomendedFee(this.asset.address).then(
                fee => {
                    state.view.fee_input = this.fee_recomended = bigNumber(fee)
                }
            )
        })
    }

    // get isEnoughBalance() {
    //     return (
    //         this.amount.lte(this.getMax()) && this.fee.lt(this.ethereum_balance)
    //     )
    // }
}
