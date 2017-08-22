import styled from 'styled-components'
import styles from '/styles'

export default styled.input`
width: ${props=>props.width||'auto'};
color: ${styles.color.front3};
font-size: 35px;
font-weight: 900;
margin: 0;
border:0;
font-family: inherit;
outline: none;
border-radius: 2px;
:hover {
    background-color: #EEE;
}
::-webkit-input-placeholder { /* Chrome */
    color: #DDD;
  }
:-ms-input-placeholder { /* IE 10+ */
color: #DDD;
}
::-moz-placeholder { /* Firefox 19+ */
color: #DDD;
opacity: 1;
}
:-moz-placeholder { /* Firefox 4 - 18 */
color: #DDD;
opacity: 1;
}
`