pipeline {

  agent any
  
  environment {
    DOCKERHUB_CREDENTIALS = 'dockerhub-creds'
    EC2_SSH_CREDENTIALS = 'ec2-ssh-key'
    EC2_HOST_CREDENTIALS = 'ec2-host'
    FRONTEND_IMAGE = "muzaffaribrar/frontend"
    BACKEND_IMAGE = "muzaffaribrar/backend"
    IMAGE_TAG = "${env.BUILD_NUMBER}"
  }
  
  options {
    timestamps()
    timeout(time: 20, unit: 'MINUTES')
    disableConcurrentBuilds()
    buildDiscarder(logRotator(numTOKeepStr: '10'))
  }
  
  stages {
  
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            parallel {
                stage('Frontend Deps') {
                    when {
                        anyOf {
                            changeset "frontend/**"
                            expression { return env.BUILD_NUMBER == '1' }  // always run on first build, nothing to diff against yet
                        }
                    }
                    steps {
                        dir('frontend') {
                            sh 'npm install'
                            sh 'rm -rf node_modules/.vite dist'   // clear vite cache
                        }
                    }
                }
                stage('Backend Deps') {
                    when {
                        anyOf {
                            changeset "backend/**"
                            expression { return env.BUILD_NUMBER == '1' }
                        }
                    }
                    steps {
                        dir('backend') {
                            sh 'npm install'
                        }
                    }
                }
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
                        withCredentials([string(credentialsId: EC2_HOST_CREDENTIALS, variable: 'EC2_IP')]) {
                            script {
                                frontendImage = docker.build(
                                    "${FRONTEND_IMAGE}:${IMAGE_TAG}",
                                    "--no-cache " +
                                    "--build-arg VITE_BACKEND_URI=http://${EC2_IP}/api " +
                                    "--build-arg VITE_SOCKET_URI=http://${EC2_IP}/socket.io " +
                                    "./frontend"
                                )
                            }
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
                        anyOf {
                            changeset "frontend/**"
                            expression { return env.BUILD_NUMBER == '1' }
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
                        anyOf {
                            changeset "backend/**"
                            expression { return env.BUILD_NUMBER == '1' }
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

                    ssh -o StrictHostKeyChecking=no ubuntu@$EC2_IP "
                      echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin &&
                      bash /home/ubuntu/FYP/deploy.sh
                    "
                  '''
                }
            }
          }
        }
  }
}
