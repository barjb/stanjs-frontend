import { DataService } from './DataService.js';
import './style.css';
import state from './assets/state.png';
import github from './assets/GitHub.png';

const ds = new DataService();

const host = 'https://stan-js.herokuapp.com/';

const url2 = host + '/api/state/stats';
const formsUrl = host + '/api/state/form';

ds.getState(url2).then((e) => createStats(e));

document.getElementById('gitHubIMG').src = github;
document.getElementById('stateOfJSIMG').src = state;

const modal = document.getElementById('survey');
const btn = document.getElementById('surveyBtn');
const span = document.getElementsByClassName('close')[0];
const postbtn = document.getElementById('send-form');
const info = document.getElementById('info-form');

btn.onclick = function () {
    modal.style.display = 'block';
    info.innerHTML = '';
    postbtn.disabled = false;
    ds.getState(formsUrl).then((e) => createForm(e));
};

postbtn.onclick = function () {
    const os = document.getElementById('os-form').value;
    const browser = document.getElementById('browser-form').value;
    const device = document.getElementById('device-form').value;
    const jobTitle = document.getElementById('jobTitle-form').value;
    const experience = document.getElementById('experience-form').value;
    const salary = document.getElementById('salary-form').value;
    const frontend = document.getElementById('frontend-form').value;
    const backend = document.getElementById('backend-form').value;
    const res = {
        year: 2021,
        user_info: {
            device: 'Legion',
            job_title: jobTitle,
            yearly_salary: salary,
            years_of_experience: experience,
            css_proficiency: frontend,
            backend_proficiency: backend,
        },
        browser: browser,
        os: os,
    };
    const hasEmpty = [os, browser, device, jobTitle, experience, salary, frontend, backend].some((e) => e === '');
    if (!hasEmpty) {
        ds.postState(formsUrl, res)
            .then((e) => {
                info.style.color = 'Green';
                info.innerHTML = 'Pomyślnie wysłano ankietę';
                postbtn.disabled = true;
            })
            .catch((err) => {
                info.style.color = 'red';
                info.innerHTML = 'Wystąpił błąd podczas wysyłania';
                console.error(err);
            });
    } else {
        info.style.color = 'red';
        info.innerHTML = 'Formularz ma puste pola';
    }
};

span.onclick = function () {
    modal.style.display = 'none';
};

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
};

function createForm(response) {
    const obj = JSON.parse(response);
    const data = obj.data;
    const form = document.getElementById('form');

    const os = document.getElementById('os-form');
    const browser = document.getElementById('browser-form');
    const device = document.getElementById('device-form');
    const jobTitle = document.getElementById('jobTitle-form');
    const experience = document.getElementById('experience-form');
    const salary = document.getElementById('salary-form');
    const frontend = document.getElementById('frontend-form');
    const backend = document.getElementById('backend-form');

    if (os.children.length === 0) {
        createSelect(data.os, os);
        createSelect(data.browser, browser);
        createSelect(data.device, device);
        createSelect(data.jobTitle, jobTitle);
        createSelect(data.experience, experience);
        createSelect(data.salary, salary);
        createSelect(data.frontend, frontend);
        createSelect(data.backend, backend);
    }
}

function createSelect(array, node) {
    const blank = document.createElement('option');
    blank.innerHTML = '';
    node.appendChild(blank);
    array.forEach((e) => {
        const option = document.createElement('option');
        option.innerHTML = e;
        if (e !== null && e !== '') node.appendChild(option);
    });
}

function createStats(statistics) {
    const stats = JSON.parse(statistics);
    const data = stats.data;
    document.getElementById('documentsCount').innerHTML += data.documents + ' dokumentów.';

    const reportContainer = document.getElementById('reports');

    const browserContainer = document.createElement('div');
    browserContainer.id = 'browserContainer';
    browserContainer.className = 'reportContainer';

    const osContainer = document.createElement('div');
    osContainer.id = 'osContainer';
    osContainer.className = 'reportContainer';

    const deviceContainer = document.createElement('div');
    deviceContainer.id = 'deviceContainer';
    deviceContainer.className = 'reportContainer';

    const jobTitleContainer = document.createElement('div');
    jobTitleContainer.id = 'jobTitleContainer';
    jobTitleContainer.className = 'reportContainer';

    const experienceContainer = document.createElement('div');
    experienceContainer.id = 'experienceContainer';
    experienceContainer.className = 'reportContainer';

    const salaryContainer = document.createElement('div');
    salaryContainer.id = 'salaryContainer';
    salaryContainer.className = 'reportContainer';

    const backendContainer = document.createElement('div');
    backendContainer.id = 'backendContainer';
    backendContainer.className = 'reportContainer';

    const frontendContainer = document.createElement('div');
    frontendContainer.id = 'frontendContainer';
    frontendContainer.className = 'reportContainer';

    createSurveyElement(data.browser, browserContainer, [
        { type: 'h1', text: 'Przeglądarka' },
        { type: 'h3', text: 'Przeglądarka używana w procesie tworzenia stron' },
    ]);
    createSurveyElement(data.os, osContainer, [
        { type: 'h1', text: 'System operacyjny' },
        { type: 'h3', text: 'System operacyjny z którego korzysta ankietowany' },
    ]);
    createSurveyElement(data.device, deviceContainer, [
        { type: 'h1', text: 'Urządzenie' },
        { type: 'h3', text: 'Urządzenie z którego wypełniono ankietę' },
    ]);
    createSurveyElement(data.jobTitle, jobTitleContainer, [
        { type: 'h1', text: 'Stanowisko' },
        { type: 'h3', text: 'Nazwa stanowiska w pracy' },
    ]);
    createSurveyElement(data.experience, experienceContainer, [
        { type: 'h1', text: 'Doświadczenie' },
        { type: 'h3', text: 'Doświadczenie zawodowe w latach' },
    ]);
    createSurveyElement(data.salary, salaryContainer, [
        { type: 'h1', text: 'Zarobki' },
        { type: 'h3', text: 'Zarobki wyrażone w tys $ rocznie' },
    ]);
    createSurveyElement(data.backend, backendContainer, [
        { type: 'h1', text: 'Znajomość backendu' },
        { type: 'h3', text: '0 - brak, 5 - expert' },
    ]);
    createSurveyElement(data.frontend, frontendContainer, [
        { type: 'h1', text: 'Znajomość frontendu' },
        { type: 'h3', text: '0 - brak, 5 - expert' },
    ]);

    reportContainer.appendChild(browserContainer);
    reportContainer.appendChild(osContainer);
    reportContainer.appendChild(deviceContainer);
    reportContainer.appendChild(jobTitleContainer);
    reportContainer.appendChild(experienceContainer);
    reportContainer.appendChild(salaryContainer);
    reportContainer.appendChild(backendContainer);
    reportContainer.appendChild(frontendContainer);
}

function createSurveyElement(array, outContainer, desc) {
    const list = document.createElement('ul');
    desc.forEach((elem) => {
        const node = document.createElement(elem.type);
        node.innerHTML = elem.text;
        outContainer.appendChild(node);
    });
    array.forEach((elem) => {
        const container = document.createElement('li');
        const name = document.createElement('span');
        const count = document.createElement('span');
        name.innerHTML = elem._id === null || elem._id === '' ? 'Nie podano' : elem._id;
        container.appendChild(name);
        count.innerHTML += elem.count;
        container.appendChild(count);
        list.appendChild(container);
    });
    outContainer.appendChild(list);
}
