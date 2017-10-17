import React from 'react'
import styled from 'styled-components'
import styles from '/const/styles'
import Div from '/components/styled/Div'

export class PopupManager extends React.Component {
    constructor(props) {
        super(props)

        // binding
        this.onKeyDown = this.onKeyDown.bind(this)
        this.eventKeydown = document.addEventListener('keydown', this.onKeyDown)
    }

    onKeyDown(e) {
        e = e || window.event
        let isEscape = false
        if (this.firstPopup) {
            if (e.keyCode == 27 && this.firstPopup.props.onClose)
                this.firstPopup.props.onClose(e)
            else if (e.keyCode == 13 && this.firstPopup.props.onKeyEnter)
                this.firstPopup.props.onKeyEnter(e)
        }
    }

    componentWillUnmount() {
        this.eventKeydown = document.removeEventListener(
            'keydown',
            this.onKeyDown
        )
    }

    render() {
        const props = this.props
        // const childrenWithProps = React.Children.map(props.children, child => {
        //   return child.type === DropdownItems ? React.cloneElement(child, {open:props.open}) : child
        // })
        let maxIndex = 0
        let assigned = false
        let childrens = Array.isArray(props.children)
            ? props.children
            : [props.children]
        delete this.firstPopup
        childrens.forEach((child, index) => {
            if (child) {
                let attrs = child.props || child.attrs
                if (attrs.open) {
                    if (attrs.zIndex > 0 && attrs.zIndex >= maxIndex) {
                        assigned = true
                        maxIndex = attrs.zIndex
                        this.firstPopup = child
                    } else if (!assigned) this.firstPopup = child
                }
            }
        })

        return (
            <PopupManagerStyled {...props}>
                {props.children}
            </PopupManagerStyled>
        )
    }
}

const PopupManagerStyled = styled.div`
    box-sizing: content-box;
    z-index: ${props => props.zIndex};
    position: absolute;
`

export class Popup extends React.Component {
    constructor(props) {
        super(props)
    }

    onClickBackground(e) {
        if (this.props.onClose) this.props.onClose(e)
    }

    onClickPopup(e) {
        e.stopPropagation()
    }

    render() {
        const props = this.props
        return (
            <PopupStyled {...props}>
                <div
                    className="eyc-background"
                    onClick={this.onClickBackground.bind(this)}
                >
                    <div
                        className="eyc-popup"
                        onClick={this.onClickPopup.bind(this)}
                    >
                        <div>
                            {props.children}
                        </div>
                    </div>
                </div>
            </PopupStyled>
        )
    }
}

const PopupStyled = styled.div`
    display: ${props => (props.open ? 'table' : 'none')};
    box-sizing: content-box;
    position: fixed;
    height: 100%;
    width: 100%;
    left: 0;
    top: 0;
    z-index: ${props => props.zIndex};

    & .eyc-background {
        box-sizing: content-box;
        display: table-cell;
        vertical-align: middle;
        background-color: rgba(0,0,0,.35);
    }

    & .eyc-popup {
        box-sizing: content-box;
        border-radius: 6px;
        background-color: white;
        width: ${props => props.width};
        margin-left: auto;
        margin-right: auto;
        margin-top: -4%;

        ${styles.media.fourth} {
            width: calc(100% - 20px);
            margin-right: 10px;
            margin-left: 10px;
        }
    }
`
// box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.22);

export class PopupHeader extends React.Component {
    constructor(props) {
        super(props)
    }

    onClickClose(e) {
        if (this.props.onClose) this.props.onClose(e)
    }

    render() {
        const props = this.props
        return (
            <PopupHeaderStyled {...props}>
                <div className="eyc-title">
                    {props.children}
                </div>
                <div
                    className="eyc-close"
                    onClick={this.onClickClose.bind(this)}
                >
                    <span />
                </div>
                <Div clear="both" />
            </PopupHeaderStyled>
        )
    }
}

const PopupHeaderStyled = styled.div`
    box-sizing: content-box;
    color: ${styles.color.front3};
    padding: 15px 20px;
    border-bottom: 1px solid ${styles.color.background4};

    & .eyc-title {
        box-sizing: content-box;
        float: left;
        font-weight: bold;
        font-size: 18px;
    }

    & .eyc-close {
        box-sizing: content-box;
        float: right;
        height: 25px;
    }
    & .eyc-close span {
        box-sizing: content-box;
        cursor: pointer;
        display: inline-block;
        width: 25px;
        height: 25px;
        overflow: hidden;
        position: relative;
    }

    & .eyc-close span::before,
    .eyc-close span::after {
        box-sizing: content-box;
        content: '';
        position: absolute;
        height: 3px;
        margin-top: -2px;
        width: 100%;
        top: 50%;
        left: 0;
        background: ${styles.color.front2};
    }
    & .eyc-close:hover span::before,
    .eyc-close:hover span::after {
        box-sizing: content-box;
        background: ${styles.color.background2};
    }
    & .eyc-close span::before {
        box-sizing: content-box;
        transform: rotate(45deg);
    }
    & .eyc-close span::after {
        box-sizing: content-box;
        transform: rotate(-45deg);
    }
`

export class PopupContent extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const props = this.props
        return (
            <PopupContentStyled {...props}>
                {props.children}
            </PopupContentStyled>
        )
    }
}

const PopupContentStyled = styled.div`
    box-sizing: content-box;
    padding: 20px;
    color: ${styles.color.front3};
    line-height: 21px;
    font-size: 15px;
`

export class PopupFooter extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        const props = this.props
        const childrens = Array.isArray(props.children)
            ? props.children.slice(0).reverse()
            : props.children
        return (
            <PopupFooterStyled {...props}>
                <div className="eyc-buttons">
                    {childrens}
                </div>
                <Div clear="both" />
            </PopupFooterStyled>
        )
    }
}

const PopupFooterStyled = styled.div`
    box-sizing: content-box;
    padding: 15px 20px;
    background: ${styles.color.background1};
    border-radius: 0px 0px 5px 5px;

    & .eyc-buttons > * {
        box-sizing: content-box;
        float: right;
        margin-left: 10px;
    }
`
