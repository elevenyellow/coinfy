import { bigNumber, hexToDec } from '/api/numbers'
import { padLeft } from '/api/strings'
// import JSONRpc from '/api/jsonrpc'
import { sortBy } from '/api/arrays'
import {
    symbol,
    url,
    api_url,
    api_key,
    url_myetherapi,
    removeHexPrefix,
    fetchBalance,
    fetchRecomendedFee as fetchRecomendedFeeRaw,
    createSimpleTx
} from '/api/coins/ETH'
import { TYPE_ERC20 } from '/const/'

export {
    isAddress,
    isAddressCheck,
    isPrivateKey,
    isPrivateKeyCheck,
    getAddressFromPrivateKey,
    ascii,
    format,
    encryptPrivateKey,
    decryptPrivateKey,
    encryptSeed,
    decryptSeed,
    decryptPrivateKeyFromSeed,
    urlInfoTx,
    fetchBalance,
    getSendProviders,
    urlDecodeTx,
    getWalletFromSeed,
    formatAddress,
    cutDecimals
} from './ETH' // '/api/coins/ETH' not working

export const type = TYPE_ERC20
export const symbol_fee = symbol
export const default_gas_limit = 130000

export function urlInfoRaw(address, handler) {
    return `${url}/token/${handler}?a=${address}`
}

export function fetchRecomendedFee(props) {
    // return Promise.resolve('0.0001')
    props.gas_limit = default_gas_limit
    return fetchRecomendedFeeRaw(props)
}

export function createSimpleTxRaw(params, contract_address, coin_decimals) {
    const value = padLeft(
        params.amount.times(bigNumber(10).pow(coin_decimals)).toString(16),
        64
    )
    params.data = `0xa9059cbb${padLeft(
        removeHexPrefix(params.toAddress),
        64
    )}${value}`
    params.gas_limit = default_gas_limit
    params.toAddress = contract_address
    params.amount = bigNumber(0)
    return createSimpleTx(params)
}

export function fetchSummary(address, contract_address, satoshis) {
    const totals = {}
    return fetchBalance(address, contract_address, satoshis)
        .then(balance => {
            totals.balance = balance
            return fetchTxs(
                address,
                undefined,
                undefined,
                contract_address,
                satoshis
            )
        })
        .then(txs => Object.assign(txs, totals))
}

const txs_cache = {}
export function fetchTxs(
    address,
    from = 0,
    to = from + 100,
    contract_address,
    _satoshis
) {
    const unique_index = contract_address + address
    const address64 = `0x000000000000000000000000${removeHexPrefix(
        address
    )}`.toLowerCase()
    let raw_txs = []
    const resolver =
        from > 0 && txs_cache[unique_index] !== undefined
            ? Promise.resolve(txs_cache[unique_index])
            : fetch(
                  `${api_url}?module=logs&action=getLogs&fromBlock=0&toBlock=latest&address=${contract_address}&topic0=0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef&topic1=${address64}&apikey=${api_key}`
              )
                  .then(response => response.json())
                  .then(json => (raw_txs = raw_txs.concat(json.result)))
                  .then(() =>
                      fetch(
                          `${api_url}?module=logs&action=getLogs&fromBlock=0&toBlock=latest&address=${contract_address}&topic0=0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef&topic2=${address64}&apikey=${api_key}`
                      )
                  )
                  .then(response => response.json())
                  .then(json => raw_txs.concat(json.result))

    return resolver.then(raw_txs => {
        txs_cache[unique_index] = raw_txs

        const data = {
            totalTxs: raw_txs.length,
            txs: []
        }

        // console.log(2, raw_txs)
        raw_txs.forEach(txRaw => {
            let tx = {
                txid: txRaw.transactionHash,
                fees: bigNumber(hexToDec(txRaw.gasUsed)),
                time: hexToDec(txRaw.timeStamp),
                value: bigNumber(hexToDec(removeHexPrefix(txRaw.data)))
                    .div(_satoshis)
                    .toString()
            }
            if (txRaw.topics[1].toLowerCase() === address64)
                tx.value = '-' + tx.value

            data.txs.push(tx)
        })

        sortBy(data.txs, '-time')

        return data
    })
}

// var value = ethFuncs.padLeft(
//     new BigNumber(value)
//         .times(new BigNumber(10).pow(this.getDecimal()))
//         .toString(16),
//     64
// )
// var toAdd = ethFuncs.padLeft(ethFuncs.getNakedAddress(toAdd), 64)
// var data = Token.transferHex + toAdd + value

// // https://tokenstandard.codetract.io/
// const instruction_getbalance = '0x70a08231'
// const instruction_transfer = '0xa9059cbb'

// function getBalance(address, contract_address) {
//     return JSONRpc(url_myetherapi, 'eth_call', [
//         {
//             to: contract_address,
//             data: `${instruction_transfer}${padLeft(
//                 removeHexPrefix(address),
//                 64
//             )}`
//         },
//         '0x00'
//     ])
//         .then(response => response.json())
//         .then(response => {
//             console.log(
//                 response,
//                 // bigNumber(response.result)
//                 //     .div(bigNumber(10).pow(18))
//                 //     .toString()
//             )
//         })
// }

// getBalance(
//     '0x6a4669e9cc75b1a1d53990f291c82ff45076310c',
//     '0x960b236a07cf122663c4303350609a66a7b288c0'
// )
