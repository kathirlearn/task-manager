const express = require('express');
const bodyParser = require('body-parser');
const tasksData = require('../tasks.json');
const validator = require('./helpers/validator');
const path = require('path');
const fs = require('fs');
const PORT = 3000;

const app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => {   
    return res.status(200).send("welcome to task manager");
});

// Get all tasks
app.get('/tasks', (req, res) => {
    const { completed, sortBy } = req.query;
    let filteredTasks = null;
    filteredTasks = Object.assign([],tasksData.tasks);

    if(completed){
        const completedStatus = completed.toLowerCase() === 'true' ? true :  (completed.toLowerCase() === 'false' ? false : null);
        if(completedStatus != null) {
            filteredTasks = filteredTasks.filter((taskObj) => taskObj.completed == completedStatus);
        } else {
            return res.status(400).send('Completed query must be boolean true/false');
        }
    } 

    if (sortBy) {
        const sortQueryArray = sortBy.split(':');
        const sortOn = sortQueryArray[0];
        const sortOrder = sortQueryArray[1];
        if(sortOrder){
            let sortMethod = sortOrder.toUpperCase() === 'DESC' ? -1 : (sortOrder.toUpperCase() === 'ASC' ? 1 : null);
            if(sortMethod){
                filteredTasks = filteredTasks.sort((a, b) => {
                    const element1 = a[sortOn];
                    const element2 = b[sortOn];

                    if(element1  < element2){
                        return -1*sortMethod;
                    }

                    if(element1 > element2){
                        return  1*sortMethod;
                    }
                    return 0;
                  });
            } else {
                return res.status(400).send('sortBy query must be DESC OR ASC');
            }
        }
      }
    return res.status(200).json(filteredTasks);
});

// Get task based on perticular id
app.get('/tasks/:taskId', (req, res) => {
    let tasks = tasksData.tasks;
    let taskId = req.params.taskId;
    let identifiedTask = tasks.find((taskObj) => taskObj.id == taskId);
    if (!identifiedTask) {
        return res.status(404).send(`No appropriate task found with the provided id ${taskId}`);
    }
    return res.status(200).json(identifiedTask);
});

// Get task based on priority level
app.get('/tasks/priority/:level', (req, res) => {
    let tasks = tasksData.tasks;
    let level = req.params.level;
    let identifiedTasks = tasks.filter((taskObj) => taskObj.priority == level);
    return res.status(200).json(identifiedTasks);
});

// Add task to list
app.post('/tasks', (req, res) => {
    const taskDetails = req.body;
    let taskWritePath = path.join(__dirname, '..', 'tasks.json');
    if(validator.validateNewTaskDetails(taskDetails).status == true) {
        let taskDataModified = JSON.parse(JSON.stringify(tasksData));
        taskDetails.completed = false;
        const timeStamp = new Date().getTime();
        taskDetails.createdOn = timeStamp;
        taskDetails.updatedOn = timeStamp;
        taskDetails.priority =  (taskDetails.priority).toLowerCase() || 'low';
        taskDataModified.tasks.push(taskDetails);
        fs.writeFile(taskWritePath, JSON.stringify(taskDataModified), {encoding: 'utf8', flag:'w'}, (err, data) => {
            if(err) {
                return res.status(500).send("Something went wrong while creating the task");
            } else {
                return res.status(201).send(validator.validateNewTaskDetails(taskDetails).message);
            }
        });
    } else {
        res.status(400).json(validator.validateNewTaskDetails(taskDetails));
    }
});

// Update task 
app.put('/tasks', (req, res) => {
    const taskDetails = req.body;
    let taskWritePath = path.join(__dirname, '..', 'tasks.json');
    if(validator.validateUpdateTaskDetails(taskDetails).status == true) {
        let taskDataModified = JSON.parse(JSON.stringify(tasksData));
        const taskArray = taskDataModified.tasks;
        taskDetails.updatedOn = new Date().getTime();
        taskDetails.priority =  (taskDetails.priority).toLowerCase() || 'low';
        const objIndex = taskArray.findIndex((taskObj) => taskObj.id == taskDetails.id);
        if(objIndex >= 0 ){
            taskArray[objIndex] = Object.assign(taskArray[objIndex],taskDetails);
        }
        fs.writeFile(taskWritePath, JSON.stringify(taskDataModified), {encoding: 'utf8', flag:'w'}, (err, data) => {
            if(err) {
                return res.status(500).send("Something went wrong while updating the task");
            } else {
                return res.status(201).send(validator.validateUpdateTaskDetails(taskDetails).message);
            }
        });
    } else {
        res.status(400).json(validator.validateUpdateTaskDetails(taskDetails));
    }
});

// Delete any task based on Id
app.delete('/tasks/:taskId', (req, res) => {
    let tasks = tasksData.tasks;
    let taskId = req.params.taskId;
    let taskWritePath = path.join(__dirname, '..', 'tasks.json');
    let taskDataModified = JSON.parse(JSON.stringify(tasksData));
    const taskArray = taskDataModified.tasks;
    const objIndex = taskArray.findIndex((taskObj) => taskObj.id == taskId);
    if(objIndex >= 0){
        taskArray.splice(objIndex,1);
        fs.writeFile(taskWritePath, JSON.stringify(taskDataModified), {encoding: 'utf8', flag:'w'}, (err, data) => {
            if(err) {
                return res.status(500).send("Something went wrong while deleting the task");
            } else {
                return res.status(201).send("Task get deleted");
            }
        });
    } else {
        res.status(404).send(`No appropriate task found with the provided id ${taskId}`);
    }
});

app.listen(PORT, (error) => {
    if(error) {
        console.log("something went wrong while starting the server");
    } else {
        console.log("server is running on port 3000");
    }
});
