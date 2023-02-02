export const getNFTsScript = `
import sbNFT from 0x65c1594f968945ee
import NonFungibleToken from 0x631e88ae7f1d7c20

pub fun main(account: Address): [&sbNFT.NFT?] {
  let collection = getAccount(account).getCapability(/public/Test1sbNFTCollection)
                    .borrow<&sbNFT.Collection{NonFungibleToken.CollectionPublic, sbNFT.CollectionPublic}>()
                    ?? panic("Can't get the User's collection.")

  let returnVals: [&sbNFT.NFT?] = []
  let ids = collection.getIDs()
  for id in ids {
    returnVals.append(collection.borrowsbNFT(id: id))
  }

  return returnVals
}
`