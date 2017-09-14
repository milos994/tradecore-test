const app = require('../app');

const supertest = require('supertest');
const chai = require('chai');
const expect = chai.expect;
const should = chai.should;

const api = supertest('http://localhost:3000');

let login = null;
let users = null;
describe('Tests', () => {

	// Login user to the system and fetch access token
	context('Sign in', () => {
		it('Login user', (done) => {
			api.post('/sign-in')
				.send({
					password: 'password',
					email: 'email',
				})
				.then((res) => {
					login = res.body.access_token;
					done();
				}).
				catch(done);
		});
	});

	// Get a list of all users
	context('Users', () => {		
		it('Get users list', (done) => {
			api.get('/users')
				.set('authorization', login)
				.then((res) => {
					// we expect that there is 6 users. You can check/confirm that in app code.
					expect(res.body.length).to.be.equal(6);
					done();
				}).
			catch(done);
		});
	});

});