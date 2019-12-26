const Metadata = artifacts.require('./Metadata.sol')
const QualificationOwnership = artifacts.require('./QualificationOwnership.sol')

module.exports = function (deployer, network, accounts) {

  deployer.then(async () => {
    await deployer.deploy(Metadata, {replace: true})
    const metadataInstance = await Metadata.deployed()

    const qualificationOwnershipInstance = await QualificationOwnership.deployed()
        
    console.log('\n*************************************************************************\n')
    console.log(`Metadata updated to Contract Address: ${metadataInstance.address}`)
    console.log(`QualificationOwnership Contract Address: ${qualificationOwnershipInstance.address}`)
    console.log('\n*************************************************************************\n')
  })
}
