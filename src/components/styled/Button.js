import styled from 'styled-components'
import styles from '/const/styles'

// color: #fff;
// background-image: linear-gradient(#e84848,#c83838);
// border: 1px solid #bc1212;

export default styled.button`
    color: ${props => (props.red ? '#fff' : styles.color.front5)};
    background-image: ${props =>
        props.red
            ? `linear-gradient(${styles.color.red3},${styles.color.red4})`
            : `linear-gradient(#fff,${styles.color.background1})`};
    border: 1px solid
        ${props => (props.red ? styles.color.red4 : styles.color.background5)};
    padding: 8px 20px 8px;
    font-weight: bold;
    font-size: ${props => (props['font-size'] ? props['font-size'] : '12px')};
    display: inline-block;
    line-height: ${props =>
        props['line-height'] ? props['line-height'] : '20px'};
    cursor: pointer;
    border-radius: ${props =>
        props['border-radius'] ? props['border-radius'] : '4px'};
    border-right: ${props =>
        props['border-right'] ? props['border-right'] : 'auto'};
    width: ${props => props.width};
    margin: ${props => props.margin};
    display: block;
    outline: none;
    &:hover {
        ${props =>
            props.disabled || props.loading
                ? styles.color.disabled
                : !props.red
                  ? `
        color: ${styles.color.background3};
        border-color: ${styles.color.background3};
    `
                  : `
        background: ${styles.color.red3};
    `};
    }
    &:active {
        background: ${props =>
            props.disabled || props.loading
                ? styles.color.disabled
                : props.red ? styles.color.red4 : styles.color.background1};
    }
    ${props => {
        let css = ''
        if (props.disabled || props.loading)
            css = `
    pointer-events: none;
    cursor:default;
    background-image: none;
    background-color: ${styles.color.disabled};
    border-color: ${styles.color.disabled} !important;
    color: ${styles.color.grey1} !important;
    `
        if (props.loading)
            css += `
    background: url('${props.loadingIco}') no-repeat center center / 18px;
    background-color: ${styles.color.disabled};
    color: transparent !important;
    `
        return css
    }};
`
