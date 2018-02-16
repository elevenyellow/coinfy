import React from 'react'
import styled from 'styled-components'
import styles from '/const/styles'

export default function AssetItem({ logo, label, balance }) {
    return (
        <div>
            <AssetIcon>
                <img src={logo} width="22" height="22" />
            </AssetIcon>
            <AssetInfo>
                <AssetLabel>{label}</AssetLabel>
                <AssetBalance>{balance}</AssetBalance>
            </AssetInfo>
        </div>
    )
}

const AssetIcon = styled.div`
    float: left;
    padding-top: 3px;
`
const AssetInfo = styled.div`
    margin-left: 33px;
`
const AssetLabel = styled.div`
    text-overflow: ellipsis;
    overflow: hidden;
    font-weight: bold;
    font-size: 16px;
    color: ${styles.color.front3};
    line-height: 20px;
`
const AssetBalance = styled.div`
    text-overflow: ellipsis;
    font-size: 12px;
    color: ${styles.color.front2};
    padding-top: 2px;
    font-weight: 100;
    letter-spacing: 0.5px;
`
