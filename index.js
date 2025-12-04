var tableHeadArr = ['', 'Name', 'Department', 'Course', 'Year', 'Age', 'Email', 'Phone', 'Address', 'CGPA'];
let form = document.querySelectorAll('form input');
let tHead = document.querySelector('thead');
let tBody = document.querySelector('tbody');
let addBtn = document.getElementById('addBtn');
let updateBtn = document.getElementById('updateBtn');
var idField = document.getElementById('id');
let searchInp = document.getElementById('search');
updateBtn.disabled = true;
addBtn.disabled = false;

var flag = true;

function changeBtn() {
    if (flag) {
        updateBtn.disabled = true;
        addBtn.disabled = false;
    } else {
        updateBtn.disabled = false;
        addBtn.disabled = true;
    }
}

function clearData(e) {
    e.preventDefault();
    form.forEach(ele => {
        ele.value = '';
    })
}

searchInp.addEventListener('change', (e) => {
    console.log(e.target.value);
    console.log('click');
})


async function getData() {
    let data = await fetch('http://localhost:3000/students');
    return data = await data.json();
}

function tableHead() {
    let tr = document.createElement('tr');
    tableHeadArr.forEach((val) => {
        let th = document.createElement('th');
        th.innerText = val;

        tr.append(th);
    })
    tHead.append(tr);
}

async function tableBody() {
    tBody.innerHTML = "";
    let data = await getData();
    data.forEach(obj => {
        let tr = document.createElement('tr');
        tr.innerHTML = `
                    <td>
                        <div class="tdBtns"> 
                            <button onclick="updateData(${obj.id})">Update</button> 
                            <button onclick="deleteData(${obj.id})">Delete</button>
                        </div>
                    </td>
                    <td>${obj.name}</td>
                    <td>${obj.department}</td>
                    <td>${obj.course}</td>
                    <td>${obj.year}</td>
                    <td>${obj.age}</td>
                    <td>${obj.email}</td>
                    <td>${obj.phone}</td>
                    <td>${obj.address}</td>
                    <td>${obj.cgpa}</td>
                
                `;
        tBody.append(tr);
    });
}

async function deleteData(id) {
    let data = await fetch(`http://localhost:3000/students/${id}`, {
        method: 'DELETE',
    });
    tableBody();
}

async function updateData(id) {
    let data = await fetch(`http://localhost:3000/students/?id=${id}`);
    data = await data.json();
    setFormData(data[0]);
    idField.value = id;
    flag = false;
    changeBtn();
}

function setFormData(data) {
    for (let key in data) {
        let input = document.getElementById(key);
        if (input) {
            input.value = data[key];
        }
        let courseInput = document.getElementById("courseInput");
        if (courseInput && data.course) {
            courseInput.value = data.course;
        }
    }
}

function getFormData() {
    let data = {};
    form.forEach((val) => {
        data[val.name] = val.value;
    })
    return data;
}

tableHead();
tableBody();

async function updateTable(e, methodName) {
    let emptyFields = []
    e.preventDefault();
    let containerArr = {};
    form.forEach(val => {
        if (val.value !== '') {
            containerArr[val.name] = val.value;
        } else {
            emptyFields.push(val.name)
        }
    });

    if (emptyFields.length > 1) {
        alert(`These fields are empty: ${emptyFields.join(", ")}`)
    } else {
        var url;
        if (methodName == 'POST') {
            url = `http://localhost:3000/students`;
            flag = true;
            changeBtn();
        } else {
            url = `http://localhost:3000/students/${containerArr.id}`;
            flag = true;
            changeBtn();
        }
        let data = await fetch(url, {
            method: `${methodName}`,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(containerArr)
        })
    }
}
