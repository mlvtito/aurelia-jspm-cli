#!/usr/bin/env groovy

node {
   def nodeHome
   stage('Preparation') {
       deleteDir()
      git 'https://backend.r-w-x.net/scm/git/aurelia/aurelia-jspm-cli.git'
      nodeHome = tool 'NodeJS_4.6.0'
      env.PATH = "${nodeHome}/bin:${env.PATH}"
      sh "npm -v"
      sh "node -v"
      sh "jspm -v"
   }
   withEnv(["PATH=${tool 'NodeJS_4.6.0'}/bin:${PATH}"]) {
     stage('Install Dependencies') {
        sh "npm install"
        lastPublishedVersion = sh(script: 'npm view aurelia-jspm-cli version', returnStdout: true).trim()
        currentVersion = sh(script: 'npm version | grep aurelia-jspm-cli | cut -d "\'" -f 4', returnStdout: true).trim()
     }
   }
}

if( lastPublishedVersion != currentVersion ) {
  stage('Publish to NPM') {
    timeout(time:5, unit:'DAYS') {
      input 'Should we deliver this version ?'
    }
    node {
      withEnv(["PATH=${tool 'NodeJS_4.6.0'}/bin:${PATH}"]) {
        sh "npm publish"
      }
    }
  }

  stage('Tag Version') {
    node {
      sh "git tag " + currentVersion
      sh "git push --tags"
    }
  }
}
