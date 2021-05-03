
const mqtt = require('mqtt');

// 연결 정보 및 연결
const HOST = '172.30.1.122';
const PORT = 1883;
const USERNAME = 'hycnc';
const PASSWORD = '159739';

const options = {
    host: HOST,
    port: PORT,
    username: USERNAME,
    password: PASSWORD,
}
const client = mqtt.connect(options);

// 연결시 이벤트
client.on("connect", () => {
    console.log(`Connected info => ${HOST}:${PORT} with ${USERNAME}, ${PASSWORD}`);
    console.log(`Connected`+client.connected);
});

// 연결 종료
// client.end();

// 연결 실패시 이벤트
client.on("error", (error) => {
    console.log("Connect Fail : "+error);
})

// 메시지 pub
let eventsData = 10;
setInterval(() => {
    client.publish('events', `${eventsData}`);
    eventsData=Math.floor(Math.random()*100%30+20);
},1500);

let logData = 0;
setInterval(() => {
    client.publish('logs', `${logData}`);
    logData=Math.floor(Math.random()*1000%500+300);
}, 1000);

// 메시지 sub

// topic 설정
const singleTopic = "test";                 // 하나의 topic
client.subscribe(singleTopic, {qos: 1});    // 하나의 topic 구독

const listTopic = ["topic1", "topic2", "topic3"];   // 여러 토픽, 단일 qos
client.subscribe(listTopic, {qos: 1});              // 여러 토픽, 단일 qos

const eachTopics = {"events": 2, "logs":1};     // 여러 토픽, 여러 qos
client.subscribe(eachTopics)                    // 여러 토픽, 여러 qos

// 메시지 받기
client.on('message', (topic, message, packet) => {
    console.log('message is '+message);
    console.log('topic is '+topic);
    console.log('packet is'+packet);
})