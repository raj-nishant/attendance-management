const dateInput = document.getElementById("date");
const searchButton = document.getElementById("searchBtn");
const fetchButton = document.getElementById("fetchBtn");
const nameContainer = document.getElementById("nameContainer");
const statusContainer = document.getElementById("statusContainer");
const percentContainer = document.getElementById("percentContainer");
const markButtonContainer = document.getElementById("markBtnContainer");

searchButton.addEventListener("click", fetchAttendance);
fetchButton.addEventListener("click", fetchAttendanceReport);

function fetchAttendance(event) {
  if (dateInput.value === "") {
    return alert("Please enter the date.");
  }
  axios
    .get("http://localhost:9000/", { params: { date: dateInput.value } })
    .then((response) => {
      console.log(response);
      if (response.data.attendanceAvailable) {
        displayAttendanceSummary(response.data);
      } else {
        displayAttendanceForm(response.data);
      }
    })
    .catch((error) => console.error(error));
}

function postAttendance() {
  let jsonData = {
    date: dateInput.value,
    data: [],
  };

  const radioButtons = document.getElementsByClassName("stud-radio");
  for (let i = 0; i < radioButtons.length; i++) {
    if (radioButtons[i].checked) {
      jsonData.data.push({
        studentId: radioButtons[i].name.split("_")[0],
        studentName: radioButtons[i].name.split("_")[1],
        status: radioButtons[i].value,
      });
    }

    let selectedValue = null;
    document.getElementsByName(`${radioButtons[i].name}`).forEach((radio) => {
      if (radio.checked) {
        selectedValue = radio.value;
      }
    });
    if (selectedValue === null) return alert("Please mark all the attendance.");
  }

  console.log(jsonData);
  axios
    .post("http://localhost:9000/", jsonData)
    .then(() => {
      displayAttendanceSummary(jsonData);
    })
    .catch((error) => console.error("postAttendanceError: ", error));
}

function displayAttendanceForm(data) {
  clearContainers();
  const totalDays = data.totalDays;

  for (let i = 0; i < data.data.length; i++) {
    nameContainer.innerHTML += `${data.data[i].studentName} <br><br>`;
    statusContainer.innerHTML += `<label><input type="radio" name="${data.data[i].studentId}_${data.data[i].studentName}" class="stud-radio" value="Present">Present</label><label><input type="radio" name="${data.data[i].studentId}_${data.data[i].studentName}" class="stud-radio" value="Absent">Absent</label>  <br><br>`;
  }

  let submitAttendanceButton = document.createElement("button");
  submitAttendanceButton.appendChild(
    document.createTextNode("Mark Attendance")
  );
  submitAttendanceButton.addEventListener("click", postAttendance);

  markButtonContainer.appendChild(submitAttendanceButton);
}

function displayAttendanceSummary(data) {
  clearContainers();

  for (let i = 0; i < data.data.length; i++) {
    nameContainer.innerHTML += `${data.data[i].studentName} <br><br>`;
    if (data.data[i].status === "Present") {
      statusContainer.innerHTML += `✔ Present <br><br>`;
    } else {
      statusContainer.innerHTML += `✘ Absent <br><br>`;
    }
  }
}

function fetchAttendanceReport() {
  axios
    .get("http://localhost:9000/report")
    .then((response) => {
      displayReport(response.data);
    })
    .catch((error) => console.error(error));
}

function displayReport(data) {
  clearContainers();
  const totalDays = data.totalDays;

  for (let i = 0; i < data.data.length; i++) {
    let percent = Math.round((data.data[i].presentCount / totalDays) * 100);
    nameContainer.innerHTML += `${data.data[i].studentName} <br><br>`;
    statusContainer.innerHTML += `${data.data[i].presentCount}/${totalDays} <br><br>`;
    percentContainer.innerHTML += `${percent}% <br><br>`;
  }
}

function clearContainers() {
  nameContainer.innerHTML = "";
  statusContainer.innerHTML = "";
  percentContainer.innerHTML = "";
  markButtonContainer.innerHTML = "";
}
