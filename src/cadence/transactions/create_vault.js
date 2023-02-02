export const setupVaultTx = `

import FlowToken from 0x7e60df042a9c0868
import FungibleToken from 0x9a0766d93b6608b7
transaction () {

  prepare(acct: AuthAccount) {
   
      acct.save(<- FlowToken.createEmptyVault(), to: /storage/Test1FlowTokenVault)
      acct.link<&FlowToken.Vault{FungibleToken.Receiver, FungibleToken.Balance}>(/public/Test1FlowTokenVault, target: /storage/Test1FlowTokenVault)
    
  }

  execute {
    log("Personal Vault is created successfully")  
  }
}
`
