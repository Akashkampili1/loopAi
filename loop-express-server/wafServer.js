const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;
const mongoose=require('mongoose')
const dbConnect = require("./config/dbConnect");
const dotenv = require("dotenv");
const Log= require("./models/waf.log")
const LogMessage=require("./models/log.message")
dotenv.config();

dbConnect();
app.use(cors()); // Enable CORS for all origins
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.get("/", (req, res) => {    
    res.send("hi i am working ")
});


app.get('/api/data', (req, res) => {
    const data = {
      message: 'Hello from the API!',
      timestamp: new Date()
    };
  
    res.json(data);
});

app.post('/api/logData', async (req, res) => {
    try {
        // Save received log data to MongoDB
        const logdata = new Log(req.body);
        console.log(logdata)
        await logdata.save();
        console.log('Log data saved successfully');
        res.send('Log data received and saved successfully');
    } catch (error) {
        console.error('Error saving log data:', error);
        res.status(500).send('Internal server error');
    }
});

app.get('/api/safe-visits', async (req, res) => {
    try {
        // Fetch logs
        const logs = await LogMessage.find().sort({ timestamp: -1 });

        // Filter logs with prediction containing "good"
        const goodLogs = logs.filter(log => /\bgood\b/.test(log.prediction));

        // Count the number of "good" logs
        const goodLogsCount = goodLogs.length;

        // Send the count as JSON response
        res.json({ count: goodLogsCount });
    } catch (error) {
        console.error('Error fetching logs:', error);
        res.status(500).send('Internal server error');
    }
});



// Endpoint to retrieve the last 5 logs regardless of query
app.get('/api/last-5-logs', async (req, res) => {
    try {
        const logs = await Log.find().sort({ timestamp: -1 }).limit(5);
        res.json(logs);
    } catch (error) {
        console.error('Error fetching last 5 logs:', error);
        res.status(500).send('Internal server error');
    }
});

app.get('/api/blocked-logs', async (req, res) => {
    try {
        const logs = await Log.find().sort({ timestamp: -1 });
        res.json(logs);
    } catch (error) {
        console.error('Error fetching logs:', error);
        res.status(500).send('Internal server error');
    }
});

app.get('/api/monitor-logs', async (req, res) => {
    try {
        const logs = await LogMessage.find().sort({ timestamp: -1 });
        res.json(logs);
    } catch (error) {
        console.error('Error fetching logs:', error);
        res.status(500).send('Internal server error');
    }
});

app.get('/api/total-unique-ips', async (req, res) => {
    try {
        // Query MongoDB to get the array of unique IP addresses
        const uniqueIPs = await LogMessage.distinct('ip');
        
        // Get the length of the array, which represents the count of unique IPs
        const totalUniqueIPs = uniqueIPs.length;
        
        res.json({ totalUniqueIPs });
    } catch (error) {
        console.error('Error fetching total unique IP addresses:', error);
        res.status(500).send('Internal server error');
    }
});




app.get('/api/documents-per-country', async (req, res) => {
    try {
        // Aggregate the documents by country and count the number of documents per country
        const documentsPerCountry = await Log.aggregate([
            {
                $group: {
                    _id: "$country",
                    count: { $sum: 1 }
                }
            }
        ]);

        res.json(documentsPerCountry);
    } catch (error) {
        console.error('Error fetching documents per country:', error);
        res.status(500).send('Internal server error');
    }
});

app.post('/api/insert-log', async (req, res) => {
    try {
        // Create a new log entry based on the request body
        const newLogEntry = new Log(req.body);

        // Save the new log entry to the database
        await newLogEntry.save();

        res.send('Log data inserted successfully');
    } catch (error) {
        console.error('Error inserting log data:', error);
        res.status(500).send('Internal server error');
    }
});

app.post('/api/logMessage', async (req, res) => {
    try {
        // Save received log data to MongoDB
        const Log_Message = new LogMessage(req.body);
        console.log(Log_Message)
        await Log_Message.save();
        console.log('Log data saved successfully');
        res.send('Log data received and saved successfully');
    } catch (error) {
        console.error('Error saving log data:', error);
        res.status(500).send('Internal server error');
    }
});

app.get('/api/total-requests', async (req, res) => {
    try {
        // Query MongoDB to get the total count of log messages
        const totalCount = await LogMessage.countDocuments();
        res.json({ totalCount });
    } catch (error) {
        console.error('Error fetching total log messages:', error);
        res.status(500).send('Internal server error');
    }
});


app.get('/api/total-blocked-requests', async (req, res) => {
    try {
        // Query MongoDB to get the total count of log messages
        const totalCount = await Log.countDocuments();
        res.json({ totalCount });
    } catch (error) {
        console.error('Error fetching total log messages:', error);
        res.status(500).send('Internal server error');
    }
});



app.post('/api/send-message', (req, res) => {
    const { message } = req.body;
    console.log("Received message:", message);
    
    res.json({ receivedMessage: message, timestamp: new Date() });
});

app.listen(PORT, () => console.log("Server running on port " + PORT));
