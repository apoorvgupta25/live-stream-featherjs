const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const socketio= require('@feathersjs/socketio');
const moment = require('moment');

//Ideas Service
class IdeaService{
    constructor(){
        this.ideas = [];
    }

    //find ideas
    async find(){
        return this.ideas
    }

    //create idea
    async create(data){
        const idea = {
            id: this.ideas.length,
            text: data.text,
            tech: data.tech,
            viewer: data.viewer
        }

        idea.time = moment().format('h:mm:ss a');

        this.ideas.push(idea);

        return idea;
    }
}

const app =  express(feathers());


//parse JSON - body parser
app.use(express.json());

//configure socketio
app.configure(socketio());

//enable REST services
app.configure(express.rest());

//register services
app.use('/ideas', new IdeaService());

//connection to channel
app.on('connection', conn => app.channel('stream').join(conn));

//publish events to stream
app.publish(data => app.channel('stream'));

const PORT = process.env.PORT || 3030;
app.listen(PORT).on('listening', () => console.log(`Real time server running on port ${PORT}`));


//creating idea
// app.service('ideas').create({
//     text: 'Feathersj is wokring',
//     tech: 'feathersjs',
//     viewer: 'Brad',
//     time: moment().format('h:mm:ss a')
// });
