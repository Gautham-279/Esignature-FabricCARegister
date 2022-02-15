

const fabricCAConstants=require("../constants/fabric-ca-constants")
const httpCodesConstants=require("../constants/http-codes")
const registerUserToFabricCA=require("../service/register-user-fabric-ca-service")

  const registerEnrollUserInFabricCA=async(request,reply)=>{
    try{
     const emailId=request.body.emailId;
     const roleType=request.body.role
     let errorMessage=""
     if(emailId==null||emailId==undefined||emailId==""){
        errorMessage="EmailId "
     }
     if(roleType==null||roleType==undefined||roleType==""){
        errorMessage=errorMessage+" role"
     }
    
      if(errorMessage!=""){
           reply.status(httpCodesConstants.badRequest).send(errorMessage+" required")
      }
      else{

         if(roleType==fabricCAConstants.roles.peer){
           const adminIdentity=fabricCAConstants['fabric-ca-admin-credential']
               const response=await registerUserToFabricCA.registerEnrollUserIAsRoleTypePeer(emailId,adminIdentity)
               reply.status(httpCodesConstants.ok).send(response)

            
         }
      
        else if(roleType==fabricCAConstants.roles.client){
         const adminIdentity=fabricCAConstants["fabric-ca-admin-credential"]
            const response=await registerUserToFabricCA.registerEnrollUserIAsRoleTypeClient(emailId,adminIdentity)
            reply.status(httpCodesConstants.ok).send(response)

         

        }  
      
      }
     
        
    }
    catch(error){
      console.log(error)
      reply.status(httpCodesConstants.internalServerError).send(error)

    
    }
    
}

module.exports=registerEnrollUserInFabricCA