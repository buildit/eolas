@Library('buildit')
def LOADED = true
podTemplate(label: 'nodeapp',
        containers: [
                containerTemplate(name: 'nodejs-builder', image: 'builditdigital/node-builder', ttyEnabled: true, command: 'cat', privileged: true),
                containerTemplate(name: 'docker', image: 'docker:1.11', ttyEnabled: true, command: 'cat'),
                containerTemplate(name: 'kubectl', image: 'builditdigital/kube-utils', ttyEnabled: true, command: 'cat')],
        volumes: [
                hostPathVolume(mountPath: '/var/projects', hostPath: '/Users/romansafronov/dev/projects'),
                hostPathVolume(mountPath: '/var/run/docker.sock', hostPath: '/var/run/docker.sock')]) {
    node('nodeapp') {

        currentBuild.result = "SUCCESS"
        sendNotifications = false //FIXME !DEV_MODE

        try {
            stage('Set Up') {

                gitInst = new git()
                npmInst = new npm()
                slackInst = new slack()

                buildNumber = env.BUILD_NUMBER
                appName = "eolas"
                cloud = "local"
                env = "staging"
                slackChannel = "eolas"
                gitUrl = "https://github.com/buildit/Eolas.git"
                dockerRegistry = "builditdigital"
                image = "$dockerRegistry/$appName"
                deployment = "${appName}-${env}"

                mongoUrl = "mongodb://mongo-staging-mongodb:27017"
            }
            container('nodejs-builder') {
                stage('Checkout') {
                    checkout scm
                    //git(url: '/var/projects/Eolas', branch: 'spike/security_perimiter')

                    // global for exception handling
                    shortCommitHash = gitInst.getShortCommit()
                    commitMessage = gitInst.getCommitMessage()
                    version = npmInst.getVersion()
                }

                stage('Install') {
                    sh "npm install"
                }

                stage('Validation') {
                    sh "DB_URL='${mongoUrl}' CONTEXT='validation' SERVER_URL='test.local' SERVER_PORT='80' npm run genConfig"
                    sh "NODE_ENV='validation' npm run validate"
                }

                stage('Packaging') {
                    sh "npm prune && npm shrinkwrap && npm run package"
                    sh "cd dist && npm install --production"
                }
            }
            container('docker') {
                stage('Docker Image Build') {
                    tag = "${version}-${shortCommitHash}-${buildNumber}"
                    // Docker pipeline plugin does not work with kubernetes (see https://issues.jenkins-ci.org/browse/JENKINS-39664)
                    sh "docker build -t $image:$tag ."
                    //ecrInst.authenticate(env.AWS_REGION) FIXME
                }
            }

            container('kubectl') {
                stage('Deploy To K8S') {
                    def deployment = "$appName-$env"
                    deploymentObj = "$deployment-$appName".take(24)
                    def varsFile = "./k8s/${cloud}/vars/${env}.yaml"
                    sh "helm ls -q | grep $deployment || helm install ./k8s/eolas -f $varsFile -n $deployment"
                    sh "helm upgrade $deployment ./k8s/eolas -f $varsFile --set image.repository=$image --set image.tag=$tag"
                    sh "kubectl rollout status deployment/$deploymentObj"
                }
            }

            container('nodejs-builder') {
                stage('Run Functional Acceptance Tests') {
                    sh "CONTEXT='acceptance' SERVER_URL='${deploymentObj}' SERVER_PORT='80' LOG_LEVEL='DEBUG' npm run genConfig"
                    sh "NODE_ENV='acceptance' npm run accept"
                }
            }

            container('docker') {
                stage('Promote Build to latest') {
                    sh "docker tag $image:$tag $image:latest"
                    if (sendNotifications) slackInst.notify("Deployed to Staging", "Commit <${gitUrl}/commits/${shortCommitHash}|${shortCommitHash}> has been deployed to ${env}\n\n${commitMessage}", "good", "http://i3.kym-cdn.com/entries/icons/square/000/002/230/42.png", slackChannel)
                }
            }
        }
        catch (err) {
            currentBuild.result = "FAILURE"
            if (sendNotifications) slackInst.notify("Error while deploying to Staging", "Commit <${gitUrl}/commits/${shortCommitHash}|${shortCommitHash}> failed to deploy to ${env}", "danger", "http://i2.kym-cdn.com/entries/icons/original/000/002/325/Evil.jpg", slackChannel)
            throw err
        }
    }
}
