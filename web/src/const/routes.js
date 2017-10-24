export default {
    home: () => `/`,

    // Add
    add: () => `/add`,
    createbtc: () => `/add/create-bitcoin`,
    importbtc: () => `/add/import-bitcoin`,

    // Assets
    asset: asset_id => `/asset/${asset_id}/summary`, // default
    summaryAsset: asset_id => `/asset/${asset_id}/summary`,
    sendAsset: asset_id => `/asset/${asset_id}/send`,
    printAsset: asset_id => `/asset/${asset_id}/print`,
    setPrivateKeyAsset: asset_id => `/asset/${asset_id}/setprivatekey`,
    changePasswordAsset: asset_id => `/asset/${asset_id}/changepassword`,
    deleteAsset: asset_id => `/asset/${asset_id}/delete`
}
