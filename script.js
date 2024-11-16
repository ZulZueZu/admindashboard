
/* SIDEBAR */

const menuBtn = document.querySelector('#menu-btn');
const closeBtn = document.querySelector('#close-btn');
const sidebar = document.querySelector('aside');

menuBtn.addEventListener('click', () => {
    sidebar.style.display = "block";
})

closeBtn.addEventListener('click', () => {
    sidebar.style.display = "none";
})


/* THEME */

const themeBtn = document.querySelector('.theme-btn');

themeBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');

    themeBtn.querySelector('i:first-child').classList.toggle('active');
    themeBtn.querySelector('i:last-child').classList.toggle('active');
})

/* DROPDOWN */

document.addEventListener('click', function (event) {
    const allDropdownMenus = document.querySelectorAll('.dropdown-menu');
    allDropdownMenus.forEach(menu => menu.style.display = 'none');

    if (event.target.closest('.options')) {
        const dropdownButton = event.target.closest('.options');
        const dropdownMenu = dropdownButton.nextElementSibling;

        if (dropdownMenu && dropdownMenu.classList.contains('dropdown-menu')) {
            dropdownMenu.style.display = 'block';
            event.stopPropagation();
        }
    }
});

/* USERS */

const renderUsers = (users) => {
    const tbody = document.querySelector('table tbody');
    tbody.innerHTML = '';

    users.forEach(user => {
        const tr = document.createElement('tr');
        const trContent = `
            <td>
                <img class="profile-photo" src="./assets/${user.picture}" alt="user profile">
            </td>
            <td>${user.name}</td>
            <td>${user.id}</td>
            <td>${user.email}</td>
            <td>
                <small>Last login</small>
                <p class="${user.lastLogin === 'Online' ? 'success' : 'danger'}">${user.lastLogin}</p>
            </td>
            <td>
                <div class="dropdown">
                    <button class="options primary" type="button" data-coreui-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i class="fas fa-ellipsis-v primary details"></i>
                    </button>
                    <div class="dropdown-menu dropdown-menu-end">
                        <a class="dropdown-item" href="#" data-coreui-i18n="view-profile">View Profile</a>
                        <a class="dropdown-item" href="#" data-coreui-i18n="send-message">Send Message</a>
                        <a class="dropdown-item" href="#" data-coreui-i18n="view-activity">View Activity Log</a>
                    </div>
                </div>
            </td>
        `;
        tr.innerHTML = trContent;
        tbody.appendChild(tr);
    });
};


const sortUsers = (direction) => {
    const sortedUsers = [...Users].sort((a, b) => {
        return direction === 'asc'
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
    });
    renderUsers(sortedUsers);
};

renderUsers(Users);

document.querySelector('.alpha-asc').addEventListener('click', () => sortUsers('asc'));
document.querySelector('.alpha-desc').addEventListener('click', () => sortUsers('desc'));



/* PROJECT TIMELINE */

Projects.sort((a, b) => {
    const aDueDateParts = a.dueDate.split(/[\/\s:]/);
    const bDueDateParts = b.dueDate.split(/[\/\s:]/);

    const aDueDate = new Date(
        aDueDateParts[2], // Year
        aDueDateParts[1] - 1, // Month
        aDueDateParts[0], // Day
        aDueDateParts[3] || 0, // Hour
        aDueDateParts[4] || 0 // Minute
    );

    const bDueDate = new Date(
        bDueDateParts[2],
        bDueDateParts[1] - 1,
        bDueDateParts[0],
        bDueDateParts[3] || 0,
        bDueDateParts[4] || 0
    );

    return aDueDate - bDueDate;
});

Projects.forEach(project => {
    const projectDueDiv = document.createElement('div');
    projectDueDiv.classList.add('project-due');

    const currentDate = new Date();
    const dueDateParts = project.dueDate.split(/[\/\s:]/);
    const dueDate = new Date(
        dueDateParts[2],
        dueDateParts[1] - 1,
        dueDateParts[0],
        dueDateParts[3] || 0,
        dueDateParts[4] || 0
    );

    let timeLabel;
    const diffInMs = dueDate - currentDate;
    const diffInMins = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMins / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMins > 0 && diffInHours < 24) {
        timeLabel = diffInMins < 60 ? `${diffInMins} mins` : `${diffInHours} hours`;
    } else if (diffInDays >= 1 && diffInDays <= 30) {
        timeLabel = `${diffInDays} days`;
    } else if (diffInDays > 30) {
        timeLabel = `${dueDateParts[0]}/${dueDateParts[1]}`;
    } else {
        timeLabel = "Overdue";
    }

    const projectDueContent = `
        <div class="project-item">
            <div class="project-date">
                <p class="text-muted">${timeLabel}</p>
            </div>
            <div class="icon">
                <i class="fas fa-circle" style="color: ${project.color};"></i>
                <div class="line"></div>
            </div>
            <div class="right">
                <div class="info">
                    <h3>${project.projectName}</h3>
                </div>
            </div>
        </div>
    `;

    projectDueDiv.innerHTML = projectDueContent;
    document.querySelector('#project-due').appendChild(projectDueDiv);
});


/* LIGHTBOX */

jQuery(document).ready(function () {
    let imageIndex = 1;
    const instructions = [
        "The date input field (dd/mm/yyyy) allows you to review past project progress.",
        "Clicking the vertical dots on project cards opens a dropdown menu with options to view the project details and progress analytics.",
        "The vertical dots on both the project progress and productivity cards display a dropdown menu with options to filter by time: last week, month, or year.",
        "The Users section displays the user's name, ID, email, and activity. You can sort the list alphabetically by clicking the A-Z or Z-A icons.",
        "Clicking the vertical dots in any row reveals additional details for that user.",
        "The project timeline displays due dates for projects, listed from the most recent to the upcoming. You can also add new projects to the timeline.",
        "The recent updates section shows the latest changes made to any projects."
    ];

    $('body').append(`
        <div class="backdrop"></div>
        <div class="box">
            <div class="close">
                <i class="fas fa-times"></i>
            </div>
            <div class="arrows">
                <button class="prev"><i class="fas fa-chevron-left"></i></button>
                <button class="next"><i class="fas fa-chevron-right"></i></button>
            </div>
            <img class="instruction-img" src="./assets/instruction-${imageIndex}.png" alt="instruction ${imageIndex}">
            <h3 class="instruction-text">${instructions[imageIndex - 1]}</h3>
        </div>
    `);  

    $('.lightbox-toggle').click(function () {
        $('.backdrop').animate({ 'opacity': '.50' }, 300, 'linear').css('display', 'block');
        $('.box').fadeIn();
    });

    $('.close, .backdrop').click(function () {
        $('.backdrop').animate({ 'opacity': '0' }, 300, 'linear', function () {
            $('.backdrop').css('display', 'none');
        });
        $('.box').fadeOut();
    });

    const updateImage = () => {
        $('.instruction-img').attr('src', `./assets/instruction-${imageIndex}.png`);
        $('.instruction-text').text(instructions[imageIndex - 1]);
    };    

    $('.next').click(function () {
        if (imageIndex < 7) {
            imageIndex++;
        } else {
            imageIndex = 1;
        }
        updateImage();
    });

    $('.prev').click(function () {
        if (imageIndex > 1) {
            imageIndex--;
        } else {
            imageIndex = 7;
        }
        updateImage();
    });
});



/* Progress Chart */

var progress = document.getElementById("progressChart").getContext('2d');
var progressChart = new Chart(progress, {
		type: 'doughnut',
		tooltipFillColor: "rgba(51, 51, 51, 0.55)",
		data: {
		labels: [
			"Completed",
			"Testing",
			"Under Development",
			"Not Started"
		],
		datasets: [{
		data: [195, 114, 209, 101],
		backgroundColor: [
			"rgb(34, 202, 75)",
			"rgb(160, 99, 245)",
			"rgb(234, 181, 7)",
			"rgb(255, 67, 54)"
		],
		hoverBackgroundColor: [
			"rgb(34, 202, 75, 0.8)",
			"rgb(160, 99, 245, 0.8)",
			"rgba(255, 204, 38, 0.8)",
			"rgb(255, 67, 54, 0.8)"
		]
		}]
	},
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            }
        }
    }
});


/* BAR CHART */

var ctx = document.getElementById("tasksBarChart").getContext('2d');
var barChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
        datasets: [{
            label: 'Completed',
            backgroundColor: "rgb(34, 202, 75)",
            hoverBackgroundColor: "rgb(34, 202, 75, 0.8)",
            borderColor: "#fff",
            borderWidth: 2,
            data: [15, 42, 28, 34, 61],
        }, {
            label: 'Testing',
            backgroundColor: "rgb(160, 99, 245)",
            hoverBackgroundColor: "rgb(160, 99, 245, 0.8)",
            borderColor: "#fff",
            borderWidth: 2,
            data: [9, 22, 38, 15, 30],
        }, {
            label: 'Under Development',
            backgroundColor: "rgb(234, 181, 7)",
            hoverBackgroundColor: "rgba(255, 204, 38, 0.8)",
            borderColor: "white",
            borderWidth: 2,
            data: [32, 58, 45, 23, 51],
            borderRadius: Number.MAX_VALUE,
        }]
    },
    options: {
        tooltips: {
            displayColors: true,
            callbacks: {
                mode: 'x',
            },
        },
        scales: {
            x: {
                stacked: true,
                ticks: {
                    display: false,
                },
                grid: {
                    display: false,
                }
            },
            y: {
                stacked: true,
                ticks: {
                    display: false,
                },
                grid: {
                    display: false,
                },
                type: 'linear',
            }
        },
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            }
        }
    }
});