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