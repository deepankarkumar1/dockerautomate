pipeline {

    agent any

    environment {
        IMAGE_NAME = "myapp"
        CONTAINER_NAME = "myapp-container"
    }

    stages {

        stage('Clone Code') {
            steps {
                git branch: 'main',
                credentialsId: 'github-creds',
                url: 'https://github.com/deepankarkumar1/dockerautomate.git'
            }
        }

        stage('Secrets Scan - Gitleaks') {
            steps {
                sh '''
                mkdir -p reports

                gitleaks detect \
                --source . \
                --report-format json \
                --report-path reports/gitleaks-report.json
                '''
            }
        }

        stage('SAST Scan by - Semgrep') {
    steps {
        sh '''
        semgrep \
        --config auto \
        . \
        --json \
        --output reports/semgrep-report.json || true
        '''
        }
      }

        stage('Dependency Scan') {
            steps {
                sh '''
                npm install

                npm audit \
                --json \
                > reports/npm-audit.json || true
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                docker build -t $IMAGE_NAME .
                '''
            }
        }

        stage('Container Scan - Trivy') {
            steps {
                sh '''
                trivy image \
                --format json \
                --output reports/trivy-report.json \
                $IMAGE_NAME
                '''
            }
        }

        stage('Stop Old Container') {
            steps {
                sh '''
                docker stop $CONTAINER_NAME || true
                docker rm $CONTAINER_NAME || true
                '''
            }
        }

        stage('Run Container') {
            steps {
                sh '''
                docker run -d \
                --name $CONTAINER_NAME \
                -p 3090:3090 \
                $IMAGE_NAME
                '''
            }
        }

        stage('DAST Scan - OWASP ZAP') {
            steps {
                sh '''
                docker run --rm \
                -v $(pwd)/reports:/zap/wrk/:rw \
                ghcr.io/zaproxy/zaproxy:stable \
                zap-baseline.py \
                -t http://localhost:3090 \
                -r zap-report.html
                '''
            }
        }

        stage('Show Running Containers') {
            steps {
                sh 'docker ps'
            }
        }

    }

    post {

        always {

            archiveArtifacts artifacts: 'reports/*', fingerprint: true

            publishHTML(target: [
                allowMissing: true,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'reports',
                reportFiles: 'zap-report.html',
                reportName: 'OWASP-ZAP-Report'
            ])
        }
    }
}
