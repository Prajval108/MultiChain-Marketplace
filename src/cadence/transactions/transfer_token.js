export const transferTx = `

import Rumble from 0x342967d90036e986
import FungibleToken from 0x9a0766d93b6608b7

transaction (Recipient: Address, amount: UFix64) {

  prepare(acct: AuthAccount) {
    let sender = acct.borrow<&Rumble.Vault>(from: /storage/RumbleVault)
                  ?? panic ("Could not borrow the sender resources reference")

    let RecipientVault = getAccount(Recipient).getCapability(/public/RumblePublic)
                          .borrow<&Rumble.Vault{FungibleToken.Receiver}>()
                          ?? panic("Could not get Recipient Vault reference")

    RecipientVault.deposit(from: <- sender.withdraw(amount: amount))
  }

  execute {
    log("Token Transfer Successfully")    
  }
}
`
