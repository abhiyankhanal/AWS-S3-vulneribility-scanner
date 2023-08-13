# Amazon S3 Vulnerability Scanner

This is a vulnerability scanner script written in TypeScript that checks the security settings for your AWS S3 buckets. 

## How the S3 Vulnerability Scanner Works

The script:
- Retrieves a list of all your S3 buckets
- Checks each bucket's settings for potential vulnerabilities, specifically the following properties:
  - Versioning
  - Public Access
  - Encryption

## Installation

Please ensure Node.js and npm are installed on your system before proceeding.

1. Clone this repo to your local machine.
2. Navigate to the root directory of the cloned repo.
3. Install required packages by running:

```bash
npm install
```

## Usage

To run the script, type the following in your terminal:

```bash
npx ts-node index.ts
```
The script will prompt you for the AWS profile name and region.

## Interpreting the Results

For each bucket, the script will display whether or not each property has been correctly set up:

- ✔ marks show that the proper security measures are in place.
- ❌ marks indicate potential vulnerabilities where action may be required. 

## Common Issues 

- If encountering `Profile not found or InvalidAccessKeyId` error, please check if your AWS profile credential is correct.
- If you encounter any unidentified errors, please make sure that your environment settings are correct and try again. 

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

If you find any bugs or have a feature request, please open an issue with a clear description.

## License

[MIT](https://choosealicense.com/licenses/mit/)

##Screenshot
![Alt text](screensot.png)