import Note from '../models/Note.js'

export const getNotes=async(req,res)=>{
  try {
    let page=parseInt(req.query.page) || 1
    let limit=parseInt(req.query.limit) || 5
    let skip=(page-1)*limit
    let search=req.query.search?.trim() || ""

    let query={user:req.user._id}

    if(search){
      let escapedSearch=search.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")

      query.$or=[
        {title:{$regex:escapedSearch,$options:"i"}},
        {content:{$regex:escapedSearch,$options:"i"}}
      ]
    }

    let total=await Note.countDocuments(query)
    let notes=await Note.find(query).sort({isPinned:-1,createdAt:-1}).skip(skip).limit(limit)
    res.status(200).json({
      success:true,
      page,
      totalPages:Math.ceil(total/limit),
      data:notes
    })
  } catch (error) {
   res.status(500).json({success:false,error:error.message}) 
  }
}


export const createNote=async(req,res)=>{
  try {
    let {title,content,isPinned}=req.body
    if(!title || !content){
      return res.status(400).json({success:false,message:'All fields required'})
    }
    let notes=await Note.create({
      title,
      content,
      isPinned:isPinned ?? false,
      user:req.user._id})
    res.status(201).json({success:true,message:'Note created Successfully',data:notes})
  } catch (error) {
    res.status(500).json({success:false,error:error.message})
  }
}

export const updateNote = async (req, res) => {
  try {
    const { title, content, isPinned } = req.body;

    if (title !== undefined && title.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Title cannot be empty"
      });
    }

    if (content !== undefined && content.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Content cannot be empty"
      });
    }

    if (isPinned !== undefined && typeof isPinned !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "Value must be a boolean"
      });
    }

    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Successfully updated",
      data: note
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}


export const deleteNote = async (req, res) => {
  try {
    const deletedNote = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!deletedNote) {
      return res.status(404).json({
        success: false,
        message: "Note not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

