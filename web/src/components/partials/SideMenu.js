import React, { Component } from 'react'
import { createObserver } from 'dop'
import styled from 'styled-components'
import { Show } from '/doprouter/react'
import IconMore from 'react-icons/lib/md/more-vert'


import routes from '/const/routes'
import styles from '/const/styles'
import { currencies } from '/const/currencies'

import { numberWithSeparation, round } from '/api/numbers'
import { Assets } from '/api/Assets'

import state from '/store/state'
import {
    setHref,
    exportAssets,
    importAssetsFromFile,
    closeSession
} from '/store/actions'

import CountUp from 'react-countup'
import {
    DropDown,
    DropDownItem,
    DropDownMenu,
    DropDownArrow
} from '/components/styled/Dropdown'
import ButtonBig from '/components/styled/ButtonBig'
import AssetList from '/components/partials/AssetList'

export default class Left extends Component {
    componentWillMount() {
        this.observer = createObserver(mutations => this.forceUpdate())
        this.observer.observe(state, 'sideMenuOpen')

        this.state = { balance_start: state.balance }
        this.createRef = this.createRef.bind(this)
    }
    componentWillUnmount() {
        this.observer.destroy()
    }
    shouldComponentUpdate() {
        return false
    }

    componentDidMount() {
        // Hidding sidebarmenu user click back
        window.addEventListener('popstate', function(e) {
            if (state.sideMenuOpen) {
                state.sideMenuOpen = false
                history.go(1) // this is a shitty hack because: https://stackoverflow.com/questions/32432296/is-it-possible-to-e-preventdefault-in-window-onpopstate/32432366#32432366
            }
        })
        // Hidding sidebar when user change size of screen
        window.addEventListener('resize', function(e) {
            if (state.sideMenuOpen) state.sideMenuOpen = false
        })


    }

    createRef(e) {
        if (e) this.menuElement = e.base
    }

    onClickBackground() {
        state.sideMenuOpen = false
    }

    render() {
        const balance_start = this.state.balance_start
        this.state.balance_start = state.balance
        return React.createElement(LeftTemplate, {
            open: state.sideMenuOpen,
            onClickBackground: this.onClickBackground,
            createRef: this.createRef,
            ascii: currencies[state.currency].ascii,
            balance_start: balance_start,
            balance_end: state.balance,
            totalAssets: state.totalAssets
        })
    }
}

function LeftTemplate({
    open,
    onClickBackground,
    createRef,
    ascii,
    balance_start,
    balance_end,
    totalAssets
}) {
    return (
        <Container>
            <Menu open={open} ref={createRef}>
                <Head>
                    <div>
                        <HeadAssets>{totalAssets} assets</HeadAssets>
                        <HeadBalance>
                            <HeadBalanceAscii>$</HeadBalanceAscii>
                            <HeadBalanceNumber>
                                <CountUp
                                    start={balance_start}
                                    end={balance_end}
                                    duration={5}
                                    useEasing={true}
                                    useGrouping={true}
                                    separator=","
                                />
                            </HeadBalanceNumber>
                        </HeadBalance>
                    </div>
                </Head>
                <Content>
                    <AssetList />
                </Content>
                <Footer>
                    <ButtonBig
                        onClick={e => {
                            setHref(routes.add())
                        }}
                    >
                        Add Asset
                    </ButtonBig>
                </Footer>
            </Menu>
            <Background open={open} onClick={onClickBackground} />
        </Container>
    )
}

const Container = styled.div`
    user-select: none;
    z-index: 3;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
`

const Background = styled.div`
    ${styles.media.first} {
        transition: 0.4s ease all;
        width: 100%;
        height: 100%;
        pointer-events: ${props => (props.open ? 'auto' : 'none')};
        display: block;
        background-color: rgba(0, 0, 0, ${props => (props.open ? 0.35 : 0)});
    }
`

const Menu = styled.div`
    pointer-events: auto;
    position: relative;
    height: calc(100% - ${styles.paddingOut} - ${styles.headerHeight});
    width: ${styles.leftColumn};
    left: ${styles.paddingOut};
    top: ${styles.headerHeight};
    ${styles.media.first} {
        transition: 0.4s ease all;
        box-shadow: 4px 0 9px 0px
            rgba(0, 0, 0, ${props => (props.open ? 0.2 : 0)});
        width: ${styles.leftColumnMobile};
        position: fixed;
        left: ${props => (props.open ? 0 : '-' + styles.leftColumnMobile)};
        top: 0;
        height: 100%;
        background: white;
    }
`

const Head = styled.div`
    height: 75px;
    background: white;
    margin-top: -45px;
    border-radius: 50% 50% 0 0;
    border-bottom: 1px solid #e5e9eb;
    & > div {
        padding-top: 13px;
    }
    ${styles.media.first} {
        margin-top: 0;
    }
`

const HeadBalance = styled.div`text-align: center;`

const HeadBalanceNumber = styled.span`
    color: ${styles.color.black};
    font-weight: 900;
    font-size: 25px;
    line-height: 25px;
`
const HeadBalanceAscii = styled.span`
    position: relative;
    top: -7px;
    font-size: 15px;
    font-weight: bold;
    padding-right: 1px;
    color: ${styles.color.black};
`

const HeadAssets = styled.div`
    color: ${styles.color.grey1};
    font-size: 13px;
    font-weight: 100;
    letter-spacing: 0.5px;
    text-align: center;
`

const Content = styled.div`
    height: calc(100% - (60px + (75px - 45px)));
    overflow-y: auto;
    width: 100%;
    &::-webkit-scrollbar {
        width: 8px;
        height: 8px;
    }
    &::-webkit-scrollbar-thumb {
        background: ${styles.color.background4};
        cursor: grab;
    }
    &::-webkit-scrollbar-track {
        background: transparent;
    }
    ${styles.media.first} {
        height: calc(100% - (60px + (75px)));
    }
`

const Footer = styled.div`
    width: calc(100% - 20px);
    padding: 10px;
`

// const balance_start = this.state.balance_start
// this.state.balance_start = state.balance
// ascii: currencies[state.currency].ascii,
// balance_start: balance_start,
// balance_end: state.balance,
// // balance: numberWithSeparation(round(state.balance)),
// color: state.balance > 0 ? Assets.BTC.color : '#DDDDDD',
// menuOpen: state.menuOpen,
// onMenuOpen: this.onMenuOpen,
// onMenuClose: this.onMenuClose,
// onExport: this.onExport,
// onImport: this.onImport,
// onClose: this.onClose,
// totalAssets: state.totalAssets

// <Chart onClick={e => setHref(routes.home())}>
// <ChartBalance>
//     <ChartLabel>
//         Total balance
//     </ChartLabel>
//     <ChartNumber>
//         <AmountSuper>{ascii}</AmountSuper>
//         <Amount>
//             <CountUp
//                 start={balance_start}
//                 end={balance_end}
//                 duration={5}
//                 useEasing={true}
//                 useGrouping={true}
//                 separator=","
//             />
//         </Amount>
//         {/* <AmountSuper>.52</AmountSuper>  */}
//     </ChartNumber>
// </ChartBalance>
// <ChartChart>
//     <svg width="100%" height="200" viewBox="0 0 28 28">
//         <circle
//             cx="14"
//             cy="15"
//             r="12.3"
//             fill="transparent"
//             stroke={color}
//             strokeWidth="1.3"
//         />
//     </svg>
// </ChartChart>
// </Chart>
// <Header>
// <HeaderLeft>
//     <IconMore size={35} color={styles.color.front2} />
// </HeaderLeft>
// <HeaderRight />
// </Header>

// const Chart = styled.div`cursor: pointer;`
// const ChartChart = styled.div``

// const ChartBalance = styled.div`
//     position: absolute;
//     text-align: center;
//     width: 100%;
//     padding-top: 80px;
// `

// const ChartLabel = styled.div`
//     font-size: 12px;
//     color: ${styles.color.front2};
// `

// const ChartNumber = styled.div`line-height: 35px;`

// const Header = styled.div`
// position: absolute;
// top: 0;
// `
// const HeaderLeft = styled.div`
// float: left;
// padding-left: 5px;
// padding-top: 10px;
// `
// const HeaderRight = styled.div`float: right;`

// const AmountSuper = styled.span`
//     position: relative;
//     top: -10px;
//     font-size: 20px;
//     font-weight: bold;
//     color: ${styles.color.front3};
// `
// const Amount = styled.span`
//     font-size: 36px;
//     font-weight: bold;
//     color: ${styles.color.front3};
// `
