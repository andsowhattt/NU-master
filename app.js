'use strict';

// Workshop: GitHub search (Github API)

// Github
// UI

const GITHUB_API = 'https://api.github.com/';
const searchUser = document.querySelector('.searchUser');
const SEARCH_DELAY = 500;
let searchTimerId;



class Github {
	constructor() {
		this.clientId = 'c496136ed76526e524de';
		this.clientSecret = '8139d3abf0b48733d0bfd9e9d6c392926056dff8';
		this.reposCount = 5; // кількість останніх репозиторіїв, які ми хочемо відобразити
		this.reposSort = 'created: asc'; // спосіб сортування репозиторіїв
	}


	async getUser(userName) {
		const response = await fetch(`${GITHUB_API}users/${userName}?client_id=${this.clientId}&client_secret=${this.clientSecret}`);
		if (response.status === 404) {
			ui.showAlert('User not found', 'alert alert-danger');
		} else {
			const user = await response.json();
			const reposResponse = await fetch(`${GITHUB_API}users/${userName}/repos?per_page=${this.reposCount}&sort=${this.reposSort}&client_id=${this.clientId}&client_secret=${this.clientSecret}`);
			if (reposResponse.status === 404) {
				ui.showAlert('User not found', 'alert alert-danger');
			} else {
				const repos = await reposResponse.json();
				return { user, repos }; // повертаємо об'єкт з користувачем та його репозиторіями
			}
		}
	}

}

class UI {
	constructor() {
		this.profile = document.querySelector('.profile');
	}

	showProfile({ user, repos }) {
		this.profile.innerHTML = `
				<div class="card card-body mb-3">
					<div class="row">
						<div class="col-md-3">
								<img class="img-fluid mb-2" src="${user.avatar_url}">
								<a href="${user.html_url}" target="_blank" class="btn btn-primary btn-block mb-4">View Profile</a>
						</div>
						<div class="col-md-9">
								<span class="badge badge-primary">Public Repos: ${user.public_repos}</span>
								<span class="badge badge-secondary">Public Gists: ${user.public_gists}</span>
								<span class="badge badge-success">Followers: ${user.followers}</span>
								<span class="badge badge-info">Following: ${user.following}</span>
								<br><br>
								<ul class="list-group">
									<li class="list-group-item">Company: ${user.company}</li>
									<li class="list-group-item">Website/Blog: <a href="${user.blog}" target="_blank">${user.blog}</a></li>
									<li class="list-group-item">Location: ${user.location}</li>
									<li class="list-group-item">Member Since: ${user.created_at}</li>
								</ul>
						</div>
					</div>
				</div>
				<div class="card mt-3">
					<div class="card-header">
						Latest Repositories
					</div>
					<ul class="list-group list-group-flush">
					${Array.isArray(repos) && repos.length > 0 ? repos.map(repo => `
        <li class="list-group-item">
            <a href="${repo.html_url}" target="_blank">${repo.name}</a>
        </li>
    `).join('') : ''}
</ul>

				</div>
		`;
	}


	showAlert(message, className) {
		this.clearAlert();

		const div = document.createElement('div');
		div.className = className;
		div.innerHTML = message;

		const search = document.querySelector('.search');
		search.before(div);

		setTimeout(() => {
			this.clearAlert()
		}, 3000)
	}

	clearAlert() {
		const alert = document.querySelector('.alert');
		if (alert) {
			alert.remove();
		}
	}

	clearProfile() {
		this.profile.innerHTML = '';
	}
}

const github = new Github();
const ui = new UI();

searchUser.addEventListener('input', () => {
	clearTimeout(searchTimerId);

	searchTimerId = setTimeout(async () => {
		const userName = searchUser.value.trim();
		if (userName) {
			try {
				const data = await github.getUser(userName);
				ui.showProfile(data);
			} catch (error) {
				ui.showAlert('User not found', 'alert alert-danger');
			}
		} else {
			ui.clearProfile();
		}
	}, SEARCH_DELAY);
});
