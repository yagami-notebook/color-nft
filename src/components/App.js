import React, { Component } from 'react';
import { Tabs, Tab } from 'react-bootstrap'
import logo from '../logo.png';
import './App.css';
import Web3 from 'web3'

import MNft from '../abis/MNft.json'

function random_item(items)
{
  
return items[Math.floor(Math.random()*items.length)];
     
}
const colors = ["#C8C8C8","#C9C8D7",,"#A8B8C8","#A9B9C8","#B8A9C1","#D8A8C8","#F8D9C8"];

let tokens = [];


class App extends Component {


async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }


    async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })

    const networkId = await web3.eth.net.getId()

    const networkData = MNft.networks[networkId]
    if(networkData) {
      const abi = MNft.abi
      const address = networkData.address
      const contract = new web3.eth.Contract(abi, address)
      this.setState({ contract })
      const totalSupply = await contract.methods.totalSupply().call()
      this.setState({ totalSupply })
      // Load Colors
      for (var i = 1; i <= totalSupply; i++) {
        const color = await contract.methods.colors(i - 1).call()
        this.setState({
          colors: [...this.state.colors, color]
        })
      }
    } else {
      window.alert('Smart contract not deployed to detected network.')
    }
  }


  async fetchUserNft() {
      let token;
      let color;
      console.log("inside fetchUserNft");
      const balance = await this.state.contract.methods.balanceOf(this.state.account).call();
      for (let i = 0; i < balance; i++) {
        token = await this.state.contract.methods.tokenOfOwnerByIndex(this.state.account, i).call();
        color = await this.state.contract.methods.tokenIdToColor(token).call();
        this.state.myTokens.push(color);
      }

      for (let i = 0; i < this.state.myTokens.length; i++) {
       console.log(this.state.myTokens[i]);
      }
    }

    mint = (color) => {
    this.state.contract.methods.mint(color).send({ from: this.state.account , value: window.web3.utils.toWei("1", "ether"),})
    .once('receipt', (receipt) => {
      this.setState({
        colors: [...this.state.colors, color]
      })
    })
    .on("transactionHash", (hash) => {
        console.log(hash);
      })
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      contract: null,
      totalSupply: 0,
      colors: [],
      myTokens:[]
    }
  }


  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://www.dappuniversity.com/bootcamp"
            target="_blank"
            rel="noopener noreferrer"
          >
            Color Tokens
          </a>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small className="text-white"><span id="account">{this.state.account}</span></small>
            </li>
          </ul>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <h1>Demo Color NFT Token</h1>

                <Tabs defaultActiveKey="mint" id="uncontrolled-tab-example">
                <Tab eventKey="mint" title="Mint NFT">
                <form onSubmit={(event) => {
                  event.preventDefault()
                  const color = this.color.value
                  this.mint(color)
                }}>
                  <input
                    type='text'
                    className='form-control mb-1'
                    placeholder='e.g. #FFFFFF'
                    value={random_item(colors)}
                    ref={(input) => { this.color = input }}
                  />
                  <input
                    type='submit'
                    className='btn btn-block btn-primary'
                    value='MINT'
                  />
                </form>
              </Tab>

              <Tab eventKey="fetchUserNft" title="My Collection">
                <div className="row text-center">
                  <form onSubmit={(event) => {
                  event.preventDefault()
                  this.fetchUserNft()
                }}>
                  <input
                    type='submit'
                    className='btn btn-block btn-primary'
                    value='Fetch'
                  />
                </form>
                </div>
              </Tab>

            </Tabs>
              </div>
            </main>
          </div>
          <hr/>
          <div className="row text-center">
            { this.state.colors.map((color, key) => {
              return(
                <div key={key} className="col-md-3 mb-3">
                  <div className="token" style={{ backgroundColor: color }}></div>
                  <div>{color}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
