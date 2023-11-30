import * as async from "async";
import * as connect from "connect";
import * as fs from "fs";
import * as http from "http";
import { testCase } from "nodeunit";
import { RackApplication } from "..";

import { 
  prepareFixtures, 
  fixturePath, 
  createConfiguration,
  touch,
  swap,
  serve
} from "./lib/test_helper";

function serveApp(path: string, callback: (
  request: (method: string, path: string, callback: (body: any) => void) => void,
  done: (callback: () => void) => void, 
  application?: RackApplication
) => void) {

  const configuration = createConfiguration({
    POW_HOST_ROOT: fixturePath("apps"),
    POW_RVM_PATH: fixturePath("fake-rvm"),
    POW_WORKERS: 1 
  });

  const application = new RackApplication(configuration, fixturePath(path));
  
  const server = connect.createServer();

  server.use((req, res, next) => {
    if (req.url === "/") {
      application.handle(req, res, next);
    } else {
      next(); 
    }
  });

  serve(server, (request, done) => {
    callback(request, (callback) => {  
      done(() => application.quit(callback)); 
    }, application);
  });

}

export = testCase({

  setUp: (proceed) => {
    prepareFixtures(proceed);
  },

  "handling a request": (test) => {

    test.expect(1);

    serveApp("apps/hello", (request, done) => {
      request("GET", "/", (body) => {        
        test.same("Hello", body);
        done(() => test.done());  
      });
    });

  },

  // ...other tests

});
