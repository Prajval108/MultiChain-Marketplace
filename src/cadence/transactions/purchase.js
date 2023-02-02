export const purchaseTx = `
import NonFungibleToken from 0x631e88ae7f1d7c20
import sbNFT from 0x65c1594f968945ee
import FungibleToken from 0x9a0766d93b6608b7
import FlowToken from 0x7e60df042a9c0868
import sbMarketplace from 0x65c1594f968945ee


transaction(userTxnId: String, account: Address, id: UInt64) {

  prepare(acct: AuthAccount) {

    let CollectionCheck = acct.getCapability<&sbNFT.Collection{NonFungibleToken.CollectionPublic}>(/public/Test1sbNFTCollection).check()
    
    if (!CollectionCheck) {
      acct.save(<- sbNFT.createEmptyCollection(), to: /storage/Test1sbNFTCollection)
      acct.link<&sbNFT.Collection{sbNFT.CollectionPublic, NonFungibleToken.CollectionPublic}>(/public/Test1sbNFTCollection, target: /storage/Test1sbNFTCollection)
      acct.link<&sbNFT.Collection>(/private/Test1sbNFTCollection, target: /storage/Test1sbNFTCollection)
      
      let sbNFTCollection = acct.getCapability<&sbNFT.Collection>(/private/Test1sbNFTCollection)
      let FlowTokenVault = acct.getCapability<&FlowToken.Vault{FungibleToken.Receiver}>(/public/Test1FlowTokenPublic)
      
      acct.save(<- sbMarketplace.createSaleCollection(sbNFTCollection: sbNFTCollection, TokenVault: FlowTokenVault), to: /storage/Test1sbNFTSaleCollection)
      acct.link<&sbMarketplace.SaleCollection{sbMarketplace.SaleCollectionPublic}>(/public/Test1sbNFTSaleCollection, target: /storage/Test1sbNFTSaleCollection)

        let saleCollection = getAccount(account).getCapability(/public/Test1sbNFTSaleCollection)
                        .borrow<&sbMarketplace.SaleCollection{sbMarketplace.SaleCollectionPublic}>()
                        ?? panic("Could not borrow the user's SaleCollection")

        let recipientCollection = getAccount(acct.address).getCapability(/public/Test1sbNFTCollection) 
                        .borrow<&sbNFT.Collection{NonFungibleToken.CollectionPublic}>()
                        ?? panic("Can't get the User's collection.")

        let price = saleCollection.getPrice(id: UInt64(id))
        let payment <- acct.borrow<&FlowToken.Vault>(from: /storage/Test1FlowTokenVault)!.withdraw(amount: price) as! @FlowToken.Vault
        saleCollection.purchase(userTxnId: userTxnId, id: UInt64(id), newOwner: acct.address, recipientCollection: recipientCollection, payment: <- payment)

    } else {

      let saleCollection = getAccount(account).getCapability(/public/Test1sbNFTSaleCollection)
      .borrow<&sbMarketplace.SaleCollection{sbMarketplace.SaleCollectionPublic}>()
      ?? panic("Could not borrow the user's SaleCollection")

      let recipientCollection = getAccount(acct.address).getCapability(/public/Test1sbNFTCollection) 
            .borrow<&sbNFT.Collection{NonFungibleToken.CollectionPublic}>()
            ?? panic("Can't get the User's collection.")

      let price = saleCollection.getPrice(id: UInt64(id))
      let payment <- acct.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)!.withdraw(amount: 25.00) as! @FlowToken.Vault
      
      saleCollection.purchase(userTxnId: userTxnId, id: UInt64(id), newOwner: acct.address, recipientCollection: recipientCollection, payment: <- payment)
    }
  }

  execute {
    log("A user purchased an NFT")
  }
}


`