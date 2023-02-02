export const mintNFT = `
import sbNFT from 0x65c1594f968945ee


transaction(name: String, description: String, thumbnail: String, endpoint: String, counter: UInt64) {

  prepare(acct: AuthAccount) {

    let NFTminter = acct.borrow<&sbNFT.NFTMinter>(from: /storage/sbNFTMinter)
                  ?? panic ("Could not borrow the Minter Resources")

    let collection = acct.borrow<&sbNFT.Collection>(from: /storage/Test1sbNFTCollection)
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
 