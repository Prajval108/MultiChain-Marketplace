export const setupUserTx = `
import ProjectR from 0x342967d90036e986
import NonFungibleToken from 0x342967d90036e986
import FungibleToken from 0x9a0766d93b6608b7
import Rumble from 0x342967d90036e986
import BloxmithMarketplace from 0x342967d90036e986

transaction {

  prepare(acct: AuthAccount) {
    acct.save(<- ProjectR.createEmptyCollection(), to: /storage/ProjectRCollection)
    acct.link<&ProjectR.Collection{ProjectR.CollectionPublic, NonFungibleToken.CollectionPublic}>(/public/ProjectRCollection, target: /storage/ProjectRCollection)
    acct.link<&ProjectR.Collection>(/private/ProjectRCollection, target: /storage/ProjectRCollection)
    
    let ProjectRCollection = acct.getCapability<&ProjectR.Collection>(/private/ProjectRCollection)
    let RumbleTokenVault = acct.getCapability<&Rumble.Vault{FungibleToken.Receiver}>(/public/RumblePublic)
    
    acct.save(<- BloxmithMarketplace.createSaleCollection(ProjectRCollection: ProjectRCollection, TokenVault: RumbleTokenVault), to: /storage/ProjectRSaleCollection)
    acct.link<&BloxmithMarketplace.SaleCollection{BloxmithMarketplace.SaleCollectionPublic}>(/public/ProjectRSaleCollection, target: /storage/ProjectRSaleCollection)
  }

  execute {
    log("A user stored a Collection and a SaleCollection inside their account")
  }
}

`