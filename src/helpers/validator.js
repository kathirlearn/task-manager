const tasksData = require('../../tasks.json');

class Validator {
    static validateNewTaskDetails(taskDetails) {
        let tasks = tasksData.tasks;
        if(
            taskDetails.hasOwnProperty("id") &&
            taskDetails.hasOwnProperty("title") && 
            taskDetails.hasOwnProperty("description")
        ) {
            const isIdDuplicate = tasks.find((taskObj) => taskDetails.id == taskObj.id);
            if(isIdDuplicate){
                return {
                    "status": false,
                    "message": `Id ${taskDetails.id} already exsists!.`
                }
            }
            else {
                return {
                    "status": true,
                    "message": "task has been added"
                }
            }
            
        }
        else {
            return {
                "status": false,
                "message": "task details is malformed, please provided all the parameters"
            }
        }
    }

    static validateUpdateTaskDetails(taskDetails) {
        let tasks = tasksData.tasks;
        if(
            taskDetails.hasOwnProperty("id") &&
            taskDetails.hasOwnProperty("title") && 
            taskDetails.hasOwnProperty("description")
        ) {

            const isTaskPresent = tasks.find((taskObj) => taskDetails.id == taskObj.id);
            if(isTaskPresent){
                return {
                    "status": true,
                    "message": "task updated successfully"
                }
            } else {
                return {
                    "status": false,
                    "message": `Unable to find task which you want to update with id ${taskDetails.id}`
                }
            }
            
        }
        else {
            return {
                "status": false,
                "message": "task details is malformed, please provided all the parameters"
            }
        }
    }
}

module.exports = Validator;