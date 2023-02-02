export const getSaleNFTsScript = `
import sbMarketplace from 0x65c1594f968945ee
import sbNFT from 0x65c1594f968945ee
import NonFungibleToken from 0x631e88ae7f1d7c20


pub fun main(account: Address): {UInt64: UFix64} {
  let saleCollection = getAccount(account).getCapability(/public/Test1sbNFTSaleCollection)
                        .borrow<&sbMarketplace.SaleCollection{sbMarketplace.SaleCollectionPublic}>()
                        ?? panic("Could not borrow the user's SaleCollection")

  let collection = getAccount(account).getCapability(/public/Test1sbNFTCollection) 
                    .borrow<&sbNFT.Collection{NonFungibleToken.CollectionPublic, sbNFT.CollectionPublic}>()
                    ?? panic("Can't get the User's collection.")

  let saleIDs = saleCollection.getIDs()
  //let price = saleCollection.getPrice(id: saleIDs)
  //let nftRef = collection.borrowEntireNFT(id: saleIDs)

  let returnVals: {UInt64: UFix64} = {}

  for saleID in saleIDs {
    let price = saleCollection.getPrice(id: saleID)
    let nftRef = collection.borrowsbNFT(id: saleID)
    returnVals.insert(key: saleID, price)
   }
  return returnVals
}
`