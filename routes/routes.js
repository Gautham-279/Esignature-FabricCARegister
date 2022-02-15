
const registerData={
  type:'object',
  properties:{
    emailId:{
      type:"string"},
      role:{
        type:"string"
      }

  },
  required:["emailId","role"]
}

const postRegisterUserOpt={
  schema:{
    body:registerData,
    response:{
       200:{
         type:"string"
       }
    }
  }
}




const registerEnrollUserInFabricCA=require("../handlers/register-user-to-fabric-ca-handler")





  
  async function registerUserToFabricCARoutes(fastify,options,done){
    
    
      fastify.post('/registerUserToFabricCA',postRegisterUserOpt,async(request,reply)=>{
                
       await registerEnrollUserInFabricCA(request,reply)
   
    })
    



}

module.exports=registerUserToFabricCARoutes

