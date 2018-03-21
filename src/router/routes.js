import { createRoute } from 'dop-router/routes'

export default {
    home: createRoute(`/`),
    settings: createRoute(`/settings`),

    // Add
    add: createRoute(`/add`),
    custom: createRoute(`/custom/:type`),
    create: createRoute(`/create/:symbol`),
    import: createRoute(`/import/:symbol`),

    // Assets
    asset: createRoute(`/asset/:asset_id/summary`), // default
    summaryAsset: createRoute(`/asset/:asset_id/summary`),
    sendAsset: createRoute(`/asset/:asset_id/send`),
    exportAsset: createRoute(`/asset/:asset_id/export`),
    changePasswordAsset: createRoute(`/asset/:asset_id/changepassword`),
    deleteAsset: createRoute(`/asset/:asset_id/delete`)
}
