import React, { Component } from 'react'
import { createObserver } from 'dop'
import styled from 'styled-components'
import styles from '/styles'

import state from '/stores/state'

import Wallet from '/components/partials/Wallet'



export default class Wallets extends Component {
    
        componentWillMount() {
            this.observer = createObserver(mutations => this.forceUpdate());
            this.observer.observe(state.wallets.BTC);
        }
        componentWillUnmount() {
            this.observer.destroy()
        }
        shouldComponentUpdate() {
            return false
        }
    

    
        render() {
            const wallets = []

            Object.keys(state.wallets).forEach(crypto=>{
                Object.keys(state.wallets[crypto]).forEach(address=>{
                    wallets.push({
                        type: crypto,
                        address: address,
                        wallet: state.wallets[crypto][address]
                    })
                })
            })

            return React.createElement(WalletsTemplate, {
                wallets: wallets
            })
        }
    }


function WalletsTemplate({ wallets }) {
    return <div>
        {wallets.map(wallet => <Wallet wallet={wallet} />)}
    </div>
}



