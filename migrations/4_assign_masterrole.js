
const QualificationFactory = artifacts.require('./QualificationFactory.sol')



module.exports = async (deployer, network, accounts) => {

    
    const qualificationFactoryInstance = await QualificationFactory.deployed()
    
  
    console.log('\n*************************************************************************\n')
    console.log(`Is 0xD9f34E548239FB86b6306C291D81DBa3b1B4c6Df a Master Role: ${await qualificationFactoryInstance.isMaster('0xD9f34E548239FB86b6306C291D81DBa3b1B4c6Df')}`)
    console.log(`Is 0xC8736DD4c7F54DC5975885d5F54Ecf21aEE73e5E a Master Role: ${await qualificationFactoryInstance.isMaster('0xC8736DD4c7F54DC5975885d5F54Ecf21aEE73e5E')}`)
    console.log(`Is 0xBD30b87Ab72D5E8D91629C5cB83924CF5eDdBc6e a Master Role: ${await qualificationFactoryInstance.isMaster('0xBD30b87Ab72D5E8D91629C5cB83924CF5eDdBc6e')}`)
    console.log(`Is 0xd9f34e548239fb86b6306c291d81dba3b1b4c6df a Master Role: ${await qualificationFactoryInstance.isMaster('0xd9f34e548239fb86b6306c291d81dba3b1b4c6df')}`)
    console.log('\n*************************************************************************\n')
}
