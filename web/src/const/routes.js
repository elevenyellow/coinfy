export default {
    home: () => `/`,

    // Add
    add: () => `/add`,
    createbtc: () => `/add/create-bitcoin`,
    importbtc: () => `/add/import-bitcoin`,

    // Assets
    asset: asset_id => `/${asset_id}/summary`, // default
    summaryAsset: asset_id => `/${asset_id}/summary`,
    receiveAsset: asset_id => `/${asset_id}/receive`,
    sendAsset: asset_id => `/${asset_id}/send`,
    printAsset: asset_id => `/${asset_id}/print`,
    setPrivateKeyAsset: asset_id => `/${asset_id}/setprivatekey`,
    changePasswordAsset: asset_id => `/${asset_id}/changepassword`,
    deleteAsset: asset_id => `/${asset_id}/delete`
}
