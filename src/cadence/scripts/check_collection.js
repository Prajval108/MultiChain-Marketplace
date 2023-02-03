export const checkCollectionTx = `
import sbNFT from 0xccdde98ef2a31d2e
import NonFungibleToken from 0x631e88ae7f1d7c20

pub fun main(account: Address): Bool {

    let CollectionCheck = getAccount(account).getCapability<&sbNFT.Collection{NonFungibleToken.CollectionPublic}>(/public/Test6sbNFTCollection).check()
    return CollectionCheck
}
`
