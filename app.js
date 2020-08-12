const fs = require('fs')
const yargs = require('yargs')
const chalk = require("chalk");

// read data from json
function loadData() {
    try {
        const buffer = fs.readFileSync('data.json')
        const dataString = buffer.toString()
        const javaScriptObject = JSON.parse(dataString)

        return javaScriptObject
    } catch (err) {
        console.log(chalk.red.bold("ERROR", err))
        return []
    }

}
// console.log(logData())
// manipulate data

// save back to json
function saveData(data) {
    // write a string or bugger to data.json
    fs.writeFileSync('data.json', JSON.stringify(data))
}


yargs.command({
    command: "add",
    describe: "adds another item to the To Do list",
    builder: {
        todo: {
            describe: "Describe what you are going to do",
            demandOption: true, //is this required or not
            type: "string"
        },
        complete: {
            describe: "Mark item as complete",
            default: false, //is this required or not
            type: "boolean"
        },

    },
    handler: function (arguments) {
        console.log(arguments.todo, arguments.complete);
        const todos = loadData()
        const id = todos.length === 0 ? 1 : todos[todos.length - 1].id + 1;
        todos.push({
            id: id,
            todo: arguments.todo,
            complete: arguments.complete
        })
        saveData(todos)
        console.log(chalk.green('successful'))
    }
});

yargs.command({
    command: "list",
    describe: "Lists all items in the To Do list",
    builder: {
        complete: {
            describe: "Shows list according to completed status \n You can sort by all || completed || incompleted",
            default: "all", //is this required or not
            type: "string"
        },
    },
    handler: function ({ complete }) {
        const todos = loadData()

        let results

        if (complete === "complete") {
            results = todos.filter(e => e.complete === true)
        } else if (complete === "incomplete") {
            results = todos.filter(e => e.complete === false)
        } else {
            results = todos
        }
        results.forEach((e) => console.log(chalk.blue(`id: ${e.id}, \n todo: ${e.todo}, \n completed: ${e.complete}`)))
    }
})


yargs.command({
    command: "delete",
    describe: "delete a todo using the ID",
    builder: {
        id: {
            describe: "Enter the ID that you want to delete \n ID: 0 will delete all",
            type: "number",
            demandOption: true
        },

    },
    handler: function (args) {
        const todos = loadData();
        let results

        if (args.id === 0) {

            results = []
            saveData(results)
            console.log(chalk.green('successful'))

        } else {
            results = todos.filter(e => e.id !== args.id);
            saveData(results);
            console.log(chalk.green('successful'))
        }

    },
});

yargs.command({
    command: "toggle",
    describe: "Toggle task complete or incomplete",
    builder: {
        id: {
            describe: "Use ID to select the task that you want to update",
            demandOption: true, //is this required or not
            type: "number"
        },
        done: {
            describe: "Use 'yes' or 'no' to declare task done or not done",
            demandOption: true,
            type: "string",
        },
    },

    handler: function (args) {
        const todos = loadData()
        const id = args.id

        let index = todos.findIndex(e => e.id === id)

        if (index >= 0){
            todos[index].complete = !todos[index].complete
            saveData(todos)
            console.log(chalk.green('successful'))
        } else{
            console.log(chalk.red.bold("That item does not exist"))
            return 
        }

    }

})

yargs.parse(); // run the config and print out all the messages nicely in our terminal

