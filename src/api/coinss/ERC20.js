import { bigNumber, formatCoin } from '/api/numbers'
import { sortBy } from '/api/arrays'
import { TYPE_ERC20, ASSET_LOGO } from '/const/'
import { padLeft } from '/api/strings'
import {
    hexToDec,
    hexToAscii,
    decodeSolidityString,
    removeHexPrefix
} from '/api/hex'
import {
    symbol as symbol_fee,
    url,
    api_url,
    api_key,
    url_myetherapi,
    fetchBalance,
    fetchRecomendedFee,
    createSimpleTx,
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
    getSendProviders,
    urlDecodeTx,
    getWalletFromSeed,
    formatAddress,
    cutDecimals,
    getDataContractMethodCall
} from '/api/coins/ETH'
import { addHexPrefix } from './ETH'

export function createERC20({
    symbol,
    name,
    color,
    contract_address,
    labels,
    coin_decimals = 18,
    price_decimals = 2,
    logo = ASSET_LOGO(symbol)
}) {
    const default_gas_limit = 130000
    const txs_cache = {}
    const satoshis = Math.pow(10, coin_decimals)

    return {
        urlInfo: function(address) {
            return `${url}/token/${contract_address}?a=${address}`
        },

        format: function(value, decimals = coin_decimals) {
            return formatCoin(value, decimals, symbol)
        },

        fetchBalance: function(address) {
            return fetchBalance(address, contract_address, satoshis)
        },

        fetchSummary: function(address) {
            const totals = {}
            return fetchBalance(address, contract_address, satoshis)
                .then(balance => {
                    totals.balance = balance
                    return this.fetchTxs(
                        address,
                        undefined,
                        undefined,
                        contract_address,
                        satoshis
                    )
                })
                .then(txs => Object.assign(txs, totals))
        },

        fetchTxs: function(address, from = 0, to = from + 100) {
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
                            .toString()
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
                params.toAddress,
                params.amount
                    .times(bigNumber(10).pow(coin_decimals))
                    .toString(16)
            )
            params.gas_limit = default_gas_limit
            params.toAddress = contract_address
            params.amount = bigNumber(0)
            return createSimpleTx(params)
        },

        fetchRecomendedFee: function(props) {
            // return Promise.resolve('0.0001')
            props.gas_limit = default_gas_limit
            return fetchRecomendedFee(props)
        },

        logo: logo,
        symbol,
        name,
        color,
        labels,
        type: TYPE_ERC20,
        symbol_fee,
        url,
        api_url,
        api_key,
        url_myetherapi,
        removeHexPrefix,
        isAddress,
        isAddressCheck,
        isPrivateKey,
        isPrivateKeyCheck,
        getAddressFromPrivateKey,
        ascii,
        encryptPrivateKey,
        decryptPrivateKey,
        encryptSeed,
        decryptSeed,
        decryptPrivateKeyFromSeed,
        getSendProviders,
        urlDecodeTx,
        getWalletFromSeed,
        formatAddress,
        cutDecimals,
        urlInfoTx
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
