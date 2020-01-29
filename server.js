/*
 * Copyright (c) 2020 VMware, Inc.
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

var osName
if(fs.existsSync("/etc/os-release")) {
  props = PropertiesReader("/etc/os-release")
  osName = props.get("PRETTY_NAME").replace(/\"/g, "")
}

const info = {
  node: `Node ${process.version}`,
  os: osName
}

app.get('/greetings', function (req, res) {
  res.setHeader("Content-Type", "text/plain");
  res.send('Hello world!')
})

app.get('/info', function (req, res) {
  res.setHeader("Content-Type", "application/json");
  res.send(info)
})

app.use(express.static('static'));
app.listen(port, function () {
  console.log(`Server listening on port ${port}`)
})
