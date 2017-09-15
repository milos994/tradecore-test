const app = require('../app');

const supertest = require('supertest');
const chai = require('chai');
const expect = chai.expect;
const should = chai.should;

const api = supertest('http://localhost:3000');

let login = null;
let users = null;
describe('Tests', () => {

	context('Hello World', () => {

		it('Returns Hello World', (done) => {
			api.get('/')
			.expect('Hello World!', done);
		});

	})

	// Login user to the system and fetch access token
	context('Sign in', () => {

		it('Returns an access token', (done) => {
			api.post('/sign-in')
				.send({
					password: 'password',
					email: 'email',
				})
				.then((res) => {
					accessToken = res.body.access_token;
					expect(accessToken).to.be.ok;
					expect(accessToken.length).to.be.equal(36);
					expect(/^\d{8}-(\d{4}-){3}\d{12}$/.test(accessToken)).to.be.ok;
					done();
				})
				.catch(done);
		});

		it('Throws an error when no email is supplied', (done) => {
			api.post('/sign-in')
				.send({
					password: 'password'
				})
				.then((res) => {
					expect(res.body.access_token).not.be.ok;

					done();
				})
				.catch(done);
		});

	});

	// Get a list of all users
	context('Users', () => {

		it('Get users list', (done) => {
			api.get('/users')
				.set('authorization', accessToken)
				.then((res) => {
					// we expect that there is 6 users. You can check/confirm that in app code.
					let users = res.body;
					expect(users.length).to.be.equal(6);
					
					const properties = [
						'user_id',
						'name',
						'title',
						'active'
					];

					users.forEach(user => {
						expect(properties.every(prop => user.hasOwnProperty(prop))).to.be.true;	
					});

					done();
				})
				.catch(done);
		});

		it('Get user by user_id', (done) => {
			api.get('/users/1')
				.set('authorization', accessToken)
				.set('Accept', 'aplication/json')
				.then((res) => {

					let user = res.body;

					// check name property
					expect(user).to.have.property("name");
					expect(user.name).to.not.equal(null);
	
					// check title property
					expect(user).to.have.property("title");
					expect(user.title).to.not.equal(null);
					
					// check active property
					expect(user).to.have.property("active");
					expect(user.active).to.not.equal(null);
					
					// TODO: Check if user has all properties.
	
					done();
	
				});
		});

	});

	context("User account", () => {

		it('Get user account', (done) => {
			api.get('/users/1/accounts')
				.set('authorization', accessToken)
				.set('Accept', 'aplication/json')
				.then((res) => {

					let userAccount = res.body;

					expect(userAccount).to.have.property("account_id");

	
					done();
	
				});
		});

	});

});