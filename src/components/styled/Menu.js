import React, { Component } from 'react'
import styled from 'styled-components'
import styles from '/const/styles'
import SelectDropdown from '/components/styled/SelectDropdown'

export class Menu extends Component {
    componentWillMount() {
        this.onChange = this.onChange.bind(this)
    }

    onChange(e) {
        this.onClicks[e.target.value](e)
    }

    getLabel(child) {
        let childrens = child.children[0].children
        for (let i in childrens)
            if (typeof childrens[i] == 'string') return childrens[i]
    }

    render() {
        this.onClicks = []
        const childrens = this.props.children
        const selects = childrens.map((child, index) => {
            // let constructor = child.nodeName // || child.type
            // let children = child.children // || child.props
            let attrs = child.attributes // || child.props
            let label = this.getLabel(child)
            this.onClicks[index] = attrs.onClick
            return (
                <option
                    selected={attrs.selected}
                    disabled={attrs.disabled}
                    value={index}
                >
                    {label}
                </option>
            )
        })

        return (
            <div>
                <MenuSelectable>
                    <SelectDropdown onChange={this.onChange}>
                        {selects}
                    </SelectDropdown>
                </MenuSelectable>
                <MenuContent>{childrens}</MenuContent>
            </div>
        )
    }
}

const MenuSelectable = styled.div`
    display: none;
    & > * > * {
        width: 100%;
    }
    ${styles.media.second} {
        display: block;
    }
`

// export const Selectable = styled.div`
// display: none;
// display: block;
// font-weight: bold;
// border: 2px solid #f5f7f8;
// padding: 6px 13px;
// border-radius: 24px;
// font-size: 14px;
// color: #aaaaaa;

// ${styles.media.second} {
//     display: block;
// }
// `

export const MenuContent = styled.div`
    width: 100%;
    height: 38px;
    clear: both;
    border-bottom: 2px solid;
    border-color: ${styles.color.background1};
    ${styles.media.second} {
        display: none;
        height: auto;
        border-bottom: 0;
    }
`

export const MenuContentItem = styled.div`
    float: left;
    padding: 10px 20px;
    margin: 0 2px;
    border-bottom: 2px solid;
    border-color: transparent;
    cursor: pointer;
    color: ${styles.color.grey1};
    &:hover {
        border-color: ${styles.color.background2};
        color: ${styles.color.background2};
    }

    ${props => {
        if (props.disabled) {
            return `
      color: ${styles.color.disabled} !important;
      cursor: default;
      border-color: transparent !important;
      `
        } else if (props.selected && props.disabled !== true) {
            return `
        border-color: ${styles.color.background2};
        color: ${styles.color.background2};
        `
        }
    }} ${styles.media.second} {
        float: none;
        width: calc(100% - 20px);
        padding: 8px 10px;
        border-bottom-width: 0;
        border-left-style: solid;
        border-left-width: 2px;
    }
`

export const MenuContentItemIcon = styled.div`
    display: none;
    float: left;
    margin-right: 10px;
    top: -2px;
    position: relative;
    transform: ${props => props.transform || 'auto'};
    & svg {
        width: 15px;
        height: 15px;
    }
`

export const MenuContentItemText = styled.div`
    color: ${props => props.color || 'inherit'};
    font-size: 13px;
    font-weight: 100;
    letter-spacing: 0.5px;
`
