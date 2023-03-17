
var batchExpand = document.getElementById("interview-expand");
var batchCollapse = document.getElementById("interview-collapse");
var batchStudList = document.getElementById("interview-batch");

batchExpand.onclick = () => {
    batchStudList.classList.remove("hidden");
    batchStudList.classList.add("active");
    batchExpand.classList.remove("active");
    batchExpand.classList.add("hidden");
    batchCollapse.classList.remove("hidden");
    batchCollapse.classList.add("active");
};

batchCollapse.onclick = () => {
    batchStudList.classList.remove("active");
    batchStudList.classList.add("hidden");
    batchExpand.classList.remove("hidden");
    batchExpand.classList.add("active");
    batchCollapse.classList.remove("active");
    batchCollapse.classList.add("hidden");
};