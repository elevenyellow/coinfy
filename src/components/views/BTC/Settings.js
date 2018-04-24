import React, { Component } from 'react'
import styled from 'styled-components'
import { createObserver, collect } from 'dop'

import { routes, Show } from '/store/router'
import styles from '/const/styles'
import { OK, ERROR, ALERT, NORMAL, minpassword } from '/const/'

import { Coins } from '/api/coins'

import state from '/store/state'
import {
    setHref,
    setPrivateKey,
    setSeed,
    addNotification,
    assetDelete
} from '/store/actions'
import {
    getAsset,
    isAssetWithSeed,
    getParamsFromLocation,
    getLabelOrAddress,
    isAssetWithPrivateKeyOrSeed
} from '/store/getters'

import Section from '/components/styled/Section'
import Div from '/components/styled/Div'
import Button from '/components/styled/Button'
import Help from '/components/styled/Help'
import Input from '/components/styled/Input'
import Password from '/components/styled/Password'
import { Label, SubLabel } from '/components/styled/Label'
import {
    FormField,
    FormFieldLeft,
    FormFieldRight,
    FormFieldButtons
} from '/components/styled/Form'
import CenterElement from '/components/styled/CenterElement'
import Checkbox from '/components/styled/Checkbox'

export default class ChangePassword extends Component {
    componentWillMount() {
        const { asset_id } = getParamsFromLocation()
        this.asset_id = asset_id
        this.asset = getAsset(asset_id)
        this.Coin = Coins[this.asset.symbol]

        this.observer = createObserver(m => this.forceUpdate())
        this.observer.observe(state.view)

        state.view = {
            // Change password
            oldpassword: '',
            password: '',
            repassword: '',
            isInvalidOldpassword: false,
            // Delete
            confirmed: false
        }

        // binding
        this.onChangeOldpassword = this.onChangeOldpassword.bind(this)
        this.onChangePassword = this.onChangePassword.bind(this)
        this.onChangeRepassword = this.onChangeRepassword.bind(this)
        this.onChangeSubmit = this.onChangeSubmit.bind(this)
        this.onDeleteConfirm = this.onDeleteConfirm.bind(this)
        this.onDeleteSubmit = this.onDeleteSubmit.bind(this)
    }
    componentWillUnmount() {
        this.observer.destroy()
    }
    shouldComponentUpdate() {
        return false
    }

    // Change Password
    onChangeOldpassword(e) {
        const collector = collect()
        state.view.isInvalidOldpassword = false
        state.view.oldpassword = e.target.value
        collector.emit()
    }
    onChangePassword(e) {
        state.view.password = e.target.value
    }
    onChangeRepassword(e) {
        state.view.repassword = e.target.value
    }
    onChangeSubmit(e) {
        e.preventDefault()
        const collector = collect()
        const asset_id = this.asset_id
        const asset = this.asset
        const Coin = this.Coin
        const address = asset.address
        const addresses = asset.addresses
        const oldpassword = state.view.oldpassword
        const password = state.view.password
        const is_seed = isAssetWithSeed(asset_id)
        const privatekey_or_seed = is_seed
            ? Coin.decryptSeed(addresses, asset.seed, oldpassword)
            : Coin.decryptPrivateKey(address, asset.private_key, oldpassword)

        if (privatekey_or_seed) {
            const name = asset.label || asset.address
            is_seed
                ? setSeed(asset_id, privatekey_or_seed, password)
                : setPrivateKey(asset_id, privatekey_or_seed, password)
            addNotification(`You have changed the password of this asset`, OK)
            setHref(routes.asset({ asset_id: asset_id }))
        } else state.view.isInvalidOldpassword = true

        collector.emit()
    }

    // Delete
    onDeleteConfirm() {
        state.view.confirmed = !state.view.confirmed
    }
    onDeleteSubmit() {
        const collector = collect()
        const asset = this.asset
        const asset_id = this.asset_id
        const name = getLabelOrAddress(asset)
        assetDelete(asset_id)
        setHref(routes.home())
        addNotification(`"${name}" asset has been deleted`)
        collector.emit()
    }

    // Getters
    get isInvalidRepassword() {
        return (
            state.view.password.length > 0 &&
            state.view.repassword.length > 0 &&
            state.view.password.length === state.view.repassword.length &&
            state.view.password !== state.view.repassword
        )
    }

    render() {
        const asset_id = this.asset_id
        const isInvalidRepassword = this.isInvalidRepassword
        const isValidForm =
            state.view.oldpassword.length > 0 &&
            state.view.password.length >= minpassword &&
            state.view.password === state.view.repassword &&
            !state.view.isInvalidOldpassword &&
            !isInvalidRepassword

        return React.createElement(ChangePasswordTemplate, {
            hasPrivateKeyOrSeed: isAssetWithPrivateKeyOrSeed(asset_id),
            hasSeed: isAssetWithSeed(asset_id),
            oldpassword: state.view.oldpassword,
            password: state.view.password,
            repassword: state.view.repassword,
            isInvalidOldpassword: state.view.isInvalidOldpassword,
            isInvalidRepassword: isInvalidRepassword,
            isValidForm: isValidForm,
            confirmed: state.view.confirmed,
            onChangeOldpassword: this.onChangeOldpassword,
            onChangePassword: this.onChangePassword,
            onChangeRepassword: this.onChangeRepassword,
            onChangeSubmit: this.onChangeSubmit,
            onDeleteConfirm: this.onDeleteConfirm,
            onDeleteSubmit: this.onDeleteSubmit
        })
    }
}

function ChangePasswordTemplate({
    hasPrivateKeyOrSeed,
    hasSeed,
    oldpassword,
    password,
    repassword,
    confirmed,
    isInvalidOldpassword,
    isInvalidRepassword,
    isValidForm,
    onChangeOldpassword,
    onChangePassword,
    onChangeRepassword,
    onChangeSubmit,
    onDeleteConfirm,
    onDeleteSubmit
}) {
    return (
        <div>
            <Show if={hasPrivateKeyOrSeed}>
                <div>
                    <Div>
                        <Section>Change Password</Section>
                    </Div>
                    <FormField>
                        <FormFieldLeft>
                            <Label>Old password</Label>
                        </FormFieldLeft>
                        <FormFieldRight>
                            <Input
                                type="password"
                                width="100%"
                                value={oldpassword}
                                onChange={onChangeOldpassword}
                                error={'Invalid old password'}
                                invalid={isInvalidOldpassword}
                            />
                        </FormFieldRight>
                    </FormField>
                    <FormField>
                        <FormFieldLeft>
                            <Label>Password</Label>
                            <Help>
                                Make sure that you remember this. This password
                                can't be restored because we don't store it. For
                                security reasons you will be asked often for
                                this password.
                            </Help>
                            <SubLabel>
                                This password encrypts your private key.
                            </SubLabel>
                        </FormFieldLeft>
                        <FormFieldRight>
                            <Password
                                minlength={minpassword}
                                value={password}
                                onChange={onChangePassword}
                                width="100%"
                                type="password"
                            />
                        </FormFieldRight>
                    </FormField>
                    <FormField>
                        <FormFieldLeft>
                            <Label>Repeat Password</Label>
                        </FormFieldLeft>
                        <FormFieldRight>
                            <Input
                                minlength={minpassword}
                                error={'Passwords do not match'}
                                invalid={isInvalidRepassword}
                                value={repassword}
                                onChange={onChangeRepassword}
                                width="100%"
                                type="password"
                            />
                        </FormFieldRight>
                    </FormField>

                    <FormField>
                        <FormFieldButtons>
                            <Button
                                width="200px"
                                disabled={!isValidForm}
                                onClick={onChangeSubmit}
                            >
                                Change password
                            </Button>
                        </FormFieldButtons>
                    </FormField>
                </div>
            </Show>

            <Div>
                <Section>Delete</Section>
            </Div>
            <Div padding-top="30px">
                <CenterElement>
                    <div>
                        <Checkbox
                            checked={confirmed}
                            onChange={onDeleteConfirm}
                            label="I understand that if I don't have a Recovery Phrase, my Paper Wallet or a Backup I won't be able to recover this asset."
                        />
                    </div>
                    <Div padding-top="10px">
                        <Button
                            font-size="14px"
                            disabled={!confirmed}
                            onClick={onDeleteSubmit}
                            width="100%"
                        >
                            Delete this asset
                        </Button>
                    </Div>
                </CenterElement>
            </Div>
        </div>
    )
}
