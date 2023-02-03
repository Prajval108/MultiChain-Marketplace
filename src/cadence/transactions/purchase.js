export const purchaseTx = `
import NonFungibleToken from 0x631e88ae7f1d7c20
import sbNFT from 0xccdde98ef2a31d2e
import FungibleToken from 0x9a0766d93b6608b7
import FlowToken from 0x7e60df042a9c0868
import sbMarketplace from 0xccdde98ef2a31d2e


transaction(userTxnId: String, account: Address, id: UInt64) {

  prepare(acct: AuthAccount) {

    let CollectionCheck = acct.getCapability<&sbNFT.Collection{NonFungibleToken.CollectionPublic}>(/public/Test6sbNFTCollection).check()
    
    if (!CollectionCheck) {
        acct.save(<- sbNFT.createEmptyCollection(), to: /storage/Test6sbNFTCollection)
        acct.link<&sbNFT.Collection{sbNFT.CollectionPublic, NonFungibleToken.CollectionPublic}>(/public/Test6sbNFTCollection, target: /storage/Test6sbNFTCollection)
        acct.link<&sbNFT.Collection>(/private/Test6sbNFTCollection, target: /storage/Test6sbNFTCollection)
        
        let sbNFTCollection = acct.getCapability<&sbNFT.Collection>(/private/Test6sbNFTCollection)
        let FlowTokenVault = acct.getCapability<&FlowToken.Vault{FungibleToken.Receiver}>(/public/flowTokenReceiver)
        
        acct.save(<- sbMarketplace.createSaleCollection(sbNFTCollection: sbNFTCollection, FlowVault: FlowTokenVault), to: /storage/Test6sbNFTSaleCollection)
        acct.link<&sbMarketplace.SaleCollection{sbMarketplace.SaleCollectionPublic}>(/public/Test6sbNFTSaleCollection, target: /storage/Test6sbNFTSaleCollection)

        let saleCollection = getAccount(account).getCapability(/public/Test6sbNFTSaleCollection)
                        .borrow<&sbMarketplace.SaleCollection{sbMarketplace.SaleCollectionPublic}>()
                        ?? panic("Could not borrow the user's SaleCollection")

        let recipientCollection = getAccount(acct.address).getCapability(/public/Test6sbNFTCollection) 
                        .borrow<&sbNFT.Collection{NonFungibleToken.CollectionPublic}>()
                        ?? panic("Can't get the User's collection.")

        let price = saleCollection.getPrice(id: UInt64(id))
        let payment <- acct.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)!.withdraw(amount: price) as! @FlowToken.Vault
        saleCollection.purchase(userTxnId: userTxnId, id: UInt64(id), newOwner: acct.address, recipientCollection: recipientCollection, payment: <- payment)

    } else {

      let saleCollection = getAccount(account).getCapability(/public/Test6sbNFTSaleCollection)
            .borrow<&sbMarketplace.SaleCollection{sbMarketplace.SaleCollectionPublic}>()
            ?? panic("Could not borrow the user's SaleCollection")

      let recipientCollection = getAccount(acct.address).getCapability(/public/Test6sbNFTCollection) 
            .borrow<&sbNFT.Collection{NonFungibleToken.CollectionPublic}>()
            ?? panic("Can't get the User's collection.")

      let price = saleCollection.getPrice(id: UInt64(id))
      let payment <- acct.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)!.withdraw(amount: price) as! @FlowToken.Vault
      saleCollection.purchase(userTxnId: userTxnId, id: UInt64(id), newOwner: acct.address, recipientCollection: recipientCollection, payment: <- payment)
    }
  }

  execute {
    log("A user purchased an NFT")
  }
}


`