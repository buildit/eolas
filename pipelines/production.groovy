// Production release pipeline

node {

  currentBuild.result = "SUCCESS"

  try {

    stage "Set Up"
      checkout scm

      sh "curl -L https://dl.bintray.com/buildit/maven/jenkins-pipeline-libraries-${env.PIPELINE_LIBS_VERSION}.zip -o lib.zip && echo 'A' | unzip lib.zip"

      ui = load "lib/ui.groovy"
      ecr = load "lib/ecr.groovy"
      slack = load "lib/slack.groovy"
      convox = load "lib/convox.groovy"
      template = load "lib/template.groovy"

      def domainName = "${env.MONGO_HOSTNAME}".substring(8)
      def appName = "eolas"
      def registryBase = "006393696278.dkr.ecr.${env.AWS_REGION}.amazonaws.com"
      def mongoUrl = "mongodb://${env.MONGO_HOSTNAME}:27017"
      def serverUrl = "${appName}.${domainName}"
      def serverPort = "80"

      // global for exception handling
      slackChannel = "synapse"
      gitUrl = "https://bitbucket.org/digitalrigbitbucketteam/eolas"
      appUrl = "http://eolas.${domainName}"

    stage "Write docker-compose"
      // global for exception handling
      def tag = "latest"
      def tmpFile = UUID.randomUUID().toString() + ".tmp"
      def ymlData = template.transform(readFile("docker-compose.yml.template"), [tag: tag, registry_base: registryBase, mongo_url: mongoUrl, db_context: dbContext, server_url: serverUrl, server_port: serverPort])

      writeFile(file: tmpFile, text: ymlData)

    stage "Deploy to production"
      sh "convox login ${env.CONVOX_RACKNAME} --password ${env.CONVOX_PASSWORD}"
      sh "convox env set NODE_ENV=production --app ${appName}"
      sh "convox deploy --app ${appName} --description '${tag}' --file ${tmpFile}"
      sh "rm ${tmpFile}"

      // wait until the app is deployed
      convox.waitUntilDeployed("${appName}")
      convox.ensureSecurityGroupSet("${appName}", env.CONVOX_SECURITYGROUP)
      slack.notify("Deployed to Production", "Tag <${gitUrl}/commits/tag/${tag}|${tag}> has been deployed to <${appUrl}|${appUrl}>", "good", "http://i3.kym-cdn.com/entries/icons/square/000/002/230/42.png", slackChannel)
  }
  catch (err) {
    currentBuild.result = "FAILURE"
    slack.notify("Error while deploying to Production", "Tag <${gitUrl}/commits/tag/${tag}|${tag}> failed to deploy to <${appUrl}|${appUrl}>", "danger", "http://i2.kym-cdn.com/entries/icons/original/000/002/325/Evil.jpg", slackChannel)
    throw err
  }
}
