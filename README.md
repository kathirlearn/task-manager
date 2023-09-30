# Task-manager
Build a RESTful API for a simple task manager application using an in-memory data store

## Endpoints
**GET** '/tasks'  -  To retrieve all tasks.

**GET** '/tasks/:id' -  To retrieve a task based on Id provide.

**GET** '/tasks/priority/:level' - To retrieve a tasks based on priority.

**POST** '/tasks' - Create a new task.

**PUT** '/tasks' - Update existing task like priority/completed status.

**DELETE** '/tasks/:id' - Delete particular task based on Id.



**Filtering & Sorting :** 


**GET** '/tasks?completed=true'  -  To retrieve all tasks based on filter by completed status.

**GET** '/tasks?sortBy=createdOn:desc' - To retrieve all tasks sorted by createdOn in desecnding order.

**GET** '/tasks?sortBy=createdOn:asc' - To retrieve all tasks sorted by createdOn in ascending order.


