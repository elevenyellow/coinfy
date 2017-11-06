import React, { Component } from 'react'
import styled from 'styled-components'
import styles from '/const/styles'

export default function Checkbox(props) {
    return (
        <CheckboxStyled onClick={props.onChange} checked={props.checked} disabled={props.disabled}>
            <input {...props} type="checkbox" />
            <div />
            <span>{props.label}</span>
        </CheckboxStyled>
    )
}

const CheckboxStyled = styled.div`
box-sizing: content-box;
display:block;
height: 25px;
padding-top: 5px;

& input {
  box-sizing: content-box;
  display:none;
}
& div {
  position:relative;
  float: left;
  display: block;
  width: 13px;
  height: 13px;
  border-radius: 2px;
  vertical-align: top;
  cursor: ${props=>props.disabled ? 'default' : 'pointer'};
  background-color: ${props=> {
    if (props.disabled && props.checked)
      return styles.color.grey1
    else if (props.checked)
      return styles.color.background3
    else
      return 'white'
  }};
  border: 2px solid ${props=> {
    if (props.disabled)
      return styles.color.grey1
    else if (props.checked)
      return styles.color.background3
    else
      return styles.color.background3
  }};
  transition: all .35s ease;
  -webkit-transition: all .35s ease;
  -moz-transition: all 0.55s ease;
  -o-transition: all .35s ease;
}
& div:before {
  position: absolute;
  top: 0;
  left: 4px;
  width: 4px;
  height: 8px;
  content: "";
  border-color: white;
  border-style: solid;
  border-top: 0;
  border-right-width: 2px;
  border-bottom-width: 2px;
  border-left: 0;

  transform: scale(${props=>props.checked ? 1 : 0}) rotate(45deg);
  -webkit-transform: scale(${props=>props.checked ? 1 : 0}) rotate(45deg);
  -ms-transform: scale(${props=>props.checked ? 1 : 0}) rotate(45deg);
  -webkit-transform: scale(${props=>props.checked ? 1 : 0}) rotate(45deg);

  transition: all .35s ease;
  -webkit-transition: all .35s ease;
  -moz-transition: all 0.55s ease;
  -o-transition: all .35s ease;
}

& span {
    display: block;
    padding-left: 25px;
    font-size: 15px;
    line-height: 16px;
    font-weight: bold;
    color: ${props=> {
      if (props.disabled)
        return styles.color.grey1
      else if (props.checked)
        return styles.color.front3
      else
        return styles.color.front3
    }};
    vertical-align: top;
    transition: all .35s ease;
    -webkit-transition: all .35s ease;
    -webkit-transition: all .35s ease;
    -moz-transition: all 0.55s ease;
    -o-transition: all .35s ease;
}
`
