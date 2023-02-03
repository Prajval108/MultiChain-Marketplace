// NOTE: I deployed this to 0x05 in the playground
import NonFungibleToken from 0x631e88ae7f1d7c20
import sbNFT from 0xccdde98ef2a31d2e
import FungibleToken from 0x9a0766d93b6608b7
import FlowToken from 0x7e60df042a9c0868

pub contract sbMarketplace {
  
  pub event NFTListing(id: UInt64, amount: UFix64)
  pub event NFTPurchase(userTxnId: String, id: UInt64, new_owner: Address?)

  pub struct SaleItem {
    pub let price: UFix64
    
    pub let nftRef: &sbNFT.NFT
    
    init(_price: UFix64, _nftRef: &sbNFT.NFT) {
      self.price = _price
      self.nftRef = _nftRef
    }
  }

  pub resource interface SaleCollectionPublic {
    pub fun getIDs(): [UInt64]
    pub fun getPrice(id: UInt64): UFix64
    pub fun purchase(userTxnId: String, id: UInt64, newOwner: Address, recipientCollection: &sbNFT.Collection{NonFungibleToken.CollectionPublic}, payment: @FlowToken.Vault)
  }

  pub resource SaleCollection: SaleCollectionPublic {
    // maps the id of the NFT --> the price of that NFT
    pub var forSale: {UInt64: UFix64}
    pub let sbNFTCollection: Capability<&sbNFT.Collection>
    pub let FlowVault: Capability<&FlowToken.Vault{FungibleToken.Receiver}>

    pub fun listForSale(id: UInt64, price: UFix64) {
      pre {
        price >= 0.0: "Price must be more that 0.0"
        self.sbNFTCollection.borrow()!.getIDs().contains(id): "This SaleCollection owner does not contain this NFT"
      }
      self.forSale[id] = price
      emit NFTListing(id: id, amount: price)
    }

    pub fun unlistFromSale(id: UInt64) {
      self.forSale.remove(key: id)
    }

    pub fun purchase(userTxnId: String, id: UInt64, newOwner: Address, recipientCollection: &sbNFT.Collection{NonFungibleToken.CollectionPublic}, payment: @FlowToken.Vault) {
      pre {
        payment.balance == self.forSale[id]: "The payment balance is not equal to the NFT price"
      }
      recipientCollection.deposit(token: <- self.sbNFTCollection.borrow()!.withdraw(withdrawID: id))
      self.FlowVault.borrow()!.deposit(from: <- payment)
      self.unlistFromSale(id: id)
      emit NFTPurchase(userTxnId: userTxnId, id: id, new_owner: newOwner)
    }

    pub fun getPrice(id: UInt64): UFix64 {
      return self.forSale[id]!
    }

    pub fun getIDs(): [UInt64] {
      return self.forSale.keys
    }

    init(_sbNFTCollection: Capability<&sbNFT.Collection>, _FlowVault: Capability<&FlowToken.Vault{FungibleToken.Receiver}>) {
      self.forSale = {}
      self.sbNFTCollection = _sbNFTCollection
      self.FlowVault = _FlowVault
    }
  }

  pub fun createSaleCollection(sbNFTCollection: Capability<&sbNFT.Collection>, FlowVault: Capability<&FlowToken.Vault{FungibleToken.Receiver}>): @SaleCollection {
    return <- create SaleCollection(_sbNFTCollection: sbNFTCollection, _FlowVault: FlowVault)
  }

  init() {

  }
}
 