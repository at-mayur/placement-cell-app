
// action executing after page loads
$(document).ready(function(){
    // get all interview items
    let interviews = $(".interview-item");

    for(let interview of interviews){
        let interviewId = interview.id.split("-")[2];

        // add list expand and collapse action for every item
        listExpandEvent(interviewId);
        // add submit action to add student form
        addStudInterviewForm(interviewId);

    }

    // fetch all update result forms
    let updateResForms = $(".stud-result-form");

    for(let updateForm of updateResForms){
        let interviewId = updateForm.id.split("-")[2];
        let studId = updateForm.id.split("-")[3];

        // add submit action to update result form
        updateStudResultForm(interviewId, studId);

    }

    // add submit action to create interview form
    addFormListener();
});

// function to add expand collapse action
function listExpandEvent(elemId){

    // fetch elements
    let batchExpand = document.getElementById(`interview-expand-${elemId}`);
    let batchCollapse = document.getElementById(`interview-collapse-${elemId}`);
    let batchStudList = document.getElementById(`interview-batch-${elemId}`);

    // on expand btn click
    batchExpand.onclick = () => {
        batchStudList.classList.remove("hidden");
        batchStudList.classList.add("active");
        batchExpand.classList.remove("active");
        batchExpand.classList.add("hidden");
        batchCollapse.classList.remove("hidden");
        batchCollapse.classList.add("active");
    };

    // on collapse btn click
    batchCollapse.onclick = () => {
        batchStudList.classList.remove("active");
        batchStudList.classList.add("hidden");
        batchExpand.classList.remove("hidden");
        batchExpand.classList.add("active");
        batchCollapse.classList.remove("active");
        batchCollapse.classList.add("hidden");
    };

}

// function to add submit action for create interview form
function addFormListener(){
    // fetch form
    let createInterviewForm = $(`#create-interview-form`);

    // add submit event listener
    createInterviewForm.submit(function(event){
        // prevent default action
        event.preventDefault();
        
        $.ajax({
            type: "post",
            url: "/interview/create-interview",
            // get form data
            data: createInterviewForm.serialize(),
            success: function(resData){
                // if interview item created
                if(resData.interviewCreated){
                    // append new item to list
                    $("#interviews-container").append(getInterviewElement(resData.interview, resData.company, resData.students));
                    // add expand collapse action
                    listExpandEvent(resData.interview._id);
                    // add submit action to add student form
                    addStudInterviewForm(resData.interview._id);

                    // show information
                    alert("Interview created Successfully.")
                }
                else{
                    alert(resData.msg);
                }
            },
            error: function(error){
                console.error(error);
                return;
            }
        });
    });
}

// add student action
function addStudInterviewForm(elemId){
    // get form
    let addStudForm = $(`#add-stud-form-${elemId}`);

    // add submit event listener
    addStudForm.submit(function(event){
        event.preventDefault();
        
        $.ajax({
            type: "post",
            url: "/interview/add-student",
            data: addStudForm.serialize(),
            success: function(resData){
                if(resData.studentAdded){
                    // add newly created elem to list
                    $(`#interview-batch-${elemId}`).prepend(getStudElement(resData.interview, resData.student, resData.result));
                    // add update result action to update result form
                    updateStudResultForm(resData.interview._id, resData.student._id);
                    alert("Student added Successfully");
                }
                else{
                    alert(resData.msg);
                }
            },
            error: function(error){
                console.error(error);
                return;
            }
        });
    });
}

// update result action
function updateStudResultForm(interId, studId){

    let updateResForm = $(`#interview-result-${interId}-${studId}`);

    updateResForm.submit(function(event){
        event.preventDefault();
        
        $.ajax({
            type: "post",
            url: "/interview/update-result",
            data: updateResForm.serialize(),
            success: function(resData){
                if(resData.resultUpdated){
                    // uncheck prev result's radio btn
                    switch (resData.prevValue) {
                        case "Pass":
                            {
                                $(`#pass-${resData.interviewId}-${resData.studentId}`).prop("checked", false);
                                // if result changing from pass to something else update stud status as not placed
                                $(`#student-${resData.interviewId}-${resData.studentId}`).text("Not Placed");
                            }
                            break;
                    
                        case "Fail":
                            {
                                $(`#fail-${resData.interviewId}-${resData.studentId}`).prop("checked", false);
                            }
                            break;

                        case "On Hold":
                            {
                                $(`#hold-${resData.interviewId}-${resData.studentId}`).prop("checked", false);
                            }
                            break;

                        case "Didn't Attempt":
                            {
                                $(`#noAttempt-${resData.interviewId}-${resData.studentId}`).prop("checked", false);
                            }
                            break;

                        case "Pending":
                            {
                                $(`#pending-${resData.interviewId}-${resData.studentId}`).prop("checked", false);
                            }
                            break;
                
                        default:
                            break;
                    }

                    // check curr result's radio btn
                    switch (resData.currValue) {
                        case "Pass":
                            {
                                $(`#pass-${resData.interviewId}-${resData.studentId}`).prop("checked", true);
                                // if result changing from something else to pass update stud status as placed
                                $(`#student-${resData.interviewId}-${resData.studentId}`).text("Placed");
                            }
                            break;
                    
                        case "Fail":
                            {
                                $(`#fail-${resData.interviewId}-${resData.studentId}`).prop("checked", true);
                            }
                            break;

                        case "On Hold":
                            {
                                $(`#hold-${resData.interviewId}-${resData.studentId}`).prop("checked", true);
                            }
                            break;

                        case "Didn't Attempt":
                            {
                                $(`#noAttempt-${resData.interviewId}-${resData.studentId}`).prop("checked", true);
                            }
                            break;

                        case "Pending":
                            {
                                $(`#pending-${resData.interviewId}-${resData.studentId}`).prop("checked", true);
                            }
                            break;
                
                        default:
                            break;
                    }

                    alert("Result updated Successfully.");

                }
                else{
                    alert(resData.msg);
                }
            },
            error: function(error){
                console.error(error);
                return;
            }
        });
    });

}


// function return new stud element
function getStudElement(interview, student){
    return $(`
            <!-- Student -->
            <div class="p-2 border-bottom border-2">
                <div class="d-flex justify-content-between align-items-center">
                    <!-- Student name & College -->
                    <div>
                        <h6>${student.stud_name}</h6>
                        <p>${student.stud_clg}</p>
                    </div>
                    <!-- Student status -->
                    <p>
                        Status:
                        <span>${student.stud_status}</span>
                    </p>
                </div>
                <div>
                    <!-- Update result of interview for student -->
                    <h6>Result</h6>
                    <div>
                        <form id="interview-result-${interview._id}-${student._id}" action="" method="post">
                            <input type="hidden" name="interviewId" value="${interview._id}">
                            <input type="hidden" name="studentId" value="${student._id}">
                            <div class="d-flex flex-wrap">
                                <div class="form-check mx-2">
                                    <input type="radio" id="pass-${interview._id}-${student._id}"
                                    name="studResult" value="Pass"
                                    <label class="form-check-label" for="pass-${interview._id}-${student._id}">Pass</label>
                                </div>

                                <div class="form-check mx-2">
                                    <input type="radio" id="fail-${interview._id}-${student._id}" 
                                    name="studResult" value="Fail" class="form-check-input">
                                    <label class="form-check-label" for="fail-${interview._id}-${student._id}">Fail</label>
                                </div>

                                <div class="form-check mx-2">
                                    <input type="radio" id="hold-${interview._id}-${student._id}"
                                    name="studResult" value="On Hold" class="form-check-input">
                                    <label class="form-check-label" for="hold-${interview._id}-${student._id}">On Hold</label>
                                </div>

                                <div class="form-check mx-2">
                                    <input type="radio" id="noAttempt-${interview._id}-${student._id}"
                                    name="studResult" value="Didn't Attempt" class="form-check-input">
                                    <label class="form-check-label" for="noAttempt-${interview._id}-${student._id}">Didn't Attempt</label>
                                </div>

                                <div class="form-check mx-2">
                                    <input type="radio" id="pending-${interview._id}-${student._id}"
                                    name="studResult" value="Pending" class="form-check-input" checked>
                                    <label class="form-check-label" for="pending-${interview._id}-${student._id}">Pending</label>
                                </div>
                            </div>

                            <button type="submit" class="btn mt-3">Update</button>
                        </form>
                    </div>
                </div>
            </div>
    `);
}

// function return new interview element
function getInterviewElement(interview, company, students){

    // get students list element for select element within add student form
    let studList = getStudList(students);

    let interviewDate = new Date(interview.interview_date).toDateString();

    return $(`
            <div id="interview-item-${interview._id}" class="text-bg-light rounded-2 my-2 interview-item">
                <!-- Company name & date & Expand/collapse arrow -->
                <div class="d-flex justify-content-between align-items-center p-2">
                    <div>
                        <h4>${company.comp_name}</h4>
                        <h6 class="text-secondary">${interviewDate}</h6>
                        <!-- div to add student -->
                        <div>
                            <form id="add-stud-form-${interview._id}" action="/interview/add-student" method="post">

                                <input type="hidden" name="interviewId" value="${interview._id}">
                                <div class="mt-3">
                                    <label class="form-label" for="stud-list-${interview._id}">Add Student</label>
                                    <!-- Student list to select from -->
                                    <select id="stud-list-${interview._id}" name="studId" class="form-select">
                                        ${studList}
                                    </select>
                                </div>
                                <button type="submit" class="btn mt-2">Add</button>

                            </form>
                        </div>
                    </div>
                    <div id="interview-expand-${interview._id}" class="me-2">
                        <i class="fa-solid fa-angle-right"></i>
                    </div>
                    <div id="interview-collapse-${interview._id}" class="me-2 hidden">
                        <i class="fa-solid fa-angle-down"></i>
                    </div>
                </div>

                <!-- Div holding list of students for that interview -->
                <div id="interview-batch-${interview._id}" class="hidden p-1">


                </div>
            </div>
    `);
}

// function return students list element
function getStudList(students){
    let lst = "";

    for(let stud of students){
        lst += `
            <option value="${stud._id}">
                <span>${stud.stud_name}</span>
                <span>|</span>
                <span>${stud.stud_email}</span>
            </option>
        `;
    }

    return lst;

}