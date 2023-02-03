export const setupUserTx = `
import NonFungibleToken from 0x631e88ae7f1d7c20
import sbNFT from 0xccdde98ef2a31d2e
import FungibleToken from 0x9a0766d93b6608b7
import FlowToken from 0x7e60df042a9c0868
import sbMarketplace from 0xccdde98ef2a31d2e

transaction {

  prepare(acct: AuthAccount) {
    acct.save(<- sbNFT.createEmptyCollection(), to: /storage/Test6sbNFTCollection)
    acct.link<&sbNFT.Collection{sbNFT.CollectionPublic, NonFungibleToken.CollectionPublic}>(/public/Test6sbNFTCollection, target: /storage/Test6sbNFTCollection)
    acct.link<&sbNFT.Collection>(/private/Test6sbNFTCollection, target: /storage/Test6sbNFTCollection)
    
    let sbNFTCollection = acct.getCapability<&sbNFT.Collection>(/private/Test6sbNFTCollection)
    let FlowTokenVault = acct.getCapability<&FlowToken.Vault{FungibleToken.Receiver}>(/public/flowTokenReceiver)
    
    acct.save(<- sbMarketplace.createSaleCollection(sbNFTCollection: sbNFTCollection, FlowVault: FlowTokenVault), to: /storage/Test6sbNFTSaleCollection)
    acct.link<&sbMarketplace.SaleCollection{sbMarketplace.SaleCollectionPublic}>(/public/Test6sbNFTSaleCollection, target: /storage/Test6sbNFTSaleCollection)
  }

  execute {
    log("A user stored a Collection and a SaleCollection inside their account")
  }
}

`