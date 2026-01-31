const questions = require("./../Model/questionModel");

exports.getAllQuestions = async (req, res) => {
  try {
    const data = await questions.find().sort({ createdAt : -1});
    res.status(200).json({
      status: "Success",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      msg: error.message,
    });
  }
};

exports.getQuestion = async (req,res) => {
    const id = req.params.id;
    try {
    const data = await questions.findById(id);
    
    res.status(200).json({
      status: "Success",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      msg: error.message,
    });
  }
};

exports.getMyQuestions = async (req, res) => {
  try {
    const myQuestions = await questions.find({ createdBy: req.user._id }).sort({ createdAt : -1});

    res.status(200).json({
      status: "Success",
      results: questions.length,
      data: myQuestions,
    });
  } catch (err) {
    res.status(500).json({
      status: "Failed",
      msg: err.message,
    });
  }
};


exports.createQuestion = async (req, res) => {
  try {
    const question = await questions.create({
      ...req.body,
      createdBy: req.user._id,
    });

    res.status(201).json({
      status: "Success",
      msg: "Question Created",
      data: question,
    });
  } catch (error) {
    res.status(400).json({
      status: "Failed",
      msg: error.message,
    });
  }
};

exports.deleteQuestion = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await questions.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        status: "Failed",
        msg: "Question not found"
      });
    }

    res.status(200).json({
      status: "Success",
      msg: "Question deleted successfully",
      data: deleted
    });

  } catch (error) {
    res.status(500).json({
      status: "Failed",
      msg: error.message
    });
  }
};


exports.addSolution = async (req, res) => {
  try {
    const { id } = req.params;          
    const { answer } = req.body;        
    const userId = req.user._id; 

    if (!answer || answer.trim() === "") {
      return res.status(400).json({ message: "Answer is required" });
    }

    const question = await questions.findById(id);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    const newSolution = {
      answer,
      createdBy: userId,
    };

    question.solutions.push(newSolution);
    await question.save();

    res.status(201).json({
      message: "Solution added successfully",
      answer: question.solutions[question.solutions.length - 1],
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
