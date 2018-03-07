import React, { Component } from 'react'
import styled from 'styled-components'
import { createObserver, collect } from 'dop'
import { Show } from '/router/components'

import {
    MAINNET,
    OK,
    ERROR,
    ALERT,
    NORMAL,
    TIMEOUT_BETWEEN_EACH_FAIL_FETCH_FEE
} from '/const/'
import styles from '/const/styles'
import routes from '/router/routes'

import { Coins } from '/api/coins'
import { parseNumberAsString, limitDecimals, bigNumber } from '/api/numbers'
import { repeatUntilResolve } from '/api/promises'

import state from '/store/state'
import { fetchBalance, setHref, sendEventToAnalytics } from '/store/actions'
import {
    getAsset,
    getPrice,
    formatCurrency,
    convertBalance,
    isAssetWithSeed,
    getPrivateKey
} from '/store/getters'

import Div from '/components/styled/Div'
import Span from '/components/styled/Span'
import Input from '/components/styled/Input'
import InputDouble from '/components/styled/InputDouble'
import Button from '/components/styled/Button'
import ButtonBig from '/components/styled/ButtonBig'
import CenterElement from '/components/styled/CenterElement'
import Alert from '/components/styled/Alert'
import SwitchView from '/components/styled/SwitchView'
import RadioButton from '/components/styled/RadioButton'
import { Label, SubLabel } from '/components/styled/Label'
import Help from '/components/styled/Help'

import IconSend from 'react-icons/lib/md/send'
// import IconBack from 'react-icons/lib/md/arrow-back'

export default class Send extends Component {
    componentWillMount() {
        this.asset_id = state.location.path[1]
        this.asset = getAsset(this.asset_id)
        this.Coin = Coins[this.asset.symbol] // Storing Asset api (Asset.BTC, Asset.ETH, ...)
        this.send_providers = this.Coin.getSendProviders()

        this.observer = createObserver(m => this.forceUpdate())
        this.observer.observe(state.view)
        this.observer.observe(state.location, 'pathname')

        // Initial state
        state.view = {
            amount: bigNumber(0),
            fee: bigNumber(0),
            balance: bigNumber(this.asset.balance),
            balance_fee: bigNumber(this.asset.balance),
            address_input: '',
            address_input_error: false,
            amount1_input: 0, // BTC
            amount2_input: 0, // FIAT
            loading_max: false,
            fee_recomended: 0,
            fee_input: 0,
            fee_input_visible: false,
            password_input: '',
            password_input_invalid: false,
            error_when_create: false,
            send_provider_selected: 0,
            show_tx_raw: false,
            loading: false,
            error_when_send: '',
            is_sent: false
        }

        // binding
        this.fetchFee = this.fetchFee.bind(this)
        this.onChangeAddress = this.onChangeAddress.bind(this)
        this.onChangeAmount1 = this.onChangeAmount1.bind(this)
        this.onChangeAmount2 = this.onChangeAmount2.bind(this)
        this.onClickMax = this.onClickMax.bind(this)
        this.onChangeFee = this.onChangeFee.bind(this)
        this.onClickFee = this.onClickFee.bind(this)
        this.onChangePassword = this.onChangePassword.bind(this)
        this.onNext = this.onNext.bind(this)
        this.onChangeProvider = this.onChangeProvider.bind(this)
        this.onShowRawTx = this.onShowRawTx.bind(this)
        this.onSend = this.onSend.bind(this)

        this.fetchBalance()
        this.fetchFee({}).then(fee => {
            const collector = collect()
            this.updateRecomendedFee(fee)
            collector.emit()
        })
    }
    componentWillUnmount() {
        this.observer.destroy()
    }
    shouldComponentUpdate() {
        return false
    }

    fetchBalance() {
        return fetchBalance(this.asset_id).then(balance => {
            const collector = collect()
            state.view.balance = bigNumber(balance)
            state.view.balance_fee = bigNumber(balance) // balance_fee is used for erc20 tokens
            collector.emit()
            return balance
        })
    }

    fetchFee({ amount, use_cache }) {
        return repeatUntilResolve(
            this.Coin.fetchRecomendedFee,
            [
                {
                    use_cache,
                    amount,
                    address: this.asset.address
                }
            ],
            { timeout: TIMEOUT_BETWEEN_EACH_FAIL_FETCH_FEE }
        ).then(fee => this.Coin.cutDecimals(fee))

        // return this.Coin.fetchRecomendedFee({
        //     use_cache,
        //     amount,
        //     address: this.asset.address
        // })
        //     .then(fee => this.Coin.cutDecimals(fee))
        //     .catch(e => {
        //         console.error(e)
        //         setTimeout(
        //             () => this.fetchFee({ use_cache }),
        //             TIMEOUT_BETWEEN_EACH_FAIL_FETCH_FEE
        //         )
        //     })
    }

    updateAmount(amount_string) {
        // console.log('updateAmount', typeof amount_string, amount_string)
        state.view.amount = bigNumber(this.Coin.cutDecimals(amount_string))
    }
    updateFee(fee_string) {
        // console.log('updateFee', typeof fee_string, fee_string)
        state.view.fee = bigNumber(this.Coin.cutDecimals(fee_string))
    }

    updateAmounts({ amount1, amount2 }) {
        const collector = collect()
        const symbol = this.asset.symbol
        const price = getPrice(symbol)
        if (amount1 !== undefined) {
            state.view.amount1_input = amount1
            state.view.amount2_input = limitDecimals(
                bigNumber(price)
                    .times(parseNumberAsString(amount1))
                    .toFixed(),
                2
            )
        } else {
            state.view.amount2_input = amount2
            state.view.amount1_input = this.Coin.cutDecimals(
                bigNumber(parseNumberAsString(amount2))
                    .div(price)
                    .toFixed()
            )
        }

        this.updateAmount(parseNumberAsString(state.view.amount1_input))
        collector.emit()
    }

    updateRecomendedFee(fee) {
        const collector = collect()
        state.view.fee_recomended = fee
        this.updateFee(
            state.view.fee_input_visible
                ? state.view.fee_input
                : state.view.fee_recomended
        )
        collector.emit()
    }

    onChangeAmount(amount, type) {
        const collector = collect()
        this.updateAmounts({ [type]: amount })
        this.fetchFee({ amount: state.view.amount, use_cache: true }).then(
            fee => {
                this.updateRecomendedFee(fee)
                collector.emit()
            }
        )
    }
    onChangeAmount1(e) {
        this.onChangeAmount(e.target.value, 'amount1')
    }
    onChangeAmount2(e) {
        this.onChangeAmount(e.target.value, 'amount2')
    }

    onClickMax(e) {
        let amount_to_calc_fee = state.view.fee_input_visible
            ? bigNumber(state.view.balance_fee).minus(state.view.fee_input)
            : state.view.balance_fee

        state.view.loading_max = true
        this.fetchFee({ amount: amount_to_calc_fee, use_cache: true }).then(
            fee => {
                const collector = collect()
                this.updateRecomendedFee(fee)
                this.updateAmounts({
                    amount1: this.getMax.toFixed()
                })
                state.view.loading_max = false
                collector.emit()
            }
        )
    }

    onChangeAddress(e) {
        const collector = collect()
        const value = e.target.value.trim()
        state.view.address_input = value
        state.view.address_input_error = !this.Coin.isAddressCheck(value)
        collector.emit()
    }

    onClickFee(e) {
        e.preventDefault()
        const collector = collect()
        state.view.fee_input_visible = !state.view.fee_input_visible
        state.view.fee_input = state.view.fee_recomended
        this.updateFee(state.view.fee_recomended)
        collector.emit()
    }

    onChangeFee(e) {
        const collector = collect()
        this.updateFee(parseNumberAsString(e.target.value))
        state.view.fee_input = e.target.value
        collector.emit()
    }

    onChangePassword(e) {
        const collector = collect()
        state.view.password_input_invalid = false
        state.view.password_input = e.target.value.trim()
        collector.emit()
    }

    onNext(e) {
        const asset = this.asset
        const asset_id = this.asset_id
        const address = asset.address
        const password = state.view.password_input
        const private_key = getPrivateKey(asset_id, password)

        const collector = collect()
        state.view.error_when_create = false
        state.view.error_when_send = ''

        if (private_key) {
            state.view.loading = true
            this.Coin.createSimpleTx({
                private_key,
                toAddress: state.view.address_input, // to/destiny
                amount: state.view.amount, // amount to send
                fee: state.view.fee
            })
                .then(tx_raw => {
                    this.tx_raw = tx_raw
                    const collector = collect()
                    state.view.loading = false
                    setHref(
                        routes.sendAsset({ asset_id: this.asset_id }) + '/1'
                    )
                    collector.emit()
                })
                .catch(e => {
                    console.error(e)
                    const collector = collect()
                    state.view.error_when_create = true
                    state.view.loading = false
                    collector.emit()
                })
        } else {
            state.view.password_input_invalid = true
        }
        collector.emit()
    }

    onChangeProvider(index) {
        state.view.send_provider_selected = index
    }

    onShowRawTx(index) {
        state.view.show_tx_raw = true
    }

    onSend(e) {
        const provider = this.send_providers[state.view.send_provider_selected]
        const collector = collect()
        state.view.loading = true
        state.view.error_when_send = ''
        collector.emit()

        provider
            .send(this.tx_raw)
            .then(tx_id => {
                sendEventToAnalytics(
                    'send',
                    this.Coin.symbol,
                    state.view.amount
                )
                this.tx_id = tx_id
                const collector = collect()
                state.view.loading = false
                state.view.is_sent = true
                state.view.balance = Number(
                    bigNumber(state.view.balance)
                        .minus(state.view.amount)
                        .minus(state.view.fee)
                )
                collector.emit()
            })
            .catch(error => {
                console.error(error)
                const collector = collect()
                state.view.loading = false
                state.view.error_when_send = error
                collector.emit()
            })
    }

    get getMax() {
        const max = bigNumber(state.view.balance).minus(state.view.fee)
        return max.gt(0) ? max : 0
    }

    get getTotal() {
        return state.view.amount.plus(state.view.fee)
    }

    get isEnoughBalance() {
        return this.getTotal.lte(state.view.balance)
    }

    get isEnoughBalanceForFee() {
        return state.view.fee.lte(state.view.balance_fee)
    }

    get isValidForm() {
        return (
            !state.view.address_input_error &&
            state.view.address_input.length > 0 &&
            state.view.password_input.length > 0 &&
            state.view.amount.gt(0) &&
            state.view.fee.gt(0) &&
            !state.view.password_input_invalid
        )
    }

    render() {
        const symbol = this.asset.symbol
        const isEnoughBalance = this.isEnoughBalance
        const isEnoughBalanceForFee = this.isEnoughBalanceForFee
        const step_path = state.location.path[3]
        const step = state.view.is_sent
            ? 2
            : step_path !== undefined && this.tx_raw !== undefined
                ? Number(step_path)
                : 0

        // Removing tx_raw in case user click back in browser
        if (step === 0) delete this.tx_raw
        // console.log({ amount: state.view.amount.toFixed(), fee: state.view.fee.toFixed() })
        return React.createElement(SendTemplate, {
            step: step,
            color: this.Coin.color,
            address_input: state.view.address_input,
            address_input_error: state.view.address_input_error,
            amount: state.view.amount.toFixed(),
            amount1_input: state.view.amount1_input,
            amount2_input: state.view.amount2_input,
            symbol_crypto: symbol,
            symbol_crypto_fee: this.Coin.symbol_fee,
            symbol_currency: state.fiat,
            fee: state.view.fee.toFixed(),
            fee_input: state.view.fee_input,
            fee_input_visible: state.view.fee_input_visible,
            fee_input_fiat: formatCurrency(
                convertBalance(this.Coin.symbol_fee, state.view.fee.toFixed()),
                2
            ),
            fee_recomended: state.view.fee_recomended,
            fee_recomended_fiat: formatCurrency(
                convertBalance(this.Coin.symbol_fee, state.view.fee_recomended),
                2
            ),
            total: this.getTotal.toFixed(),
            password_input: state.view.password_input,
            password_input_invalid: state.view.password_input_invalid,
            isEnoughBalance: isEnoughBalance,
            isEnoughBalanceForFee: isEnoughBalanceForFee,
            isValidForm:
                this.isValidForm && isEnoughBalance && isEnoughBalanceForFee,
            isFeeLowerThanRecomended: state.view.fee.lt(
                state.view.fee_recomended
            ),
            error_when_create: state.view.error_when_create,
            send_provider_selected: state.view.send_provider_selected,
            send_providers: this.send_providers,
            show_tx_raw: state.view.show_tx_raw,
            tx_raw: this.tx_raw,
            loading: state.view.loading,
            error_when_send: state.view.error_when_send,
            tx_id: this.tx_id,
            tx_info: this.Coin.urlInfoTx(this.tx_id),
            url_decode_tx: this.Coin.urlDecodeTx(this.tx_raw),
            loading_max: state.view.loading_max,
            onChangeAddress: this.onChangeAddress,
            onChangeAmount1: this.onChangeAmount1,
            onChangeAmount2: this.onChangeAmount2,
            onClickMax: this.onClickMax,
            onClickFee: this.onClickFee,
            onChangeFee: this.onChangeFee,
            onChangePassword: this.onChangePassword,
            onNext: this.onNext,
            onChangeProvider: this.onChangeProvider,
            onShowRawTx: this.onShowRawTx,
            onSend: this.onSend
        })
    }
}

function SendTemplate({
    step,
    color,
    address_input,
    address_input_error,
    amount,
    amount1_input,
    amount2_input,
    symbol_crypto,
    symbol_crypto_fee,
    symbol_currency,
    fee,
    fee_input_fiat,
    fee_input,
    fee_input_visible,
    fee_recomended,
    fee_recomended_fiat,
    total,
    password_input,
    password_input_invalid,
    isEnoughBalance,
    isEnoughBalanceForFee,
    isValidForm,
    isFeeLowerThanRecomended,
    error_when_create,
    send_provider_selected,
    send_providers,
    show_tx_raw,
    tx_raw,
    loading,
    error_when_send,
    tx_id,
    tx_info,
    url_decode_tx,
    loading_max,
    onChangeAddress,
    onChangeAmount1,
    onChangeAmount2,
    onClickMax,
    onClickFee,
    onChangeFee,
    onChangePassword,
    onNext,
    onChangeProvider,
    onShowRawTx,
    onSend
}) {
    return (
        <CenterElement width="500px" media={styles.media.third}>
            <SwitchView active={step}>
                <Div>
                    <Div>
                        <Input
                            value={address_input}
                            error="Invalid address"
                            invalid={address_input_error}
                            onChange={onChangeAddress}
                            placeholder="Address"
                            width="100%"
                            text-align="center"
                        />
                    </Div>
                    <Div padding-top="10px">
                        <Div float="left">
                            <Button
                                line-height="54px"
                                width="72px"
                                font-size="15px"
                                border-radius="10px 0 0 10px"
                                border-right="1px solid transparent"
                                loadingIco="/static/image/loading.gif"
                                loading={loading_max}
                                onClick={onClickMax}
                            >
                                Max
                            </Button>
                        </Div>
                        <Div float="left" width="calc(100% - 72px)">
                            <InputDouble
                                invalid={!isEnoughBalance}
                                error="Not enough funds"
                                value1={amount1_input}
                                value2={amount2_input}
                                color1={color}
                                color2="#000"
                                label1={symbol_crypto}
                                label2={symbol_currency}
                                onChange1={onChangeAmount1}
                                onChange2={onChangeAmount2}
                            />
                        </Div>
                    </Div>
                    <Div clear="both" />

                    <Show if={fee_input_visible}>
                        <Div
                            text-align="center"
                            padding-top="10px"
                            position="relative"
                        >
                            <DivOverInput>{fee_input_fiat}</DivOverInput>
                            <Input
                                value={fee_input}
                                error="Very low fee"
                                color={color}
                                invalid={false}
                                onChange={onChangeFee}
                                placeholder="Network fee"
                                width="100%"
                                text-align="center"
                            />
                        </Div>
                    </Show>

                    <Show if={isFeeLowerThanRecomended}>
                        <Div padding-top="10px">
                            <Alert>
                                An appropriate network fee is required to
                                confirm this transaction. It is suggested to
                                apply the recommended network fee.
                            </Alert>
                        </Div>
                    </Show>

                    <Div text-align="center" padding="10px 0">
                        {/* <Show if={!fee_fetching}> */}
                        <TextFee href="#" onClick={onClickFee}>
                            <span>
                                {fee_input_visible
                                    ? 'Recommended Network Fee '
                                    : 'Fee '}
                            </span>
                            <Span color={color} font-weight="bold">
                                {fee_recomended}{' '}
                            </Span>
                            <Span color="#000" font-weight="bold">
                                {fee_recomended_fiat}
                            </Span>
                            <Show if={symbol_crypto !== symbol_crypto_fee}>
                                <span> ({symbol_crypto_fee})</span>
                            </Show>
                        </TextFee>
                        {/* </Show> */}
                    </Div>

                    <Div padding-top="10px">
                        <Input
                            invalid={password_input_invalid}
                            error="Invalid password"
                            placeholder="Password"
                            type="password"
                            width="100%"
                            text-align="center"
                            value={password_input}
                            onChange={onChangePassword}
                        />
                    </Div>

                    <Div padding-top="10px">
                        <ButtonBig
                            onClick={onNext}
                            disabled={!isValidForm}
                            font-size="14px"
                            width="100%"
                            loading={loading}
                            loadingIco="/static/image/loading.gif"
                        >
                            Next
                        </ButtonBig>
                    </Div>

                    <Show if={!isEnoughBalanceForFee}>
                        <Div padding-top="10px">
                            <Alert color={ERROR}>
                                This wallet does not have enough funds to afford
                                the network fee.
                            </Alert>
                        </Div>
                    </Show>

                    <Show if={error_when_create}>
                        <Div padding-top="10px">
                            <Alert color={ERROR}>
                                Something wrong ocurred when creating your
                                transaction. Please, try again later.
                            </Alert>
                        </Div>
                    </Show>
                </Div>
                <Div>
                    {/* <Div>
                        <IconBack size={25} color={styles.color.grey1} />
                    </Div> */}
                    <Div>
                        <Resume>
                            <ResumeLabel>Address</ResumeLabel>
                            <ResumeValue left={true}>
                                {address_input}
                            </ResumeValue>
                        </Resume>
                        <Resume>
                            <ResumeLabel>Amount</ResumeLabel>
                            <ResumeValue>
                                {amount} {symbol_crypto}
                            </ResumeValue>
                        </Resume>
                        <Resume>
                            <ResumeLabel>Network Fee</ResumeLabel>
                            <ResumeValue>
                                {fee} {symbol_crypto_fee}
                            </ResumeValue>
                        </Resume>
                        <Show if={symbol_crypto === symbol_crypto_fee}>
                            <Resume>
                                <ResumeLabel color={styles.color.background3}>
                                    Total
                                </ResumeLabel>
                                <ResumeValue color={styles.color.background3}>
                                    {total} {symbol_crypto}
                                </ResumeValue>
                            </Resume>
                        </Show>
                    </Div>
                    <Div padding-top="10px" clear="both">
                        <List>
                            {send_providers.map((provider, index) => (
                                <ListItem
                                    selected={index === send_provider_selected}
                                    onClick={e => onChangeProvider(index)}
                                >
                                    <ListItemLeft>
                                        <RadioButton
                                            checked={
                                                index === send_provider_selected
                                            }
                                        />
                                    </ListItemLeft>
                                    <ListItemRight>
                                        <ListItemTitle>
                                            {provider.name}
                                        </ListItemTitle>
                                        <ListItemUrl
                                            href={provider.url}
                                            target="_blank"
                                        >
                                            {provider.url}
                                        </ListItemUrl>
                                    </ListItemRight>
                                </ListItem>
                            ))}
                        </List>
                    </Div>
                    <Div padding-top="10px">
                        <ButtonBig
                            onClick={onSend}
                            font-size="14px"
                            width="100%"
                            loading={loading}
                            loadingIco="/static/image/loading.gif"
                        >
                            Send / Broadcast
                        </ButtonBig>
                    </Div>
                    <Show if={error_when_send !== ''}>
                        <Div padding-top="10px">
                            <Alert color={ERROR}>{error_when_send}</Alert>
                        </Div>
                    </Show>
                    <Div padding-top="20px" text-align="center">
                        <TransparentInfo
                            show={show_tx_raw}
                            text={
                                <LinkOpenHex onClick={onShowRawTx}>
                                    Show raw transaction
                                </LinkOpenHex>
                            }
                        >
                            <CodeBox>{tx_raw}</CodeBox>
                            {url_decode_tx === '' ? null : (
                                <Label size="11px">
                                    <a
                                        href="https://live.blockcypher.com/btc/decodetx/"
                                        target="_blank"
                                    >
                                        Decode raw transaction
                                    </a>
                                </Label>
                            )}
                        </TransparentInfo>
                    </Div>
                </Div>
                <Div padding-top="10px">
                    <ConfirmationCircle sent={step === 2}>
                        <img src="/static/image/send.svg" width="60" />
                    </ConfirmationCircle>
                    <Div
                        padding-top="20px"
                        font-size="24px"
                        font-weight="900"
                        text-align="center"
                    >
                        Transaction Sent!
                    </Div>
                    <Div padding-top="10px">
                        <ConfirmationLink href={tx_info} target="_blank">
                            {tx_id}
                        </ConfirmationLink>
                    </Div>
                </Div>
            </SwitchView>
        </CenterElement>
    )
}

const TextFee = styled.a`
    font-size: 12px;
    color: ${styles.color.grey1};
    &:hover {
        color: #000;
    }
`

const DivOverInput = styled.div`
    position: absolute;
    z-index: 1;
    line-height: 34px;
    font-weight: bold;
    font-size: 12px;
    right: 10px;
    top: 13px;
    color: #000;
    pointer-events: none;
`

const List = styled.div`
    & > div {
        margin-bottom: 5px;
    }
`

const ListItem = styled.div`
    min-height: 55px;
    border: 3px solid ${styles.color.background1};
    background-color: ${props =>
        props.selected ? styles.color.background1 : 'transparent'};
    &:hover {
        background-color: ${styles.color.background1};
    }
    & > div {
        float: left;
    }
`

const ListItemLeft = styled.div`
    padding: 18px 15px;
`
const ListItemRight = styled.div`
    width: calc(100% - 50px);
`
const ListItemTitle = styled.div`
    font-weight: bold;
    font-size: 16px;
    line-height: 16px;
    padding-top: 12px;
    color: ${styles.color.front3};
`
const ListItemUrl = styled.a`
    font-size: 11px;
    color: ${styles.color.grey1};
    display: inline-block;
    text-decoration: none;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    &:hover {
        text-decoration: underline;
        color: ${styles.color.front3};
    }
    ${styles.media.fourth} {
        display: block;
    }
`

function TransparentInfo({ children, show = false, height, text }) {
    return (
        <TransparentInfoStyled show={show} height={height}>
            <div className="overlay" />
            <div className="text">{text}</div>
            <div>{children}</div>
        </TransparentInfoStyled>
    )
}
const TransparentInfoStyled = styled.div`
    height: ${props => (!props.show ? props.height || '50px' : 'auto')};
    overflow: ${props => (!props.show ? 'hidden' : 'auto')};
    position: relative;
    & .text {
        display: ${props => (!props.show ? 'block' : 'none')};
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translateX(-50%) translateY(-50%);
    }
    & .overlay {
        display: ${props => (!props.show ? 'block' : 'none')};
        position: absolute;
        top: 0;
        left: 0;
        background: rgba(255, 255, 255, 0.8);
        width: 100%;
        height: 100%;
    }
`

function CodeBox({ children }) {
    return (
        <CodeBoxView>
            <span>{children}</span>
        </CodeBoxView>
    )
}

const CodeBoxView = styled.div`
    padding: 10px;
    border: 1px solid ${styles.color.background4};
    border-radius: 3px;
    & > span {
        text-align: left;
        word-wrap: break-word;
        display: inline-block;
        font-size: 10px;
        color: ${styles.color.grey1};
        font-family: monospace;
        width: 100%;
    }
`

const LinkOpenHex = styled.a`
    font-weight: bold;
    color: ${styles.color.background3};
    text-shadow: 0px 0px 15px #ffffff;
    font-size: 13px;
    text-decoration: underline;
    cursor: pointer;
    &:hover {
        opacity: 0.6;
    }
`

const Resume = styled.div`
    clear: both;
    padding-top: 5px;
`

const ResumeLabel = styled.div`
    float: left;
    width: 90px;
    font-size: 13px;
    color: ${props => props.color || styles.color.grey1};
    user-select: auto;
`
const ResumeValue = styled.div`
    float: ${props => (props.left ? 'none' : 'right')};
    color: ${props => props.color || styles.color.front3};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 13px;
    font-weight: bold;
    text-align: right;
    user-select: auto;
`

const ConfirmationCircle = styled.div`
    position: relative;
    width: 155px;
    height: 155px;
    background: #34c362;
    border: 8px solid #54d37e;
    border-radius: 50%;
    text-align: center;
    margin: 0 auto;
    line-height: 205px;
    box-shadow: 0px 6px 12px 0px rgba(0, 0, 0, 0.2);
    animation: ${props =>
        props.sent ? 'sent 2s cubic-bezier(.175, .885, .32, 1.275)' : 'none'};
    @keyframes sent {
        0% {
            transform: scale(.7);
        }
        30% {
            transform: scale(.5);
        }
        100% {
            transform: scale(1);
        }
    }

    & img {
        display: block;
        position: absolute;
        transform: translate(148px,-73px);
        opacity: 0;
        animation: ${props =>
            props.sent
                ? 'sent2 3s cubic-bezier(.175, .885, .32, 1.275)'
                : 'none'};
        @keyframes sent2 {
            0% {
                transform: translate(45px,45px);
                opacity: 1;
            }
            80% {
                transform: translate(45px,45px);
                opacity: 1;
            }
            85% {
                transform: translate(35px,55px);
                opacity: 1;
            }
            100% {
                transform: translate(148px,-73px);
                opacity: 1;
            }
        }
    }
}
    
`

const ConfirmationLink = styled.a`
    color: ${styles.color.background2};
    font-size: 12px;
    font-weight: bold;
    text-align: center;
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    letter-spacing: 0.5px;
    &:hover {
        color: ${styles.color.background3};
    }
`
