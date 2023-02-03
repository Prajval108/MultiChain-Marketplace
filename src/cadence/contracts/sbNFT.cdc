import NonFungibleToken from 0x631e88ae7f1d7c20

pub contract sbNFT: NonFungibleToken {

    pub var totalSupply: UInt64

    pub event ContractInitialized()
    pub event Withdraw(id: UInt64, from: Address?)
    pub event Deposit(id: UInt64, to: Address?)

    pub resource NFT: NonFungibleToken.INFT {
        pub let id: UInt64
        pub let name: String
        pub let description: String
        pub let thumbnail: String
        pub let creator: Address
    
        init(
            name: String,
            description: String,
            thumbnail: String,
            creator: Address,
        ) {
            self.id = sbNFT.totalSupply
            self.name = name
            self.description = description
            self.thumbnail = thumbnail
            self.creator = creator

            sbNFT.totalSupply = sbNFT.totalSupply + 1
        }
    }

    pub resource interface CollectionPublic {
        pub fun deposit(token: @NonFungibleToken.NFT)
        pub fun getIDs(): [UInt64]
        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT
        pub fun borrowsbNFT(id: UInt64): &sbNFT.NFT? {
            post {
                (result == nil) || (result?.id == id):
                    "Cannot borrow sbNFT reference: the ID of the returned reference is incorrect"
            }
        }
    }

    pub resource Collection: CollectionPublic, NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic {
        pub var ownedNFTs: @{UInt64: NonFungibleToken.NFT}

        pub fun withdraw(withdrawID: UInt64): @NonFungibleToken.NFT {
            let token <- self.ownedNFTs.remove(key: withdrawID) ?? panic("This NFT does not exist")

            emit Withdraw(id: token.id, from: self.owner?.address)

            return <-token
        }

        pub fun deposit(token: @NonFungibleToken.NFT) {
            let token <- token as! @sbNFT.NFT
            let id: UInt64 = token.id
            self.ownedNFTs[id] <-! token
            emit Deposit(id: id, to: self.owner?.address)
        }

        pub fun getIDs(): [UInt64] {
            return self.ownedNFTs.keys
        }

        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT {
            return (&self.ownedNFTs[id] as &NonFungibleToken.NFT?)!
        }
 
        pub fun borrowsbNFT(id: UInt64): &sbNFT.NFT? {
            if self.ownedNFTs[id] != nil {
                let ref = (&self.ownedNFTs[id] as auth &NonFungibleToken.NFT?)!
                return ref as! &sbNFT.NFT
            }

            return nil
        }

        pub fun getCreator(id: UInt64): Address {
            let nft = self.borrowsbNFT(id: id)
            return nft!.creator
        }

        init () {
            self.ownedNFTs <- {}
        }

        destroy() {
            destroy self.ownedNFTs
        }
    }

    pub fun createEmptyCollection(): @NonFungibleToken.Collection {
        return <- create Collection()
    }

    pub fun mintNFT(name: String, description: String, thumbnail: String, creator: Address): @sbNFT.NFT {
        return <- create NFT(
                name: name,
                description: description,
                thumbnail: thumbnail,
                creator: creator,
                )
    }

    init() {
        self.totalSupply = 0

        emit ContractInitialized()
    }
}