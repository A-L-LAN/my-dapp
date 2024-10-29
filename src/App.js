import Web3 from "web3";
import { useEffect, useState } from "react";

const CONTRACT_ADDRESS = "your_contract_address_here";
const CONTRACT_ABI = [
  // ABI array here
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
      const accounts = await web3.eth.getAccounts();
      await contract.methods.set(inputValue).send({ from: accounts[0] });
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