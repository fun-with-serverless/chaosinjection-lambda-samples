## Overview
This repository contains a code sample demonstrating how to inject chaos into AWS Lambda functions seamlessly. By leveraging AWS Fault Injection Simulator (FIS), it allows you to simulate real-world unpredictable conditions like increased latency or random function failures, without modifying your function's original code.

This sample uses Lambda layers to host the chaos injection tooling. During the FIS experiment, an AWS Systems Manager Document is used to temporarily attach this layer to your target Lambda function. The Rust-based chaos extension within the layer then takes over, inducing the desired faults. Once the experiment is concluded, another Systems Manager Document detaches the chaos layer, reverting the Lambda function to its original state.

The content of this repository is based on [AWS Compute Blog](https://aws.amazon.com/cn/blogs/compute/building-resilient-serverless-applications-using-chaos-engineering/) written by Suranjan Choudhury (Head of TME and ITeS SA), Anil Sharma (Sr PSA, Migration) and Marcia Villalba.
### High Level Architecture
![chaos-injection-lambda-sample](https://github.com/fun-with-serverless/chaosinjection-lambda-samples/assets/110536677/ac8bbafb-9d07-482f-9ef1-368e3d411b63)

## Why Use Rust Chaos Extension?
The Rust-based lambda-chaos-extension offers several advantages:

* Seamless Integration: No need to alter your existing Lambda function's code. It's a plug-and-play solution.
* Universal Compatibility: The extension is runtime-agnostic, supporting a wide array of Lambda runtimes including Node.js, Python, Java, .NET, and Ruby.
* Peak Performance: Written in Rust, the extension is blazing fast, ensuring minimal overhead. When turned off, it has zero impact on your Lambda's behavior.

The Rust Chaos extension offers more capabilities than those provided in this sample. For further information, please refer to the [official GitHub repository](https://github.com/aws-cli-tools/chaos-lambda-extension).

## Getting Started
This code provides a way to inject chaos into Lambda functions using Lambda layers and AWS FIS.

### Prerequisites
To deploy this code, you'll need to:
- [AWS SAM](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html#install-sam-cli-instructions)
- [Node 18.X](https://github.com/nvm-sh/nvm)
- [Python 3.11](https://github.com/pyenv/pyenv)

### Deployment
```bash
sam build
sam deploy
```

By default, the experiment targets a sample Python Lambda function. To run the experiment on a different Lambda function, run sam deploy --guided. During this process, you will be prompted to enter the ARN of the Lambda function where you wish to deploy the chaos layer. If you leave this field blank, the default sample Python Lambda function will be used.

## Run the  Experiment
### Run FIS
* Access AWS FIS Console: Open the AWS FIS console by visiting https://console.aws.amazon.com/fis/.
* Select Experiment Template: Choose the "fisChaosInjection" experiment template. Note that the template name will include a random suffix made up of letters and numbers.
* Start the Experiment: Go to the details page for the selected template. Click on "Actions" and then select "Start." A confirmation prompt will appear; type "start" and click "Start Experiment."
* Monitor for Completion: Wait until the experiment's state changes to "Completed."

### Run Your Application Testing Experiment
At this point, everything is set up for chaos injection into your Lambda function. To start the FIS experiment, invoke the targeted Lambda function using the provided commands.

### Roll Back the Experiment
* Navigate to the Systems Manager Console, go to the "Documents" menu, and locate the document called `RollbackChaosDocument`. Note that the template name will include a random suffix made up of letters and numbers.
* Click on the document and select "Execute Automation". Click "Execute".
* You can roll back the experiment using the AWS CLI. The AWS SAM template output includes a named `StopExperiment` section that provides a CLI example for you to execute. For instance, you can run the following command: `aws ssm start-automation-execution --document-name "RollbackChaosDocument-XYZ" --document-version "\$DEFAULT" --region us-east-1`

### Cleanup
To avoid incurring future charges, delete all resources created by the SAM template with the following AWS CLI command. 
```bash
sam delete
```
