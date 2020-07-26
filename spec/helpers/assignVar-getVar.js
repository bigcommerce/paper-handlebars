const Lab = require('lab'),
    lab = exports.lab = Lab.script(),
    describe = lab.experiment,
    it = lab.it,
    specHelpers = require('../spec-helpers'),
    testRunner = specHelpers.testRunner,
    renderString = specHelpers.renderString;


describe('assignVar and getVar helpers', function() {
    const context = {
        value1: "Big",
        value2: "Commerce",
        value3: 12,
        value1300char: "rOiWsgkWKLRm0fve752Upp7qe3QBNBlKaSgMJaG6zbB8TChtbxLfnEbidd6GiJdjm5Q18LDwy24zQxjOpGKqVzbg3cyEh5vwSZvdwl34EMXM8Iqa3QTP2aEXCBhpnoTBBv4USIPU3dmyNRL7Gmx63TyBkVCqrjXZ033KhrDXrGmE9eVGpzNktFxpAiylJHFnQmehKFnsPn5fbicfDChGhTbu3hk4ti9tvmawWziljUmqdGQ8ddovJ2ivz0fSfoC5UoBTOMU4xNJfupFunE1ayncImLJUnDCW1hWC99Qb2AVAMNCzH84V3Pch0cERhxYed87Aw1rH4tMOLBnnOWF6KYDd5hGQLWaSMiv2kS5PHiAfcndquARxnSrAxGY01ly3bSLivoW98AD7poZXb61Skuiw5wSd6rAfr2WXRTlaQWsyJ3r5qqtmg9k5LwH9p76FMKYDOFtf0tqE8nK0ZoSBesASojH3aNLEV9Ad8zXBIv5euClEwDs54aWtYgnAZt1fBz9pDmcwMi32YrHcYDHM2HGDkdfjaGpEsPzvlipBRveXQwmwgxzqNlXoQT98vPSFXKm8WC2dQkcCt8XbMEr5gk37UJNoqhcaAp7vKCentu1iO8y80aN2ggzJ14tHTk5zYpvtk2gplkh6yWri9z99FpHpWoXIHH37EEGaw9KmRju5Gb7GK4HsDhQmkxUajdpcWZGneNQEbQ0kHd3iPaTzioJJ1tLoi4qRoTvttahwIcuxFtOXi6mg6dE60RtlZUPDn8MLsA7o7Ofu6uuzktP8ZyafhmC1YVAO5GPxSi9DAbtAC8EkWFNkD6ZGJdPWCbSGNVjfMwZ5Jn4Y9MpV3hF4wuTj2HLdSmhq0SO9npznJpXX38N6mgMoW9OOSKa2meGT7IzqAH4hzjagHJoKjVz0N06TO5jclv72nyHXv9tfQHyrT5HAHDCWvmqvDKmqyJlmZ78bZLa8CyE1CChqjtI6lhsf2grHw7sHE0wmA3K3TbQuAg1DHxhHZtUzoDHj8JBrW3iSACljFu8KBGnBVEdVV9amvLaZSj466sougBQUcpjfkPKeig7iqJmzqBhA2WXZ03qXoIioCQFxbUuZJ7H53LtK8AbB9Nou8E0eChhEnTE69K3R9g15I8zD8xvFQvat8h62Ac0UBj4SqOvpYwtK0yXY3a87kK341KA7pFH99k0SRtUxAUHSYwnhvSAYHe2oZyDUxoQbF3ElbF68cMWbFB39x40lnKKxV0V6T97JI2lDivSH4r6sJV416P5xh7a21q20gwEmAfEBKSQ20i5f",
    };

    const runTestCases = testRunner({context});

    it('should throw an exception if the assignVar key is not a string', function (done) {
        renderString('{{assignVar 1 2}}').catch(e => {
            done();
        });
    });

    it('should throw an exception if the getVar key is not a string', function (done) {
        renderString('{{getVar 2}}').catch(e => {
            done();
        });
    });

    it('should assign and get variables', function(done) {
        runTestCases([
            {
                input: "{{assignVar 'data1' value1}}{{assignVar 'data2' 12}}{{getVar 'data1'}} {{getVar 'data2'}}",
                output: 'Big 12',
            },
            {
                input: "{{assignVar 'data1' value1}}{{assignVar 'data2' value2}}{{getVar 'data1'}}{{getVar 'data2'}}",
                output: 'BigCommerce',
            },
        ], done);
    });

    it('should return empty string if variable is not defined', function(done) {
        runTestCases([
            {
                input: "{{getVar 'data3'}}",
                output: '',
            },
            {
                input: "{{assignVar 'data1' value1}}{{getVar 'data3'}}",
                output: '',
            },
        ], done);
    });

    it('should return empty string if variable is not *yet* defined', function(done) {
        runTestCases([
            {
                input: "{{getVar 'data1'}}{{assignVar 'data1' value1}}",
                output: '',
            },
        ], done);
    });

    it('should return integers with correct type', function(done) {
        runTestCases([
            {
                input: "{{assignVar 'data1' value3}}{{assignVar 'data2' 10}}{{getVar 'data1'}} + {{getVar 'data2'}} = {{add (getVar 'data1') (getVar 'data2')}}",
                output: '12 + 10 = 22',
            },
        ], done);
    });

    it('should throw an error if too long of a value is used', function(done) {
        renderString("{{assignVar 'data1' value1300char}}").catch(e => {
            done();
        });
    });
});
