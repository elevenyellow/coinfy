import styled from 'styled-components'
import styles from '/const/styles'

export default styled.div`
    width: 30px;
    float: left;
    padding-top: 5px;
    padding-right: 10px;
    & > img {
        width: 30px;
        height: 30px;
    }
    ${styles.media.second} {
        padding-top: 2px;
        padding-right: 5px;
        & > img {
            width: 25px;
            height: 25px;
        }
    }
    ${styles.media.fourth} {
        display: none;
    }
`
