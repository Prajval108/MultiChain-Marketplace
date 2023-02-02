export const getTokenBalance = `
import Rumble from 0x342967d90036e986
import FungibleToken from 0x9a0766d93b6608b7

pub fun main(account: Address): UFix64 {
    let RecipientVault = getAccount(account).getCapability(/public/RumblePublic)
                            .borrow<&Rumble.Vault{FungibleToken.Balance}>()
                            ?? panic("Could not get Recipient Vault reference")
    return RecipientVault.balance
}
`