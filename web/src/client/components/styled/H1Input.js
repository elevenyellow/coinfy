import styled from 'styled-components'
import styles from '/const/styles'

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
:hover, :focus {
    background-color: ${styles.color.background1};
}
::-webkit-input-placeholder { /* Chrome */
    color: rgba(90,97,104,.2);
  }
:-ms-input-placeholder { /* IE 10+ */
color: rgba(90,97,104,.2);
}
::-moz-placeholder { /* Firefox 19+ */
color: rgba(90,97,104,.2);
opacity: 1;
}
:-moz-placeholder { /* Firefox 4 - 18 */
color: rgba(90,97,104,.2);
opacity: 1;
}
`