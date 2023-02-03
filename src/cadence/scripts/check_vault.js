export const checkVaultTx = `

import FlowToken from 0x7e60df042a9c0868
import FungibleToken from 0x9a0766d93b6608b7

pub fun main(account: Address): Bool {
    let VaultCheck = getAccount(account).getCapability<&FlowToken.Vault{FungibleToken.Balance}>(/public/flowTokenBalance).check()
    return VaultCheck
}
`
