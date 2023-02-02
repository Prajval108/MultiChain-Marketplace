export const listForSaleTx = `
import BloxmithMarketplace from 0x342967d90036e986

transaction(id: UInt64, price: UFix64) {

  prepare(acct: AuthAccount) {
    let saleCollection = acct.borrow<&BloxmithMarketplace.SaleCollection>(from: /storage/ProjectRSaleCollection)
                            ?? panic("This SaleCollection does not exist")
    saleCollection.listForSale(id: UInt64(id), price: price)
  }

  execute {
    log("A user listed an NFT for Sale")
  }
}
`