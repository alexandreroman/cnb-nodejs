/*
 * Copyright (c) 2021 VMware, Inc. or its affiliates
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const fs = require('fs')
const PropertiesReader = require('properties-reader')
const express = require('express')
const app = express()
const port = process.env.PORT || 8080

var osName = "";
if(fs.existsSync("/etc/os-release")) {
  props = PropertiesReader("/etc/os-release")
  osName = props.get("PRETTY_NAME").replace(/\"/g, "")
}

const info = {
  node: `Node ${process.version}`,
  os: osName
}

const greetings = process.env.GREETINGS || 'Hello world!';

app.get('/greetings', function (req, res) {
  res.setHeader("Content-Type", "text/plain");
  res.end(greetings);
})

app.get('/info', function (req, res) {
  res.setHeader("Content-Type", "application/json");
  res.end(info)
})

var opensslVersion = "";
const os = require('os');
const opensslVersionOutput = require('child_process').execSync("openssl version -a").toString();
const opensslVersionLines = opensslVersionOutput.split(os.EOL);
opensslVersion = opensslVersionLines[0].trim();
if(!opensslVersionLines[1].includes("not available")) {
  opensslVersion += (" " + opensslVersionLines[1].trim());
}

const Prometheus = require('prom-client');
const promReg = new Prometheus.Registry();

const appInfo = new Prometheus.Counter({
  name: 'app_info_total',
  help: 'Get application info',
  labelNames: ["application_name", "nodejs_version", "openssl_version"]
});
appInfo.labels("cnb-nodejs", info.node, opensslVersion).inc();
promReg.registerMetric(appInfo);

app.get('/metrics', (req, res) => {
  res.set('Content-Type', promReg.contentType);
  res.end(promReg.metrics());
});

const appDataDir = process.env.APP_DATA || '/app-data';
if(fs.existsSync(appDataDir)) {
  app.use(express.static(appDataDir));
}

app.use(express.static('static'));
app.listen(port, function () {
  console.log(`Server listening on port ${port}`)
})
