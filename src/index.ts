require('aws-sdk/lib/maintenance_mode_message').suppress = true;

import * as readline from 'readline';
import * as AWS from 'aws-sdk';
import { ListBucketsCommandOutput, S3 } from '@aws-sdk/client-s3';
import * as chalk from 'chalk';

//IO interface for the CLI app
const IO = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

//Function to return answer for a question
const askQuestion = async (question: string): Promise<string> => {
  return new Promise(resolve =>
    IO.question(question, answer => resolve(answer.trim()))
  );
};

const main = async () => {
  const profile = await askQuestion('Enter AWS profile name: ');
  const region = await askQuestion('Enter AWS region: ');

  try {
    const s3: S3 = new S3({
      credentials: new AWS.SharedIniFileCredentials({ profile }),
      region,
    });
    const data: ListBucketsCommandOutput = await s3.listBuckets({});
    const buckets = data?.Buckets;

    console.log(
      chalk.blue(
        '------------------------Bucket List------------------------------'
      )
    );
    if (buckets) {
      buckets.forEach(async bucket => {
        console.log(`Bucket Name: ${bucket?.Name ?? ''}`);
        await checkBucketProperties(bucket?.Name ?? '', s3);
      });
    } else {
      console.info(chalk.yellow('No buckets available'));
    }
    console.log(
      chalk.blue(
        '------------------------------------------------------------------'
      )
    );
  } catch (error) {
    console.error(chalk.red('An unidentified error occured:', error));
  } finally {
    console.log('\n\n---------------------Vulneribility Report---------------------\n\n');
    IO.close();
  }
};

const checkBucketProperties = async (bucketName: string, s3: S3) => {
  try {
    const versioning = await s3.getBucketVersioning({ Bucket: bucketName });
    const publicAccess = await s3.getPublicAccessBlock({ Bucket: bucketName });

    const versioningStatus = versioning.Status;
    console.log('---------------------');
    versioningStatus
      ? console.log(
          chalk.green(
            `${bucketName}:Versioning has been enabled, no action required`
          )
        )
      : console.log(
          chalk.red(
            `${bucketName}:Versioning has not been enabled, action required`
          )
        );

    const isPublicAccess =
      publicAccess.PublicAccessBlockConfiguration?.RestrictPublicBuckets;
    isPublicAccess
      ? console.log(chalk.red('Public Access is Enabled for the Bucket'))
      : console.log('Public Access has been restricted');

    console.log('---------------------');
  } catch (error) {
    console.error(`Error checking properties for bucket ${bucketName}:`, error);
  }
};

main();
