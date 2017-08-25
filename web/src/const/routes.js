export default {
    home: () => `/`,
    addwallet: () => `/addwallet`,
    createbtc: () => `/addwallet/create-bitcoin`,
    importbtc: () => `/addwallet/import-bitcoin`,
    wallet: (currency,address) => `/${currency}/${address}`,
    deleteWallet: (currency,address) => `/${currency}/${address}/delete`
}