const registerEnrollUserInFabricCAHandler=require("../register-user-to-fabric-ca-handler")

const registerEnrollUserInFabricCAService=require("../../service/register-user-fabric-ca-service");


let reply = {
	responseStatus: 0,
	body: null,
	status: function(rstatus) {
		this.responseStatus= rstatus;
		return this;
	},
	send: function(result) {
		this.body=result ;
		return this;
	},
};


describe('Test for register-user-to-fabric-ca-handler',()=>{
  it('test for registerEnrollUserInFabricCA when role is peer',async()=>{
    registerEnrollUserInFabricCAService.registerEnrollUserIAsRoleTypePeer=jest.fn().mockReturnValue('User peer@exathought.com successfully registered and enrolled for peer role')
    const request={
      body:{
          "emailId":"peer@exathought.com",
          "role":"peer"
      }
    }
    await registerEnrollUserInFabricCAHandler(request,reply)
     expect(registerEnrollUserInFabricCAService.registerEnrollUserIAsRoleTypePeer).toBeCalledTimes(1)
     expect(reply.responseStatus).toBe(200)
     
  })
  it('test for registerEnrollUserInFabricCA when role is not given',async()=>{
    const request={
      body:{
          "emailId":"peer@exathought.com"
      }
    }
    await registerEnrollUserInFabricCAHandler(request,reply)
     expect(reply.responseStatus).toBe(400)
     expect(reply.body).toBe(' role required')
     
  })
  it('test for registerEnrollUserInFabricCA when role is client',async()=>{
    registerEnrollUserInFabricCAService.registerEnrollUserIAsRoleTypeClient=jest.fn().mockReturnValue('User client@exathought.com successfully registered and enrolled for client role')
    const request={
      body:{
          "emailId":"client@exathought.com",
          "role":"client"
      }
    }
    await registerEnrollUserInFabricCAHandler(request,reply)
     expect(registerEnrollUserInFabricCAService.registerEnrollUserIAsRoleTypeClient).toBeCalledTimes(1)
     expect(reply.responseStatus).toBe(200)
     
  })

  it('test for registerEnrollUserInFabricCA when role and emailId is not given',async()=>{
    const request={
      body:{

      }
    }
    await registerEnrollUserInFabricCAHandler(request,reply)
     expect(reply.responseStatus).toBe(400)
     expect(reply.body).toBe('EmailId  role required')
  })
   

  it('test for registerEnrollUserInFabricCA when emailId is not given',async()=>{
    const request={
      body:{
          role:"peer"
      }
    }
    await registerEnrollUserInFabricCAHandler(request,reply)
     expect(reply.responseStatus).toBe(400)
     expect(reply.body).toBe('EmailId  required')
  })
  it('test for registerEnrollUserInFabricCA when there is error raised by registerEnrollUserInFabricCAService',async()=>{
    registerEnrollUserInFabricCAService.registerEnrollUserIAsRoleTypePeer=jest.fn().mockRejectedValue(new Error('User peer@exathought.com already registered for peer Role'))
    const request={
      body:{
          "emailId":"peer@exathought.com",
          "role":"peer"
      }
    }
    await registerEnrollUserInFabricCAHandler(request,reply)
     expect(registerEnrollUserInFabricCAService.registerEnrollUserIAsRoleTypePeer).toBeCalledTimes(1)
     expect(reply.responseStatus).toBe(500)
     
  })
})
