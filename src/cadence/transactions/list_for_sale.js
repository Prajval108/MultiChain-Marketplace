export const listForSaleTx = `
import sbMarketplace from 0x65c1594f968945ee

transaction(id: UInt64, price: UFix64) {

  prepare(acct: AuthAccount) {
    let saleCollection = acct.borrow<&sbMarketplace.SaleCollection>(from: /storage/Test1sbNFTSaleCollection)
                            ?? panic("This SaleCollection does not exist")
    saleCollection.listForSale(id: UInt64(id), price: price)
  }

  execute {
    log("A user listed an NFT for Sale")
  }
}
`