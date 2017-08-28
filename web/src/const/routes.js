export default {
    home: () => `/`,

    // Add
    addwallet: () => `/addwallet`,
    createbtc: () => `/addwallet/create-bitcoin`,
    importbtc: () => `/addwallet/import-bitcoin`,

    // Wallets
    wallet: (currency, address) => `/${currency}/${address}/summary`, // default
    summaryWallet: (currency, address) => `/${currency}/${address}/summary`,
    receiveWallet: (currency, address) => `/${currency}/${address}/receive`,
    sendWallet: (currency, address) => `/${currency}/${address}/send`,
    printWallet: (currency, address) => `/${currency}/${address}/print`,
    setPrivateKeyWallet: (currency, address) => `/${currency}/${address}/setprivatekey`,
    changePasswordWallet: (currency, address) => `/${currency}/${address}/changepassword`,
    deleteWallet: (currency, address) => `/${currency}/${address}/delete`
}
