var chai = require("chai");
var chaiHttp = require('chai-http');
var server = require('../app');
var assert = chai.assert;
var should = chai.should();

chai.use(chaiHttp);

describe('Calculation result Rest APIs', function() {
	it('should list ALL calculations on /result GET if there is any', function(done) {
		chai.request(server)
		.get('/result')
		.end(function(err, res){
			res.should.have.status(200);
			res.should.be.json;
			resType = Object.prototype.toString.call(res.body);
			if(resType === "[object Array]") {
				assert.typeOf(res.body, "array");
				if(res.body.length > 0) {
					res.body[0].should.have.property("expression");
					res.body[0].should.have.property("result");
					res.body[0].should.have.property("date");
				}
				else {
					res.body.should.have.length.be(0);
				}	
			}	
			else {
				res.body.should.have.property("success", false);
			}
			done();
		});
	});

	it('should add a calculation on /result POST', function(done) {
		chai.request(server)
		.post('/result')
		.send({"expression": "9*6*(8-3)", "result": 270,"date": "2015-11-21T11:49:51.997Z"})
		.end(function(err, res){
			res.should.have.status(200);
			res.should.be.json;
			res.body.should.be.a("object");
			res.body.should.have.property("success", true);
			done();
		});
	});

	it('should update a SINGLE blob on /blob/<id> PUT', function(done) {
		chai.request(server)
		.delete('/result')
		.end(function(err, res){
			res.should.have.status(200);
			res.should.be.json;
			res.body.should.be.a("object");
			res.body.should.have.property("success", true);
			done();
		});
	});

});