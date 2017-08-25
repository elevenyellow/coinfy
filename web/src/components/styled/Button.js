import styled from 'styled-components'
import styles from '/const/styles'

export default styled.button`
color: ${props=>props.red ? styles.color.red2 : styles.color.front5};
background-image: linear-gradient(#fff,${styles.color.background1});
border: 1px solid ${props=>props.red ? styles.color.red : styles.color.background5};
padding: 8px 20px 8px;
font-weight: bold;
font-size: 12px;
display: inline-block;
line-height: 20px;
cursor: pointer;
border-radius: 4px;
width: ${props=>props.width};
outline: none;
&:hover {
    color: ${styles.color.background3};
    border-color: ${styles.color.background3};
}
&:active {
    background-image: linear-gradient(${styles.color.background1},${styles.color.background1});
}
${props=>{
    if (props.disabled) return `
    cursor:default;
    background-image: none;
    background-color: ${styles.color.disabled};
    border-color: ${styles.color.disabled} !important;
    color: grey !important;
    `;
}}
`