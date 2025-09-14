import noteModel from "../model/notesModel.js";
import { generateAIResponse } from "../services/gemini.js";

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
        const userId = req.user.id
        const notes = await noteModel.find({
            userId:userId
        })
        res.json({notes})
    }catch(err){
        return res.json({success:false, message: err.message})
    }
}

const getQuiz  = async(req, res)=>{
    try{
        const userId = req.user.id;
        const {title} = req.body;
        
        const note = await noteModel.find({
            userId: userId,
            title: title
        })

        if (!note){
            return res.json({success:false, message: "There are no notes with this title"})
        }
        const contents = note.map(n => n.content).join(" ");

        const quiz = await generateAIResponse(contents)
        return res.json({quiz})


        // return res.json({contents})

    }catch(error){
        return res.json({ success:false, message: error.message})
    }
}

export {saveTNotes, getSavedTNotes, getQuiz};
