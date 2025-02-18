require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const Together = require('together-ai');
const fs =require('fs');

const app =express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

//API calls 
const client = new Together({
    apiKey: process.env['TOGETHER_API_KEY'] // The API key is not provided in .env file for security reasons
  });


app.get('/', (req,res)=>{
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.post('/submit', async (req,res)=>{
    let prompt= req.body.prompt;
    let model_name = req.body.select_model;
    let imageUrl = req.body.imageUpload;
    const chatCompletion = await client.chat.completions.create({
        messages:[
            /*{role: 'system', content: prompt},*/
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": imageUrl,
                        },
                    },
                ],
            }
        ],
            model : model_name,
            temperature : 0.3,
    });
    //console.log(chatCompletion.choices[0].message.content);
    let op = await chatCompletion.choices[0].message.content;
    console.log(op);
    op = op.split('\n');
    res.render(path.join(__dirname, 'views', 'index.ejs') , {output: op, img_src : imageUrl});
});


app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running on port 3000.");
});


