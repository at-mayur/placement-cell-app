
// action executing after page loads
$(document).ready(function(){
    // get all batch items
    let batches = $(".batch");


    for(let batch of batches){
        let batchId = batch.id.split("-")[1];

        // add list expand and collapse action for every item
        listExpandEvent(batchId);

    }

    // add submit action to create interview form
    addFormListener();
});

// function to add expand collapse action
function listExpandEvent(elemId){

    let batchExpand = document.getElementById(`students-batch-expand-${elemId}`);
    let batchCollapse = document.getElementById(`students-batch-collapse-${elemId}`);
    let batchStudList = document.getElementById(`students-batch-${elemId}`);

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

};


// function to add submit action for create student form
function addFormListener(){
    // fetch form
    let addStudForm = $(`#create-student-form`);

    // add submit event listener
    addStudForm.submit(function(event){
        // prevent default action
        event.preventDefault();
        
        
        $.ajax({
            type: "post",
            url: "/add-student",
            // get form data
            data: addStudForm.serialize(),
            success: function(resData){
                // if student item created
                if(resData.studentCreated){
                    // if new batch created
                    if(resData.newBatchCreated){

                        // append new item to list
                        $("#batches-container").append(getBatchElement(resData.batch, resData.student));
                        // add expand collapse action
                        listExpandEvent(resData.batch._id);
                        alert("New Batch Created and Student Added Successfully.");
    
                    }
                    // if student added to existing batch
                    else{
                        
                        // append new item to existing list
                        $(`#students-batch-${resData.batch._id}`).prepend(getStudentElement(resData.student));
                        alert("Student added to previous existing batch for the same date.");
    
                    }
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


// function return new batch element
function getBatchElement(batch, student){
    let batchDate = new Date(batch.start_date).toDateString();

    return $(`
        <div id="batch-${batch._id}" class="text-bg-light rounded-2 batch">
            <div class="d-flex justify-content-between align-items-center p-2">
                <div>
                    <h4>${batch.name}</h4>
                    <h6 class="text-secondary">${batchDate}</h6>
                </div>
                <div id="students-batch-expand-${batch._id}" class="me-2">
                    <i class="fa-solid fa-angle-right"></i>
                </div>
                <div id="students-batch-collapse-${batch._id}" class="me-2 hidden">
                    <i class="fa-solid fa-angle-down"></i>
                </div>
            </div>
            <div id="students-batch-${batch._id}" class="hidden p-1">

                <div class="p-2 border-bottom border-2">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h6>${student.stud_name}</h6>
                            <p>${student.stud_clg}</p>
                        </div>
                        <p>
                            Status:
                            <span>${student.stud_status}</span>
                        </p>
                    </div>
                    <div>
                        <span>DSA: ${student.stud_dsa}%</span>
                        <span class="mx-3">|</span>
                        <span>WebD: ${student.stud_webD}%</span>
                        <span class="mx-3">|</span>
                        <span>React: ${student.stud_react}%</span>
                    </div>
                </div>

            </div>
        </div>
    `);

}

// function return new stud element
function getStudentElement(student){

    return $(`

        <div class="p-2 border-bottom border-2">
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <h6>${student.stud_name}</h6>
                    <p>${student.stud_clg}</p>
                </div>
                <p>
                    Status:
                    <span>${student.stud_status}</span>
                </p>
            </div>
            <div>
                <span>DSA: ${student.stud_dsa}%</span>
                <span class="mx-3">|</span>
                <span>WebD: ${student.stud_webD}%</span>
                <span class="mx-3">|</span>
                <span>React: ${student.stud_react}%</span>
            </div>
        </div>

    `);

}

