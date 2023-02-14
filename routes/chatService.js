const { NlpManager } = require('node-nlp');
const manager = new NlpManager({ languages: ['en'] });
const Courses = require('../models/course')
const Categories = require('../models/category');
const category = require('../models/category');
// 1 - Train the IA
async function trainChatBotIA() {
    return new Promise(async (resolve, reject) => {
        // Adds the utterances and intents for the NLP
        // // Train also the NLG
        // Adds the utterances and intents for the NLP
        manager.addDocument('en', 'goodbye for now', 'greetings.bye');
        manager.addDocument('en', 'bye bye take care', 'greetings.bye');
        manager.addDocument('en', 'okay see you later', 'greetings.bye');
        manager.addDocument('en', 'bye for now', 'greetings.bye');
        manager.addDocument('en', 'i must go', 'greetings.bye');
        manager.addDocument('en', 'hello', 'greetings.hello');
        manager.addDocument('en', 'hi', 'greetings.hello');
        manager.addDocument('en', 'howdy', 'greetings.hello');
        manager.addDocument('en', 'yes', 'ask.category');
        manager.addDocument('en', 'show me', 'show.category');
        manager.addDocument('en', 'another', 'show.course');
        manager.addDocument('en', 'exit', 'greetings.bye');
        // manager.addDocument('en', 'one more', 'greetings.bye');
// Train also the NLG
        manager.addAnswer('en', 'greetings.bye', 'Till next time');
        manager.addAnswer('en', 'greetings.bye', 'see you soon!');
        manager.addAnswer('en', 'greetings.hello', 'Hey there!');
        manager.addAnswer('en', 'greetings.hello', 'Greetings!');
        manager.addAnswer('en', 'ask.category', 'From Which Category Would You Like Me To Suggest? Write The Name Of The Category');
        const categories = await Categories.find()
        for(let cat = 0; cat <categories.length; cat++){
            manager.addDocument('en', categories[cat].name,  "show." + categories[cat].name);
        }
        const courses = await Courses.find().populate("category");
        for(let i = 0; i <courses.length; i++){
            let durationText = (courses[i].duration)?" For Your Knowledge People Who Participate In This Course Finish It Around " + courses[i].duration:"";
            manager.addAnswer('en', 'show.' + courses[i].category.name,  "How About " + courses[i].name + 
                              "? The Price is: " + courses[i].price + "₪ And Its About " + courses[i].description +
                              durationText);
            
        }
        
        // manager.addAnswer('en', 'show.category', 'Which ');
await manager.train();
        manager.save();
        console.log("AI has been trainded")
        resolve(true);
    })
}
async function generateResponseAI(qsm) {
    // Train and save the mode
    return new Promise(async (resolve, reject) => {
        response = await manager.process('en', qsm);
        resolve(response);
    })
}
numberOfConnected = 0;
const connectWebSocket = (io) => {

    io.on('connection', function (socket) {
        numberOfConnected++;
        io.emit('connectedUsersCount', numberOfConnected);
        // io.emit('connectedUsersCount', connectedUsersCount);
        socket.on('join', (userId) => {
            socket.join(userId);

            
        });

        socket.on('disconnect', function () {
            numberOfConnected--
            io.emit('connectedUsersCount', numberOfConnected);
            
        });
        socket.on('new-msg', async function (data) {
            console.log(data)
            let response = await generateResponseAI(data.msg);
            io.to(data.room).emit('send-msg-response', response.answer !== undefined
                ? response.answer : "I am sorry, I don't understand :( ");
        })
});
}
module.exports = {
    connectWebSocket,
    trainChatBotIA
}