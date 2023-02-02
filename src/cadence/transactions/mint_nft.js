export const mintNFT = `
import ProjectR from 0x342967d90036e986

transaction(name: String, description: String, thumbnail: String, endpoint: String, counter: UInt64) {

  prepare(acct: AuthAccount) {

    let NFTminter = acct.borrow<&ProjectR.NFTMinter>(from: /storage/ProjectRMinter)
                  ?? panic ("Could not borrow the Minter Resources")

    let collection = acct.borrow<&ProjectR.Collection>(from: /storage/ProjectRCollection)
                        ?? panic("This collection does not exist here")

    var a = counter
      while a > 0 {
          a = a - 1
          let nft <- NFTminter.mintNFT(name: name, description: description, thumbnail: thumbnail, endpoint: endpoint)
          collection.deposit(token: <- nft)
      }}

  execute {
    log("Your NFT is successully Minted")
  }
}
`
 