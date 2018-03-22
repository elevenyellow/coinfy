import { createGroup, createRoute } from 'dop-router/routes'
import * as components from 'dop-router/react'
import state from '/store/state'

const group = createGroup(state.location)

export const routes = {
    home: group.add(createRoute(`/`)),
    settings: group.add(createRoute(`/settings`)),

    // Add
    add: group.add(createRoute(`/add`)),
    custom: group.add(createRoute(`/custom/:type`)),
    create: group.add(createRoute(`/create/:symbol`)),
    import: group.add(createRoute(`/import/:symbol`)),

    // Assets
    asset: group.add(createRoute(`/asset/:asset_id/summary`)),
    summaryAsset: group.add(createRoute(`/asset/:asset_id/summary`)),
    sendAsset: group.add(createRoute(`/asset/:asset_id/send`)),
    exportAsset: group.add(createRoute(`/asset/:asset_id/export`)),
    changePasswordAsset: group.add(
        createRoute(`/asset/:asset_id/changepassword`)
    ),
    deleteAsset: group.add(createRoute(`/asset/:asset_id/delete`))
}

export const Router = components.Router
export const Route = components.Route
export const Show = components.Show
export const getRoute = group.getRoute
export const getParams = group.getParams
