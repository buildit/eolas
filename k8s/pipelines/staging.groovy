@Library('buildit')
import buildit.*

gitInst = new git()
slackInst = new slack()
envz = buildit.Jenkins.globalEnv

k8s = new K8S(this, Cloud.valueOf(envz.CLOUD), envz.REGION)

gitUrl = "https://github.com/buildit/Eolas.git"
dockerRegistry = envz.REGISTRY

sendNotifications = false //FIXME !DEV_MODE
buildNumber = env.BUILD_NUMBER
targetEnv = "staging"
appName = "eolas"
slackChannel = "synapse"
image = "$dockerRegistry/$appName"

mongoUrl = "mongodb://mongo-staging-mongodb:27017"

extraMounts = []
if (envz.HOST_PROJECT_PATH) {
    extraMounts << hostPathVolume(mountPath: '/var/projects', hostPath: envz.HOST_PROJECT_PATH)
}

k8s.build([containerTemplate(name: 'nodejs-builder', image: 'builditdigital/node-builder', ttyEnabled: true, command: 'cat', privileged: true)],
        extraMounts) {

    try {
        container('nodejs-builder') {
            stage('Checkout') {
                try {
                    checkout scm
                } catch (hudson.AbortException e) {
                    // we're not in multibranch pipeline
                    git(url: gitUrl, branch: 'master')
                    echo "falling back to default project URL: $gitUrl"
                }

                shortCommitHash = gitInst.getShortCommit()
                commitMessage = gitInst.getCommitMessage()
                npmInst = new npm()
                version = npmInst.getVersion()
            }

            stage('Install') {
                k8s.withCache('node_modules') {
                    sh "npm install"
                }
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

        stage('Docker Image Build') {
            tag = "${version}-${shortCommitHash}-${buildNumber}"
            k8s.dockerBuild(image, tag)
        }

        stage('Docker Push') {
            k8s.dockerPush(image, tag)
        }

        stage('Deploy To K8S') {
            deployment = k8s.helmDeploy(appName, targetEnv, image, tag)
        }

        container('nodejs-builder') {
            stage('Run Functional Acceptance Tests') {
                sh "CONTEXT='acceptance' SERVER_URL='${deployment}' SERVER_PORT='80' LOG_LEVEL='DEBUG' npm run genConfig"
                sh "NODE_ENV='acceptance' npm run accept"
            }
        }

        stage('Promote Build to latest') {
            k8s.inDocker {
                sh "docker tag $image:$tag $image:latest"
            }
            k8s.dockerPush(image, 'latest')
            if (sendNotifications) slackInst.notify("Deployed to Staging", "Commit <${gitUrl}/commits/${shortCommitHash}|${shortCommitHash}> has been deployed to ${targetEnv}\n\n${commitMessage}", "good", "http://i3.kym-cdn.com/entries/icons/square/000/002/230/42.png", slackChannel)
        }
    }
    catch (err) {
        currentBuild.result = "FAILURE"
        if (sendNotifications) slackInst.notify("Error while deploying to Staging", "Commit <${gitUrl}/commits/${shortCommitHash}|${shortCommitHash}> failed to deploy to ${env}", "danger", "http://i2.kym-cdn.com/entries/icons/original/000/002/325/Evil.jpg", slackChannel)
        throw err
    }
}
