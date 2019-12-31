const Metadata = artifacts.require('./Metadata.sol')
const QualificationFactory = artifacts.require('./QualificationFactory.sol')
const QualificationHelper = artifacts.require('./QualificationHelper.sol')
const QualificationOwnership = artifacts.require('./QualificationOwnership.sol')


module.exports = async (deployer, network, accounts) => {

    await deployer.deploy(Metadata)
    const metadataInstance = await Metadata.deployed()

    await deployer.deploy(QualificationFactory)
    const qualificationFactoryInstance = await QualificationFactory.deployed()
    await qualificationFactoryInstance.assignMasterRole('0xD9f34E548239FB86b6306C291D81DBa3b1B4c6Df')
    await qualificationFactoryInstance.assignMasterRole('0xC8736DD4c7F54DC5975885d5F54Ecf21aEE73e5E')
    await qualificationFactoryInstance.assignMasterRole('0xBD30b87Ab72D5E8D91629C5cB83924CF5eDdBc6e')
  //  await qualificationFactoryInstance.transferOwnership('0xC8736DD4c7F54DC5975885d5F54Ecf21aEE73e5E')
   
    await deployer.deploy(QualificationHelper)
    const qualificationHelperInstance = await QualificationHelper.deployed()
  //  await qualificationHelperInstance.transferOwnership('0xC8736DD4c7F54DC5975885d5F54Ecf21aEE73e5E')
    
    await deployer.deploy(QualificationOwnership, 'Qualifications', 'QUAL', metadataInstance.address)
    const qualificationOwnershipInstance = await QualificationOwnership.deployed()
  //  await qualificationOwnershipInstance.transferOwnership('0xC8736DD4c7F54DC5975885d5F54Ecf21aEE73e5E')
        
    console.log('\n*************************************************************************\n')
    console.log(`Metadata Contract Address: ${metadataInstance.address}`)
    console.log(`Qualification Factory Address: ${qualificationFactoryInstance.address}`)
    console.log(`Qualification Helper Address: ${qualificationHelperInstance.address}`)
    console.log(`QualificationOwnership Contract Address: ${qualificationOwnershipInstance.address}`)
    console.log(`Owner of QualificationFactory: ${await qualificationFactoryInstance.owner()}`)
    console.log(`Owner of QualificationHelper: ${await qualificationHelperInstance.owner()}`)
    console.log(`Owner of QualificationOwnership: ${await qualificationOwnershipInstance.owner()}`)
    console.log('\n*************************************************************************\n')

    
  
}
