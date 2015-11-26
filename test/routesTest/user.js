/**
 * Created by Taras on 25.11.2015.
 */

var request = require('supertest');
var url = 'http://localhost:8089';

describe('USER CRUD', function () {


    this.timeout(2000);



    it('/user/ GET ', function (done) {

        agent
            .get('/user/')
            .expect(200)
            .end(function (err, res) {
                console.dir(res.body);
                if (err) {
                    return done(err);
                }
                done();
            });
    });

    it('/user/:id POST', function (done) {
        agent
            .post('/user/')
            .expect(200)
            .end(function (err, res) {
                console.dir(res.body);
                if (err) {
                    return done(err);
                }
                done();
            });
    });
});