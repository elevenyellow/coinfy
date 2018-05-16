import { util } from 'dop'
import { Fiats } from '/api/fiats'
import { Coins } from '/api/coins'
import { now } from '/api/time'
import state from '/store/state'
import { group } from '/store/router'
import { version } from './../../package.json'
import { sha3 } from 'ethereumjs-util'

export function getTotalAssets(assets) {
    return Object.keys(assets).length
}

export function convertBalance(symbol, value) {
    return getPrice(symbol) * (value || 0)
}

export function getAssetId(asset) {
    for (let asset_id in state.assets)
        if (state.assets[asset_id] === asset) {
            return asset_id
        }
}

export function getAsset(asset_id) {
    return state.assets[asset_id]
}

export function getAssetsAsArray() {
    const assets = []
    Object.keys(state.assets).forEach(asset_id => {
        assets.push(state.assets[asset_id])
    })
    return assets
}

export function isAssetRegisteredById(asset_id) {
    return state.assets.hasOwnProperty(asset_id)
}

export function isAssetRegistered(symbol, address) {
    return getAssetsAsArray().some(
        asset => asset.symbol === symbol && asset.addresses.includes(address)
    )
}

export function isAssetRegisteredBySeed(symbol, seed) {
    const hash = sha3(seed).toString('hex')
    return getAssetsAsArray().some(
        asset =>
            asset.symbol === symbol &&
            asset.hasOwnProperty('seed') &&
            asset.seed.hash === hash
    )
}

export function getAddresses(asset_id) {
    const asset = getAsset(asset_id)
    const Coin = Coins[asset.symbol]
    return Coin.multiaddress ? asset.addresses.slice(0) : [asset.address]
    // return [asset.address]
}

export function isAssetWithPrivateKeyOrSeed(asset_id) {
    return isAssetWithPrivateKey(asset_id) || isAssetWithSeed(asset_id)
}

export function isAssetWithPrivateKey(asset_id) {
    return (
        isAssetRegisteredById(asset_id) &&
        state.assets[asset_id].hasOwnProperty('private_key')
    )
}

export function isAssetWithSeed(asset_id) {
    return (
        isAssetRegisteredById(asset_id) &&
        state.assets[asset_id].hasOwnProperty('seed')
    )
}

export function getSymbolsFromAssets(assets = state.assets) {
    const symbols = Object.keys(assets).map(asset_id => assets[asset_id].symbol)
    return symbols.filter((item, pos) => symbols.indexOf(item) == pos)
}

export function isValidAsset(asset) {
    try {
        const symbol = asset.symbol
        const addr = asset.address
        const address = typeof addr == 'string' ? addr : addr[addr.length - 1]
        return Coins[symbol].isAddressCheck(address)
    } catch (e) {
        return false
    }
}

export function generateDefaultAsset(object = {}) {
    let asset = {
        // type: type,
        // symbol: symbol,
        // address: address,
        // addresses: [object.address],
        // id: getNextAssetId(object),
        label: '',
        balance: '0',
        printed: false, // wallet printed?
        summary: {
            // this must be removed when exporting or saving in localstorage
        }
    }

    asset = util.merge(asset, object)
    if (!Array.isArray(asset.addresses) || asset.addresses.length < 1)
        asset.addresses = [object.address]
    // console.log(asset)
    return asset
}

export function generateDefaultBackup(object = {}) {
    const backup = {
        date: now(),
        network: state.network,
        v: version
            .split('.')
            .slice(0, 2)
            .join('.'),
        assets: {},
        customs: {}
    }
    return util.merge(backup, object)
}

export function formatCurrency(value, n = 0, currencySymbol = state.fiat) {
    return Fiats[currencySymbol].format(value, n)
}

export function getNextAssetId(asset) {
    const symbol = asset.symbol
    const address = asset.addresses[0]
    const init_id = `${symbol}-${address}`
    let index = 1
    let id = init_id
    while (state.assets.hasOwnProperty(id)) {
        id = `${init_id}-${index++}`
    }
    return id
}

export function getPrice(symbol) {
    return state && state.prices && state.prices[symbol]
        ? state.prices[symbol]
        : 0
}

export function getPrivateKey(asset_id, password) {
    const asset = getAsset(asset_id)
    const Coin = Coins[asset.symbol]
    return isAssetWithSeed(asset_id)
        ? Coin.decryptPrivateKeyFromSeed(
              asset.address,
              asset.addresses,
              asset.seed,
              password
          )
        : Coin.decryptPrivateKey(asset.address, asset.private_key, password)
}

export function getPrivateKeys(asset_id, password) {
    const asset = getAsset(asset_id)
    const Coin = Coins[asset.symbol]
    const is_seed = isAssetWithSeed(asset_id)
    const addresses = Coin.multiaddress
        ? asset.addresses.slice(0)
        : [asset.address]

    return addresses.map(address => {
        return is_seed
            ? Coin.decryptPrivateKeyFromSeed(
                  address,
                  addresses,
                  asset.seed,
                  password
              )
            : Coin.decryptPrivateKey(asset.address, asset.private_key, password)
    })
}

export function getSeed(asset_id, password) {
    const asset = getAsset(asset_id)
    const Coin = Coins[asset.symbol]
    return Coin.decryptSeed(asset.addresses, asset.seed, password)
}

export function getLabelOrAddress(asset) {
    if (typeof asset == 'string') asset = getAsset(asset)
    return asset.label.length > 0 ? asset.label : asset.address
}

export function getReusableSeeds(symbol) {
    const reusables = []
    const groups = {}
    const assets = getAssetsAsArray().filter(asset =>
        asset.hasOwnProperty('seed')
    )

    assets.forEach(asset => {
        const hash = asset.seed.hash
        if (!groups.hasOwnProperty(hash)) groups[hash] = []
        groups[hash].push(asset)
    })

    for (let hash in groups) {
        const group = groups[hash]
        if (group.filter(asset => asset.symbol === symbol).length === 0)
            reusables.push(group)
    }

    return reusables
}

export function getParamsFromLocation() {
    return group.getParams(state.location)
}

export function getRouteFromLocation() {
    return group.getRoute(state.location)
}
