const Metadata = artifacts.require('./Metadata.sol')
const QualificationFactory = artifacts.require('./QualificationFactory.sol')
const QualificationHelper = artifacts.require('./QualificationHelper.sol')
const QualificationOwnership = artifacts.require('./QualificationOwnership.sol')

module.exports = function (deployer, network, accounts) {

  deployer.then(async () => {
    await deployer.deploy(Metadata)
    const metadataInstance = await Metadata.deployed()

    await deployer.deploy(QualificationFactory)
    const qualificationFactoryInstance = await QualificationFactory.deployed()

    await deployer.deploy(QualificationHelper)
    const qualificationHelperInstance = await QualificationHelper.deployed()

    await deployer.deploy(QualificationOwnership, 'Qualifications', 'QUAL', metadataInstance.address)
    const qualificationOwnershipInstance = await QualificationOwnership.deployed()
        
    console.log('\n*************************************************************************\n')
    console.log(`Metadata Contract Address: ${metadataInstance.address}`)
    console.log(`Qualification Factory Address: ${qualificationFactoryInstance.address}`)
    console.log(`Qualification Helper Address: ${qualificationHelperInstance.address}`)
    console.log(`QualificationOwnership Contract Address: ${qualificationOwnershipInstance.address}`)
    console.log('\n*************************************************************************\n')
  })
}
