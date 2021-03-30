const MNft = artifacts.require("MNft");

module.exports = async function(deployer) {
    	//deploy Token
	await deployer.deploy(MNft);
	//assign token into variable to get it's address
	const mnft = await MNft.deployed();	

};