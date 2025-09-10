import noteModel from "../model/notesModel.js";

const saveTNotes = async (req, res) =>{
    try {
        const {userId, title, content} = req.body;

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

export default saveTNotes;