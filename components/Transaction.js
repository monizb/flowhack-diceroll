import { Button } from "@chakra-ui/react";
function Transaction({txId, txInProgress, txStatus, txStatusCode}) {
    if (txInProgress && txStatusCode === 0) {
      return (
        <article>
          {txStatus < 0
          ?
          <div className="dice-roll">
            <span>
              Transaction Status: <kbd>Initializing</kbd>
              <br />
              <small>Understanding the request...</small>
            </span>
            <progress indeterminate="true">Initializing</progress>
          </div>
          : txStatus < 2
          ? 
          <div className="dice-roll">
            <span>
              Transaction Status: 
              <span className="txId">
                <a href={`https://testnet.flowscan.org/transaction/${txId}`} target="_blank" rel="noreferrer">{txId?.slice(0,8)}...</a>
              </span>
              <kbd>Pending</kbd>
              <br />
              <small>Cleaning and getting the dice ready for the roll...</small>
            </span>
            <progress indeterminate="true">Finalizing...</progress>
          </div>
          : txStatus === 2
          ? 
          <div className="dice-roll">
            <span>
              Transaction Status: 
              <span className="txId">
                <a href={`https://testnet.flowscan.org/transaction/${txId}`} target="_blank" rel="noreferrer">{txId?.slice(0,8)}...</a>
              </span>
              <kbd>Finalized</kbd>
              <br />
              <small>Rolling the dice....</small>
            </span>
            <progress min="0" max="100" value="60">Executing...</progress>
          </div>
          : txStatus === 3
          ?
          <div className="dice-roll">
            <span>
              Transaction Status: 
              <span className="txId">
                <a href={`https://testnet.flowscan.org/transaction/${txId}`} target="_blank" rel="noreferrer">{txId?.slice(0,8)}...</a>
              </span>
              <kbd>Executed</kbd>
              <br />
              <small>Engraving results and fetching it...</small>
            </span>
            <progress min="0" max="100" value="80">Sealing...</progress>
          </div>
          : txStatus === 4
          ? 
          <div className="dice-roll" style={{textAlign: "center"}}>
            <p>Transaction Status </p>
            <br/>

              <Button color={"red"} onClick={()=> window.open(`https://testnet.flowscan.org/transaction/${txId}`, "_blank")}>View on Flowscan</Button>
              <br/>
              <br/>
              <p>SEALED</p>
              <br />
              <p>Dice Roll Complete! This is now forever on the chain</p>
              <br/>
            <progress min="0" max="100" value="100">Sealing!</progress>
          </div>
          : null}
        </article>
      )
    } else if (txStatusCode === 1) {
       return (
        <article>PROBLEM!!!!!!!!!! View problem here: <span className="txId">
        <a href={`https://testnet.flowscan.org/transaction/${txId}`} target="_blank" rel="noreferrer">{txId?.slice(0,8)}...</a>
      </span></article>
       )
    } else {
      return <></>
    }
  }
  
  export default Transaction;