declare module "ftp-deploy" {
	type DeployConfig = {
		user: string
		// Password optional, prompted if none given
		password?: string
		host: string
		port: number | string
		localRoot: string
		// Where the files should be placed
		remoteRoot: string
		// include: ["*", "**/*"],      // this would upload everything except dot files
		include: string[]
		exclude?: string[]
		// e.g. exclude sourcemaps, and ALL files in node_modules (including dot files)
		// exclude: [
		//   "dist/**/*.map",
		//   "node_modules/**",
		//   "node_modules/**/.*",
		//   ".git/**"
		// ],
		// delete ALL existing files at destination before uploading, if true
		deleteRemote: boolean
		// Passive mode is forced (EPSV command is not sent)
		forcePasv: boolean
	}

	class FtpDeploy {
		deploy(config: DeployConfig): Promise<Array<string[]>>
	}

	export default FtpDeploy
}
