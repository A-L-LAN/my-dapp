import Web3 from "web3";
import { useEffect, useState } from "react";

const CONTRACT_ADDRESS = "0xbCC4cb89dEee89d01deF4213A0a6E518494c2Fb4";
const CONTRACT_ABI = [
	{
		"inputs": [],
		"name": "decrement",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "increment",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "x",
				"type": "uint256"
			}
		],
		"name": "setData",
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
		"inputs": [
			{
				"internalType": "string",
				"name": "newMessage",
				"type": "string"
			}
		],
		"name": "updateMessage",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getData",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getMessage",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

const App = () => {
  const [storedData, setStoredData] = useState(null);
  const [message, setMessage] = useState("");
  const [newMessage, setNewMessage] = useState("");
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
  
  useEffect(() => {
    if (contract) {
      getData(); // Fetch and display the stored data
    }
  }, [contract]); // Adding contract as a dependency
  

  const getData = async () => {
    if (contract) {
      const data = await contract.methods.getData().call();
      setStoredData(data.toString())
    }
  };

  const getMessage = async () => {
    if (contract) {
      const currentMessage = await contract.methods.getMessage().call();
      setMessage(currentMessage);
    }
  };

        const setData = async () => {
          if (contract && web3) {
            try {
              // Request account access if needed
              await window.ethereum.request({ method: 'eth_requestAccounts' });
              const accounts = await web3.eth.getAccounts();
              await contract.methods.setData(inputValue).send({ from: accounts[0] });
              alert("Data updated!");
              setInputValue("");
              getData(); // Refresh displayed data
            } catch (error) {
              console.error("Error:", error);
            }
          }
        };
        

        const increment = async () => {
          if (contract && web3) {
            try {
              await window.ethereum.request({ method: 'eth_requestAccounts' });
              const accounts = await web3.eth.getAccounts();
              await contract.methods.increment().send({ from: accounts[0] });
              getData(); // Refresh displayed data
            } catch (error) {
              console.error("Error:", error);
            }
          }
        };
      
        const decrement = async () => {
          if (contract && web3) {
            try {
              await window.ethereum.request({ method: 'eth_requestAccounts' });
              const accounts = await web3.eth.getAccounts();
              await contract.methods.decrement().send({ from: accounts[0] });
              setData(); // Reset input
              getData(); // Refresh displayed data
            } catch (error) {
              console.error("Error:", error);
            }
          }
        };
      
        const updateMessage = async () => {
          if (contract && web3) {
            try {
              await window.ethereum.request({ method: 'eth_requestAccounts' });
              const accounts = await web3.eth.getAccounts();
              await contract.methods.updateMessage(newMessage).send({ from: accounts[0] });
              setNewMessage(""); // Reset input
              getMessage(); // Refresh displayed message
            } catch (error) {
              console.error("Error:", error);
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
        <button onClick={increment}>Increase Number</button>
        <button onClick={decrement}>Decrease Number</button>
      </div>
      <div>
        <input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button onClick={setData}>Set Data</button>
      </div>
      <div>
        <button onClick={getMessage}>Get Message</button>
        <p>Message: {message}</p>
      </div>
      <div>
        <input
          type="text"
          value={newMessage}
          placeholder="Enter new message"
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={updateMessage}>Update Message</button>
      </div>
    </div>
  );
};

export default App;
