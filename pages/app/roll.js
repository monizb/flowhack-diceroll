import AppLayout from "../../components/AppLayout"
import React, { useEffect, useState } from "react"
import axios from "axios"
import * as fcl from "@onflow/fcl"
import { Button, Spinner, Input } from "@chakra-ui/react"
import Transaction from "../../components/Transaction"

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

  const rollDice = async () => {
    setTxnInProgress(true)
    setTxStatus(-1)
    await axios.post("https://dice-roll-backend.vercel.app/api/flow/roll/quick", { quantity: quantity, purpose: purpose }).then((res) => {
      setId(res.data.message.transactionId)
      fcl.tx(res.data.message.transactionId).subscribe((tx) => {
        setTxStatus(tx.status)
        setTransaction(tx)
        setTxStatusCode(tx.statusCode);
        if(tx.status === 4) {
          const dice_result = tx.events.find((e) => e.type === "A.0228cfaf738ed8f5.Diceroller.DiceRollSetResult")
          setResult(dice_result.data.result)
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
        <Input placeholder="Enter the number of dice to roll" onChange={(e) => setQuantity(e.target.value)} style={{marginTop: 40}} value={quantity} />
        <Input placeholder="Enter the purpose of the roll" onChange={(e) => setPurpose(e.target.value)} style={{marginTop: 40}} value={purpose} />
      </div>}
      <Transaction txId={id} txInProgress={txnInProgress} txStatus={txStatus} txStatusCode={txStatusCode} />
      {result && txStatus === 4 && <h1 style={{marginTop: 40}}>Result: {result.join(" ")}</h1>}
      <div style={{display:"flex"}}>
      <Button colorScheme="blue" onClick={rollDice} style={{marginTop: 40, marginRight: 30}}>
        Roll The Dice!
      </Button>
      {txStatus === 4 && txStatusCode !== 1 && <Button colorScheme="green" onClick={reset} style={{marginTop: 40}}>
        Reset
      </Button>}
      </div>
    </AppLayout>
  )
}

RollPage.requireAuth = true
export default RollPage
