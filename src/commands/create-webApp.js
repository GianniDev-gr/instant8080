const { Command, flags } = require("@oclif/command");
const fs = require("fs");

class CreateWebAppCommand extends Command {
  async run() {
    const { flags } = this.parse(CreateWebAppCommand);
    const name = flags.name;

    const indexjs = `const PORT = process.env.PORT || 8080;
    const express = require('express');
    const app = express();
    
    const http = require('http');
    const server = http.Server(app);
    
    //Set static files directory
    app.use(express.static('public'));
    
    //Set the view engine
    app.engine('html', require('ejs').renderFile);
    app.set('view engine', 'html');
    
    //set the views folder
    app.set('views', './views');
    
    //Import routes
    const api = require('./routes/api');
    
    //Set routes
    app.use('/api', api);
    
    //Start server
    server.listen(PORT, function () {
      console.log('Chat server running');
    });`;
    const gitignore = `node_modules/`;
    const Procfile = `web: node index.js`;
    const api = `const express = require('express');
    const router = express.Router();
    
    router.get('/', (req, res) => {
      res.render('index.ejs', {});
    });
    
    module.exports = router;`;
    const ejs = `<!DOCTYPE html/> <html></html>`;

    //Check if directory already exists
    //If not it creates it
    if (!fs.existsSync("./" + name)) {
      fs.mkdirSync("./" + name, {
        recursive: true,
      });

      //Create essential files
      fs.appendFile(`./${name}/index.js`, indexjs, (err) => {
        if (err) throw err;
      });

      fs.appendFile(`./${name}/.gitignore`, gitignore, (err) => {
        if (err) throw err;
      });

      fs.appendFile(`./${name}/Procfile`, Procfile, (err) => {
        if (err) throw err;
      });

      //Create the static folder for css, img, js
      fs.mkdirSync(`./${name}/public`, {
        recursive: true,
      });

      fs.mkdirSync(`./${name}/public/css`, {
        recursive: true,
      });
      fs.mkdirSync(`./${name}/public/img`, {
        recursive: true,
      });

      fs.mkdirSync(`./${name}/public/js`, {
        recursive: true,
      });

      //Create routes folder
      fs.mkdirSync(`./${name}/routes`, {
        recursive: true,
      });

      fs.appendFile(`./${name}/routes/api.js`, api, (err) => {
        if (err) throw err;
      });

      //Finaly it creates the views folder
      fs.mkdirSync(`./${name}/views`, {
        recursive: true,
      });

      fs.appendFile(`./${name}/views/index.ejs`, ejs, (err) => {
        if (err) throw err;
      });
    }

    this.log(`Created project at ./${name} \nThen`);
    this.log(`\ncd ${name}`);
    this.log(`npm init`);
    this.log(`npm install express --save`);
    this.log(`npm install ejs --save`);
    this.log(`npm install nodemon --save`);
  }
}

CreateWebAppCommand.description = `Creates web app's esential files`;

CreateWebAppCommand.flags = {
  name: flags.string({
    char: "n",
    description: "Name of the project's directory",
  }),
};

module.exports = CreateWebAppCommand;
