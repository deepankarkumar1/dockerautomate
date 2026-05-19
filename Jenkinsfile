pipeline {

    agent any

    stages {

        stage('Clone Code') {
            steps {
                git 'https://github.com/deepankarkumar1/dockerautomate.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t myapp .'
            }
        }

        stage('Push Docker Image') {
            steps {
                sh 'docker push myapp'
            }
        }
    }
}
