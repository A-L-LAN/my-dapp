import Web3 from "web3";
import { useEffect, useState } from "react";

const CONTRACT_ADDRESS = "0x540d7E428D5207B30EE03F2551Cbb5751D3c7569";
const CONTRACT_ABI = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "x",
				"type": "uint256"
			}
		],
		"name": "set",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [],
		"name": "get",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

const App = () => {
  const [storedData, setStoredData] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);
      const contractInstance = new web3Instance.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
      setContract(contractInstance);
    }
  }, []);

  const getData = async () => {
    if (contract) {
      const data = await contract.methods.get().call();
      setStoredData(data);
    }
  };


  const setData = async () => {
    if (contract && web3) {
      try {
        // Request account access if needed
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        const accounts = await web3.eth.getAccounts();
        if (accounts.length === 0) {
          alert("No accounts found. Make sure MetaMask is connected.");
          return;
        }

        // Send transaction
        await contract.methods.set(inputValue).send({ from: accounts[0] });
        alert("Transaction successful!");
        setInputValue(""); // Reset the input field
      } catch (error) {
        console.error("Error sending transaction:", error);
        alert("Error sending transaction. Check console for details.");
      }
    }
  };

  return (
    <div>
      <h1>Simple Storage DApp</h1>
      <div>
        <button onClick={getData}>Get Stored Data</button>
        <p>Stored Data: {storedData}</p>
      </div>
      <div>
        <input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button onClick={setData}>Set Data</button>
      </div>
    </div>
  );
};

export default App;