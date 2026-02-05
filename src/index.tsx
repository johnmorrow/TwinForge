#!/usr/bin/env node
import React from 'react'
import { render } from 'ink'
import { App } from './components/App.js'

const initialDir = process.argv[2] || process.cwd()

render(<App initialDir={initialDir} />)
