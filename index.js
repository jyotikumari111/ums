const express= require('express');
const mongoose=require('mongoose');
const path=require('path');
require ('dotenv').config();

const app=express();
const PORT=3002;

//Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname,'public')));

const mongoURI=process.env.MONGO_URI;
//connect to MongoDB
//mongoose.connect(mongoURI)
mongoose.connect('mongodb+srv://jyoti201ku:root@cluster0.93gqmji.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
.then(()=>console.log('Connected to MongoDB'))
.catch(err=>console.error('Error connecting to MongoDB: ',err));

//define user schema
const userSchema= new mongoose.Schema({
    name: String,
    email: String,
    password: String
});
const User=mongoose.model('User', userSchema);

app.get('/users', (req,res)=>{
    User.find({})
    .then(users=>res.json(users))
    .catch(err=>res.status(500).json({message: err.message}));
});
app.post('/users',(req,res)=>{
    const user=new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    })
    user.save()
    .then(newUser => res.status(201).json(newUser))
    .catch(err=> res.status(400).json({message: err.message
    }));
});
    app.put('/users/:id',(req,res)=>{
        const userId= req.params.id;
        const updateData={
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        };
        User.findByIdAndUpdate(userId,updateData,{new:true})
        .then(updateUser=>{
            if(!updateUser){
                return res.status(404).json({message:' User not found'});
            }
            res.json(updateUser);
        })
        .catch(err=>res.status(400).json({message: err.message}));
    });
    app.delete('/users/:id',(req,res)=>{
        const userId= req.params.id;
        
        User.findByIdAndDelete(userId)
        .then(deletedUser=>{
            if(!deletedUser){
                return res.status(404).json({message:' User not found'});
            }
            res.json({message: 'User deleted successfully'});
        })
        .catch(err=>res.status(400).json({message: err.message}));
    });

app.listen(3002);

