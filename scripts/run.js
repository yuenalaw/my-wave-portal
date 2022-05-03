
const main = async () => {
    //to deploy to blockchain, we need wallet address...
    //hardhat does this in background
    //but here we get wallet address of contract owner and grabbed random wallet address and call randomPerson.
    const [owner,randomPerson] = await hre.ethers.getSigners();


    const simps = {};

    //compile, deploy then execute 
    //compiles our contract and generates the necessary files to work with our contracts under artifacts directory
    const waveContractFactory = await hre.ethers.getContractFactory("WavePortal");
    //hardhat creates local ethereum network for us, just for this contract
    //after script completes, local network destroyed
    //aka every time contract is run, it'll be a fresh blockchain
    //basically easier to debug--kind of like refreshing local server every time
    const waveContract = await waveContractFactory.deploy();
    //constructor in WavePortal.sol runs when deployed
    await waveContract.deployed();
    
    //address of deployed contract. this address is how we can find our contract on the blockchain
    console.log("Contract deployed to: ", waveContract.address);
    console.log("Contract deployed by:",owner.address);

    if (!simps[waveContract.address]){
        simps[waveContract.address] = {};
    }

    if (simps[waveContract.address][owner.address]){
        simps[waveContract.address][owner.address] += 1;
    } else {
        simps[waveContract.address][owner.address] = 1;
    }
    let waveCount;
    waveCount = await waveContract.getTotalWaves();

    let waveTxn = await waveContract.connect(randomPerson).wave();
    await waveTxn.wait();

    //check if waveCount changed
    waveCount = await waveContract.getTotalWaves();
}

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

runMain();