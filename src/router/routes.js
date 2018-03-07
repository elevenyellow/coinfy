export default {
    home: () => `/`,
    settings: () => `/settings`,

    // Add
    add: () => `/add`,
    custom: ({ type }) => `/custom/${type}`,
    create: ({ symbol }) => `/create/${symbol}`,
    import: ({ symbol }) => `/import/${symbol}`,

    // Assets
    asset: ({ asset_id }) => `/asset/${asset_id}/summary`, // default
    summaryAsset: ({ asset_id }) => `/asset/${asset_id}/summary`,
    sendAsset: ({ asset_id }) => `/asset/${asset_id}/send`,
    exportAsset: ({ asset_id }) => `/asset/${asset_id}/export`,
    changePasswordAsset: ({ asset_id }) => `/asset/${asset_id}/changepassword`,
    deleteAsset: ({ asset_id }) => `/asset/${asset_id}/delete`
}
