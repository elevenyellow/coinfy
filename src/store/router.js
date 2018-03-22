import { createGroup, createRoute } from 'dop-router/routes'
import * as components from 'dop-router/react'
import state from '/store/state'

export const group = createGroup()
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

export const Router = props => {
    if (props.location === undefined) props.location = state.location
    if (props.group === undefined) props.group = group
    return components.Router(props)
}
export const Route = components.Route
export const Show = components.Show
