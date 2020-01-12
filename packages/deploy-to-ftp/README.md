# deploy-to-ftp

Deploy a folder to your ftp. Note, this is basically a specialized (typed) proxy of the awesome [ftp-deploy](https://www.npmjs.com/package/ftp-deploy)

## TLDR;

```javascript
const deployToFTP = require("./")
const dotenv = require("dotenv")

dotenv.config()

const pathToFolderToDeploy = "./dist" // 👨‍🍳 You can use __dirname or process.cwd() if you want more control over the path. But you probably don't nee to

deployToFTP(pathToFolderToDeploy)({
	// Where to place the files on your FTP
	into: "web",
	// FTP host
	host: process.env.FTP_HOST,
	// FTP port
	port: process.env.FTP_PORT,
	// FTP user
	user: process.env.FTP_USER,
	// FTP user password
	password: process.env.FTP_PASSWORD,
	// 🛑 Deletes ALL existing files at destination path (config.into) before uploading when true
	cleanupExisting: true,
}).then(status => {
	// 👨‍🍳 To keep type safety, the function never throws
	if (status.type === "failure") {
		console.error(status.error.message)

		// 👨‍🍳 But if you really must you can always do it anyway
		throw error
	} else {
		console.log(status.report) // [ 'uploaded dist/cjs/index.d.ts','uploaded dist/cjs/index.js' ],[ 'uploaded dist/esm/index.d.ts', ] ]
	}
})
```
