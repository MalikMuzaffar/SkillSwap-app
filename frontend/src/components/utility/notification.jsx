export const sendNotification = async(userId,type,status,message='')=>{
          const response = await axios.post(`/notification/create`,{
            type,
            message:message=='' ? `${status}`:message,
            userId:userId.toString()
          },{
            withCredentials:true
          })
}