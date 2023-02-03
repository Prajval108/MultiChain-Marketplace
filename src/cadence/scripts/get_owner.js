export const getCreatorScript = `
import sbNFT from 0xccdde98ef2a31d2e
import NonFungibleToken from 0x631e88ae7f1d7c20

pub fun main(id: UInt64, account: Address): AnyStruct {
    let collection = getAccount(account).getCapability(/public/Test6sbNFTCollection)
                      .borrow<&sbNFT.Collection{NonFungibleToken.CollectionPublic, sbNFT.CollectionPublic}>()
                      ?? panic("Can't get the User's collection.")

    let datas = collection.borrowsbNFT(id: id)

    return datas
  }
`