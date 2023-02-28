import { Heading, Text, Image } from "@chakra-ui/react"
import { useRouter } from "next/router"

import AppLayout from "../../../components/AppLayout"
import { ComponentWithAuth } from "../../../components/ComponentWithAuth"
import { useNftQuery } from "../../../generated/graphql"
import { useGraphQLQuery } from "../../../hooks/useGraphQLQuery"

import { gql } from "graphql-request"

gql`
  query nft($id: ID!) {
    nft(id: $id) {
      id
      blockchainId
      serialNumber
      model {
        id
        blockchainId
        title
        description
        rarity
        quantity
        metadata
        content {
          poster {
            url
          }
          files {
            url
            contentType
          }
        }
      }
    }
  }
`

const NftPage: ComponentWithAuth = () => {
  const router = useRouter()
  const nftId = router.query["nftId"]?.toString()

  const { data } = useGraphQLQuery(useNftQuery, { id: nftId })

  const nft = data?.nft
  const model = nft?.model

  return (
    <AppLayout>
      {model && (
        <>
           <Image alt={nft.model?.title} boxSize="50vh" src={nft.model?.content?.poster?.url} style={{borderRadius: 10, height: "130%"}}></Image>
          <Heading>{model.title}</Heading>
          <Text>{model.description}</Text>
          <Text>
            {nft.blockchainId == null
              ? "Blockchain State: Not yet minted."
              : `Blockchain State: ID=${nft.blockchainId}, Serial=${nft.serialNumber}`}
          </Text>
          <br/>
          <br/>
        </>
      )}
    </AppLayout>
  )
}

NftPage.requireAuth = true
export default NftPage
