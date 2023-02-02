export const getNFTsScript = `
import ProjectR from 0x342967d90036e986
import NonFungibleToken from 0x342967d90036e986

pub fun main(account: Address): [&ProjectR.NFT?] {
  let collection = getAccount(account).getCapability(/public/ProjectRCollection)
                    .borrow<&ProjectR.Collection{NonFungibleToken.CollectionPublic, ProjectR.CollectionPublic}>()
                    ?? panic("Can't get the User's collection.")

  let returnVals: [&ProjectR.NFT?] = []
  let ids = collection.getIDs()
  for id in ids {
    returnVals.append(collection.borrowProjectR(id: id))
  }

  return returnVals
}
`