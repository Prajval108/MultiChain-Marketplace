export const checkCollectionTx = `
import sbNFT from 0x65c1594f968945ee
import NonFungibleToken from 0x631e88ae7f1d7c20

pub fun main(account: Address): Bool {

    let CollectionCheck = getAccount(account).getCapability<&sbNFT.Collection{NonFungibleToken.CollectionPublic}>(/public/Test1sbNFTCollection).check()
    return CollectionCheck
}
`
