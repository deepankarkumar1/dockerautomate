pipeline {
    agent any

    environment {
        IMAGE_NAME = "myapp"
    }

    stages {

        stage('Clone') {
            steps {
                git branch: 'main',
                url: 'https://github.com/deepankarkumar1/dockerautomate.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t myapp .'
            }
        }

        stage('List Images') {
            steps {
                sh 'docker images'
            }
        }

    }
}
