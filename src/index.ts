require('aws-sdk/lib/maintenance_mode_message').suppress = true;

import * as readline from 'readline';
import * as AWS from 'aws-sdk';
import { ListBucketsCommandOutput, S3 } from '@aws-sdk/client-s3';
import * as chalk from 'chalk';

const IO = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const askQuestion = async (question: string): Promise<string> => {
  return new Promise(resolve =>
    IO.question(question, answer => resolve(answer.trim()))
  );
};

const checkBucketProperties = async (bucketName: string, s3: S3) => {
    try {
      const versioning = await s3.getBucketVersioning({ Bucket: bucketName });
      const publicAccess = await s3.getPublicAccessBlock({ Bucket: bucketName });
  
      const versioningStatus = versioning.Status;
      console.info('---------------------');
      versioningStatus
        ? console.info(
            chalk.green(
              `${bucketName}:Versioning has been enabled, no action required`
            )
          )
        : console.info(
            chalk.red(
              `${bucketName}:Versioning has not been enabled, action required`
            )
          );
  
      const isPublicAccess =
        publicAccess.PublicAccessBlockConfiguration?.RestrictPublicBuckets;
      isPublicAccess
        ? console.info(chalk.red('Public Access is Enabled for the Bucket'))
        : console.info('Public Access has been restricted');
  
      console.info('---------------------');
    } catch (error) {
      console.error(`Error checking properties for bucket ${bucketName}:`, error);
    }
  };

const main = async () => {
  const profile = await askQuestion('Enter AWS profile name: ');
  const region = await askQuestion('Enter AWS region: ');

  let s3: S3;
  let buckets: AWS.S3.Bucket[]|undefined;

try {
  s3 = new S3({
    credentials: new AWS.SharedIniFileCredentials({ profile }),
    region,
  });
  const data: ListBucketsCommandOutput = await s3.listBuckets({});
  buckets = data?.Buckets;
} catch (error) {
  if (error === 'SharedIniFileCredentialsProviderFailure') {
    console.error(chalk.red('Profile not found or InvalidAccessKeyId.'));
  } else {
    console.error(chalk.red('An unidentified error occurred:', error));
  }
}

  //List Buckets
    console.info(
      chalk.blue(
        '------------------------Bucket List------------------------------'
      )
    );
    if (buckets) {
      buckets.forEach(async (bucket,index) => {
        console.info(`${index+1}. Bucket Name: ${bucket?.Name ?? ''}`);
      });
    } else {
      console.info(chalk.yellow('No buckets available'));
    }
    console.info(
      chalk.blue(
        '------------------------------------------------------------------'
      )
    );
    console.info(`Total number of s3 buckets = ${buckets?.length??0}`);

    // Show Vulneribility Report
    console.info('\n\n---------------------Vulneribility Report---------------------\n\n');
    try{
        if(buckets){
            buckets.forEach(async bucket => {
               await checkBucketProperties(bucket?.Name??'', s3)
              });
        }  else {
            console.info(chalk.yellow('No buckets available'));
          }
    }catch(error){
        console.error(chalk.red(`Error:${error}`))
    }finally{
        IO.close();
    }
};

//Execute main
main();
