export const mintNFT = `
import sbNFT from 0xccdde98ef2a31d2e


transaction(name: String, description: String, thumbnail: String, counter: UInt64) {

  prepare(acct: AuthAccount) {

    let collection = acct.borrow<&sbNFT.Collection>(from: /storage/Test6sbNFTCollection)
                        ?? panic("This collection does not exist here")

    var a = counter
      while a > 0 {
          a = a - 1
          let nft <- sbNFT.mintNFT(name: name, description: description, thumbnail: thumbnail, creator: acct.address)
          collection.deposit(token: <- nft)
      }}

  execute {
    log("Your NFT is successully Minted")
  }
}
`
 