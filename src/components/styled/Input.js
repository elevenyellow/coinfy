import React from 'react'
import styled from 'styled-components'
import styles from '/const/styles'


export default function Input(props) {
    const showerror = props.invalid && props.error ? <InputError>{props.error}</InputError> : null
    return (
        <div>
            <InputStyled {...props} />
            {showerror}
        </div>
    )
}


const InputStyled = styled.input`
${props=>{
    if (props.width) return 'width:'+props.width+';'
}}
border: 1px solid ${props=>props.invalid ? `${styles.color.error} !important` : styles.color.background4};
background: #FFF;
padding: 10px;
font-weight: 500;
outline: none;
font-family: monospace;
font-size: 14px;
color:${styles.color.front6};
box-shadow:0 1px 1px 0 rgba(0,0,0,0.05) inset;
box-sizing: border-box;
text-align: ${props=>props['text-align'] ? props['text-align'] : 'left'};

font-weight: bold;
font-size: 15px;
color: #000;
letter-spacing: 1px;


&:focus {
    box-shadow: none !important;
    border-color: ${styles.color.background3};
}
::-webkit-input-placeholder { /* Chrome */
    color: rgba(90,97,104,.4);
  }
:-ms-input-placeholder { /* IE 10+ */
color: rgba(90,97,104,.4);
}
::-moz-placeholder { /* Firefox 19+ */
color: rgba(90,97,104,.4);
opacity: 1;
}
:-moz-placeholder { /* Firefox 4 - 18 */
color: rgba(90,97,104,.4);
opacity: 1;
}
`
const InputError = styled.div`
font-size: 10px;
text-align: right;
color: ${styles.color.error};
font-weight: bold;
letter-spacing: 0.3px;
`
