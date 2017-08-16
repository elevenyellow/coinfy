import styled from 'styled-components'
import styles from '/styles'

export default styled.button`
border: 0;
background-color: ${styles.color.background2};
color: white;
font-weight: bold;
height: 40px;
width: ${props=>props.width||'100%'};
border-radius: 4px;
font-size: 15px;
letter-spacing: -0.2px;
cursor: pointer;
outline: none;
&:hover {
    background-color: ${styles.color.background3};
}
/*color: ${styles.color.front3};
background-image: linear-gradient(#fff,#f7f9fb);
background-color: #f7f9fb;
border: 1px solid #d4dce4;
-webkit-transition: 0.15s ease all;
transition: 0.15s ease all;*/
`