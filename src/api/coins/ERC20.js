import { bigNumber, formatCoin } from '/api/numbers'
import { sortBy } from '/api/arrays'
import { TYPE_ERC20, ASSET_LOGO, MAINNET, TESTNET } from '/const/'
import { padLeft } from '/api/strings'
import {
    hexToDec,
    hexToAscii,
    decodeSolidityString,
    removeHexPrefix
} from '/api/hex'

import {
    symbol as symbol_fee,
    api_key,
    fetchBalance,
    fetchRecomendedFee,
    createSimpleTx,
    isAddress,
    isPrivateKey,
    getAddressFromPrivateKey,
    ascii,
    format,
    encryptPrivateKey,
    decryptPrivateKey,
    encryptSeed,
    decryptSeed,
    decryptPrivateKeyFromSeed,
    decryptWalletFromSeed,
    urlInfoTx,
    getSendProviders,
    urlDecodeTx,
    getWalletFromSeed,
    getWalletsFromSeed,
    formatAddress,
    cutDecimals,
    getDataContractMethodCall,
    discoverAddress,
    discoverWallet,
    multiaddress,
    changeaddress,
    getNextWalletFromSeed,
    networks,
    derivation_path
} from '/api/coins/ETH'
import { addHexPrefix } from './ETH'

// export const networks = {
//     [MAINNET]: {
//         // mainnet
//         api_url: 'https://api.etherscan.io/api',
//         url: 'https://etherscan.io',
//         url_myetherapi: 'https://api.myetherapi.com/eth'
//     },
//     [TESTNET]: {
//         // mainnet
//         api_url: 'https://ropsten.etherscan.io/api',
//         url: 'https://ropsten.etherscan.io',
//         url_myetherapi: 'https://api.myetherapi.com/rop'
//     }
// }

let network_id, url, url_myetherapi, api_url

export function createERC20({
    symbol,
    name,
    color,
    contract_address,
    labels,
    coin_decimals = 18,
    price_decimals = 2,
    logo = ASSET_LOGO(symbol),
    custom = false,
    networks_availables = [MAINNET, TESTNET]
}) {
    const default_gas_limit = 130000
    const txs_cache = {}
    const satoshis = Math.pow(10, coin_decimals)

    return {
        setupNetwork: function(id, networks) {
            const network_data = networks[id]
            if (typeof network_data !== 'undefined') {
                network_id = id
                api_url = network_data.api_url
                url = network_data.url
                url_myetherapi = network_data.url_myetherapi
                return true
            }
            return false
        },

        urlInfo: function(address) {
            return `${url}/token/${contract_address}?a=${address}`
        },

        format: function(value, decimals = coin_decimals) {
            return formatCoin(value, decimals, symbol)
        },

        fetchBalance: function(address) {
            return fetchBalance(address, contract_address, satoshis)
        },

        discoverAddress: function({ seed, index }) {
            return discoverAddress({
                seed,
                contract_address,
                satoshis,
                index
            })
        },

        discoverWallet: function({ seed }, onDiscoverAddress) {
            return discoverWallet(
                {
                    seed,
                    contract_address,
                    satoshis
                },
                onDiscoverAddress
            )
        },

        fetchTxs: function(addresses, from = 0, to = from + 100) {
            const address = addresses[0]
            const unique_index = contract_address + address
            const address64 = addHexPrefix(
                padLeft(removeHexPrefix(address), 64)
            )
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
                            .div(satoshis)
                            .toFixed()
                    }
                    if (txRaw.topics[1].toLowerCase() === address64)
                        tx.value = '-' + tx.value

                    data.txs.push(tx)
                })

                sortBy(data.txs, '-time')

                return data
            })
        },

        createSimpleTx: function(params) {
            params.data = getDataContractMethodCall(
                'transfer(address,uint256)',
                params.to_address,
                bigNumber(params.amount)
                    .times(bigNumber(10).pow(coin_decimals))
                    .toString(16)
            )
            params.gas_limit = default_gas_limit
            params.to_address = contract_address
            params.amount = bigNumber(0)
            return createSimpleTx(params)
        },

        fetchRecomendedFee: function(props) {
            // return Promise.resolve('0.0001')
            props.gas_limit = default_gas_limit
            return fetchRecomendedFee(props)
        },

        networks,
        networks_availables,
        custom,
        logo: logo,
        symbol,
        name,
        color,
        labels,
        type: TYPE_ERC20,
        symbol_fee,
        derivation_path,
        coin_decimals,
        price_decimals,
        satoshis,
        removeHexPrefix,
        isAddress,
        isPrivateKey,
        getAddressFromPrivateKey,
        ascii,
        encryptPrivateKey,
        decryptPrivateKey,
        encryptSeed,
        decryptSeed,
        decryptPrivateKeyFromSeed,
        decryptWalletFromSeed,
        getSendProviders,
        urlDecodeTx,
        getWalletFromSeed,
        getWalletsFromSeed,
        formatAddress,
        cutDecimals,
        urlInfoTx,
        multiaddress,
        changeaddress,
        getNextWalletFromSeed
    }
}

// https://tokenstandard.codetract.io/
export function ethCall(contract_address, data) {
    return fetch(
        `${api_url}?module=proxy&action=eth_call&to=${contract_address}&data=${data}`
    )
        .then(response => response.json())
        .then(
            json =>
                json.error || json.result === '0x'
                    ? null
                    : removeHexPrefix(json.result)
        )
}

export function getNameContract(contract_address) {
    const data = getDataContractMethodCall('name()')
    return ethCall(contract_address, data).then(result_hex => {
        return result_hex ? decodeSolidityString(result_hex) : null
    })
}

export function getSymbolContract(contract_address) {
    const data = getDataContractMethodCall('symbol()')
    return ethCall(contract_address, data).then(result_hex => {
        return result_hex ? decodeSolidityString(result_hex) : null
    })
}

export function getDecimalsContract(contract_address) {
    const data = getDataContractMethodCall('decimals()')
    return ethCall(contract_address, data).then(result_hex => {
        return result_hex ? hexToDec(result_hex) : null
    })
}

export function getSupplyContract(contract_address) {
    const data = getDataContractMethodCall('totalSupply()')
    return ethCall(contract_address, data).then(result_hex => {
        return result_hex ? hexToDec(result_hex) : null
    })
}

export function isErc20Contract(contract_address) {
    const url = `${api_url}?module=contract&action=getabi&address=${contract_address}`
    return fetch(url)
        .then(response => response.json())
        .then(data => data.status === '1')
}
