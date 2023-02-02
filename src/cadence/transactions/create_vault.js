export const setupVaultTx = `

import Rumble from 0x342967d90036e986
import FungibleToken from 0x9a0766d93b6608b7
transaction () {

  prepare(acct: AuthAccount) {
   
      acct.save(<- Rumble.createEmptyVault(), to: /storage/RumbleVault)
      acct.link<&Rumble.Vault{FungibleToken.Receiver, FungibleToken.Balance}>(/public/RumblePublic, target: /storage/RumbleVault)
    
  }

  execute {
    log("Personal Vault is created successfully")  
  }
}
`
