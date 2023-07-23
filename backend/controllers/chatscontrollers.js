const Chat = require("../models/chatmodel");

const accessChat = async (req, res) => {
    
    
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400);
    }
     const isChat = await Chat.find({
      isGroupChat: false,
      
       $and:[
        {users:{$elemMatch:{$eq:req.user._id}}},
        {users:{$elemMatch:{$eq:userId}}}
      ] 
      
    }).populate("users", "-password").populate("latestMessage")
    .populate("latestMessage.sender", "name picture email");
    
  if (isChat.length === 1) {
    res.status(200).send(isChat[0])
  }else{
    
      const chatdata ={
          chatName:"sender",
          isGroupChat:false,
          users:[req.user._id,userId]
      }
      const createChat = new Chat(chatdata)

      const t = await createChat.save()

      const FullChat= await Chat.findOne({_id:t._id}).populate('users','-password')
      
      res.status(200).send(FullChat)
  }
       
      
      
  } catch (error) {
    res.status(400).send("no")
  }
};
const fetchChats = async(req,res)=>{
    try {
        const chats = await Chat.find({users:{$elemMatch:{$eq:req.user._id}}})
        .populate("users","-password")
        .populate("groupAdmin","-password")
        .populate("latestMessage")
        .populate("latestMessage.sender","name picture email")
        .sort({updateAt:-1})
        
        res.send(chats)
    } catch (error) {
        res.status(401).send("invalid")
    }
}
const createGroupChat = async(req,res)=>{
    try {
      
       if(!req.body.users || !req.body.name){
        return res.status(401).send("fill the fields")
       }
       
        const users = req.body.users
        
        if(users.length<2){
            return res.status(401).send("More than 2 users are required for a group chat")
        }
   
        users.push(req.user._id)
        
        const groupChat = await Chat.create({
            chatName:req.body.name,
            users:users,
            isGroupChat:true,
            groupAdmin:req.user
        })
        
        const fullGroupChat= await Chat.findOne({_id:groupChat._id})
        .populate('users','-password')
        .populate('groupAdmin','-password')

        res.send(fullGroupChat)
        
    }
       
     catch (error) {
        res.status(401).send("invalid")
    }
}
const renameGroup = async (req,res)=>{
  const {chatId,chatName} = req.body
try {
  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,{
      chatName
},{
  new:true
}).populate("users","-password")
.populate("groupAdmin","-password")
if(!updatedChat) {return res.status(401).send("not found")}

res.send(updatedChat)
} catch (error) {
  res.status(401).send("error")
}
  


}
const removeFromGroup = async (req,res)=>{
  const {chatId,userId} =req.body;

  try {
    const remove = await Chat.findByIdAndUpdate(
      chatId,{
        $pull:{users:userId}
      },{
        new:true
      }
    ).populate("users","-password")
    .populate("groupAdmin","-password")
    res.send(remove)
  } catch (error) {
    res.status(401).send("error")
  }
}
const addToGroup = async(req,res)=>{
  const {chatId,userId} =req.body;

  try {
    const added = await Chat.findByIdAndUpdate(
      chatId,{
        $push:{users:userId}
      },{
        new:true
      }
    ).populate("users","-password")
    .populate("groupAdmin","-password")
    res.send(added)
  } catch (error) {
    res.status(401).send("error")
  }
}


module.exports = { accessChat,fetchChats,createGroupChat,renameGroup,removeFromGroup,addToGroup };
