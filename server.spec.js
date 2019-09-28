const server = require('./server.js');
const request = require('supertest')

describe('the server', ()=>{
    describe('GET /', ()=>{
        xit('should run the testing env', () =>{
            expect(process.env.DB_ENV).toBe('testing');
        });

        it('should return status 200', () =>{
            return request(server)
            .get('/')
            .then(res =>{
                expect(res.status).toBe(200)
            });
    });
        it('should return the correct object', () =>{
            return request(server)
            .get('/')
            .then(res =>{
                expect(res.type).toBe('application/json')
                expect(res.body).toEqual({ api: 'up'})
        })
    })
    })
})