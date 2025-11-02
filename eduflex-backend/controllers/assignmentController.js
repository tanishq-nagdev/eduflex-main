const Assignment = require('../models/Assignment');
const Course = require('../models/Course');

// @desc    Create a new assignment
// @route   POST /api/assignments
// @access  Private (Teacher)
const createAssignment = async (req, res) => {
  try{
    const { title, description, courseId, dueDate } = req.body;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    // ensure teacher owns course
    if (req.user.role === 'teacher' && String(course.teacher) !== String(req.user.id)) {
      return res.status(403).json({ message: 'You can only create assignments for your own courses' });
    }

    const assignment = new Assignment({
      title, 
      description, 
      course: courseId, 
      dueDate, 
      createdBy: req.user.id
    });
    await assignment.save();
    res.status(201).json(assignment);
  }catch(err){
  console.log(err)
  return res.status(500).json({message:"Server Error"})
}

};

// @desc    Get all assignments for a course
// @route   GET /api/assignments/course/:courseId
// @access  Private
const getAssignmentsForCourse = async (req, res) => {
  try{
    const list = await Assignment.find({ course: req.params.courseId });
    res.json(list);
  }catch(err){
  console.log(err)
  return res.status(500).json({message:"Server Error"})
}
};

const updateAssignment=async(req, res)=>{
   try{
    const { title, description,  dueDate } = req.body;
    if(!title || !description || !dueDate ){
      return res.status(400).json({message:"missing fields"})
    }
    const assignment=await Assignment.findById(req.params.id).populate('course');
    if(!assignment) return res.status(404).json({message:"Assignment not found!"})
    if(String(assignment.course.teacher)!==String(req.user._id)){
      return res.status(403).json({message:"Update Access Forbidden"})
    }
  assignment.dueDate=dueDate;
  assignment.title=title;
  assignment.description=description;

  // save changes to db
  await assignment.save();

  return res.status(200).json({message:"Assignment Updated Successfully!"})
}catch(err){
  console.log(err)
  return res.status(500).json({message:"Server Error"})
}
}

const deleteAssignment=async(req, res)=>{
  try{
    const assignment=await Assignment.findById(req.params.id).populate('course')
    if(String(assignment.course.teacher)!==String(req.user._id)){
      return res.status(403).json({message:"Deletion Access Forbidden"})
    }
    assignment.deleteOne()
    return res.status(200).json({message:"Assignment Deleted Successfully!"})
  }catch(err){
    console.log(err)
    res.status(500).json({message:"Server Error"})
  }
}

module.exports = {
  createAssignment,
  getAssignmentsForCourse,
  updateAssignment,
  deleteAssignment
};