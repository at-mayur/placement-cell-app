const Interview = require("../models/interview");
const Student = require("../models/student");
const Company = require("../models/company");
const Result = require("../models/result");

// interview controller to render interviews page
module.exports.interviewController = async function(req, res){
    
    try {

        // check req authentication
        if(!req.isAuthenticated()){
            return res.redirect("/user/sign-in");
        }
    
        // get all interviews and populate all paths
        let interviews = await Interview.find({}).populate("company").populate({
            path: "students",
            populate: {
                path: "student result"
            }
        }).sort("interview_date");

        // find all students
        let students = await Student.find({}).sort("stud_status");

        // render interview page with interviews & students data
        return res.render("interview", {
            interviews,
            students,
            title: "Interviews"
        });
        
    } catch (error) {
        console.error(error);
        return res.redirect("back");
    }

};

// func to control create interview action
module.exports.createInterviewController = async function(req, res){

    try {

        // find company with submitted name
        let company = await Company.findOne({ comp_name: req.body.compName.toUpperCase() });

        // find all students
        let students = await Student.find({}).sort("stud_status");

        // if company exists
        if(company){

            // find interview with given date
            let interview = await Interview.findOne({ company: company.id, interview_date: req.body.interviewDate });

            // if interview exists. return
            if(interview){
                if(req.xhr){
                    return res.status(200).json({
                        interviewCreated: false,
                        msg: "Interview for same company already exists for given date."
                    });
                }
    
                return res.redirect("back");
            }

            // otherwise create new interview
            let newInterview = await Interview.create({
                // existing company id
                company: company.id,
                interview_date: req.body.interviewDate
            });

            // add interview to company interviews list.
            company.interview_schedules.push(newInterview.id);
            await company.save();

            if(req.xhr){
                return res.status(200).json({
                    interviewCreated: true,
                    company,
                    interview: newInterview,
                    students,
                    msg: "Interview created with existing company."
                });
            }

            return res.redirect("back");
        }
        // if company not exists
        else{
            // create new company
            let newCompany = await Company.create({
                comp_name: req.body.compName.toUpperCase()
            });

            // create new interview
            let interview = await Interview.create({
                // new company id
                company: newCompany.id,
                interview_date: req.body.interviewDate
            });

            // add new interview to new company interviews list
            newCompany.interview_schedules.push(interview.id);
            await newCompany.save();

            if(req.xhr){
                return res.status(200).json({
                    interviewCreated: true,
                    company: newCompany,
                    interview,
                    students,
                    msg: "Interview created with existing company."
                });
            }

            return res.redirect("back");
        }
        
    } catch (error) {
        
        console.error(error);
        if(req.xhr){
            return res.status(500).json({
                interviewCreated: false,
                msg: error
            });
        }

        return res.redirect("back");

    }

};


// func to control add student to interview action
module.exports.addStudInterviewController = async function(req, res){

    try {

        // fetch student with id submitted
        let student = await Student.findById(req.body.studId);

        // fetch interview with id submitted
        let interview = await Interview.findById(req.body.interviewId);

        // if any one or both not exists then return
        if(!student || !interview){

            if(req.xhr){
                return res.status(204).json({
                    studentAdded: false,
                    msg: "Student or Interview does not exist"
                });
            }
    
            return res.redirect("back");

        }

        // find if student already added to interview
        let index = student.stud_interviews.findIndex((id) => id==interview.id);

        // if not added
        if(index==-1){
            // create new result obj
            let result = await Result.create({
                comp_name: interview.company,
                student: student.id,
                interview: interview.id,
                result_stat: "Pending"
            });

            // add student to interview list
            interview.students.push({
                student: student.id,
                result: result.id
            });

            await interview.save();

            // also add interview to student's interview list
            student.stud_interviews.push(interview.id);
            await student.save();

            if(req.xhr){
                return res.status(200).json({
                    studentAdded: true,
                    interview,
                    student,
                    result,
                    msg: "Student added to interview"
                });
            }
    
            return res.redirect("back");
        }

        // if student already exists in interview then return
        if(req.xhr){
            return res.status(200).json({
                studentAdded: false,
                msg: "Student already exists for given interview"
            });
        }

        return res.redirect("back");
        
    } catch (error) {
        
        console.error(error);
        if(req.xhr){
            return res.status(500).json({
                studentAdded: false,
                msg: error
            });
        }

        return res.redirect("back");

    }

};


// function to control update result action
module.exports.updateStudResult = async function(req, res){

    try {

        // fetch result for student for that interview
        let result = await Result.findOne({ interview: req.body.interviewId, student: req.body.studentId });

        // if result does not exists then return error msg
        if(!result){
            if(req.xhr){
                return res.status(204).json({
                    resultUpdated: false,
                    msg: "Student or Interview does not exist"
                });
            }
    
            return res.redirect("back");
        }

        // get prev and curr result values
        let prevValue = result.result_stat;
        let currValue = req.body.studResult;

        // set result to curr value
        result.result_stat = currValue;
        await result.save();

        // if value is changing from Pass to something else then update student status as not placed
        if(prevValue=="Pass"){
            let student = await Student.findById(req.body.studentId);
            student.stud_status = "Not Placed";
            await student.save();
        }

        // if value is changing from something else to pass then update student status as placed
        if(currValue=="Pass"){
            let student = await Student.findById(req.body.studentId);
            student.stud_status = "Placed";
            await student.save();
        }

        if(req.xhr){
            return res.status(200).json({
                resultUpdated: true,
                interviewId: req.body.interviewId,
                studentId: req.body.studentId,
                prevValue,
                currValue,
                msg: "Result updated successfully."
            });
        }

        return res.redirect("back");
        
    } catch (error) {
        
        console.error(error);
        if(req.xhr){
            return res.status(500).json({
                resultUpdated: false,
                msg: error
            });
        }

        return res.redirect("back");

    }

};
