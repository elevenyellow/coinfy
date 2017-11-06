import React, { Component } from 'react'
import { createObserver } from 'dop'
import styled from 'styled-components'
import styles from '/const/styles'

import state from '/store/state'
import { getAssetsAsArray } from '/store/getters'

import AssetListItem from '/components/partials/AssetListItem'

export default class AssetList extends Component {
    componentWillMount() {
        this.observer = createObserver(mutations => this.forceUpdate())
        this.observer.observe(state, 'assets')
        this.observer.observe(state.assets)
    }
    componentWillUnmount() {
        this.observer.destroy()
    }
    shouldComponentUpdate() {
        return false
    }

    render() {
        return React.createElement(AssetListTemplate, {
            assets: getAssetsAsArray()
        })
    }
}

function AssetListTemplate({ assets }) {
    return (
        <div>
            {assets.map(asset => <AssetListItem asset={asset} />)}
        </div>
    )
}
