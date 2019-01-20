#!/usr/bin/env node
'use strict'

const path = require('path')
const download = require('download')

const URL = 'https://github.com/facebook/nailgun/releases/download/nailgun-all-v1.0.0/nailgun-server-1.0.0-SNAPSHOT.jar'

const JAR_DIR_PATH = path.join(__dirname, '../vendor')

download(URL, JAR_DIR_PATH, { filename: 'nailgun.jar' })
