export default {
    home: () => `/`,
    addwallet: () => `/addwallet`,
    createbtc: () => `/addwallet/create-bitcoin`,
    importbtc: () => `/addwallet/import-bitcoin`,
    wallet: (currency,address) => `/${currency}/${address}`,
    summaryWallet: (currency,address) => `/${currency}/${address}/summary`,
    setPrivateKeyWallet: (currency,address) => `/${currency}/${address}/setprivatekey`,
    deleteWallet: (currency,address) => `/${currency}/${address}/delete`,
}