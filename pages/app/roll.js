import AppLayout from "../../components/AppLayout"
import React, { useEffect, useState } from "react"
import axios from "axios"
import * as fcl from "@onflow/fcl"
import { Button, Spinner, Input, InputGroup, InputLeftAddon } from "@chakra-ui/react"
import Transaction from "../../components/Transaction"
import one from "./images/1.jpeg"

fcl
  .config()
  .put("accessNode.api", "https://rest-testnet.onflow.org")
  .put("flow.network", "testnet")
  .put("discovery.wallet", "https://fcl-discovery.onflow.org/testnet/authn")

const RollPage = () => {
  const [status, setStatus] = useState("idle")
  const [id, setId] = useState(null)
  const [transaction, setTransaction] = useState(null)
  const [txnInProgress, setTxnInProgress] = useState(false)
  const [txStatus, setTxStatus] = useState(-1);
  const [txStatusCode, setTxStatusCode] = useState(-1);
  const [result, setResult] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [purpose, setPurpose] = useState("")
  const [randomImage, setRandomImage] = useState(1)
  const [nftmodelinCreation, setNftmodelinCreation] = useState(false)
  const [nftModelCreated, setNftModelCreated] = useState(false)

  useEffect (() => {
    setInterval(() => {
      setRandomImage(Math.floor(Math.random() * 6) + 1)
    }, 100)
  }, [])

  const dice_map = {
    1: "https://acharyaplacement-dev.s3.ap-south-1.amazonaws.com/public/random/1.jpeg",
    2: "https://acharyaplacement-dev.s3.ap-south-1.amazonaws.com/public/random/2.jpeg",
    3: "https://acharyaplacement-dev.s3.ap-south-1.amazonaws.com/public/random/3.jpeg",
    4: "https://acharyaplacement-dev.s3.ap-south-1.amazonaws.com/public/random/4.jpeg",
    5: "https://acharyaplacement-dev.s3.ap-south-1.amazonaws.com/public/random/5.jpeg",
    6: "https://acharyaplacement-dev.s3.ap-south-1.amazonaws.com/public/random/6.jpeg",
  }

  const rollDice = async () => {
    if(quantity <= 0 || quantity > 100 || purpose.trim() === "") {
      alert("Please enter valid quantity and purpose.")
      return
    }
    setTxnInProgress(true)
    setTxStatus(-1)
    await axios.post("https://dice-roll-backend.vercel.app/api/flow/roll/quick", { quantity: quantity, purpose: purpose }).then((res) => {
      setId(res.data.message.transactionId)
      fcl.tx(res.data.message.transactionId).subscribe(async (tx) => {
        setTxStatus(tx.status)
        setTransaction(tx)
        setTxStatusCode(tx.statusCode);
        if(tx.status === 4) {
          const dice_result = tx.events.find((e) => e.type === "A.0228cfaf738ed8f5.Diceroller.DiceRollSetResult")
          setResult(dice_result.data.result)
          setNftmodelinCreation(true)
          await axios.post("https://dice-roll-backend.vercel.app/api/nft/generate", { diceResults: dice_result.data.result.map(i=>Number(i)) }).then((res) => {
            setNftModelCreated(true)
          }).catch((err) => {
            alert("Failed to create NFT model. Please try again later.")
          })
        }
      })
    }).catch((err) => {
      console.log(err)
      setStatus("error")
      alert("Something went wrong. Please try again later.")
    }
    )
  }

  const reset = () => {
    setTxnInProgress(false)
    setId(null)
    setTransaction(null)
    setTxStatus(-1)
    setTxStatusCode(-1)
    setResult(null)
  }
  return (
    <AppLayout>
      {txnInProgress && txStatus !== 4 && <Spinner />}
      {!txnInProgress && <div>
        <InputGroup size='lg' style={{marginTop: 40}}>
    <InputLeftAddon children='No. of dice to roll (Max 100)' color={"black"} />
    <Input placeholder="Enter the number of dice to roll" onChange={(e) => setQuantity(e.target.value)} value={quantity} />
  </InputGroup>
       
        <Input placeholder="Enter the purpose of the roll (required)" onChange={(e) => setPurpose(e.target.value)} style={{marginTop: 40}} value={purpose} />
      </div>}
      
      {txnInProgress && txStatus !== 4 && <div style={{display:"flex", alignItems:"center", marginTop: 30}}>
        <img src={dice_map[randomImage]} style={{width: 100, height: 100}} />
        <h1 style={{marginLeft: 15, fontSize: 30}}> x {quantity}</h1>
        </div>}
        {nftmodelinCreation && !nftModelCreated && <h1>DICE NFT model being generated <Spinner /></h1>}
        <Transaction txId={id} txInProgress={txnInProgress} txStatus={txStatus} txStatusCode={txStatusCode} nftModelCreated={nftModelCreated} />
      {result && txStatus === 4 && <div style={{textAlign:"center", paddingLeft: 60, paddingRight: 30, display: "flex", flexDirection: "column", alignItems: "center"}}>
        <h1 style={{color: "black", padding: 6, background: "white", borderRadius: 5}}>{result.length} x Dice Roll Result = <span style={{color: "red"}}>{result.join(" ")}</span></h1>
        <br/>
        <div style={{display: "flex", alignItems: "center", flexWrap: "wrap"}}>
        {result.map((r) => <img src={dice_map[r]} style={{width: 100, height: 100}} />)}
        </div>
        </div>}
      <div style={{display:"flex"}}>
      <Button colorScheme="blue" onClick={rollDice} style={{marginTop: 40, marginRight: 30}}>
        Roll The Dice!
      </Button>
      {txStatus === 4 && txStatusCode !== 1 && <Button colorScheme="green" onClick={reset} style={{marginTop: 40}}>
        Reset
      </Button>}
      </div>
      <br/>
      <br/>
    </AppLayout>
  )
}

RollPage.requireAuth = true
export default RollPage
