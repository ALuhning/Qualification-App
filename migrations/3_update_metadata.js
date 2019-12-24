const Metadata = artifacts.require('./Metadata.sol')
const QualificationCoin = artifacts.require('./QualificationCoin.sol')

module.exports = function (deployer, network, accounts) {

  deployer.then(async () => {
    await deployer.deploy(Metadata, {replace: true})
    const metadataInstance = await Metadata.deployed()

    const qualificationCoinInstance = await QualificationCoin.deployed()
        
    console.log('\n*************************************************************************\n')
    console.log(`Metadata updated to Contract Address: ${metadataInstance.address}`)
    console.log(`QualificationCoinToken Contract Address: ${qualificationCoinInstance.address}`)
    console.log('\n*************************************************************************\n')
  })
}
