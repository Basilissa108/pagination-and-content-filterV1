/***************************************************     VARIABLES     *************************************************************/
// get all student objects from the page
const students = $("ul.student-list li");

// SEARCH
const searchBluePrint = '<div class="student-search">\
				          <input placeholder="Search for students...">\
				          <button>Search</button>\
				         </div>';

/***********************************************************************************************************************************/
/***********************************************************************************************************************************/
/***************************************************     FUNCTIONS     *************************************************************/

// function to hide students
function hideStudents(startIndex){
	for(i = startIndex; i < students.length; i++){
	students[i].style.display = "none";
	}
}

function appendPageLinks(studentList){
	// PAGINATION
	// calculate page numbers
	const iPages = Math.ceil((studentList.length) / 10);
	// create pagination blueprint
	const paginationBluePrint = '<div class="pagination"><ul></ul></div>';
	// append pagination blueprint to .page
	$(".page").append(paginationBluePrint);
	// create page links in loop and append them to the .pagination div
	for(i = 0; i < iPages; i++){
		let pageNumber = i + 1;
		$(".pagination ul").append('<li><a href="#">'+pageNumber+'</a></li>');
	}

	// STUDENT LIST
	// create two dimensional array, store 10 students in each subarray, in the last array there can be less than 10 students
	let aStudents = [];
	let aSubStudents = [];
	for(i = 0; i < studentList.length; i++){
		aSubStudents.push(studentList[i]);
		if(aSubStudents.length === 10){
			aStudents.push(aSubStudents);
			aSubStudents = [];
		}else if(i === (studentList.length - 1)){
			aStudents.push(aSubStudents);
		}
	}

	// get page id from click event and calculate index of the subarray that should be displayed (page number minus one)
	$(".pagination li").click(function(){
		let pageNumberToShow = $(this).text();
		let indexOfArrayToShow = pageNumberToShow - 1;
		let studentsToShow = aStudents[indexOfArrayToShow];
		// call the showPage function and pass the page number and the array of students that should be displayed 
		showPage(studentsToShow);
		// remove active class from all pagination links
		$(".pagination li a").removeClass("active");
		// add active class to pagination link
		$(this).children("a").addClass("active");
	})
	// return two dimensional array for search function
	return aStudents;
}

// function to display students of one page and hide all other students
function showPage(studentList){
	hideStudents(0);
	for(i = 0; i < studentList.length; i++){
		studentList[i].style.display = "list-item";
	}
}

function searchStudents(search){
	// remove no-result message in case it's there
	if($("#no-result") !== null){
		$("#no-result").remove();
	}
	// remove pagination
	$(".pagination").remove();
	// define search pattern
	let pattern = new RegExp(search, "ig");
	// create empty matches array
	let matches = [];
	// loop through all students
	for(i = 0; i < students.length; i++){
		// get student name
		let studentName = $(students[i]).children(".student-details").children("h3").text();
		// get student mail
		let studentMail = $(students[i]).children(".student-details").children(".email").text();
		// check if name matches search pattern
		let matchResultName = studentName.match(pattern);
		// check if mail matches search pattern
		let matchResultMail = studentMail.match(pattern);
		// if name or mail match, push student to matches array
		if(matchResultName !== null || matchResultMail !== null){
			matches.push(students[i]);
		}
	}
	hideStudents(0);
	if(matches.length > 0 && matches.length <=10){
		for(i = 0; i < matches.length; i++){
			let student = matches[i];
			student.style.display = "list-item";
		}
	}else if(matches.length > 10){
		let multipleMatches = appendPageLinks(matches);
		showPage(multipleMatches[0]);
	}else{
		$(".page").append('<p id="no-result">No matching student found.</p>');
	}
}

/***********************************************************************************************************************************/
/***********************************************************************************************************************************/
/****************************************************     ON LOAD     **************************************************************/

// add search bar
$(".page-header").append(searchBluePrint);
// hide all students, except for the first 10
hideStudents(10);
// call appendPage function, passing the students array
appendPageLinks(students);

/***********************************************************************************************************************************/
/***********************************************************************************************************************************/
/*****************************************************     EVENTS     **************************************************************/


$(document).on("click", ".student-search button", function(){
	// get search keyword
	let search = $(this).siblings().val();
	// pass search keyword to search function
	searchStudents(search);
})
