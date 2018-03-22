import { createGroup, createRoute } from 'dop-router/routes'
import * as components from 'dop-router/react'
import state from '/store/state'

export const group = createGroup()
export const routes = {
    // Main
    home: group.add(createRoute(`/`)),
    settings: group.add(createRoute(`/settings`)),

    // Add
    add: group.add(createRoute(`/add(?filter=:filter)`)),
    custom: group.add(createRoute(`/custom/:type`)),
    create: group.add(createRoute(`/create/:symbol`)),
    import: group.add(createRoute(`/import/:symbol`)),

    // Assets
    asset: group.add(createRoute(`/asset/:asset_id`)),
    assetSend: group.add(createRoute(`/asset/:asset_id/send`)),
    assetExport: group.add(createRoute(`/asset/:asset_id/export`)),
    assetChangepassword: group.add(
        createRoute(`/asset/:asset_id/changepassword`)
    ),
    assetDelete: group.add(createRoute(`/asset/:asset_id/delete`))
}

export const Router = props => {
    if (props.location === undefined) props.location = state.location
    if (props.group === undefined) props.group = group
    return components.Router(props)
}
export const Route = components.Route
export const Show = components.Show
