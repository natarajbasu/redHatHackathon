//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

let App = require('../app');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

chai.use(chaiHttp);

describe('/GET', () => {
    it('it should GET the main page', (done) => {
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

describe('/GET forgetPassword', () => {
    it('it should GET the login page', (done) => {
    chai.request(App)
        .get('/forgetPassword')
        .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
            done();
        });
    });
});

describe('/POST getSessionMessage', () => {
    it('it should Return the session message', (done) => {
    chai.request(App)
        .post('/getSessionMessage')
        .send({"sessionKey":"firstPageInfo"})
        .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
            done();
        });
    });
});

describe('/POST searchUserDetails', () => {
    it('it should Return the user details', (done) => {
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
    it('it should Rreturn the login status', (done) => {
    var userName = "nbasuibm"
    var password = "abc123";
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

// describe('/POST passwordChange', () => {
//     it('it should Return the POST status', (done) => {
//     chai.request(App)
//         .post('/passwordChange')
//         .send({
//             "newPassword":"abc123",
//             "id":"nbasuibm"})
//         .end((err, res) => {
//                 res.should.have.status(200);
//                 // res.body.should.be.a('object');
//             done();
//         });
//     });
// });

describe('/POST getUserInterestList', () => {
    it('it should Return the a list of users interest', (done) => {
    chai.request(App)
        .post('/getUserInterestList')
        .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
            done();
        });
    });
});

describe('/POST avaiableUserId', () => {
    it('it should Return a list of avaiable User Ids', (done) => {
    chai.request(App)
        .post('/avaiableUserId')
        .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
            done();
        });
    });
});

describe('/POST registerUser', () => {
    it('it should Return the user registration status', (done) => {
    chai.request(App)
        .post('/registerUser')
        .send({
            "firstName": "fName",
            "lastName": "lName",
            "userName": "uName",
            "password": "pass123",
            "secretQues": "secQ",
            "sectAnswer": "secA",
            "userGender": "M",
            "dateOfBirth": "01/01/1991",
            "avaiableUserId": "avUId"
        })
        .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
            done();
        });
    });
});

describe('/POST registerInterests', () => {
    it('it should Return the registerInterests status', (done) => {
    chai.request(App)
        .post('/registerInterests')
        .send({
            "avaiableUserId":"firstPageInfo",
            "selectedInterest":"firstPageInfo"
            })
        .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
            done();
        });
    });
});

describe('/POST populateLoginData', () => {
    it('it should Return the populate Login Data status', (done) => {
    chai.request(App)
        .post('/populateLoginData')
        .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
            done();
        });
    });
});

describe('/POST getRecomondation', () => {
    it('it should Return the recommendations', (done) => {
    chai.request(App)
        .post('/getRecomondation')
        .send({"recomondationList":"firstPageInfo"})
        .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
            done();
        });
    });
});

describe('/POST logoutUser', () => {
    it('it should Return the logout status', (done) => {
    chai.request(App)
        .post('/logoutUser')
        .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
            done();
        });
    });
});

describe('/POST openGraph', () => {
    it('it should Return the openGraph status', (done) => {
    chai.request(App)
        .post('/openGraph')
        .send({
            "graphInput": "firstPageInfo",
            "graphType": "fullGraph" 
        })
        .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
            done();
        });
    });
});

describe('/POST updateUserInterest', () => {
    it('it should Return the updateUserInterest status', (done) => {
    chai.request(App)
        .post('/updateUserInterest')
        .send({"loggedInUserId":"nbasuibm"})
        .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
            done();
        });
    });
});

describe('/POST updateUserTravel', () => {
    it('it should Return the updateUserTravel status', (done) => {
    chai.request(App)
        .post('/updateUserTravel')
        .send({
            "loggedInUserId": "nbasuibm",
            "locationId": "10"
        })
        .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
            done();
        });
    });
});

