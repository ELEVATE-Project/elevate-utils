const express = require('express')
const routes = require('./constants/routes')
const packageRouter = require('./router')
const dependencyManager = require('./helpers/dependencyManager')

require('dotenv').config();


const packageName = 'sunbird-mentoring'
const getDependencies = () => {
	return ['kafka', 'kafka-connect', 'redis']
}
const getRequiredDependencies = () => {
	return 	[
		{
			"packageName": packageName,
			"dependencies": [{ "name": "kafka" }]
		}
	]
}

const getPackageMeta = () => {
	return {
		basePackageName: 'mentoring',
		packageName: packageName,
	}
}

const createPackage = (options) => {
	const { kafkaClient, redisClient } = options

	
	const sendNotification = (message) => {
		kafkaClient.send(message)
	}

	const cacheSave = (key, value) => {
		redisClient.cacheIt(key, value)
	}

	const router = express.Router()
	router.get('/', (req, res) => {
		res.send('Hello, world! From package1')
		sendNotification('SENDING NOTIFICATION FROM PACKAGE 1 CONTROLLER')
		cacheSave('ALPHA KEY', 'ALPHA ')
	})

	return {
		sendNotification,
		cacheSave,
		router,
	}
}

if(process.env.DEBUG_MODE== "true"){
	console.log("running in debug mode");
}

let kafkaPackageName = "sunbird-mentoring-notification"

const environmentVariablePrefix = kafkaPackageName.toUpperCase().replace(/-/g, '_');

const requiredEnvs = {
	[`${environmentVariablePrefix}_KAFKA_CLIENT_ID`]: {
		message: `[${kafkaPackageName}] Required Kafka Brokers Hosts`,
		optional: false,
	},
	[`${environmentVariablePrefix}_KAFKA_BROKERS`]: {
		message: `[${kafkaPackageName}] Required Kafka Brokers Hosts`,
		optional: false,
	},
	[`${environmentVariablePrefix}_KAFKA_GROUP_ID`]: {
		message: `[${kafkaPackageName}] Required Kafka Group ID`,
		optional: false,
	},
	[`${environmentVariablePrefix}_KAFKA_TOPIC`]: {
		message: `[${kafkaPackageName}] Required Kafka Topics`,
		optional: false,
	},
	SUNBIRD_NOTIFICAION_SERVICE_BASE_URL: {
		message: `[${kafkaPackageName}] Required Base URL for the Interface Service`,
		optional: false,
	},
	SUNBIRD_NOTIFICAION_SEND_EMAIL_ROUTE: {
		message: `[${kafkaPackageName}] Required Route for send email in the Interface Service`,
		optional: false,
	},
	SUNBIRD_NOTIFICATION_SENDER_EMAIL : {
		message: `[${kafkaPackageName}] Required sender email address in the Interface Service`,
		optional: false,
	},
	SUNBIRD_AUTHORIZATION_TOKEN : {
		message: `[${kafkaPackageName}] Required authorization token with bearer`,
		optional: false,
	},
	[`SUNBIRD_USER_KAFKA_CLIENT_ID`]: {
		message: `[SUNBIRD_USER_KAFKA_CLIENT_ID] Required Kafka Brokers Hosts`,
		optional: false,
	},
	[`SUNBIRD_USER_KAFKA_BROKERS`]: {
		message: `[SUNBIRD_USER_KAFKA_BROKERS] Required Kafka Brokers Hosts`,
		optional: false,
	},
	[`SUNBIRD_USER_KAFKA_GROUP_ID`]: {
		message: `[SUNBIRD_USER_KAFKA_GROUP_ID] Required Kafka Group ID`,
		optional: false,
	},
	[`SUNBIRD_USER_USER_UPDATE_KAFKA_TOPIC`]: {
		message: `[SUNBIRD_USER_USER_UPDATE_KAFKA_TOPIC] Required Kafka Topics`,
		optional: false,
	},
	MENTORING_SERVICE_BASE_URL: {
		message: `[MENTORING_SERVICE_BASE_URL] Required Base URL for the Mentoring Service`,
		optional: false,
	},
	MENTORING_SERVICE_USER_UPDATE_ROUTE: {
		message: `[MENTORING_SERVICE_USER_UPDATE_ROUTE] Required Route for User Update in the Mentoring Service`,
		optional: false,
	},
	MENTORING_INTERNAL_ACCESS_TOKEN: {
		message: `[MENTORING_INTERNAL_ACCESS_TOKEN] Required Internal Access Token of the Mentoring Service`,
		optional: false,
	},
}



module.exports = {
	dependencies: getDependencies(),
	routes,
	createPackage,
	packageMeta: getPackageMeta(),
	packageRouter,
	requiredEnvs,
	dependencyManager,
	requiredDependencies:getRequiredDependencies

}
