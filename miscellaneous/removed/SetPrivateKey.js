// import React, { Component } from 'react'
// import styled from 'styled-components'
// import { createObserver, collect } from 'dop'


// import routes from '/const/routes'
// import { BTC } from '/api/Coins'

// import { isPrivateKey, getAddressFromPrivateKey } from '/api/Coins/BTC'
// import { minpassword } from '/api/crypto'

// import state from '/store/state'
// import { setHref, setPrivateKey } from '/store/actions'
// import { getAsset } from '/store/getters'

// import Div from '/components/styled/Div'
// import Button from '/components/styled/Button'
// import Help from '/components/styled/Help'
// import Input from '/components/styled/Input'
// import Password from '/components/styled/Password'
// import { Label, SubLabel } from '/components/styled/Label'
// import CenterElement from '/components/styled/CenterElement'
// import {
//     FormField,
//     FormFieldLeft,
//     FormFieldRight,
//     FormFieldButtons
// } from '/components/styled/Form'



// export default class SetPrivateKeyBTC extends Component {
//     componentWillMount() {
//         this.observer = createObserver(m => this.forceUpdate())
//         this.observer.observe(state.view)

//         // Initial state
//         state.view = {
//             input: '',
//             password: '',
//             repassword: ''
//         }

//         // binding
//         this.onChangeInput = this.onChangeInput.bind(this)
//         this.onChangePassword = this.onChangePassword.bind(this)
//         this.onChangeRepassword = this.onChangeRepassword.bind(this)
//         this.onSubmit = this.onSubmit.bind(this)
//     }
//     componentWillUnmount() {
//         this.observer.destroy()
//     }
//     shouldComponentUpdate() {
//         return false
//     }


//     // Actions
//     onChangeInput(e) {
//         state.view.input = e.target.value.trim()
//     }
//     onChangePassword(e) {
//         state.view.password = e.target.value
//     }
//     onChangeRepassword(e) {
//         state.view.repassword = e.target.value
//     }
//     onSubmit(e) {
//         e.preventDefault()
//         const asset_id = state.location.path[1]
//         const collector = collect()
//         setPrivateKey(asset_id, state.view.input, state.view.password)
//         setHref(routes.asset(asset_id))
//         collector.emit()
//     }

//     // // Getters
//     get isInvalidRepassword() {
//         return (
//             state.view.password.length > 0 &&
//             state.view.repassword.length > 0 &&
//             state.view.password.length === state.view.repassword.length &&
//             state.view.password !== state.view.repassword
//         )
//     }
//     get isTheRightPrivateKey() {
//         const input = state.view.input
//         const asset_id = state.location.path[1]
//         const address = getAsset(asset_id).address
//         let isTheRightPrivateKey = false
//         if (isPrivateKey(input)) {
//             try {
//                 const newaddress = getAddressFromPrivateKey(input)
//                 if (newaddress === address) isTheRightPrivateKey = true
//             } catch (e) {}
//         }
//         return isTheRightPrivateKey
//     }

//     render() {
//         const isInvalidPrivateKey =
//             !this.isTheRightPrivateKey && state.view.input.length > 0
//         const isInvalidRepassword = this.isInvalidRepassword
//         const isValidForm =
//             state.view.input.length > 0 &&
//             state.view.password.length >= minpassword &&
//             state.view.password === state.view.repassword &&
//             !isInvalidPrivateKey &&
//             !isInvalidRepassword

//         return React.createElement(SetPrivateKeyBTCTemplate, {
//             input: state.view.input,
//             password: state.view.password,
//             repassword: state.view.repassword,
//             isInvalidPrivateKey: isInvalidPrivateKey,
//             isInvalidRepassword: isInvalidRepassword,
//             isValidForm: isValidForm,
//             onChangeInput: this.onChangeInput,
//             onChangePassword: this.onChangePassword,
//             onChangeRepassword: this.onChangeRepassword,
//             onSubmit: this.onSubmit
//         })
//     }
// }

// function SetPrivateKeyBTCTemplate({
//     input,
//     password,
//     repassword,
//     isInvalidPrivateKey,
//     isInvalidRepassword,
//     isValidForm,
//     onChangeInput,
//     onChangePassword,
//     onChangeRepassword,
//     onSubmit
// }) {
//     return (
//         <div>
//             <FormField>
//                 <FormFieldLeft>
//                     <Label>Private key</Label>
//                     <SubLabel>Type or paste your Private key in WIF format.</SubLabel>
//                 </FormFieldLeft>
//                 <FormFieldRight>
//                     <Input
//                         width="100%"
//                         value={input}
//                         onChange={onChangeInput}
//                         error={'Invalid private key'}
//                         invalid={isInvalidPrivateKey}
//                     />
//                 </FormFieldRight>
//             </FormField>
//             <FormField>
//                 <FormFieldLeft>
//                     <Label>Password</Label>
//                     <Help>
//                         Make sure that you remember this. This password can't be
//                         restored because we don't store it. For security reasons
//                         you will be asked often for this password.
//                     </Help>
//                     <SubLabel>
//                         This password encrypts your private key.
//                     </SubLabel>
//                 </FormFieldLeft>
//                 <FormFieldRight>
//                     <Password
//                         minlength={minpassword}
//                         value={password}
//                         onChange={onChangePassword}
//                         width="100%"
//                         type="password"
//                     />
//                 </FormFieldRight>
//             </FormField>
//             <FormField>
//                 <FormFieldLeft>
//                     <Label>Repeat Password</Label>
//                 </FormFieldLeft>
//                 <FormFieldRight>
//                     <Input
//                         minlength={minpassword}
//                         error={'Passwords do not match'}
//                         invalid={isInvalidRepassword}
//                         value={repassword}
//                         onChange={onChangeRepassword}
//                         width="100%"
//                         type="password"
//                     />
//                 </FormFieldRight>
//             </FormField>

//             <FormField>
//                 <FormFieldButtons>
//                     <Button
//                         width="200px"
//                         disabled={!isValidForm}
//                         onClick={onSubmit}
//                     >
//                         Set private key
//                     </Button>
//                 </FormFieldButtons>
//             </FormField>
//         </div>
//     )
// }
