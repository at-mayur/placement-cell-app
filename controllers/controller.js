const csv = require("csv");
const fs = require("fs");
const path = require("path");

const Batch = require("../models/batch");
const Student = require("../models/student");
const Result = require("../models/result");


// home controller to render home page i.e. student details page
module.exports.homeContorller = async function (req, res) {
  try {
    // for non authenticated request back to sign in
    if (!req.isAuthenticated()) {
      return res.redirect("/user/sign-in");
    }

    // fetch batches and populate students
    let batches = await Batch.find({}).populate("students").sort("start_date");

    // render student details page and passing batches data
    return res.render("students", {
      batches,
      title: "Home | Students",
    });

  } catch (error) {
    console.error(error);
    return res.redirect("back");
  }
};

// controller func to create student on submission of create student form
module.exports.createStudentController = async function (req, res) {
  try {
    // fetch student using mail id provided
    let stud = await Student.findOne({ stud_email: req.body.studEmail });

    // if student already exists then do nothing and return
    if (stud) {
      console.log("Student exists with given mail id..");

      if (req.xhr) {
        return res.status(200).json({
          studentCreated: false,
          msg: "Student exists with given mail id.",
        });
      }

      return res.redirect("back");
    }

    // find batch with same start date
    let batch = await Batch.findOne({ start_date: req.body.studBatch });

    // if batch exists
    if (batch) {
      // create student
      let newStud = await Student.create({
        stud_name: req.body.studName,
        stud_email: req.body.studEmail,
        stud_clg: req.body.studClg,
        // batch id ref existing batch
        stud_batch: batch.id,
        stud_dsa: req.body.studDsa,
        stud_webD: req.body.studWebd,
        stud_react: req.body.studReact,
        stud_status: req.body.studStatus,
      });

      // add student to the existing batch
      batch.students.push(newStud.id);
      await batch.save();

      // return json if req is xhr
      if (req.xhr) {
        return res.status(200).json({
          studentCreated: true,
          newBatchCreated: false,
          batch,
          student: newStud,
          msg: "Student added to an existing batch.",
        });
      }

      return res.redirect("back");

    } else {
      // arr to fetch month name
      let months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      // creating new date obj
      let dt = new Date(req.body.studBatch);
      // get month name & date
      let month = months[dt.getMonth()];
      let date = dt.getDate();

      // create new batch
      let newBatch = await Batch.create({
        name: "Batch-" + month + date,
        start_date: req.body.studBatch,
      });

      // create new student
      let newStud = await Student.create({
        stud_name: req.body.studName,
        stud_email: req.body.studEmail,
        stud_clg: req.body.studClg,
        // batch ref to newly created batch
        stud_batch: newBatch.id,
        stud_dsa: req.body.studDsa,
        stud_webD: req.body.studWebd,
        stud_react: req.body.studReact,
        stud_status: req.body.studStatus,
      });

      // add new student ref to new batch obj
      newBatch.students.push(newStud.id);
      await newBatch.save();

      if (req.xhr) {
        return res.status(200).json({
          studentCreated: true,
          newBatchCreated: true,
          batch: newBatch,
          student: newStud,
          msg: "Student added with a new batch.",
        });
      }

      return res.redirect("back");

    }
  } catch (error) {
    console.error(error);
    if (req.xhr) {
      return res.status(500).json({
        studentCreated: false,
        msg: error,
      });
    }

    return res.redirect("back");
  }
};

// func to control get student data.
module.exports.studCsvDatacontroller = async function (req, res) {
  try {
    
    // fetch all students
    let students = await Student.find({}).populate({
        path: "stud_interviews",
        populate: {
            path: "company"
        }
    });

    // create arr to store entries for csv file
    let studentsData = [];

    // for each student
    for (let student of students) {

      // if interview arr length is 0
        if(student.stud_interviews.length==0){
            let stud = {
                student_name: student.stud_name,
                student_email: student.stud_email,
                student_college: student.stud_clg,
                student_status: student.stud_status,
                student_dsa_score: student.stud_dsa,
                student_webD_score: student.stud_webD,
                student_react_score: student.stud_react,
                // student not appeared for any interview
                interview_company: "Not appeared for interview",
                interview_date: "NA",
                interview_result_student: "NA",
            };

            studentsData.push(stud);

        }

        // if length is not 0 then for each interview student has given
        for (let interview of student.stud_interviews) {

          // get result for student for that interview
            let result = await Result.findOne({ student: student.id, interview: interview.id });

            let stud = {
                student_name: student.stud_name,
                student_email: student.stud_email,
                student_college: student.stud_clg,
                student_status: student.stud_status,
                student_dsa_score: student.stud_dsa,
                student_webD_score: student.stud_webD,
                student_react_score: student.stud_react,
                // interview data & result
                interview_company: interview.company.comp_name,
                interview_date: interview.interview_date.toDateString(),
                interview_result_student: result.result_stat,
            };

            studentsData.push(stud);
        }
    }

    // using csv lib. csv stringify creates csv data.
    csv.stringify(studentsData, {
      // add header to csv data
        header: true,
    }, function(error, csvOutput){
        if(error){
            console.error(error);
            return;
        }

        // path to csv file to store data
        let pathStr = path.join(__dirname, "../resources/studentData/");
        let fileName = "studData"+".csv";
        // creating file with csv data
        fs.writeFileSync(pathStr+fileName, csvOutput);

        // resolving file path. sendfile does not accept relative paths.
        let sndFilePath = path.resolve(pathStr+fileName);

        // sending file as response
        return res.sendFile(sndFilePath);
    });

    
  } catch (error) {
    console.error(error);
    return res.redirect("back");
  }
};


// func to display available jobs
module.exports.jobsFetchController = async function(req, res){

    try {

      // url string for api
        let url = `https://www.themuse.com/api/public/jobs?location=India&page=${req.params.id}`;

        // get response using fetch
        let fetchRes = await fetch(url);

        // get json data
        let data = await fetchRes.json();

        // render jobs page with response data
        return res.render("jobs", {
            jobs: data.results,
            nxtPage: Number(req.params.id)+1,
            title: "Latest Jobs"
        });

        
    } catch (error) {
        console.error(error);
        return res.redirect("back");
    }

};