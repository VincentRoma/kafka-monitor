const express = require('express')
var Kafka = require('node-rdkafka');
const app = express()

app.use('/', express.static('.'));

app.get('/api', function (req, res) {
    res.send('Hello World!')
});

var consumer = new Kafka.KafkaConsumer({
    'group.id': 'kafka',
    'metadata.broker.list': 'localhost:9092',
}, {});

consumer.connect();

consumer
    .on('ready', function () {
        consumer.subscribe(['plant-json-channel']);

        // Consume from the librdtesting-01 topic. This is what determines
        // the mode we are running in. By not specifying a callback (or specifying
        // only a callback) we get messages as soon as they are available.
        consumer.consume();
    })
    .on('data', function (data) {
        // Output the actual message contents
        console.log(data.message.toString());
    });


app.listen(33666, function () {
    console.log('Application Running on 0.0.0.0:33666')
});