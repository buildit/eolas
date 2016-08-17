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
      def appName = "synapse"
      def registryBase = "006393696278.dkr.ecr.${env.AWS_REGION}.amazonaws.com"

      // global for exception handling
      slackChannel = "synapse"
      gitUrl = "https://bitbucket.org/digitalrigbitbucketteam/synapse"
      appUrl = "http://synapse.${domainName}"

    stage "Write docker-compose"
      // global for exception handling
      tag = ui.selectTag(ecr.imageTags(appName, env.AWS_REGION))
      def tmpFile = UUID.randomUUID().toString() + ".tmp"
      def ymlData = template.transform(readFile("docker-compose.yml.template"), [tag: tag, registry_base: registryBase, domain_name: domainName])

      writeFile(file: tmpFile, text: ymlData)

    stage "Deploy to production"
      sh "convox login ${env.CONVOX_RACKNAME} --password ${env.CONVOX_PASSWORD}"
      sh "convox env set NODE_ENV=production MIDAS_API_URL=http://midas-api.${domainName}/ --app ${appName}"
      sh "convox deploy --app ${appName} --description '${tag}' --file ${tmpFile}"
      sh "rm ${tmpFile}"

      // wait until the app is deployed
      convox.waitUntilDeployed("${appName}")
      convox.ensureSecurityGroupSet("${appName}", env.CONVOX_SECURITYGROUP)
      slack.notify("Deployed to Production", "Tag <${gitUrl}/commits/tag/\'${tag}\'|\'${tag}\'> has been deployed to <${appUrl}|${appUrl}>", "good", "http://i296.photobucket.com/albums/mm200/kingzain/the_eye_of_sauron_by_stirzocular-d86f0oo_zpslnqbwhv2.png", slackChannel)
  }
  catch (err) {
    currentBuild.result = "FAILURE"
    slack.notify("Error while deploying to Production", "Tag <${gitUrl}/commits/tag/\'${tag}\'|\'${tag}\'> failed to deploy to <${appUrl}|${appUrl}>", "danger", "http://i296.photobucket.com/albums/mm200/kingzain/the_eye_of_sauron_by_stirzocular-d86f0oo_zpslnqbwhv2.png", slackChannel)
    throw err
  }
}
