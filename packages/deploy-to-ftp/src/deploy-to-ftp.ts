import FtpDeploy from "ftp-deploy"

export type DeployToFTPConfig = {
	// Where to place the files on your FTP
	into: string
	// FTP host
	host: string
	// FTP port
	port: number | string
	// FTP user
	user: string
	// FTP user password
	password: string
	// Delete ALL existing files at destination (into) before uploading
	cleanupExisting: boolean
}

type DeployReport = Array<string[]>

type DeploySuccess = {
	type: "success"
	report: DeployReport
}
type DeployFailure = {
	type: "failure"
	error: Error
}

type DeployToFtpStatus = DeploySuccess | DeployFailure

const failure = (error: Error): DeployFailure => ({
	type: "failure",
	error,
})

const success = (report: DeployReport): DeploySuccess => ({
	type: "success",
	report,
})

const deployToFTP = (folder: string) => (
	config: DeployToFTPConfig,
): Promise<DeployToFtpStatus> => {
	const ftpDeploy = new FtpDeploy()

	return ftpDeploy
		.deploy({
			user: config.user,
			password: config.password,
			host: config.host,
			port: config.port,
			// What files to upload
			localRoot: folder,
			// Where to place uploaded files on FTP
			remoteRoot: config.into,
			include: ["**/*", "*"],
			// exclude: [
			//   "dist/**/*.map",
			//   "node_modules/**",
			//   "node_modules/**/.*",
			//   ".git/**"
			// ],
			// delete ALL existing files at destination before uploading, if true
			deleteRemote: config.cleanupExisting,
			// Passive mode is forced (EPSV command is not sent)
			forcePasv: true,
		})
		.then(success)
		.catch(failure)
}

export default deployToFTP
