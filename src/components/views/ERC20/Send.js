import { ETH } from '/api/Coins'
import { bigNumber } from '/api/numbers'
import Send from '/components/views/BTC/Send'
import state from '/store/state'
import { fetchBalance } from '/store/actions'

export default class SendERC20 extends Send {
    fetchBalance() {
        fetchBalance(this.asset_id).then(balance => {
            this.balance = bigNumber(balance)
        })
        ETH.fetchBalance(this.asset.address).then(balance => {
            this.balance_fee = bigNumber(balance)
        })
    }

    get getTotal() {
        return this.amount
    }

    get getMax() {
        return this.balance
    }
}
