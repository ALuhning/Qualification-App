const QualificationFactory = artifacts.require("./QualificationFactory.sol")

require('chai')
    .use(require('chai-as-promised'))
    .should()

const BN = require('bn.js')

require('chai')
    .use(require('chai-bn')(BN))

contract('QualificationFactory', ([contractOwner]) => {

    let qualificationContract
    const masterAccount = '0x55b8e2c4AE5951D1A8e77d0E513a6E598Ee0bE86'

    beforeEach(async () => {
        qualificationContract = await QualificationFactory.new()

        try {
            await qualificationContract.assignMasterRole([masterAccount], {from: contractOwner})
        } catch (e) {
            console.log("Error: " + e)
        }
    })

    describe('role assignment', () => {
        it('ensure owner is the first address', async () => {
        const owner = await qualificationContract.owner()
        owner.should.equal(contractOwner)
        })

        it('ensure masterAddress has been given master role', async () => {
            try {
                await qualificationContract.assignMasterRole(masterAddress, {from: contractOwner})
            } catch (e) {
                console.log(`Error: ${e}`)
            }
        })
    })
})