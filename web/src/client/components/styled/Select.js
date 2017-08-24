
import styled from 'styled-components'
import styles from '/const/styles'

export default styled.select`
${props=>{
    if (props.width) return 'width:'+props.width+';'
}}
border: 1px solid ${props=>props.invalid ? `${styles.color.error} !important` : styles.color.background4};
background-color: #FFFFFF;
font-weight: 500;
outline: none;
font-family: monospace;
font-size: 14px;
color:${styles.color.front6};
box-shadow:0 1px 1px 0 rgba(0,0,0,0.05) inset;
box-sizing: border-box;
height: 38px;
`