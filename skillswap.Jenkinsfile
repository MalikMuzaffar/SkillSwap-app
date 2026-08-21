// Declare image variables globally so they persist across parallel stages
def frontendImage
def backendImage

pipeline {

    agent any
    
    environment {
        DOCKERHUB_CREDENTIALS = 'dockerhub-creds'
        EC2_SSH_CREDENTIALS   = 'ec2-ssh-key'
        EC2_HOST_CREDENTIALS  = 'ec2-host'
        FRONTEND_IMAGE       = "muzaffaribrar/frontend"
        BACKEND_IMAGE        = "muzaffaribrar/backend"
        IMAGE_TAG            = "${env.BUILD_NUMBER}"
        DOCKER_BUILDKIT      = '0' // Disables BuildKit globally to prevent TLS/network errors
    }
    
    options {
        timestamps()
        timeout(time: 20, unit: 'MINUTES')
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }
    
    stages {
    
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Images') {
            parallel {
                stage('Build Frontend Image') {
                    when {
                        anyOf {
                            changeset "frontend/**"
                            expression { return env.BUILD_NUMBER == '1' }
                        }
                    }
                    steps {
                        script {
                            frontendImage = docker.build(
                                "${FRONTEND_IMAGE}:${IMAGE_TAG}",
                                "--no-cache " +
                                "--build-arg VITE_BACKEND_URI=/api " +
                                "--build-arg VITE_SOCKET_URI=/socket.io " +
                                "./frontend"
                            )
                        }
                    }
                }
                
                stage('Build Backend Image') {
                    when {
                        anyOf {
                            changeset "backend/**"
                            expression { return env.BUILD_NUMBER == '1' }
                        }
                    }
                    steps {
                        script {
                            backendImage = docker.build("${BACKEND_IMAGE}:${IMAGE_TAG}", "./backend")
                        }
                    }
                }
            }
        }
        

        stage('Push Images') {
            when { branch 'main' }
            parallel {
                stage('Push Frontend') {
                    when {
                        allOf {
                            expression { return frontendImage != null }
                            anyOf {
                                changeset "frontend/**"
                                expression { return env.BUILD_NUMBER == '1' }
                            }
                        }
                    }
                    steps {
                        script {
                            docker.withRegistry('https://registry.hub.docker.com', DOCKERHUB_CREDENTIALS) {
                                frontendImage.push("${IMAGE_TAG}")
                                frontendImage.push('latest')
                            }
                        }
                    }
                }
                stage('Push Backend') {
                    when {
                        allOf {
                            expression { return backendImage != null }
                            anyOf {
                                changeset "backend/**"
                                expression { return env.BUILD_NUMBER == '1' }
                            }
                        }
                    }
                    steps {
                        script {
                            docker.withRegistry('https://registry.hub.docker.com', DOCKERHUB_CREDENTIALS) {
                                backendImage.push("${IMAGE_TAG}")
                                backendImage.push('latest')
                            }
                        }
                    }
                }
            }
        }
        
        stage('Deploy to EC2') {
            when { branch 'main' }
            steps {
                withCredentials([
                    string(credentialsId: EC2_HOST_CREDENTIALS, variable: 'EC2_IP'),
                    usernamePassword(credentialsId: DOCKERHUB_CREDENTIALS, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')
                ]) {
                    sshagent(credentials: [EC2_SSH_CREDENTIALS]) {
                        sh '''
                            scp -o StrictHostKeyChecking=no ./docker-compose.yml ubuntu@$EC2_IP:/home/ubuntu/FYP/docker-compose.yml

                            ssh -o StrictHostKeyChecking=no ubuntu@$EC2_IP "echo '$DOCKER_PASS' | docker login -u '$DOCKER_USER' --password-stdin && bash /home/ubuntu/FYP/deploy.sh"
                        '''
                    }
                }
            }
        }
    }
}
