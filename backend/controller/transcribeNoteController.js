import noteModel from "../model/notesModel.js";

const saveTNotes = async (req, res) =>{
    try {
        const { title, content} = req.body;
        const userId = req.user.id;

        if ( !title || !content){
            return res.json({success:false, message: "missing title or content"})
        }
        const notes = new noteModel({ userId, title, content});
        await notes.save();
        res.json({success:true, message:"Transcribe saved successfully."})
    }catch(error){
        res.json({ success: false, message: error.message });
    }
}



const getSavedTNotes = async(req,res) =>{
    try{
        const userId = req.user.id;
        const notes = await noteModel.find({
            userId:userId
        })
        res.json({notes})
    }catch(err){
        return res.json({success:false, message: err.message})
    }
}

export {saveTNotes, getSavedTNotes};