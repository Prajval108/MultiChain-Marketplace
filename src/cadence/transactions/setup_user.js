export const setupUserTx = `
import NonFungibleToken from 0x631e88ae7f1d7c20
import sbNFT from 0x65c1594f968945ee
import FungibleToken from 0x9a0766d93b6608b7
import FlowToken from 0x7e60df042a9c0868
import sbMarketplace from 0x65c1594f968945ee

transaction {

  prepare(acct: AuthAccount) {
    acct.save(<- sbNFT.createEmptyCollection(), to: /storage/Test1sbNFTCollection)
    acct.link<&sbNFT.Collection{sbNFT.CollectionPublic, NonFungibleToken.CollectionPublic}>(/public/Test1sbNFTCollection, target: /storage/Test1sbNFTCollection)
    acct.link<&sbNFT.Collection>(/private/Test1sbNFTCollection, target: /storage/Test1sbNFTCollection)
    
    let sbNFTCollection = acct.getCapability<&sbNFT.Collection>(/private/Test1sbNFTCollection)
    let FlowTokenVault = acct.getCapability<&FlowToken.Vault{FungibleToken.Receiver}>(/public/Test1FlowTokenPublic)
    
    acct.save(<- sbMarketplace.createSaleCollection(sbNFTCollection: sbNFTCollection, TokenVault: FlowTokenVault), to: /storage/Test1sbNFTSaleCollection)
    acct.link<&sbMarketplace.SaleCollection{sbMarketplace.SaleCollectionPublic}>(/public/Test1sbNFTSaleCollection, target: /storage/Test1sbNFTSaleCollection)
  }

  execute {
    log("A user stored a Collection and a SaleCollection inside their account")
  }
}

`