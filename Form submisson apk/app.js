const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');
const path = require('path');

app.use(express.urlencoded({extended:false}));

app.use(express.static(path.join(__dirname,'public')));

app.get('/',(req,res) => {
    res.sendFile(path.join(__dirname,'views','index.html'));
});

// getting my data and processing it:

app.post('/submit', (req,res) => {
    let formData = req.body;
    let jsonData = [];
    let filePath = path.join(__dirname,'data.json');

    if(!fs.existsSync(filePath)){
        fs.writeFileSync(filePath, '[]');
    }

    fs.readFile(filePath, 'utf-8', (err,data) => {
        if(err) {
            console.log(err.message);
        }

        // read database data.json file and add it to jsonData var now making jsonData rep data.json in json format
        jsonData = JSON.parse(data);

        // Check if user's input already exists in database:

        const isDuplicate = jsonData.some(entry => {
            return JSON.stringify(entry) === JSON.stringify(formData);
        });

        if(isDuplicate){
            const page = path.join(__dirname,'views','error.html');
            res.sendFile(page);
        } else {
            jsonData.push(formData);

            fs.writeFile(filePath, JSON.stringify(jsonData,null,2), (err,data) => {
                if(err){
                    res.status(500).send('ERROR SAVING DATA');
                } else {
                    res.send('Data saved in Database successfully'+ '<a href="/">back</a>');
                }    
            });
        }
    }); 
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server now running at port: ${port}`);
});