import React from 'react'
import Container from '/components/views/BTC/Container'
import Export from '/components/views/ETH/Export'
import Send from '/components/views/ERC20/Send'

export default function ContainerERC20() {
    return <Container Send={Send} Export={Export} />
}
