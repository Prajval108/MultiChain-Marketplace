export const checkCollectionTx = `
import ProjectR from 0x342967d90036e986
import NonFungibleToken from 0x342967d90036e986

pub fun main(account: Address): Bool {

    let CollectionCheck = getAccount(account).getCapability<&ProjectR.Collection{NonFungibleToken.CollectionPublic}>(/public/ProjectRCollection).check()
    return CollectionCheck
}
`
