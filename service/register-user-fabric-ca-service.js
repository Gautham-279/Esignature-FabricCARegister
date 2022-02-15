'use strict';

const FabricCAServices = require('fabric-ca-client');
const { Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');


const fabricCAConstants=require("../constants/fabric-ca-constants")

 const registerEnrollUserIAsRoleTypeClient=async(emailId,adminCredential)=>{
   try{
    const ccpPath = path.resolve(__dirname, '..','connection_profile_path' ,'connection-exathought.esignature.exadock.app.json');

    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    // Create a new CA client for interacting with the CA.
    const caURL = ccp.certificateAuthorities['ca.exathought.esignature.exadock.app'].url;
    const ca = new FabricCAServices(caURL);
    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Check to see if we've already enrolled the user.
    const userIdentity = await wallet.get(emailId);
    if (userIdentity) {
       
        throw new Error(`User ${emailId} already registered for client Role`)

    }


    // Check to see if we've already enrolled the admin user.
    let adminIdentity = await wallet.get(adminCredential.name);
    if (!adminIdentity) {
        await getFabricCAAdmin(adminCredential.name,adminCredential.password)
        adminIdentity = await wallet.get(adminCredential.name);


        
    }
    // build a user object for authenticating with the CA
    const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
    const adminUser = await provider.getUserContext(adminIdentity, adminCredential);
    // Register the user, enroll the user, and import the new identity into the wallet.
    const secret = await ca.register({
        affiliations: fabricCAConstants.affiliations.exathoughtEsignature,
        enrollmentID: emailId,
        role: 'client'
    }, adminUser);
    const enrollment = await ca.enroll({
        enrollmentID: emailId,
        enrollmentSecret: secret
    });
    const x509Identity = {
        credentials: {
            certificate: enrollment.certificate,
            privateKey: enrollment.key.toBytes(),
        },
        mspId: fabricCAConstants.msp.exaThoughtMSP,
        type: 'X.509',
    };
    await wallet.put(emailId, x509Identity);
    return `User ${emailId} successfully registered and enrolled for  client role`  


       
    }
   catch(error){
       throw error
   }

    


}


 const registerEnrollUserIAsRoleTypePeer=async(emailId,adminCredential)=>{
    try{
        const ccpPath = path.resolve(__dirname, '..','connection_profile_path' ,'connection-exathought.esignature.exadock.app.json');

        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

        // Create a new CA client for interacting with the CA.
        const caURL = ccp.certificateAuthorities['ca.exathought.esignature.exadock.app'].url;
        const ca = new FabricCAServices(caURL);
        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userIdentity = await wallet.get(emailId);
        if (userIdentity) {
           
            throw new Error(`User ${emailId} alerady registered for peer Role`)

        }
          console.log(adminCredential)
          console.log(adminCredential.name)
          console.log(adminCredential.password)
        // Check to see if we've already enrolled the admin user.
        let adminIdentity = await wallet.get(adminCredential.name);
        if (!adminIdentity) {
            await getFabricCAAdmin(adminCredential.name,adminCredential.password)
            adminIdentity = await wallet.get(adminCredential.name);
            
        }

        // build a user object for authenticating with the CA
        const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
        const adminUser = await provider.getUserContext(adminIdentity, adminCredential);
        // Register the user, enroll the user, and import the new identity into the wallet.
        const secret = await ca.register({
            affiliations: fabricCAConstants.affiliations.exathoughtEsignature,
            enrollmentID: emailId,
            role: 'peer'
        }, adminUser);
        const enrollment = await ca.enroll({
            enrollmentID: emailId,
            enrollmentSecret: secret
            
        });
        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: fabricCAConstants.msp.exaThoughtMSP,
            type: 'X.509',
        };
        await wallet.put(emailId, x509Identity);
        return `User ${emailId} successfully registered and enrolled for peer role`  


    }
    catch(error){
        throw error
    }
 
     
 
 
 }


  const getFabricCAAdmin=async(adminCredential,password)=>{
    try{
       
        const ccpPath = path.resolve(__dirname, '..','connection_profile_path' ,'connection-exathought.esignature.exadock.app.json');
        const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
        const caInfo = ccp.certificateAuthorities['ca.exathought.esignature.exadock.app'];
        const caTLSCACerts = caInfo.tlsCACerts.pem;
       
        caInfo.caName="ca_exathought.esignature.exadock.app"
        const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        
        const identity = await wallet.get(adminCredential);
        if (identity) {
           throw new Error(`User ${adminCredential} already registered for Admin Role`)
        }
       // console.log(caInfo)
       console.log("Before enrollment")

         // Enroll the admin user, and import the new identity into the wallet.
        const enrollment = await ca.enroll({ enrollmentID: adminCredential, enrollmentSecret: password });
         console.log("After enrollment")
        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: fabricCAConstants.msp.exaThoughtMSP,
            type: 'X.509',
        };
        await wallet.put(adminCredential, x509Identity);
        return `User ${adminCredential} successfully exported fabric-ca admin to wallet`  
      

    }
    catch(error){
        throw error
    }
 
     
 
 
 }


 module.exports={getFabricCAAdmin:getFabricCAAdmin,
    registerEnrollUserIAsRoleTypePeer:registerEnrollUserIAsRoleTypePeer,
    registerEnrollUserIAsRoleTypeClient:registerEnrollUserIAsRoleTypeClient}