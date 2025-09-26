import noteModel from "../model/transcribeModel.js";
import { generateAIResponse } from "../services/gemini.js";
import quizModel from "../model/quizModel.js";
import transcribeModel from "../model/transcribeModel.js";

const saveTNotes = async (req, res) =>{
    try {
        const { title, content} = req.body;
        const userId = req.user.id;

        if ( !title || !content){
            return res.json({success:false, message: "missing title or content"})
        }
        const beautifiedNotes =  await generateAIResponse(content, false)
        console.log("This is coming from saveTNotes controller Ai notes", beautifiedNotes)
        const transcribe = new transcribeModel({ userId, title, content : beautifiedNotes});
        await transcribe.save();
        res.json({success:true, message:"Transcribe saved successfully."})
    }catch(error){
        res.json({ success: false, message: error.message });
    }
}

const saveNotes = async(req,res)=>{
    try {
        const {title, content} = req.body;

        if (!title || !content){
            return res.json({success:false, message: "Missing title or the note"})
        }

        notes = new noteModel({ userId, title, content})
        await notes.save()
        res.json({success:true, message:"Notes saved to the database"})
        
    }catch(error){
        res.json({success:false, message:error.message})
    }
}
const delNote = async(req, res)=>{
    const { title } = req.params;
}


const getSavedTNotes = async(req,res) =>{
    try{
        const userId = req.user.id
        const notes = await noteModel.find({ userId}).sort({ createdAt: -1 });
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

        const quiz = await generateAIResponse(contents, true)
        return res.json({quiz})


        // return res.json({contents})

    }catch(error){
        return res.json({ success:false, message: error.message})
    }
}

const saveQuizScore = async(req, res) =>{
    try{
        const userId = req.user.id;
        const {title, score} = req.body;
        
        

        if (!title || !score){
            return res.json({success:false, message: "missing title or score."})
        }
        const quiz = new quizModel({userId, title, score})
        await quiz.save();

        return res.json("Score saved successfully.")

        

    }catch(error){
        return res.json({success:false, message: error.message})
    }
}

export {saveTNotes, saveNotes, getSavedTNotes, getQuiz, saveQuizScore, delNote};
