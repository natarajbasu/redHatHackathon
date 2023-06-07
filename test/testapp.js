//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let App = require('../app');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

chai.use(chaiHttp);

describe('/GET', () => {
    it('it should GET the user details', (done) => {
    chai.request(App)
        .get('/')
        .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
            done();
        });
    });
});

describe('/GET loginPage', () => {
    it('it should GET the login page', (done) => {
    chai.request(App)
        .get('/loginPage')
        .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
            done();
        });
    });
});

describe('/GET register', () => {
    it('it should GET the user registration page', (done) => {
    chai.request(App)
        .get('/register')
        .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
            done();
        });
    });
});

describe('/POST searchUserDetails', () => {
    it('it should GET the user details', (done) => {
    chai.request(App)
        .post('/searchUserDetails')
        .send({"userName":"nbasuibm"})
        .end((err, res) => {
            // console.log(res.body);
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('status');
                res.body.should.have.status('success');
                res.body.should.have.property('question');
                res.body.should.have.property('answer');
                res.body.should.have.property('id');
            done();
        });
    });
});

describe('/POST loginUser', () => {
    it('it should GET the user details', (done) => {
    var userName = "nbasuibm"
    var password = "ibm123";
    chai.request(App)
        .post('/loginUser')
        .send({
                "userName":userName, 
                "password":password
            })
        .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.status('success');
                res.body.should.have.property('status');
            done();
        });
    });
});