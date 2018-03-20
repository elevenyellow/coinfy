import React, { Component } from 'react'
import styled from 'styled-components'
import { createObserver, collect } from 'dop'
import { Show } from '/router/components'

import styles from '/const/styles'
import routes from '/router/routes'

import { Coins } from '/api/coins'

import state from '/store/state'
import { getReusableSeeds, getLabelOrAddress, getAssetId } from '/store/getters'
import { setHref, createAsset, setSeed, addNotification } from '/store/actions'

import {
    RightContainerPadding,
    RightHeader,
    RightContent
} from '/components/styled/Right'
import H1 from '/components/styled/H1'
import H2 from '/components/styled/H2'
import Div from '/components/styled/Div'
import ButtonBig from '/components/styled/ButtonBig'
import Input from '/components/styled/Input'
import IconHeader from '/components/styled/IconHeader'
import AssetItem from '/components/styled/AssetItem'
import SelectDropdown from '/components/styled/SelectDropdown'

import NewAsset from '/components/views/Create/new'

export default class AddAsset extends Component {
    componentWillMount() {
        this.observer = createObserver(m => this.forceUpdate())
        this.observer.observe(state.view)
        state.view = {
            force_new: false,
            group_selected: -1,
            asset_selected: 0,
            password: '',
            password_error: false
        }

        this.Coin =
            Coins[
                decodeURIComponent(
                    state.location.path[state.location.path.length - 1]
                )
            ]
        this.reusable_seeds = getReusableSeeds(this.Coin.symbol)
        this.step = state.location.path[2]

        this.onNew = this.onNew.bind(this)
        this.onChangePassword = this.onChangePassword.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }
    componentWillUnmount() {
        // this.observer.destroy()
    }
    shouldComponentUpdate() {
        return false
    }

    onNew() {
        state.view.force_new = true
        this.observer.destroy()
    }

    onSelectGroup(index) {
        const collector = collect()
        state.view.group_selected = index
        state.view.asset_selected = 0
        state.view.password = ''
        state.view.password_error = false
        collector.emit()
    }

    onChangeAsset(e) {
        const collector = collect()
        state.view.asset_selected = e.target.value
        state.view.password_error = false
        collector.emit()
    }

    onChangePassword(e) {
        const collector = collect()
        state.view.password = e.target.value
        state.view.password_error = false
        collector.emit()
    }

    onSubmit(e) {
        const collector = collect()
        const password = state.view.password
        const asset_from = this.reusable_seeds[state.view.group_selected][
            state.view.asset_selected
        ]
        const seed = Coins[asset_from.symbol].decryptSeed(
            asset_from.address,
            asset_from.seed,
            password
        )
        if (seed) {
            const { address } = this.Coin.getWalletFromSeed({ seed: seed })
            const symbol = this.Coin.symbol
            const asset = createAsset(this.Coin.type, symbol, address)
            const asset_id = getAssetId({ symbol, address })
            setSeed(asset_id, seed, password)
            setHref(routes.asset({ asset_id: asset_id }))
            addNotification(`New "${symbol}" asset has been created`)
        } else {
            state.view.password_error = true
        }
        collector.emit()
    }

    render() {
        return React.createElement(AddAssetTemplate, {
            Coin: this.Coin,
            is_reuse_view:
                !state.view.force_new &&
                this.reusable_seeds.length > 0 &&
                isNaN(Number(this.step)),
            reusable_seeds: this.reusable_seeds,
            group_selected: state.view.group_selected,
            asset_selected: state.view.asset_selected,
            password: state.view.password,
            password_error: state.view.password_error,
            onNew: this.onNew,
            onSelectGroup: this.onSelectGroup,
            onChangeAsset: this.onChangeAsset,
            onChangePassword: this.onChangePassword,
            onSubmit: this.onSubmit
        })
    }
}

function AddAssetTemplate({
    Coin,
    is_reuse_view,
    reusable_seeds,
    group_selected,
    asset_selected,
    password,
    password_error,
    onNew,
    onSelectGroup,
    onChangeAsset,
    onChangePassword,
    onSubmit
}) {
    return (
        <RightContainerPadding>
            <RightHeader>
                <IconHeader>
                    <img src={Coin.logo} />
                </IconHeader>
                <Div float="left">
                    <H1>{Coin.name}</H1>
                    <H2>Create {Coin.symbol} asset</H2>
                </Div>
                <Div clear="both" />
            </RightHeader>
            <RightContent>
                {is_reuse_view ? (
                    <Options>
                        <Option1>
                            <div>
                                <OptionNumber>01</OptionNumber>
                                <OptionTitle>
                                    Reuse the same Recovery Phrase that I am
                                    using for
                                </OptionTitle>
                            </div>
                            <OptionContent>
                                {reusable_seeds.map((group, index) => (
                                    <Group>
                                        <GroupContainer
                                            selected={group_selected === index}
                                        >
                                            <GroupSelectable
                                                onClick={e =>
                                                    onSelectGroup(index)
                                                }
                                            >
                                                <Assets>
                                                    {group.map(asset => (
                                                        <Asset>
                                                            <AssetItem
                                                                logo={
                                                                    Coins[
                                                                        asset
                                                                            .symbol
                                                                    ].logo
                                                                }
                                                                label={getLabelOrAddress(
                                                                    asset
                                                                )}
                                                                balance={Coins[
                                                                    asset.symbol
                                                                ].format(
                                                                    asset.balance,
                                                                    5
                                                                )}
                                                            />
                                                        </Asset>
                                                    ))}
                                                </Assets>
                                                <Button>Select</Button>
                                            </GroupSelectable>
                                            <GroupConfirm>
                                                <SelectDropdown
                                                    onChange={onChangeAsset}
                                                >
                                                    {group.map(
                                                        (asset, index) => (
                                                            <option
                                                                value={index}
                                                                selected={
                                                                    index ===
                                                                    asset_selected
                                                                }
                                                            >
                                                                <OptionIcon>
                                                                    <img
                                                                        src={
                                                                            Coins[
                                                                                asset
                                                                                    .symbol
                                                                            ]
                                                                                .logo
                                                                        }
                                                                    />
                                                                </OptionIcon>
                                                                <OptionLabel>
                                                                    {getLabelOrAddress(
                                                                        asset
                                                                    )}
                                                                </OptionLabel>
                                                            </option>
                                                        )
                                                    )}
                                                </SelectDropdown>
                                                <Div padding-top="10px">
                                                    <Input
                                                        type="password"
                                                        placeholder="Password of this asset"
                                                        value={password}
                                                        invalid={password_error}
                                                        error="Invalid password"
                                                        width="100%"
                                                        text-align="center"
                                                        onChange={
                                                            onChangePassword
                                                        }
                                                    />
                                                </Div>
                                                <Div padding-top="10px">
                                                    <ButtonBig
                                                        onClick={onSubmit}
                                                        disabled={
                                                            password.length ===
                                                                0 ||
                                                            password_error
                                                        }
                                                    >
                                                        Unlock and Reuse
                                                    </ButtonBig>
                                                </Div>
                                            </GroupConfirm>
                                            <Div clear="both" />
                                        </GroupContainer>
                                    </Group>
                                ))}
                            </OptionContent>
                        </Option1>
                        <Separator>
                            <Line />
                            <Or>OR</Or>
                        </Separator>
                        <Option2>
                            <div>
                                <OptionNumber>02</OptionNumber>
                                <OptionTitle>
                                    Create a new Recovery Phrase for this asset
                                </OptionTitle>
                            </div>
                            <OptionContent>
                                <ButtonBig onClick={onNew}>New</ButtonBig>
                            </OptionContent>
                        </Option2>
                    </Options>
                ) : (
                    <NewAsset />
                )}
            </RightContent>
        </RightContainerPadding>
    )
}

const Separator = styled.div`
    position: absolute;
    height: calc(100% - 180px);
    width: calc(100% - 80px);
    pointer-events: none;
    ${styles.media.second} {
        width: calc(100% - 50px);
    }
    ${styles.media.third} {
        position: relative;
        height: 35px;
        width: 100%;
        margin-bottom: 30px;
        padding-top: 10px;
    }
`
const Line = styled.div`
    width: 4px;
    height: 100%;
    margin: 0 auto;
    background: ${styles.color.grey2};
    ${styles.media.third} {
        width: 100%;
        height: 4px;
    }
`
const Or = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    background: white;
    font-size: 30px;
    font-weight: 100;
    color: ${styles.color.grey3};
    width: 60px;
    ${styles.media.third} {
        width: 40px;
        top: auto;
    }
`

const Options = styled.div``
const Option1 = styled.div`
    padding-right: 60px;
    float: left;
    width: 50%;
    box-sizing: border-box;
    ${styles.media.third} {
        float: none;
        width: 100%;
        padding: 0;
    }
`
const Option2 = styled.div`
    padding-left: 60px;
    float: left;
    width: 50%;
    box-sizing: border-box;
    ${styles.media.third} {
        float: none;
        width: 100%;
        padding: 0;
    }
`

const OptionNumber = styled.div`
    float: left;
    font-size: 50px;
    line-height: 38px;
    padding-right: 10px;
    color: ${styles.color.grey2};
    ${styles.media.third} {
        display: none;
    }
`
const OptionTitle = styled.div`
    font-size: 18px;
    font-weight: bold;
    height: 48px;
    line-height: 20px;
    color: ${styles.color.grey3};
    letter-spacing: 0.3px;
    ${styles.media.third} {
        height: auto;
        text-align: center;
    }
`

const OptionContent = styled.div`
    padding-top: 30px;
    ${styles.media.third} {
        padding-top: 15px;
    }
`

const Group = styled.div`
    margin-bottom: 30px;
    overflow: hidden;
`
const GroupContainer = styled.div`
    position: relative;
    width: 200%;
    transition: 0.75s ease all;
    left: ${props => (props.selected ? '-100%' : 0)};
`

const GroupSelectable = styled.div`
    float: left;
    width: 50%;
    cursor: pointer;
    &:hover > div {
        border-color: ${styles.color.background3};
    }
    &:hover > button {
        background-color: ${styles.color.background3};
    }

    &:hover > div > div {
        opacity: 0.9;
    }
`

const GroupConfirm = styled.div`
    float: left;
    width: 50%;
    box-sizing: border-box;
    padding-left: 5px;
`

const Assets = styled.div`
    border: 4px solid ${styles.color.background2};
    border-radius: 5px;
    padding: 20px;
`

const Asset = styled.div`
    clear: both;
    margin-bottom: 15px;
    height: 40px;
    overflow: hidden;
    &:last-child {
        margin-bottom: 0;
    }
    /* & > * {
        position: absolute;
        height: 50px;
        top: 0;
        width: 100%;
    } */
`
// const AssetPassword = styled.div``

const Button = styled.button`
    position: relative;
    top: -7px;
    border: 0;
    background-color: ${styles.color.background2};
    color: white;
    font-weight: bold;
    height: 40px;
    width: 100%;
    border-radius: 0 0 4px 4px;
    font-size: 15px;
    letter-spacing: -0.2px;
    outline: none;
    pointer-events: none;
`

const OptionIcon = styled.div`
    position: absolute;
    top: 11px;
    & img {
        height: 16px;
    }
`
const OptionLabel = styled.div`
    margin-left: 25px;
    text-overflow: ellipsis;
    overflow: hidden;
`
