import { ETH } from '/api/coins'
import { bigNumber } from '/api/numbers'
import Send from '/components/views/BTC/Send'
import state from '/store/state'
import { fetchBalance } from '/store/actions'

export default class SendERC20 extends Send {
    fetchBalance() {
        fetchBalance(this.asset_id).then(balance => {
            state.view.balance = bigNumber(balance)
        })
        ETH.fetchBalance(this.asset.address).then(balance => {
            state.view.balance_fee = bigNumber(balance)
        })
    }

    get getTotal() {
        return state.view.amount
    }

    get getMax() {
        return state.view.balance
    }
}
