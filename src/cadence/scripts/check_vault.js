export const checkVaultTx = `

import Rumble from 0x342967d90036e986
import FungibleToken from 0x9a0766d93b6608b7

pub fun main(account: Address): Bool {
    let VaultCheck = getAccount(account).getCapability<&Rumble.Vault{FungibleToken.Balance}>(/public/RumblePublic).check()
    return VaultCheck
}
`
