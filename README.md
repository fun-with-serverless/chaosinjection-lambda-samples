:construction: Work in Progress: This repository is currently under active development. Features may be incomplete, and documentation may not be up-to-date. Please proceed with caution and feel free to contribute! :construction:

## Chaos Injection in Lambda Functions
This code sample demonstrates an approach for injecting chaos into Lambda functions without altering the original function code. The blog leverages the AWS Fault Injection Simulator (FIS) service to create experiments that introduce disruptions into Lambda-based serverless applications. Specifically, the sample code injects random disruptions like increased response times (latency) or random failures.

The sample sets up an FIS experiment that utilizes Lambda layers to inject these disruptions. The Lambda layer contains the fault injection tooling and is invoked prior to the Lambda function to inject random latencies or errors. This simulates real-world unpredictable conditions. The FIS experiment configures the Lambda function to use this fault injection layer through an AWS Systems Manager Document using the `aws:ssm:start-automation-execution` action. Once the experiment is complete, another AWS Systems Manager Document rolls back the attachment of the layer, reverting the Lambda function to its original state.

## Getting Started
This code provides a way to inject chaos into Lambda functions using Lambda layers and AWS FIS.

### Prerequisites
To deploy this code, you'll need to:
- Clone this repository
- Have AWS SAM installed
- Have Node 18 installed
- Have Python 3.11 installed

### Deployment
- Run `sam build`
- After a successful build, run `sam deploy`

### Run the FIS Experiment
By default, the experiment is configured to inject chaos into a Python sample Lambda function. To change it to a different Lambda, follow these steps:
- Copy the output value of "PythonChaosInjectionParam" from the CloudFormation stack that you created.
- Edit the FIS experiment template:
  - Open the AWS FIS console at [AWS FIS Console](https://console.aws.amazon.com/fis/)
  - Select the experiment template "fisChaosInjection" and choose "Update Experiment Template" from the Actions menu. Edit the "InjectChaos" action.
  - Paste the value of the "PythonChaosInjectionParam" into the "Document Parameters - optional" field. Click "Save," and then click "Update Experiment Template."

### To Run Your Application Testing Experiment
At this stage, all elements are in place to inject chaos into your Lambda function. Execute the function for which the FIS experiment was configured by invoking the respective Lambda function using the commands provided.

### To Roll Back the Experiment
- Navigate to the Systems Manager Console, go to the "Documents" menu, and locate the document called `InjectLambdaChaos-Rollback`.
- Click on the document and select "Execute Automation." Provide the value for the "FunctionName" parameter to remove the chaos injection layer from the targeted Lambda function. Click "Execute."

### Cleanup
To avoid incurring future charges, delete all resources created by the CloudFormation template with the following AWS CLI command. Update the stack name to the one you provided when creating the stack.
```bash
aws cloudformation delete-stack --stack-name myChaosStack
```
