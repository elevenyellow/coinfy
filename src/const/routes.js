export default {
    home: () => `/`,
    settings: () => `/settings`,

    // Add
    add: () => `/add`,
    create: symbol => `/add/create-${symbol}`.toLowerCase(),
    import: symbol => `/add/import-${symbol}`.toLowerCase(),

    // Assets
    asset: asset_id => `/asset/${asset_id}/summary`, // default
    summaryAsset: asset_id => `/asset/${asset_id}/summary`,
    sendAsset: asset_id => `/asset/${asset_id}/send`,
    printAsset: asset_id => `/asset/${asset_id}/print`,
    changePasswordAsset: asset_id => `/asset/${asset_id}/changepassword`,
    deleteAsset: asset_id => `/asset/${asset_id}/delete`
}
