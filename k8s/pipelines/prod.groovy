@Library('buildit')
import buildit.*

slackInst = new slack()
envz = buildit.Jenkins.globalEnv

k8s = new K8S(this, Cloud.valueOf(envz.CLOUD), envz.REGION)

sendNotifications = false //FIXME !DEV_MODE
appName = "eolas"
targetEnv = "prod"
slackChannel = "synapse"
gitUrl = "https://github.com/buildit/Eolas.git"
dockerRegistry = envz.REGISTRY
image = "$dockerRegistry/$appName"

extraMounts = []
if(envz.HOST_PROJECT_PATH) {
    extraMounts << hostPathVolume(mountPath: '/var/projects', hostPath: envz.HOST_PROJECT_PATH)
}

k8s.build([containerTemplate(name: 'nodejs-builder', image: 'builditdigital/node-builder', ttyEnabled: true, command: 'cat', privileged: true)],
        extraMounts) {

    try {
        container('nodejs-builder') {
            try {
                checkout scm
            } catch(hudson.AbortException e) {
                // we're not in multibranch pipeline
                git(url: gitUrl, branch: 'master')
            }
        }
        stage('Deploy To K8S') {
            k8s.helmDeploy(appName, targetEnv, image, 'latest', 'public')
        }
        if (sendNotifications) slackInst.notify("Deployed ${appName} latest to ${env}", "Latest image ${image} has been deployed to ${env}", "good", "http://images.8tracks.com/cover/i/001/225/360/18893.original-9419.jpg?rect=50,0,300,300&q=98&fm=jpg&fit=max&w=100&h=100", slackChannel)
    }
    catch (err) {
        currentBuild.result = "FAILURE"
        if (sendNotifications) slackInst.notify("Error while promoting ${appName} to ${env}", "Failed to promote image ${image} to ${env}", "danger", "http://i2.kym-cdn.com/entries/icons/original/000/002/325/Evil.jpg", slackChannel)
        throw err
    }
}
